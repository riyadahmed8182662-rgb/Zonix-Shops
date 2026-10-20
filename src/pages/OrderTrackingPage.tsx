/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Calendar,
  ExternalLink,
  Phone
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { fetchOrderByIdOrNumber } from '../services/storeService';

interface OrderTrackingPageProps {
  initialOrderNumber?: string;
  onNavigateHome: () => void;
}

const ORDER_STEPS: Array<{ key: OrderStatus; label: string; description: string }> = [
  { key: 'pending', label: 'Order Placed', description: 'Order received and logged in system' },
  { key: 'confirmed', label: 'Order Confirmed', description: 'Address & items verified by team' },
  { key: 'processing', label: 'Processing & Packed', description: 'Packed with quality inspection' },
  { key: 'shipped', label: 'Handed to Courier', description: 'In transit with delivery partner' },
  { key: 'delivered', label: 'Delivered', description: 'Parcel delivered to recipient' }
];

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrderNumber,
  onNavigateHome
}) => {
  const [searchInput, setSearchInput] = useState(initialOrderNumber || '');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchOrder = async (orderIdentifier: string) => {
    if (!orderIdentifier.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const found = await fetchOrderByIdOrNumber(orderIdentifier.trim());
      if (!found) {
        setError(`No order found matching "${orderIdentifier}". Please verify your Order Number (e.g. ZX-123456).`);
        setOrder(null);
      } else {
        setOrder(found);
      }
    } catch (err: any) {
      setError(err.message || 'Error looking up order.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      searchOrder(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchOrder(searchInput);
  };

  const getStepStatus = (stepKey: OrderStatus, currentStatus: OrderStatus) => {
    const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (currentStatus === 'cancelled') {
      return stepKey === 'pending' ? 'completed' : 'cancelled';
    }
    if (currentStatus === 'returned') {
      return 'returned';
    }

    if (currentIndex >= stepIndex) return 'completed';
    if (currentIndex === stepIndex - 1) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <PackageCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Track Your Shipment</h1>
        <p className="text-xs text-gray-500 mt-1">
          Enter your ZonixShop Order Number (e.g. ZX-849201) to view real-time courier and delivery status.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mt-6 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              required
              placeholder="Enter Order Number (e.g. ZX-123456)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
              className="w-full pl-10 pr-4 py-3 text-xs bg-white border border-gray-200 rounded-2xl shadow-xs focus:outline-none focus:border-emerald-500 font-mono uppercase"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-xs transition-colors shrink-0 disabled:opacity-50"
          >
            {loading ? 'Tracking...' : 'Track Parcel'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Order Tracking Display */}
      {order && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-8 space-y-8 animate-in fade-in">
          {/* Order Meta Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-gray-500">Order Ref:</span>
                <span className="text-base font-extrabold text-emerald-700 font-mono">{order.orderNumber}</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-100 text-emerald-800">
                  {order.orderStatus}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-gray-500 block">Total Amount</span>
              <span className="text-xl font-extrabold text-gray-900">৳{order.total.toLocaleString()}</span>
              <span className="text-[11px] block font-medium text-gray-500 uppercase mt-0.5">
                {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
              </span>
            </div>
          </div>

          {/* Courier Consignment Section (If assigned) */}
          {order.courierName && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">
                    Handed to {order.courierName}
                  </h4>
                  <p className="text-[11px] text-emerald-800">
                    Consignment / Tracking ID: <strong className="font-mono">{order.trackingNumber || 'Pending pickup'}</strong>
                  </p>
                </div>
              </div>
              {order.trackingNumber && (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
                  In Transit with {order.courierName}
                </span>
              )}
            </div>
          )}

          {/* Timeline Visualizer */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Shipment Milestones</h3>
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {ORDER_STEPS.map((step, idx) => {
                const status = getStepStatus(step.key, order.orderStatus);
                const isCompleted = status === 'completed';
                const isCurrent = status === 'current';

                return (
                  <div key={step.key} className="relative flex items-start gap-4">
                    {/* Circle marker */}
                    <div
                      className={`absolute -left-6 sm:-left-8 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                        isCompleted
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                          : isCurrent
                          ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                          : 'bg-gray-100 text-gray-400 border border-gray-300'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div>
                      <h4
                        className={`text-xs font-bold ${
                          isCompleted ? 'text-emerald-900' : isCurrent ? 'text-amber-900' : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p className="text-[11px] text-gray-500">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items in this Order */}
          <div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Parcel Items</h3>
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden text-xs">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=100&q=80'}
                      alt={item.productName}
                      className="w-10 h-10 object-cover rounded-lg bg-gray-50 shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{item.productName}</p>
                      {item.variant && <p className="text-[10px] text-gray-500">Variant: {item.variant}</p>}
                      <p className="text-[11px] text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">৳{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address Summary */}
          <div className="p-4 bg-gray-50 rounded-2xl text-xs space-y-1">
            <span className="font-bold text-gray-900 flex items-center gap-1.5 mb-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              Delivery Destination
            </span>
            <p className="text-gray-700 font-semibold">{order.shippingAddress.fullName} • {order.shippingAddress.phone}</p>
            <p className="text-gray-500">{order.shippingAddress.fullAddress}, {order.shippingAddress.district}, {order.shippingAddress.division}</p>
          </div>
        </div>
      )}
    </div>
  );
};
