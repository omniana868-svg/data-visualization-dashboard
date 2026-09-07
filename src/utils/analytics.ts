import { SaleRecord, OrderGroup, ChartBuilderConfig } from '../types';
import { getOrderGroups } from '../data/salesData';

export interface DashboardMetrics {
  totalRevenue: number;
  totalUnits: number;
  totalOrders: number;
  avgOrderValue: number;
  avgItemPrice: number;
  avgBasketSize: number;
  topProductByRevenue: { name: string; revenue: number };
  topProductByVolume: { name: string; units: number };
  topPaymentMethod: { method: string; count: number; revenue: number };
  multiItemOrderCount: number;
  singleItemOrderCount: number;
}

export function calculateMetrics(records: SaleRecord[]): DashboardMetrics {
  const totalRevenue = records.reduce((acc, r) => acc + r.price, 0);
  const totalUnits = records.length;
  const orders = getOrderGroups(records);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const avgItemPrice = totalUnits > 0 ? totalRevenue / totalUnits : 0;
  const avgBasketSize = totalOrders > 0 ? totalUnits / totalOrders : 0;

  // Product aggregations
  const productRevMap: Record<string, number> = {};
  const productVolMap: Record<string, number> = {};
  records.forEach((r) => {
    productRevMap[r.product] = (productRevMap[r.product] || 0) + r.price;
    productVolMap[r.product] = (productVolMap[r.product] || 0) + 1;
  });

  let topProductByRevenue = { name: 'N/A', revenue: 0 };
  Object.entries(productRevMap).forEach(([name, revenue]) => {
    if (revenue > topProductByRevenue.revenue) {
      topProductByRevenue = { name, revenue };
    }
  });

  let topProductByVolume = { name: 'N/A', units: 0 };
  Object.entries(productVolMap).forEach(([name, units]) => {
    if (units > topProductByVolume.units) {
      topProductByVolume = { name, units };
    }
  });

  // Payment aggregations
  const payMap: Record<string, { count: number; revenue: number }> = {};
  records.forEach((r) => {
    if (!payMap[r.paymentMethod]) {
      payMap[r.paymentMethod] = { count: 0, revenue: 0 };
    }
    payMap[r.paymentMethod].count += 1;
    payMap[r.paymentMethod].revenue += r.price;
  });

  let topPaymentMethod = { method: 'N/A', count: 0, revenue: 0 };
  Object.entries(payMap).forEach(([method, data]) => {
    if (data.revenue > topPaymentMethod.revenue) {
      topPaymentMethod = { method, count: data.count, revenue: data.revenue };
    }
  });

  const multiItemOrders = orders.filter((o) => o.itemCount > 1).length;
  const singleItemOrders = orders.filter((o) => o.itemCount === 1).length;

  return {
    totalRevenue,
    totalUnits,
    totalOrders,
    avgOrderValue,
    avgItemPrice,
    avgBasketSize,
    topProductByRevenue,
    topProductByVolume,
    topPaymentMethod,
    multiItemOrderCount: multiItemOrders,
    singleItemOrderCount: singleItemOrders,
  };
}

export interface DailyTrendPoint {
  date: string;
  formattedDate: string;
  revenue: number;
  cumulativeRevenue: number;
  units: number;
  movingAverage7d: number;
  orderCount: number;
}

