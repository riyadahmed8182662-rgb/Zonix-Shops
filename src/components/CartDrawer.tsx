/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { StoreSettings } from '../types';

interface CartDrawerProps {
  settings: StoreSettings;
  onProceedToCheckout: () => void;
  onStartShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  settings,
  onProceedToCheckout,
  onStartShopping
}) => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal, itemCount } = useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings.freeShippingThreshold || 2500;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-gray-900">Your Shopping Cart</h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-100">
            <div className="flex items-center justify-between text-xs font-medium text-emerald-900 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                {remainingForFreeShipping > 0
                  ? `Add ৳${remainingForFreeShipping.toLocaleString()} more for FREE Delivery`
                  : '🎉 Congratulations! You unlocked FREE Delivery!'}
              </span>
              <span className="font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-emerald-200/60 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-1">Your cart is empty</h3>
                <p className="text-xs text-gray-500 max-w-xs mb-6">
                  Browse our catalog to discover authentic Bangladeshi lifestyle, electronics, and fashion products.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onStartShopping();
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedVariant || ''}`}
                  className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 relative group"
                >
                  {/* Thumbnail */}
                  <img
                    src={
                      item.product.images?.[0] ||
                      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80'
                    }
                    alt={item.product.name}
                    className="w-18 h-18 object-cover rounded-lg bg-white shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 truncate">{item.product.name}</h4>
                      {item.selectedVariant && (
                        <p className="text-[11px] text-gray-500 font-medium">Variant: {item.selectedVariant}</p>
                      )}
                      <div className="text-xs font-bold text-emerald-700 mt-1">
                        ৳{item.product.price.toLocaleString()}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 bg-white rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1, item.selectedVariant)
                          }
                          className="p-1 hover:bg-gray-100 text-gray-600 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1, item.selectedVariant)
                          }
                          disabled={item.quantity >= item.product.stock}
                          className="p-1 hover:bg-gray-100 text-gray-600 disabled:opacity-40 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Subtotal & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-extrabold text-gray-900 text-base">৳{subtotal.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Taxes & exact delivery fee (Inside Dhaka ৳{settings.deliveryChargeInsideDhaka} / Outside ৳{settings.deliveryChargeOutsideDhaka}) verified at checkout.
              </p>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Cash on Delivery & bKash / Nagad Accepted</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
