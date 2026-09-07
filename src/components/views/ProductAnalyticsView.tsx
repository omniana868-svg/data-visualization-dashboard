import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  Legend,
} from 'recharts';
import { PackageCheck, ArrowUpDown, Tag, DollarSign, Layers } from 'lucide-react';
import { SaleRecord } from '../../types';
import { getProductStats } from '../../utils/analytics';
import { PRODUCT_COLORS } from '../../data/salesData';

interface ProductAnalyticsViewProps {
  records: SaleRecord[];
  onSelectProduct?: (productName: string) => void;
}

export const ProductAnalyticsView: React.FC<ProductAnalyticsViewProps> = ({ records }) => {
  const [sortField, setSortField] = useState<'revenue' | 'units' | 'unitPrice'>('revenue');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const productStats = getProductStats(records);

  const sortedStats = [...productStats].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    return sortAsc ? valA - valB : valB - valA;
  });

  const handleSort = (field: 'revenue' | 'units' | 'unitPrice') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const totalCatalogRev = productStats.reduce((sum, p) => sum + p.revenue, 0);

  return (
    <div className="space-y-6">
      {/* Product Highlights Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center space-x-2">
              <PackageCheck className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-base">Product Portfolio Performance</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparative analysis of all 12 products across volume, unit price, and gross margin
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500 font-medium">Rank by:</span>
            <div className="bg-slate-100 p-0.5 rounded-lg flex space-x-1">
              <button
                onClick={() => { setSortField('revenue'); setSortAsc(false); }}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  sortField === 'revenue' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => { setSortField('units'); setSortAsc(false); }}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  sortField === 'units' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Units Sold
              </button>
              <button
                onClick={() => { setSortField('unitPrice'); setSortAsc(false); }}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  sortField === 'unitPrice' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                Price Tier
              </button>
            </div>
          </div>
        </div>

        {/* Product Revenue Bar Chart */}
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedStats}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis
                type="number"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => (sortField === 'units' ? `${v}` : `$${v}`)}
              />
              <YAxis
                dataKey="product"
                type="category"
                stroke="#334155"
                fontSize={11}
                tickLine={false}
                width={170}
                tickFormatter={(val) => (val.length > 22 ? `${val.slice(0, 20)}…` : val)}
              />
              <Tooltip
                formatter={(val: any) => [
                  sortField === 'units' ? `${val} items` : `$${Number(val).toFixed(2)}`,
                  sortField === 'revenue' ? 'Gross Revenue' : sortField === 'units' ? 'Units Sold' : 'Unit Price',
                ]}
                labelFormatter={(l) => `${l}`}
              />
              <Bar dataKey={sortField} name="Value" radius={[0, 6, 6, 0]}>
                {sortedStats.map((entry) => (
                  <Cell
                    key={`prod-cell-${entry.product}`}
                    fill={PRODUCT_COLORS[entry.product] || '#4f46e5'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comprehensive Catalog Performance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Detailed SKU Ledger (12 Products)
          </h4>
          <span className="text-xs text-slate-500 font-mono">
            Total Revenue: ${totalCatalogRev.toFixed(2)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Product Name</th>
                <th
                  onClick={() => handleSort('unitPrice')}
                  className="py-3 px-4 cursor-pointer hover:text-indigo-600 text-right"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Catalog Price</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('units')}
                  className="py-3 px-4 cursor-pointer hover:text-indigo-600 text-right"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Units Sold</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('revenue')}
                  className="py-3 px-4 cursor-pointer hover:text-indigo-600 text-right"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Gross Revenue</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Revenue Contribution</th>
                <th className="py-3 px-4 text-center">Orders Present</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedStats.map((item, idx) => {
                const color = PRODUCT_COLORS[item.product] || '#4f46e5';
                return (
                  <tr key={item.product} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-semibold text-slate-800">{item.product}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700">
                      ${item.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                      {item.units}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      ${item.revenue.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <span className="font-mono text-slate-600">{item.percentageOfRevenue}%</span>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(100, item.percentageOfRevenue * 5)}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[11px]">
                        {item.orderAppearances} orders
                      </span>
                    </td>
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
