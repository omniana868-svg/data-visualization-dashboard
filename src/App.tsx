import React, { useState, useMemo } from 'react';
import { ALL_SALES_DATA, getOrderGroups } from './data/salesData';
import { FilterState, ViewMode, OrderGroup } from './types';
import { calculateMetrics } from './utils/analytics';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { KpiCards } from './components/KpiCards';
import { ExecutiveOverview } from './components/views/ExecutiveOverview';
import { TrendsTimelineView } from './components/views/TrendsTimelineView';
import { ProductAnalyticsView } from './components/views/ProductAnalyticsView';
import { PaymentBasketView } from './components/views/PaymentBasketView';
import { CustomChartBuilder } from './components/views/CustomChartBuilder';
import { DataTableView } from './components/views/DataTableView';
import { OrderDetailModal } from './components/OrderDetailModal';

const INITIAL_FILTERS: FilterState = {
  searchQuery: '',
  dateRange: 'all',
  startDate: '',
  endDate: '',
  selectedPaymentMethods: [],
  selectedProducts: [],
  minPrice: 50,
  maxPrice: 180,
};

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('overview');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [selectedOrder, setSelectedOrder] = useState<OrderGroup | null>(null);

  // Apply filters to dataset
  const filteredRecords = useMemo(() => {
    return ALL_SALES_DATA.filter((record) => {
      // Search query
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesSearch =
          record.orderNumber.toLowerCase().includes(q) ||
          record.product.toLowerCase().includes(q) ||
          record.paymentMethod.toLowerCase().includes(q) ||
          record.date.includes(q);
        if (!matchesSearch) return false;
      }

      // Date range presets
      if (filters.startDate && record.date < filters.startDate) return false;
      if (filters.endDate && record.date > filters.endDate) return false;

      // Payment method
      if (
        filters.selectedPaymentMethods.length > 0 &&
        !filters.selectedPaymentMethods.includes(record.paymentMethod)
      ) {
        return false;
      }

      // Product
      if (
        filters.selectedProducts.length > 0 &&
        !filters.selectedProducts.includes(record.product)
      ) {
        return false;
      }

      // Price bounds
      if (record.price < filters.minPrice || record.price > filters.maxPrice) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Derived metrics
  const metrics = useMemo(() => calculateMetrics(filteredRecords), [filteredRecords]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased">
      {/* Pinned Global Header */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        filteredCount={filteredRecords.length}
        totalCount={ALL_SALES_DATA.length}
        totalRevenue={metrics.totalRevenue}
        onResetFilters={handleResetFilters}
        filteredRecords={filteredRecords}
      />

      {/* Global Interactive Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        onReset={handleResetFilters}
        totalCount={ALL_SALES_DATA.length}
        filteredCount={filteredRecords.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Metrics Strip */}
        <KpiCards metrics={metrics} />

        {/* View Router */}
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">🔍</span>
            </div>
            <h3 className="text-base font-bold text-slate-800">No Records Match Active Filters</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try widening your price range, clearing selected payment channels, or removing the search term.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div>
            {currentView === 'overview' && (
              <ExecutiveOverview records={filteredRecords} metrics={metrics} />
            )}
            {currentView === 'trends' && (
              <TrendsTimelineView records={filteredRecords} />
            )}
            {currentView === 'products' && (
              <ProductAnalyticsView records={filteredRecords} />
            )}
            {currentView === 'payments' && (
              <PaymentBasketView
                records={filteredRecords}
                onSelectOrder={(orderNum) => {
                  const orders = getOrderGroups(filteredRecords);
                  const found = orders.find((o) => o.orderNumber === orderNum);
                  if (found) setSelectedOrder(found);
                }}
              />
            )}
            {currentView === 'custom' && (
              <CustomChartBuilder records={filteredRecords} />
            )}
            {currentView === 'table' && (
              <DataTableView
                records={filteredRecords}
                onOpenOrderModal={(order) => setSelectedOrder(order)}
              />
            )}
          </div>
        )}
      </main>

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-slate-700">Sales & Orders Intelligence Dashboard</span>
            <span className="mx-2">•</span>
            <span>116 Line Items Verified Across 98 Orders (TT-1001 – TT-1098)</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">August 15 – October 07, 2025</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-indigo-600 hover:underline font-medium"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
