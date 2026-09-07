import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { 
  TrendingUp, 
  ShoppingBag, 
  CreditCard, 
  Calendar, 
  Sparkles,
  ArrowUpRight,
  PieChart as PieIcon,
  BarChart2
} from 'lucide-react';
import { SaleRecord } from '../../types';
import { 
  getDailyTrends, 
  getProductStats, 
  getPaymentStats, 
  getDayOfWeekStats,
  getBasketSizeStats,
  DashboardMetrics 
} from '../../utils/analytics';
import { PAYMENT_METHOD_COLORS, PRODUCT_COLORS } from '../../data/salesData';

interface ExecutiveOverviewProps {
  records: SaleRecord[];
  metrics: DashboardMetrics;
  onSelectProduct?: (productName: string) => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  records,
  metrics,
}) => {
  const [timelineMetric, setTimelineMetric] = useState<'revenue' | 'units' | 'orderCount'>('revenue');

  const dailyTrends = getDailyTrends(records);
  const productStats = getProductStats(records);
  const paymentStats = getPaymentStats(records);
  const dayStats = getDayOfWeekStats(records);
  const basketStats = getBasketSizeStats(records);

  // Top 6 products for the overview chart
  const topProducts = productStats.slice(0, 6);

  // Custom tooltips
  const CustomTimelineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-800 text-xs space-y-1">
          <p className="font-semibold text-slate-300">{data.date} ({new Date(data.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })})</p>
          <p className="text-emerald-400 font-mono font-medium">Daily Revenue: ${data.revenue.toFixed(2)}</p>
          <p className="text-indigo-300 font-mono">7-Day Moving Avg: ${data.movingAverage7d.toFixed(2)}</p>
          <p className="text-slate-400">Units Sold: {data.units} • Orders: {data.orderCount}</p>
        </div>
      );
    }
    return null;
  };

  const CustomProductTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-800 text-xs space-y-1">
          <p className="font-semibold text-slate-200">{data.product}</p>
          <p className="text-indigo-400 font-mono font-medium">Revenue: ${data.revenue.toFixed(2)}</p>
          <p className="text-slate-300">Units Sold: {data.units}</p>
          <p className="text-slate-400">Share of Total: {data.percentageOfRevenue}%</p>
        </div>
      );
    }
    return null;
  };

  const CustomPaymentTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-800 text-xs space-y-1">
          <p className="font-semibold text-slate-200">{data.method}</p>
          <p className="text-emerald-400 font-mono font-medium">Revenue: ${data.revenue.toFixed(2)} ({data.percentageOfRevenue}%)</p>
          <p className="text-slate-300">Transactions: {data.count} ({data.percentageOfCount}%)</p>
          <p className="text-slate-400 font-mono">Avg Ticket: ${data.avgTransaction.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Strategic Insights Banner */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white border border-indigo-900/40 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold tracking-wider uppercase text-indigo-300">
                Key Analytical Highlights
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Dataset Performance Summary
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Based on {metrics.totalUnits} items across {metrics.totalOrders} customer orders spanning August 15 through October 7, 2025. 
              Top grossing SKU is <span className="text-amber-300 font-semibold">{metrics.topProductByRevenue.name}</span>, generating <span className="text-emerald-300 font-semibold">${metrics.topProductByRevenue.revenue.toFixed(2)}</span>.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10">
              <span className="text-[10px] text-slate-300 block uppercase font-medium">Multi-Item Basket Rate</span>
              <span className="text-base font-bold text-emerald-300 font-mono">
                {metrics.totalOrders > 0 ? ((metrics.multiItemOrderCount / metrics.totalOrders) * 100).toFixed(1) : 0}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{metrics.multiItemOrderCount} bundled orders</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10">
              <span className="text-[10px] text-slate-300 block uppercase font-medium">Avg Item Price</span>
              <span className="text-base font-bold text-indigo-200 font-mono">
                ${metrics.avgItemPrice.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Across catalog</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-300 block uppercase font-medium">Top Payment</span>
              <span className="text-base font-bold text-amber-300 font-mono truncate block">
                {metrics.topPaymentMethod.method}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                ${metrics.topPaymentMethod.revenue.toFixed(0)} total
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 1: Primary Timeline & Payment Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Revenue & Velocity Over Time</h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daily fluctuations and 7-day rolling performance trend
                </p>
              </div>

              {/* Metric Toggle */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium self-start sm:self-auto">
                <button
                  onClick={() => setTimelineMetric('revenue')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    timelineMetric === 'revenue'
                      ? 'bg-white text-indigo-600 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Revenue ($)
                </button>
                <button
                  onClick={() => setTimelineMetric('units')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    timelineMetric === 'units'
                      ? 'bg-white text-indigo-600 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Units Sold
                </button>
                <button
                  onClick={() => setTimelineMetric('orderCount')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    timelineMetric === 'orderCount'
                      ? 'bg-white text-indigo-600 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Orders
                </button>
              </div>
            </div>

            {/* Chart */}
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorMov" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="formattedDate"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    interval={Math.ceil(dailyTrends.length / 10)}
                  />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTimelineTooltip />} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area
                    type="monotone"
                    dataKey={timelineMetric}
                    name={timelineMetric === 'revenue' ? 'Daily Revenue ($)' : timelineMetric === 'units' ? 'Units Sold' : 'Order Count'}
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                  {timelineMetric === 'revenue' && (
                    <Area
                      type="monotone"
                      dataKey="movingAverage7d"
                      name="7-Day Moving Avg ($)"
                      stroke="#10b981"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      fillOpacity={0}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Range: {dailyTrends[0]?.date} to {dailyTrends[dailyTrends.length - 1]?.date}</span>
            <span className="font-mono text-indigo-600 font-semibold">
              Total Days: {dailyTrends.length}
            </span>
          </div>
        </div>

        {/* Payment Channels Breakdown (1 col) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <PieIcon className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Payment Methods Share</h3>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              Share of gross revenue across transaction channels
            </p>

            <div className="h-52 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentStats}
                    dataKey="revenue"
                    nameKey="method"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {paymentStats.map((entry) => (
                      <Cell
                        key={`cell-${entry.method}`}
                        fill={PAYMENT_METHOD_COLORS[entry.method] || '#6366f1'}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPaymentTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] text-slate-400 font-medium uppercase">Gross</span>
                <span className="text-sm font-bold font-mono text-slate-900">
                  ${(metrics.totalRevenue / 1000).toFixed(1)}k
                </span>
              </div>
            </div>

            {/* Method Breakdown List */}
            <div className="space-y-2 mt-2">
              {paymentStats.map((p) => {
                const color = PAYMENT_METHOD_COLORS[p.method];
                return (
                  <div key={p.method} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="font-medium text-slate-700">{p.method}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-right font-mono">
                      <span className="text-slate-500">{p.count} txns</span>
                      <span className="font-semibold text-slate-900">${p.revenue.toFixed(0)} ({p.percentageOfRevenue}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Top Products Performance & Day of Week Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products Bar Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Top Revenue Contributing SKUs</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Top 6 by Gross $</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topProducts}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <YAxis
                  dataKey="product"
                  type="category"
                  stroke="#475569"
                  fontSize={11}
                  tickLine={false}
                  width={140}
                  tickFormatter={(val) => (val.length > 18 ? `${val.slice(0, 16)}…` : val)}
                />
                <Tooltip content={<CustomProductTooltip />} />
                <Bar dataKey="revenue" name="Revenue ($)" radius={[0, 6, 6, 0]}>
                  {topProducts.map((entry) => (
                    <Cell key={`bar-${entry.product}`} fill={PRODUCT_COLORS[entry.product] || '#4f46e5'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
            <span>Highest unit price: Premium Tailored Trousers ($175.00)</span>
            <span className="font-medium text-indigo-600">Total catalog: 12 SKUs</span>
          </div>
        </div>

        {/* Day of the Week Sales Heat */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Sales Velocity by Day of Week</h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">Weekly Rhythm</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dayStats} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="day"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(d) => d.slice(0, 3)}
                />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(val: any, name: string) => [
                    name === 'revenue' ? `$${Number(val).toFixed(2)}` : val,
                    name === 'revenue' ? 'Revenue' : 'Units Sold',
                  ]}
                  labelFormatter={(l) => `${l}`}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar dataKey="revenue" name="Revenue ($)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="units" name="Units Sold" fill="#93c5fd" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
            <span>Weekend vs Weekday analysis</span>
            <span className="font-mono text-slate-700 font-semibold">
              Highest Day: {dayStats.reduce((prev, curr) => (curr.revenue > prev.revenue ? curr : prev)).day}
            </span>
          </div>
        </div>
      </div>

      {/* Row 3: Basket Size Analysis Details */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Basket Size & Order Bundling Distribution</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Order Composition</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {basketStats.map((b) => (
            <div
              key={b.basketSize}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {b.basketSize}
                </span>
                <p className="text-xl font-bold font-mono text-slate-900 mt-0.5">
                  {b.orderCount} Orders ({b.percentageOfOrders}%)
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Generated <strong className="text-slate-800 font-mono">${b.totalRevenue.toFixed(2)}</strong> in sales
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Average Order Value</span>
                <span className="text-lg font-bold font-mono text-indigo-600">
                  ${b.avgOrderValue.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
