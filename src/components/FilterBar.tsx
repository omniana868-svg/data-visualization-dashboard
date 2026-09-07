import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  X, 
  ChevronDown, 
  ChevronUp,
  Tag,
  DollarSign
} from 'lucide-react';
import { FilterState } from '../types';
import { UNIQUE_PRODUCTS, UNIQUE_PAYMENT_METHODS, PAYMENT_METHOD_COLORS } from '../data/salesData';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  totalCount,
  filteredCount,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchQuery: e.target.value });
  };

  const handleDatePreset = (preset: FilterState['dateRange']) => {
    let start = '';
    let end = '';
    if (preset === 'aug') {
      start = '2025-08-15';
      end = '2025-08-31';
    } else if (preset === 'sep') {
      start = '2025-09-01';
      end = '2025-09-30';
    } else if (preset === 'oct') {
      start = '2025-10-01';
      end = '2025-10-07';
    }
    onFilterChange({
      ...filters,
      dateRange: preset,
      startDate: start,
      endDate: end,
    });
  };

  const togglePaymentMethod = (method: string) => {
    const exists = filters.selectedPaymentMethods.includes(method);
    const updated = exists
      ? filters.selectedPaymentMethods.filter((m) => m !== method)
      : [...filters.selectedPaymentMethods, method];
    onFilterChange({ ...filters, selectedPaymentMethods: updated });
  };

  const toggleProduct = (product: string) => {
    const exists = filters.selectedProducts.includes(product);
    const updated = exists
      ? filters.selectedProducts.filter((p) => p !== product)
      : [...filters.selectedProducts, product];
    onFilterChange({ ...filters, selectedProducts: updated });
  };

  const isFiltered = 
    filters.searchQuery !== '' ||
    filters.dateRange !== 'all' ||
    filters.selectedPaymentMethods.length > 0 ||
    filters.selectedProducts.length > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < 200;

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Main top bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="filter-search-input"
              type="text"
              value={filters.searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by order # (TT-1001) or product..."
              className="w-full pl-9 pr-8 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 placeholder-slate-400 transition-all"
            />
            {filters.searchQuery && (
              <button
                onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Date Presets */}
          <div className="flex items-center space-x-1.5 overflow-x-auto text-xs font-medium">
            <span className="text-slate-500 mr-1 flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Period:
            </span>
            {[
              { id: 'all', label: 'All Dates' },
              { id: 'aug', label: 'Aug 2025' },
              { id: 'sep', label: 'Sep 2025' },
              { id: 'oct', label: 'Oct 2025' },
            ].map((d) => (
              <button
                key={d.id}
                id={`date-filter-${d.id}`}
                onClick={() => handleDatePreset(d.id as FilterState['dateRange'])}
                className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  filters.dateRange === d.id
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Payment Method Quick Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
            <span className="text-slate-500 mr-1 hidden sm:inline">Payment:</span>
            {UNIQUE_PAYMENT_METHODS.map((pm) => {
              const isSelected = filters.selectedPaymentMethods.includes(pm);
              const color = PAYMENT_METHOD_COLORS[pm];
              return (
                <button
                  key={pm}
                  id={`pay-filter-${pm.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => togglePaymentMethod(pm)}
                  className={`px-2.5 py-1.5 rounded-md font-medium transition-all whitespace-nowrap border flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: color }}
                  />
                  <span>{pm}</span>
                </button>
              );
            })}
          </div>

          {/* Advanced Filters Toggle & Reset */}
          <div className="flex items-center space-x-2">
            <button
              id="toggle-advanced-filters-btn"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                isExpanded || filters.selectedProducts.length > 0 || filters.minPrice > 0 || filters.maxPrice < 200
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>More Filters</span>
              {filters.selectedProducts.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-indigo-600 text-white rounded-full text-[10px]">
                  {filters.selectedProducts.length}
                </span>
              )}
              {isExpanded ? <ChevronUp className="w-3 h-3 ml-0.5" /> : <ChevronDown className="w-3 h-3 ml-0.5" />}
            </button>

            {isFiltered && (
              <button
                id="filterbar-reset-btn"
                onClick={onReset}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 flex items-center"
              >
                <X className="w-3 h-3 mr-1" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Results summary bar */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
          <div>
            Showing <strong className="text-slate-800 font-semibold">{filteredCount}</strong> of{' '}
            <span>{totalCount}</span> line items
            {isFiltered && (
              <span className="ml-2 text-indigo-600 font-medium">(Filtered dataset)</span>
            )}
          </div>
          {filters.dateRange !== 'all' && (
            <div className="text-slate-600">
              Period: <span className="font-medium text-slate-800">{filters.startDate}</span> to{' '}
              <span className="font-medium text-slate-800">{filters.endDate}</span>
            </div>
          )}
        </div>

        {/* Expanded panel for Product filters and Price bounds */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl">
            {/* Product selection */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-2 flex items-center">
                <Tag className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Filter by Products ({filters.selectedProducts.length ? `${filters.selectedProducts.length} selected` : 'All 12 products'})
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {UNIQUE_PRODUCTS.map((prod) => {
                  const selected = filters.selectedProducts.includes(prod);
                  return (
                    <button
                      key={prod}
                      id={`product-chip-${prod.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      onClick={() => toggleProduct(prod)}
                      className={`text-xs px-2.5 py-1 rounded-md transition-all border ${
                        selected
                          ? 'bg-indigo-600 text-white border-indigo-600 font-medium'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {prod}
                    </button>
                  );
                })}
              </div>
              {filters.selectedProducts.length > 0 && (
                <button
                  onClick={() => onFilterChange({ ...filters, selectedProducts: [] })}
                  className="text-xs text-indigo-600 hover:underline mt-2 inline-block font-medium"
                >
                  Select all products
                </button>
              )}
            </div>

            {/* Price slider */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2 flex items-center">
                <DollarSign className="w-3.5 h-3.5 mr-1 text-slate-500" />
                Price Range: ${filters.minPrice} – ${filters.maxPrice}
              </label>
              <div className="space-y-3 bg-white p-3 rounded-lg border border-slate-200">
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Min Price</span>
                    <span className="font-semibold text-slate-800">${filters.minPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="180"
                    step="5"
                    value={filters.minPrice}
                    onChange={(e) => onFilterChange({ ...filters, minPrice: Number(e.target.value) })}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Max Price</span>
                    <span className="font-semibold text-slate-800">${filters.maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="180"
                    step="5"
                    value={filters.maxPrice}
                    onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
