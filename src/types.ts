export interface SaleRecord {
  id: string; // unique row id
  orderNumber: string;
  product: string;
  price: number;
  date: string; // YYYY-MM-DD
  paymentMethod: 'Credit Card' | 'Debit Card' | 'eWallet' | 'Cash';
  dayOfWeek?: string;
  month?: string;
  week?: string;
}

export interface OrderGroup {
  orderNumber: string;
  date: string;
  items: SaleRecord[];
  totalPrice: number;
  itemCount: number;
  paymentMethods: string[];
}

export interface FilterState {
  searchQuery: string;
  dateRange: 'all' | 'aug' | 'sep' | 'oct' | 'custom';
  startDate: string;
  endDate: string;
  selectedPaymentMethods: string[];
  selectedProducts: string[];
  minPrice: number;
  maxPrice: number;
}

export type ViewMode = 
  | 'overview' 
  | 'trends' 
  | 'products' 
  | 'payments' 
  | 'custom' 
  | 'table';

export interface ChartBuilderConfig {
  chartType: 'bar' | 'line' | 'area' | 'pie' | 'composed';
  dimension: 'product' | 'paymentMethod' | 'date' | 'dayOfWeek' | 'month' | 'orderBasketSize';
  metric: 'revenue' | 'volume' | 'avgPrice';
  sortBy: 'valueDesc' | 'valueAsc' | 'nameAsc';
  colorTheme: 'indigo' | 'emerald' | 'amber' | 'multi';
}