export function getDailyTrends(records: SaleRecord[]): DailyTrendPoint[] {
  const dateMap: Record<string, { revenue: number; units: number; orders: Set<string> }> = {};

  records.forEach((r) => {
    if (!dateMap[r.date]) {
      dateMap[r.date] = { revenue: 0, units: 0, orders: new Set() };
    }
    dateMap[r.date].revenue += r.price;
    dateMap[r.date].units += 1;
    dateMap[r.date].orders.add(r.orderNumber);
  });

  const sortedDates = Object.keys(dateMap).sort();
  let runningCumulative = 0;
  const points: DailyTrendPoint[] = [];

  sortedDates.forEach((date, index) => {
    const data = dateMap[date];
    runningCumulative += data.revenue;

    // 7-day moving average
    const windowStart = Math.max(0, index - 6);
    const windowDates = sortedDates.slice(windowStart, index + 1);
    const windowSum = windowDates.reduce((sum, d) => sum + dateMap[d].revenue, 0);
    const movingAverage7d = Math.round((windowSum / windowDates.length) * 100) / 100;

    const [y, m, d] = date.split('-');
    const formattedDate = `${m}/${d}`;

    points.push({
      date,
      formattedDate,
      revenue: Math.round(data.revenue * 100) / 100,
      cumulativeRevenue: Math.round(runningCumulative * 100) / 100,
      units: data.units,
      movingAverage7d,
      orderCount: data.orders.size,
    });
  });

  return points;
}

export interface DayOfWeekData {
  day: string;
  revenue: number;
  units: number;
  orderCount: number;
  avgOrderValue: number;
}

const ORDERED_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function getDayOfWeekStats(records: SaleRecord[]): DayOfWeekData[] {
  const map: Record<string, { revenue: number; units: number; orders: Set<string> }> = {};
  ORDERED_DAYS.forEach((d) => {
    map[d] = { revenue: 0, units: 0, orders: new Set() };
  });

  records.forEach((r) => {
    const day = r.dayOfWeek || 'Monday';
    if (!map[day]) {
      map[day] = { revenue: 0, units: 0, orders: new Set() };
    }
    map[day].revenue += r.price;
    map[day].units += 1;
    map[day].orders.add(r.orderNumber);
  });

  return ORDERED_DAYS.map((day) => {
    const data = map[day];
    const orderCount = data.orders.size;
    return {
      day,
      revenue: Math.round(data.revenue * 100) / 100,
      units: data.units,
      orderCount,
      avgOrderValue: orderCount > 0 ? Math.round((data.revenue / orderCount) * 100) / 100 : 0,
    };
  });
}

export interface ProductStat {
  product: string;
  revenue: number;
  units: number;
  unitPrice: number;
  percentageOfRevenue: number;
  orderAppearances: number;
}

