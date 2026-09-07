import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
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
  Sliders, 
  BarChart2, 
  TrendingUp, 
  PieChart as PieIcon, 
  Palette, 
  ArrowUpDown,
  Download,
  Table as TableIcon
} from 'lucide-react';
import { SaleRecord, ChartBuilderConfig } from '../../types';
import { buildCustomChartData } from '../../utils/analytics';

interface CustomChartBuilderProps {
  records: SaleRecord[];
}

const THEME_PALETTES = {
  indigo: ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'],
  emerald: ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
  amber: ['#d97706', '#f59e0b', '#fbbf24', '#fcd34d', '#fde68a'],
  multi: [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
    '#ec4899', '#06b6d4', '#14b8a6', '#f97316', '#84cc16', 
    '#6366f1', '#a855f7'
  ],
};

export const CustomChartBuilder: React.FC<CustomChartBuilderProps> = ({ records }) => {
  const [config, setConfig] = useState<ChartBuilderConfig>({
    chartType: 'bar',
    dimension: 'product',
    metric: 'revenue',
    sortBy: 'valueDesc',
    colorTheme: 'indigo',
  });

  const chartData = buildCustomChartData(records, config);
  const palette = THEME_PALETTES[config.colorTheme];

  const metricLabel = 
    config.metric === 'revenue' 
      ? 'Total Revenue ($)' 
      : config.metric === 'volume' 
      ? 'Units Sold (Qty)' 
      : 'Average Price ($)';

  const dimensionLabel = {
    product: 'Product Name',
    paymentMethod: 'Payment Method',
    date: 'Date',
    dayOfWeek: 'Day of Week',
    month: 'Month',
    orderBasketSize: 'Basket Size',
  }[config.dimension];

  return (
    <div className="space-y-6">
      {/* Studio Controls Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 mb-4 pb-3 border-b border-slate-100">
          <Sliders className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="font-bold text-slate-900 text-base">Interactive Visualization Studio</h3>
            <p className="text-xs text-slate-500">Configure custom dimensions, metrics, and chart projections</p>
          </div>
        </div>

        {/* Control Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
          {/* Chart Type Selector */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">Chart Type</label>
            <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setConfig({ ...config, chartType: 'bar' })}
                className={`py-1.5 px-2 rounded-md font-medium text-center transition-all ${
                  config.chartType === 'bar' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Bar Chart
              </button>
              <button
                onClick={() => setConfig({ ...config, chartType: 'line' })}
                className={`py-1.5 px-2 rounded-md font-medium text-center transition-all ${
                  config.chartType === 'line' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Line Chart
              </button>
              <button
                onClick={() => setConfig({ ...config, chartType: 'area' })}
                className={`py-1.5 px-2 rounded-md font-medium text-center transition-all ${
                  config.chartType === 'area' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Area Chart
              </button>
              <button
                onClick={() => setConfig({ ...config, chartType: 'pie' })}
                className={`py-1.5 px-2 rounded-md font-medium text-center transition-all ${
                  config.chartType === 'pie' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Donut / Pie
              </button>
            </div>
          </div>

          {/* Dimension Selector */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">Dimension (X-Axis)</label>
            <select
              value={config.dimension}
              onChange={(e) => setConfig({ ...config, dimension: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="product">Product (12 SKUs)</option>
              <option value="paymentMethod">Payment Method</option>
              <option value="dayOfWeek">Day of Week</option>
              <option value="date">Date (Daily Timeline)</option>
              <option value="month">Month</option>
              <option value="orderBasketSize">Order Basket Size</option>
            </select>
          </div>

          {/* Metric Selector */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">Metric (Y-Axis)</label>
            <select
              value={config.metric}
              onChange={(e) => setConfig({ ...config, metric: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="revenue">Gross Revenue ($)</option>
              <option value="volume">Units Sold (Count)</option>
              <option value="avgPrice">Average Unit Price ($)</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">Sort Order</label>
            <select
              value={config.sortBy}
              onChange={(e) => setConfig({ ...config, sortBy: e.target.value as any })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="valueDesc">Highest to Lowest</option>
              <option value="valueAsc">Lowest to Highest</option>
              <option value="nameAsc">Alphabetical / Label</option>
            </select>
          </div>

          {/* Color Palette Selector */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">Color Palette</label>
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-lg">
              {(['indigo', 'emerald', 'amber', 'multi'] as const).map((theme) => (
                <button
                  key={theme}
                  onClick={() => setConfig({ ...config, colorTheme: theme })}
                  className={`py-2 rounded-md flex items-center justify-center transition-all ${
                    config.colorTheme === theme ? 'bg-white ring-2 ring-slate-800 shadow-xs' : 'hover:bg-slate-200'
                  }`}
                  title={theme}
                >
                  <div className="flex space-x-0.5">
                    {THEME_PALETTES[theme].slice(0, 3).map((c, i) => (
                      <span key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rendered Chart Canvas */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">
              {metricLabel} by {dimensionLabel}
            </h4>
            <span className="text-xs text-slate-500">
              {chartData.length} categories rendered
            </span>
          </div>
        </div>

        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {config.chartType === 'bar' ? (
              <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="label"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  angle={config.dimension === 'product' || config.dimension === 'date' ? -35 : 0}
                  textAnchor={config.dimension === 'product' || config.dimension === 'date' ? 'end' : 'middle'}
                  height={config.dimension === 'product' || config.dimension === 'date' ? 70 : 30}
                  interval={0}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => (config.metric !== 'volume' ? `$${v}` : `${v}`)}
                />
                <Tooltip
                  formatter={(val: any) => [
                    config.metric !== 'volume' ? `$${Number(val).toFixed(2)}` : val,
                    metricLabel,
                  ]}
                />
                <Bar dataKey="value" name={metricLabel} radius={[4, 4, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
                  ))}
                </Bar>
              </BarChart>
            ) : config.chartType === 'line' ? (
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="label"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  angle={config.dimension === 'product' || config.dimension === 'date' ? -35 : 0}
                  textAnchor={config.dimension === 'product' || config.dimension === 'date' ? 'end' : 'middle'}
                  height={config.dimension === 'product' || config.dimension === 'date' ? 70 : 30}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => (config.metric !== 'volume' ? `$${v}` : `${v}`)}
                />
                <Tooltip
                  formatter={(val: any) => [
                    config.metric !== 'volume' ? `$${Number(val).toFixed(2)}` : val,
                    metricLabel,
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name={metricLabel}
                  stroke={palette[0]}
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            ) : config.chartType === 'area' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
                <defs>
                  <linearGradient id="customAreaColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={palette[0]} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={palette[0]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="label"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  angle={config.dimension === 'product' || config.dimension === 'date' ? -35 : 0}
                  textAnchor={config.dimension === 'product' || config.dimension === 'date' ? 'end' : 'middle'}
                  height={config.dimension === 'product' || config.dimension === 'date' ? 70 : 30}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(v) => (config.metric !== 'volume' ? `$${v}` : `${v}`)}
                />
                <Tooltip
                  formatter={(val: any) => [
                    config.metric !== 'volume' ? `$${Number(val).toFixed(2)}` : val,
                    metricLabel,
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  name={metricLabel}
                  stroke={palette[0]}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#customAreaColor)"
                />
              </AreaChart>
            ) : (
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                >
                  {chartData.map((_, index) => (
                    <Cell key={`pie-${index}`} fill={palette[index % palette.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [
                    config.metric !== 'volume' ? `$${Number(val).toFixed(2)}` : `${val} units`,
                    metricLabel,
                  ]}
                />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Underlying Aggregation Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TableIcon className="w-4 h-4 text-slate-500" />
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Aggregated Data Breakdown
            </h4>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {chartData.length} records
          </span>
        </div>

        <div className="overflow-x-auto max-h-64">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/80 sticky top-0 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-4">{dimensionLabel}</th>
                <th className="py-2.5 px-4 text-right">{metricLabel}</th>
                <th className="py-2.5 px-4 text-right">Transaction Count</th>
                <th className="py-2.5 px-4 text-right">Cumulative Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {chartData.map((row, idx) => {
                const totalMetricSum = chartData.reduce((acc, c) => acc + c.value, 0);
                const share = totalMetricSum > 0 ? ((row.value / totalMetricSum) * 100).toFixed(1) : '0.0';
                return (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-4 font-medium text-slate-800">{row.label}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                      {config.metric !== 'volume' ? `$${row.value.toFixed(2)}` : row.value}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-600">{row.count || 0}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-500">{share}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
