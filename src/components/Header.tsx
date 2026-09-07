import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PackageCheck, 
  CreditCard, 
  Sliders, 
  Table, 
  Download, 
  RotateCcw,
  Layers
} from 'lucide-react';
import { ViewMode, SaleRecord } from '../types';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  filteredCount: number;
  totalCount: number;
  totalRevenue: number;
  onResetFilters: () => void;
  filteredRecords: SaleRecord[];
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  filteredCount,
  totalCount,
  totalRevenue,
  onResetFilters,
  filteredRecords,
}) => {
  const exportCSV = () => {
    const headers = ['Order Number', 'Product', 'Price', 'Date', 'Payment Method', 'Day of Week'];
    const rows = filteredRecords.map((r) => [
      r.orderNumber,
      `"${r.product}"`,
      r.price.toFixed(2),
      r.date,
      `"${r.paymentMethod}"`,
      r.dayOfWeek || '',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `orders_dataset_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredRecords, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `orders_dataset_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const navItems: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Executive Overview', icon: <Layers className="w-4 h-4" /> },
    { id: 'trends', label: 'Trends & Timeline', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'products', label: 'Product Performance', icon: <PackageCheck className="w-4 h-4" /> },
    { id: 'payments', label: 'Payments & Baskets', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'custom', label: 'Chart Studio', icon: <Sliders className="w-4 h-4" /> },
    { id: 'table', label: 'Data Explorer', icon: <Table className="w-4 h-4" /> },
  ];

  const hasFilterActive = filteredCount < totalCount;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
          {/* Brand & Context */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-inner ring-2 ring-indigo-400/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Sales & Orders Intelligence
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {filteredCount} Items
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Aug 15 – Oct 07, 2025 • Orders TT-1001 to TT-1098
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-1.5 flex items-center space-x-2">
              <span className="text-slate-400">Active Revenue:</span>
              <span className="font-semibold text-emerald-400 font-mono text-sm">
                ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {hasFilterActive && (
              <button
                id="header-reset-filters-btn"
                onClick={onResetFilters}
                className="inline-flex items-center space-x-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-2.5 py-1.5 rounded-lg transition-colors"
                title="Reset filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}

            <div className="relative group">
              <button
                id="header-export-btn"
                onClick={exportCSV}
                className="inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors font-medium shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Export CSV</span>
              </button>
            </div>
            <button
              id="header-export-json-btn"
              onClick={exportJSON}
              className="inline-flex items-center space-x-1.5 bg-slate-800/60 hover:bg-slate-700 text-slate-300 border border-slate-700/80 px-2.5 py-1.5 rounded-lg transition-colors font-medium"
            >
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto scrollbar-none py-1 border-t border-slate-800/80 text-sm">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