export function getProductStats(records: SaleRecord[]): ProductStat[] {
  const map: Record<string, { revenue: number; units: number; orders: Set<string>; unitPrice: number }> = {};
  const totalRevenue = records.reduce((sum, r) => sum + r.price, 0);

  records.forEach((r) => {
    if (!map[r.product]) {
      map[r.product] = { revenue: 0, units: 0, orders: new Set(), unitPrice: r.price };
    }
    map[r.product].revenue += r.price;
    map[r.product].units += 1;
    map[r.product].orders.add(r.orderNumber);
  });

  return Object.entries(map)
    .map(([product, data]) => ({
      product,
      revenue: Math.round(data.revenue * 100) / 100,
      units: data.units,
      unitPrice: data.unitPrice,
      percentageOfRevenue: totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 1000) / 10 : 0,
      orderAppearances: data.orders.size,
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

export interface PaymentStat {
  method: string;
  revenue: number;
  count: number;
  percentageOfRevenue: number;
  percentageOfCount: number;
  avgTransaction: number;
}

export function getPaymentStats(records: SaleRecord[]): PaymentStat[] {
  const map: Record<string, { revenue: number; count: number }> = {};
  const totalRevenue = records.reduce((sum, r) => sum + r.price, 0);
  const totalCount = records.length;

  records.forEach((r) => {
    if (!map[r.paymentMethod]) {
      map[r.paymentMethod] = { revenue: 0, count: 0 };
    }
    map[r.paymentMethod].revenue += r.price;
    map[r.paymentMethod].count += 1;
  });

  return Object.entries(map)
    .map(([method, data]) => ({
      method,
      revenue: Math.round(data.revenue * 100) / 100,
      count: data.count,
      percentageOfRevenue: totalRevenue > 0 ? Math.round((data.revenue / totalRevenue) * 1000) / 10 : 0,
      percentageOfCount: totalCount > 0 ? Math.round((data.count / totalCount) * 1000) / 10 : 0,
      avgTransaction: data.count > 0 ? Math.round((data.revenue / data.count) * 100) / 100 : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

export interface BasketSizeStat {
  basketSize: string;
  orderCount: number;
  totalRevenue: number;
  avgOrderValue: number;
  percentageOfOrders: number;
}

export function getBasketSizeStats(records: SaleRecord[]): BasketSizeStat[] {
  const orders = getOrderGroups(records);
  const totalOrders = orders.length;

  const single = orders.filter((o) => o.itemCount === 1);
  const multi = orders.filter((o) => o.itemCount > 1);

  const singleRev = single.reduce((sum, o) => sum + o.totalPrice, 0);
  const multiRev = multi.reduce((sum, o) => sum + o.totalPrice, 0);

  return [
    {
      basketSize: 'Single Item (1)',
      orderCount: single.length,
      totalRevenue: Math.round(singleRev * 100) / 100,
      avgOrderValue: single.length > 0 ? Math.round((singleRev / single.length) * 100) / 100 : 0,
      percentageOfOrders: totalOrders > 0 ? Math.round((single.length / totalOrders) * 1000) / 10 : 0,
    },
    {
      basketSize: 'Multi-Item (2+)',
      orderCount: multi.length,
      totalRevenue: Math.round(multiRev * 100) / 100,
      avgOrderValue: multi.length > 0 ? Math.round((multiRev / multi.length) * 100) / 100 : 0,
      percentageOfOrders: totalOrders > 0 ? Math.round((multi.length / totalOrders) * 1000) / 10 : 0,
    },
  ];
}

// Dynamic chart builder aggregator
export interface CustomChartDataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
  count?: number;
}

export function buildCustomChartData(records: SaleRecord[], config: ChartBuilderConfig): CustomChartDataPoint[] {
  const orders = getOrderGroups(records);
  const map: Record<string, { sum: number; count: number }> = {};

  records.forEach((r) => {
    let key = '';
    switch (config.dimension) {
      case 'product':
        key = r.product;
        break;
      case 'paymentMethod':
        key = r.paymentMethod;
        break;
      case 'date':
        key = r.date;
        break;
      case 'dayOfWeek':
        key = r.dayOfWeek || 'Unknown';
        break;
      case 'month':
        key = r.month || 'Unknown';
        break;
      case 'orderBasketSize': {
        const order = orders.find((o) => o.orderNumber === r.orderNumber);
        key = (order && order.itemCount > 1) ? 'Multi-Item (2)' : 'Single Item (1)';
        break;
      }
      default:
        key = r.product;
    }

    if (!map[key]) {
      map[key] = { sum: 0, count: 0 };
    }
    map[key].sum += r.price;
    map[key].count += 1;
  });

  const points: CustomChartDataPoint[] = Object.entries(map).map(([label, val]) => {
    let computedValue = 0;
    if (config.metric === 'revenue') {
      computedValue = Math.round(val.sum * 100) / 100;
    } else if (config.metric === 'volume') {
      computedValue = val.count;
    } else if (config.metric === 'avgPrice') {
      computedValue = val.count > 0 ? Math.round((val.sum / val.count) * 100) / 100 : 0;
    }

    return {
      label,
      value: computedValue,
      secondaryValue: Math.round(val.sum * 100) / 100,
      count: val.count,
    };
  });

  if (config.sortBy === 'valueDesc') {
    points.sort((a, b) => b.value - a.value);
  } else if (config.sortBy === 'valueAsc') {
    points.sort((a, b) => a.value - b.value);
  } else if (config.sortBy === 'nameAsc') {
    points.sort((a, b) => a.label.localeCompare(b.label));
  }

  return points;
}
