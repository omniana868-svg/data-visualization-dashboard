import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp, Calendar, ArrowUpRight, BarChart3, Clock } from 'lucide-react';
import { SaleRecord } from '../../types';
import { getDailyTrends, getDayOfWeekStats } from '../../utils/analytics';

interface TrendsTimelineViewProps {
  records: SaleRecord[];
}

export const TrendsTimelineView: React.FC<TrendsTimelineViewProps> = ({ records }) => {
  const [viewInterval, setViewInterval] = useState<'daily' | 'cumulative'>('daily');
  const dailyTrends = getDailyTrends(records);
  const dayStats = getDayOfWeekStats(records);

  // Calculate high-level trend metrics
  const totalDays = dailyTrends.length;
  const totalRev = dailyTrends.reduce((sum, d) => sum + d.revenue, 0);
  const avgDailyRevenue = totalDays > 0 ? totalRev / totalDays : 0;
  
  const peakDay = dailyTrends.reduce(
    (max, d) => (d.revenue > max.revenue ? d : max),
    dailyTrends[0] || { date: 'N/A', revenue: 0, orderCount: 0 }
  );

  return (
    <div className="space-y-6">
      {/* Quick Trend KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Average Daily Revenue</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">
            ${avgDailyRevenue.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Across {totalDays} active recording days
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Peak Revenue Day</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600">
            ${peakDay.revenue.toFixed(2)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Recorded on {peakDay.date} ({peakDay.orderCount} orders)
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span>Peak Day of Week</span>
            <Calendar className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {dayStats.reduce((prev, curr) => (curr.revenue > prev.revenue ? curr : prev)).day}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Highest cumulative sales velocity
          </p>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-base">
                Sales Trajectory & Smoothing
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare discrete daily volume against the 7-day rolling baseline
            </p>
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setViewInterval('daily')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewInterval === 'daily'
                  ? 'bg-white text-indigo-600 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily + 7d Moving Avg
            </button>
            <button
              onClick={() => setViewInterval('cumulative')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                viewInterval === 'cumulative'
                  ? 'bg-white text-indigo-600 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cumulative Growth Curve
            </button>
          </div>
        </div>

        {viewInterval === 'daily' ? (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dailyTrends} margin={{ top: 10, right: 10, left: -15, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="formattedDate"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  interval={Math.ceil(dailyTrends.length / 14)}
                />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(val: any, name: string) => [
                    `$${Number(val).toFixed(2)}`,
                    name === 'revenue' ? 'Daily Revenue' : '7-Day Moving Average',
                  ]}
                  labelFormatter={(l, payload) => {
                    if (payload && payload.length) {
                      return `${payload[0].payload.date}`;
                    }
                    return l;
                  }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar dataKey="revenue" name="Daily Revenue ($)" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={12} />
                <Line
                  type="monotone"
                  dataKey="movingAverage7d"
                  name="7-Day Moving Avg ($)"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrends} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorCum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="formattedDate"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  interval={Math.ceil(dailyTrends.length / 14)}
                />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  formatter={(val: any) => [`$${Number(val).toFixed(2)}`, 'Cumulative Total']}
                  labelFormatter={(l, payload) => {
                    if (payload && payload.length) {
                      return `${payload[0].payload.date}`;
                    }
                    return l;
                  }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area
                  type="monotone"
                  dataKey="cumulativeRevenue"
                  name="Cumulative Gross ($)"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorCum)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Day of the Week Deep Dive */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Day-of-Week Sales Performance</h3>
            <p className="text-xs text-slate-500">Aggregated revenue, volume, and average order ticket</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {dayStats.map((day) => {
            const isTop = day.revenue === Math.max(...dayStats.map((d) => d.revenue));
            return (
              <div
                key={day.day}
                className={`p-3.5 rounded-xl border transition-all ${
                  isTop
                    ? 'bg-indigo-50/80 border-indigo-200 ring-1 ring-indigo-400'
                    : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-800 text-xs">{day.day}</span>
                  {isTop && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-600 text-white">
                      Peak
                    </span>
                  )}
                </div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                  ${day.revenue.toFixed(0)}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Units:</span>
                    <span className="font-semibold text-slate-700">{day.units}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Orders:</span>
                    <span className="font-semibold text-slate-700">{day.orderCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Ticket:</span>
                    <span className="font-semibold text-slate-700 font-mono">${day.avgOrderValue.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
