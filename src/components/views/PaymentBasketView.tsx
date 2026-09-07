import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { CreditCard, ShoppingBag, DollarSign, ArrowRight, Layers } from 'lucide-react';
import { SaleRecord } from '../../types';
import { getPaymentStats, getBasketSizeStats } from '../../utils/analytics';
import { PAYMENT_METHOD_COLORS, getOrderGroups } from '../../data/salesData';

interface PaymentBasketViewProps {
  records: SaleRecord[];
  onSelectOrder?: (orderNumber: string) => void;
}

export const PaymentBasketView: React.FC<PaymentBasketViewProps> = ({ records }) => {
  const paymentStats = getPaymentStats(records);
  const basketStats = getBasketSizeStats(records);
  const orders = getOrderGroups(records);

  const multiItemOrders = orders.filter((o) => o.itemCount > 1);

  return (
    <div className="space-y-6">
      {/* Payment Channel Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {paymentStats.map((p) => {
          const color = PAYMENT_METHOD_COLORS[p.method] || '#6366f1';
          return (
            <div
              key={p.method}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">{p.method}</span>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900">
                  ${p.revenue.toFixed(2)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {p.percentageOfRevenue}% of total sales
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">{p.count} transactions</span>
                <span className="font-mono font-medium text-slate-800">
                  Avg: ${p.avgTransaction.toFixed(2)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row: Payment Donut & Average Ticket Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Share Donut */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2 mb-1">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Payment Volume Distribution</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Proportion of sales captured across electronic, card, and cash channels
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentStats}
                  dataKey="revenue"
                  nameKey="method"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                >
                  {paymentStats.map((entry) => (
                    <Cell
                      key={`cell-${entry.method}`}
                      fill={PAYMENT_METHOD_COLORS[entry.method] || '#6366f1'}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`$${Number(val).toFixed(2)}`, 'Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Average Transaction Value Comparison */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center space-x-2 mb-1">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Average Ticket Size by Channel</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Comparison of mean expenditure per checkout method
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentStats} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="method" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(val: any) => [`$${Number(val).toFixed(2)}`, 'Avg Ticket']} />
                <Bar dataKey="avgTransaction" name="Average Ticket ($)" radius={[6, 6, 0, 0]}>
                  {paymentStats.map((entry) => (
                    <Cell
                      key={`bar-${entry.method}`}
                      fill={PAYMENT_METHOD_COLORS[entry.method] || '#4f46e5'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Basket Size & Bundling Analysis */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 mb-1">
          <ShoppingBag className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-base">Cart Bundling & Multi-Item Orders</h3>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Analysis of single-item checkouts versus multi-item cross-sell bundles
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {basketStats.map((b) => (
            <div
              key={b.basketSize}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {b.basketSize}
                  </span>
                  <div className="text-3xl font-bold font-mono text-slate-900 mt-1">
                    {b.orderCount} Orders
                  </div>
                  <span className="text-xs text-indigo-600 font-medium mt-1 inline-block">
                    {b.percentageOfOrders}% of checkout frequency
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Total Volume Value</span>
                  <div className="text-xl font-bold font-mono text-emerald-600">
                    ${b.totalRevenue.toFixed(2)}
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Mean AOV: <strong>${b.avgOrderValue.toFixed(2)}</strong>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Multi-Item Orders Showcase */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Cross-Sell Bundle Examples ({multiItemOrders.length} Multi-Item Orders in Dataset)
            </h4>
            <span className="text-xs text-slate-500">Orders containing 2+ products</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {multiItemOrders.slice(0, 9).map((order) => (
              <div
                key={order.orderNumber}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 transition-colors shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-slate-800">{order.orderNumber}</span>
                  <span className="text-slate-400">{order.date}</span>
                </div>

                <div className="space-y-1 text-xs">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-slate-700">
                      <span className="truncate max-w-[170px]">• {item.product}</span>
                      <span className="font-mono text-slate-500">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">{order.paymentMethods.join('/')}</span>
                  <span className="font-bold font-mono text-indigo-600">
                    Total: ${order.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
