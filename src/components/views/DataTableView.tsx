import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Download, 
  ExternalLink,
  ChevronLeft, 
  ChevronRight,
  Receipt
} from 'lucide-react';
import { SaleRecord, OrderGroup } from '../../types';
import { PAYMENT_METHOD_COLORS, PRODUCT_COLORS, getOrderGroups } from '../../data/salesData';

interface DataTableViewProps {
  records: SaleRecord[];
  onOpenOrderModal: (order: OrderGroup) => void;
}

type SortField = 'orderNumber' | 'date' | 'product' | 'price' | 'paymentMethod';

export const DataTableView: React.FC<DataTableViewProps> = ({
  records,
  onOpenOrderModal,
}) => {
  const [localSearch, setLocalSearch] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('orderNumber');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);

  const orderGroups = useMemo(() => getOrderGroups(records), [records]);

  // Filter records based on local search
  const filteredRecords = useMemo(() => {
    if (!localSearch.trim()) return records;
    const q = localSearch.toLowerCase();
    return records.filter(
      (r) =>
        r.orderNumber.toLowerCase().includes(q) ||
        r.product.toLowerCase().includes(q) ||
        r.paymentMethod.toLowerCase().includes(q) ||
        r.date.includes(q)
    );
  }, [records, localSearch]);

  // Sort records
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'price') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredRecords, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleInspectOrder = (orderNum: string) => {
    const found = orderGroups.find((o) => o.orderNumber === orderNum);
    if (found) {
      onOpenOrderModal(found);
    }
  };

  const exportTableCSV = () => {
    const headers = ['Order Number', 'Date', 'Product', 'Price', 'Payment Method', 'Day of Week'];
    const rows = sortedRecords.map((r) => [
      r.orderNumber,
      r.date,
      `"${r.product}"`,
      r.price.toFixed(2),
      `"${r.paymentMethod}"`,
      r.dayOfWeek || '',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sales_records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Table Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => {
              setLocalSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search records in table..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
          />
        </div>

        {/* Page size & export */}
        <div className="flex items-center space-x-3 text-xs w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-300 rounded-md py-1 px-2 text-slate-700 text-xs focus:outline-none"
            >
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <button
            onClick={exportTableCSV}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Export Table</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th
                  onClick={() => handleSort('orderNumber')}
                  className="py-3 px-4 cursor-pointer hover:text-indigo-600 select-none"
                >
                  <div className="flex items-center space-x-1">
                    <span>Order #</span>
                    {sortField === 'orderNumber' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-indigo-600" /> : <ArrowDown className="w-3 h-3 text-indigo-600" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('date')}
                  className="py-3 px-4 cursor-pointer hover:text-indigo-600 select-none"
                >
                  <div className="flex items-center space-x-1">
                    <span>Date & Day</span>
                    {sortField === 'date' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-indigo-600" /> : <ArrowDown className="w-3 h-3 text-indigo-600" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('product')}
                  className="py-3 px-4 cursor-pointer hover:text-indigo-600 select-none"
                >
                  <div className="flex items-center space-x-1">
                    <span>Product</span>
                    {sortField === 'product' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-indigo-600" /> : <ArrowDown className="w-3 h-3 text-indigo-600" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('price')}
                  className="py-3 px-4 cursor-pointer hover:text-indigo-600 select-none text-right"
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span>Price ($)</span>
                    {sortField === 'price' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-indigo-600" /> : <ArrowDown className="w-3 h-3 text-indigo-600" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort('paymentMethod')}
                  className="py-3 px-4 cursor-pointer hover:text-indigo-600 select-none"
                >
                  <div className="flex items-center space-x-1">
                    <span>Payment Method</span>
                    {sortField === 'paymentMethod' ? (
                      sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-indigo-600" /> : <ArrowDown className="w-3 h-3 text-indigo-600" />
                    ) : (
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-500">
                    No matching records found.
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((r) => {
                  const payColor = PAYMENT_METHOD_COLORS[r.paymentMethod];
                  const prodColor = PRODUCT_COLORS[r.product];
                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                      onClick={() => handleInspectOrder(r.orderNumber)}
                    >
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 flex items-center space-x-1.5">
                        <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                          {r.orderNumber}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="font-mono text-slate-800">{r.date}</span>
                        <span className="text-slate-400 ml-1.5">({r.dayOfWeek?.slice(0, 3)})</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: prodColor }}
                          />
                          <span className="font-medium text-slate-800">{r.product}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        ${r.price.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border"
                          style={{
                            backgroundColor: `${payColor}12`,
                            borderColor: `${payColor}30`,
                            color: payColor,
                          }}
                        >
                          {r.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInspectOrder(r.orderNumber);
                          }}
                          className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                          title="View order details"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedRecords.length)} of {sortedRecords.length} records
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-slate-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
