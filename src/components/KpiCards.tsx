import React from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Layers, 
  TrendingUp, 
  Award, 
  CreditCard 
} from 'lucide-react';
import { DashboardMetrics } from '../utils/analytics';

interface KpiCardsProps {
  metrics: DashboardMetrics;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ metrics }) => {
  const cards = [
    {
      id: 'kpi-total-revenue',
      title: 'Total Gross Revenue',
      value: `$${metrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `${metrics.totalUnits} items across ${metrics.totalOrders} orders`,
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      badge: 'Catalog Total',
      bgClass: 'bg-emerald-50 text-emerald-700',
      borderClass: 'border-emerald-100',
    },
    {
      id: 'kpi-total-orders',
      title: 'Total Unique Orders',
      value: metrics.totalOrders.toLocaleString(),
      subtitle: `${metrics.singleItemOrderCount} single • ${metrics.multiItemOrderCount} multi-item`,
      icon: <ShoppingBag className="w-5 h-5 text-indigo-600" />,
      badge: `${metrics.avgBasketSize.toFixed(2)} items/order`,
      bgClass: 'bg-indigo-50 text-indigo-700',
      borderClass: 'border-indigo-100',
    },
    {
      id: 'kpi-total-units',
      title: 'Units Sold',
      value: metrics.totalUnits.toLocaleString(),
      subtitle: `Avg item price: $${metrics.avgItemPrice.toFixed(2)}`,
      icon: <Layers className="w-5 h-5 text-blue-600" />,
      badge: '12 Catalog SKUs',
      bgClass: 'bg-blue-50 text-blue-700',
      borderClass: 'border-blue-100',
    },
    {
      id: 'kpi-avg-order-value',
      title: 'Average Order Value (AOV)',
      value: `$${metrics.avgOrderValue.toFixed(2)}`,
      subtitle: 'Basket expenditure per transaction',
      icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
      badge: 'AOV Metric',
      bgClass: 'bg-purple-50 text-purple-700',
      borderClass: 'border-purple-100',
    },
    {
      id: 'kpi-top-product',
      title: 'Top Product (Revenue)',
      value: metrics.topProductByRevenue.name,
      subtitle: `$${metrics.topProductByRevenue.revenue.toFixed(2)} generated`,
      icon: <Award className="w-5 h-5 text-amber-600" />,
      badge: 'Leading SKU',
      bgClass: 'bg-amber-50 text-amber-700',
      borderClass: 'border-amber-100',
      isTextVal: true,
    },
    {
      id: 'kpi-top-payment',
      title: 'Top Payment Channel',
      value: metrics.topPaymentMethod.method,
      subtitle: `${metrics.topPaymentMethod.count} orders • $${metrics.topPaymentMethod.revenue.toFixed(2)}`,
      icon: <CreditCard className="w-5 h-5 text-cyan-600" />,
      badge: 'Primary Method',
      bgClass: 'bg-cyan-50 text-cyan-700',
      borderClass: 'border-cyan-100',
      isTextVal: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          id={card.id}
          className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 line-clamp-1">{card.title}</span>
              <div className={`p-1.5 rounded-lg ${card.bgClass}`}>
                {card.icon}
              </div>
            </div>
            <div
              className={`font-bold tracking-tight text-slate-900 ${
                card.isTextVal ? 'text-base font-semibold leading-tight line-clamp-2 min-h-[44px]' : 'text-2xl font-mono'
              }`}
            >
              {card.value}
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 truncate mr-1">{card.subtitle}</span>
            <span className={`px-1.5 py-0.5 rounded font-medium whitespace-nowrap ${card.bgClass}`}>
              {card.badge}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
