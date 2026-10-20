/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  CheckCircle,
  Package,
  Truck,
  Phone,
  Printer,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';
import { Order } from '../types';

interface OrderSuccessPageProps {
  order: Order;
  onTrackOrder: (orderNumber: string) => void;
  onContinueShopping: () => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  order,
  onTrackOrder,
  onContinueShopping
}) => {
  const handlePrint = () => {
    window.print();
  };

  const isDhaka = order.shippingAddress.isInsideDhaka;
  const estimatedDays = isDhaka ? '24 – 48 Hours' : '2 – 3 Days';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-in fade-in zoom-in-95">
      {/* Success Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        {/* Top Celebration Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-8 text-center relative">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-xs rounded-full flex items-center justify-center mx-auto mb-4 border border-white/30">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <span className="text-emerald-100 text-xs uppercase tracking-widest font-bold">
            Order Successfully Placed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">Thank you for your order!</h1>
          <p className="text-xs text-emerald-100 mt-2 max-w-md mx-auto">
            Your order has been verified and registered into our fulfillment queue.
          </p>

          <div className="mt-4 inline-block bg-white text-gray-900 px-4 py-2 rounded-xl text-xs font-mono font-bold shadow-xs">
            Order Reference: <span className="text-emerald-700">{order.orderNumber}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Status alerts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3">
              <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-900">Estimated Delivery</p>
                <p className="text-emerald-700 font-medium">{estimatedDays} ({isDhaka ? 'Inside Dhaka' : 'All Bangladesh'})</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-start gap-3">
              <Package className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-gray-900">Payment Status</p>
                <p className="text-gray-600 uppercase font-bold text-[11px]">
                  {order.paymentMethod === 'cod'
                    ? 'Unpaid (Cash on Delivery)'
                    : `Pending Verification (${order.paymentMethod.toUpperCase()})`}
                </p>
              </div>
            </div>
          </div>

          {/* Line items table */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Items Ordered</h3>
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between text-xs gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'}
                      alt={item.productName}
                      className="w-10 h-10 object-cover rounded-lg bg-gray-50 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 truncate">{item.productName}</p>
                      {item.variant && <p className="text-[11px] text-gray-500">Variant: {item.variant}</p>}
                      <p className="text-[11px] text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-extrabold text-gray-900 shrink-0">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing calculations */}
          <div className="p-4 bg-gray-50 rounded-2xl space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">৳{order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Discount ({order.couponCode || 'Promo'})</span>
                <span>-৳{order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Delivery Charge</span>
              <span className="font-semibold text-gray-900">
                {order.shippingFee === 0 ? 'FREE' : `৳${order.shippingFee}`}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline text-sm font-extrabold text-gray-900">
              <span>Total Payable</span>
              <span className="text-lg text-emerald-700">৳{order.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Shipping Address review */}
          <div className="p-4 bg-gray-50 rounded-2xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-gray-900 mb-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Delivery Details</span>
            </div>
            <p className="text-gray-800 font-semibold">{order.shippingAddress.fullName} • {order.shippingAddress.phone}</p>
            <p className="text-gray-600">{order.shippingAddress.fullAddress}, {order.shippingAddress.cityArea}, {order.shippingAddress.district}, {order.shippingAddress.division}</p>
            {order.notes && <p className="text-gray-500 italic">Notes: "{order.notes}"</p>}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onTrackOrder(order.orderNumber)}
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>Track Shipment Live</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrint}
              className="py-3 px-4 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4 text-gray-500" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={onContinueShopping}
              className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
