import React from 'react';
import { X, Calendar, CreditCard, ShoppingBag, Receipt } from 'lucide-react';
import { OrderGroup } from '../types';
import { PAYMENT_METHOD_COLORS, PRODUCT_COLORS } from '../data/salesData';

interface OrderDetailModalProps {
  order: OrderGroup | null;
  onClose: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold font-mono tracking-tight">{order.orderNumber}</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  {order.itemCount} {order.itemCount === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center mt-0.5">
                <Calendar className="w-3.5 h-3.5 mr-1" />
                {order.date}
              </p>
            </div>
          </div>
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
              Purchased Products
            </h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {order.items.map((item, index) => {
                const color = PRODUCT_COLORS[item.product] || '#6366f1';
                return (
                  <div key={item.id || index} className="p-3.5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{item.product}</p>
                        <div className="flex items-center space-x-2 mt-0.5 text-xs text-slate-500">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium"
                            style={{
                              backgroundColor: `${PAYMENT_METHOD_COLORS[item.paymentMethod]}15`,
                              color: PAYMENT_METHOD_COLORS[item.paymentMethod],
                            }}
                          >
                            <CreditCard className="w-3 h-3 mr-1" />
                            {item.paymentMethod}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary breakdown */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-sm">
            <div className="flex justify-between text-slate-600 text-xs">
              <span>Subtotal ({order.itemCount} items)</span>
              <span className="font-mono font-medium">${order.totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600 text-xs">
              <span>Taxes & Shipping</span>
              <span className="text-slate-500">Included in catalog price</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
              <span className="font-bold text-slate-800">Total Order Amount</span>
              <span className="text-xl font-bold font-mono text-indigo-600">
                ${order.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Method Details */}
          <div className="text-xs text-slate-500 flex items-center justify-between px-1">
            <span>Settled Payment Channel:</span>
            <span className="font-semibold text-slate-700">
              {order.paymentMethods.join(', ')}
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
