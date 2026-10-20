/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  CreditCard,
  Tag,
  AlertCircle,
  CheckCircle2,
  Lock,
  Phone,
  User,
  MapPin,
  FileText
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { StoreSettings, ShippingAddress, PaymentMethod, Order } from '../types';
import { createOrderSecurely, validateCouponCode } from '../services/storeService';

interface CheckoutPageProps {
  settings: StoreSettings;
  onBack: () => void;
  onOrderPlaced: (order: Order) => void;
  onOpenAuth: () => void;
}

const BD_DIVISIONS = [
  'Dhaka',
  'Chattogram',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Sylhet',
  'Rangpur',
  'Mymensingh'
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  settings,
  onBack,
  onOrderPlaced,
  onOpenAuth
}) => {
  const { cart, subtotal, clearCart, appliedCoupon, setAppliedCoupon } = useCart();
  const { user, userProfile } = useAuth();

  // Form State
  const [fullName, setFullName] = useState(userProfile?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [altPhone, setAltPhone] = useState('');
  const [division, setDivision] = useState(userProfile?.defaultShipping?.division || 'Dhaka');
  const [district, setDistrict] = useState(userProfile?.defaultShipping?.district || 'Dhaka City');
  const [cityArea, setCityArea] = useState(userProfile?.defaultShipping?.cityArea || '');
  const [fullAddress, setFullAddress] = useState(userProfile?.defaultShipping?.fullAddress || '');
  const [notes, setNotes] = useState('');

  // Shipping choice: Dhaka vs Outside Dhaka
  const [isInsideDhaka, setIsInsideDhaka] = useState(
    userProfile?.defaultShipping?.isInsideDhaka !== undefined
      ? userProfile.defaultShipping.isInsideDhaka
      : true
  );

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [paymentTransactionId, setPaymentTransactionId] = useState('');
  const [paymentSenderNumber, setPaymentSenderNumber] = useState('');

  // Coupon
  const [couponInput, setCouponInput] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Pre-fill profile if changes
  useEffect(() => {
    if (userProfile) {
      if (!fullName) setFullName(userProfile.displayName || '');
      if (!phone) setPhone(userProfile.phone || '');
      if (!email && user?.email) setEmail(user.email);
    }
  }, [userProfile, user]);

  // Delivery fee
  const deliveryFee =
    settings.freeShippingThreshold > 0 && subtotal >= settings.freeShippingThreshold
      ? 0
      : isInsideDhaka
      ? settings.deliveryChargeInsideDhaka
      : settings.deliveryChargeOutsideDhaka;

  // Estimated total
  const estimatedTotal = Math.max(0, subtotal - couponDiscount + deliveryFee);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponError(null);
    setCouponSuccess(null);
    try {
      const result = await validateCouponCode(couponInput.trim(), subtotal);
      setAppliedCoupon(result.coupon);
      setCouponDiscount(result.discountAmount);
      setCouponSuccess(`Coupon '${result.coupon.code}' applied! You saved ৳${result.discountAmount}.`);
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon code');
      setCouponDiscount(0);
      setAppliedCoupon(null);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (cart.length === 0) {
      setFormError('Your shopping cart is empty.');
      return;
    }

    if (!phone.trim() || phone.trim().length < 11) {
      setFormError('Please provide a valid 11-digit Bangladeshi mobile number (e.g. 01XXXXXXXXX).');
      return;
    }

    if (!fullAddress.trim()) {
      setFormError('Please enter your full street/house delivery address.');
      return;
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !paymentTransactionId.trim()) {
      setFormError(`Please enter the ${paymentMethod.toUpperCase()} Transaction ID (TrxID) after making the payment.`);
      return;
    }

    setSubmitting(true);

    try {
      const shippingAddress: ShippingAddress = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        alternativePhone: altPhone.trim(),
        division,
        district,
        cityArea: cityArea.trim(),
        fullAddress: fullAddress.trim(),
        deliveryNotes: notes.trim(),
        isInsideDhaka
      };

      const clientItems = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        selectedVariant: item.selectedVariant
      }));

      const verifiedOrder = await createOrderSecurely({
        customerId: user?.uid || 'guest_' + phone.trim().replace(/\D/g, ''),
        customerName: fullName.trim(),
        customerEmail: email.trim() || `${phone.trim()}@guest.zonixshop.bd`,
        customerPhone: phone.trim(),
        shippingAddress,
        clientItems,
        paymentMethod,
        couponCode: appliedCoupon?.code || couponInput.trim() || undefined,
        paymentTransactionId: paymentTransactionId.trim() || undefined,
        paymentSenderNumber: paymentSenderNumber.trim() || undefined,
        notes: notes.trim()
      });

      clearCart();
      onOrderPlaced(verifiedOrder);
    } catch (err: any) {
      console.error('Order creation error:', err);
      setFormError(err.message || 'Failed to place order. Please review your cart and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
        <p className="text-xs text-gray-500 mb-6">There are no items in your cart to checkout.</p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-emerald-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Shopping</span>
      </button>

      {/* Header title */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Checkout & Delivery</h1>
        <p className="text-xs text-gray-500 mt-1">
          Complete your order with secure server price validation and nationwide courier delivery.
        </p>
      </div>

      {formError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-xs text-red-800">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Order Validation Error</p>
            <p>{formError}</p>
          </div>
        </div>
      )}

      {/* Sign-in prompt if not logged in */}
      {!user && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-900">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Already have an account?</span>
              <p className="text-[11px] text-emerald-700">Sign in to auto-fill address and track your order in My Orders.</p>
            </div>
          </div>
          <button
            onClick={onOpenAuth}
            className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shrink-0"
          >
            Sign In / Register
          </button>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Delivery & Payment Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <User className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-gray-900">1. Customer Contact Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Recipient Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Riyad Ahmed"
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mobile Number (11 Digits) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Alternative Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    placeholder="019XXXXXXXX"
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@example.com"
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-gray-900">2. Shipping & Delivery Address</h2>
              </div>

              {/* Delivery Area Toggle */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Delivery Region</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => {
                      setIsInsideDhaka(true);
                      setDivision('Dhaka');
                    }}
                    className={`p-3 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                      isInsideDhaka
                        ? 'border-emerald-600 bg-emerald-50/50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryRegion"
                      checked={isInsideDhaka}
                      onChange={() => {}}
                      className="mt-1 text-emerald-600"
                    />
                    <div>
                      <span className="font-bold text-xs text-gray-900 block">Inside Dhaka City</span>
                      <span className="text-[11px] text-gray-500">
                        Delivery in 24–48 Hours • Fee: ৳{settings.deliveryChargeInsideDhaka}
                      </span>
                    </div>
                  </label>

                  <label
                    onClick={() => {
                      setIsInsideDhaka(false);
                      if (division === 'Dhaka') setDivision('Chattogram');
                    }}
                    className={`p-3 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                      !isInsideDhaka
                        ? 'border-emerald-600 bg-emerald-50/50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryRegion"
                      checked={!isInsideDhaka}
                      onChange={() => {}}
                      className="mt-1 text-emerald-600"
                    />
                    <div>
                      <span className="font-bold text-xs text-gray-900 block">Outside Dhaka (All BD)</span>
                      <span className="text-[11px] text-gray-500">
                        Delivery in 48–72 Hours • Fee: ৳{settings.deliveryChargeOutsideDhaka}
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Division</label>
                  <select
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
                  >
                    {BD_DIVISIONS.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    District / City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g. Gazipur / Dhanmondi"
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Area / Thana</label>
                  <input
                    type="text"
                    value={cityArea}
                    onChange={(e) => setCityArea(e.target.value)}
                    placeholder="e.g. Mirpur-10 / Uttara"
                    className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Street / House / Road Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={fullAddress}
                  onChange={(e) => setFullAddress(e.target.value)}
                  placeholder="House #, Road #, Sector/Block, Landmark details..."
                  className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Delivery Instructions / Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Call before delivery, ring the bell on 3rd floor"
                  className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-gray-900">3. Select Payment Method</h2>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-600 bg-emerald-50/50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => {}}
                    className="mt-1 text-emerald-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900">Cash on Delivery (COD)</span>
                      <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        Most Popular
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Pay cash to the delivery rider when you receive and check your parcel at your doorstep.
                    </p>
                  </div>
                </label>

                {/* bKash Payment */}
                <label
                  onClick={() => setPaymentMethod('bkash')}
                  className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'bkash'
                      ? 'border-pink-600 bg-pink-50/40'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'bkash'}
                    onChange={() => {}}
                    className="mt-1 text-pink-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900 flex items-center gap-2">
                        <span className="bg-pink-600 text-white font-extrabold px-1.5 py-0.5 rounded text-[10px]">
                          bKash
                        </span>
                        <span>Merchant Payment</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Send payment to verified bKash Merchant Number: <strong>{settings.bkashMerchantNumber}</strong>
                    </p>

                    {paymentMethod === 'bkash' && (
                      <div className="mt-3 p-3 bg-white rounded-xl border border-pink-200 space-y-2 text-xs">
                        <p className="text-[11px] text-pink-900 font-medium">
                          1. Open bKash App & select "Make Payment" or Dial *247#.<br />
                          2. Enter Merchant Number: <strong>{settings.bkashMerchantNumber}</strong>.<br />
                          3. Enter Amount: <strong>৳{estimatedTotal.toLocaleString()}</strong>.<br />
                          4. Reference: <strong>ZONIX</strong>.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          <input
                            type="text"
                            required
                            placeholder="bKash Sender Number (017...)"
                            value={paymentSenderNumber}
                            onChange={(e) => setPaymentSenderNumber(e.target.value)}
                            className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Transaction ID (TrxID e.g. 9J82KZ...)"
                            value={paymentTransactionId}
                            onChange={(e) => setPaymentTransactionId(e.target.value)}
                            className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none font-mono uppercase"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </label>

                {/* Nagad Payment */}
                <label
                  onClick={() => setPaymentMethod('nagad')}
                  className={`p-4 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'nagad'
                      ? 'border-orange-600 bg-orange-50/40'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'nagad'}
                    onChange={() => {}}
                    className="mt-1 text-orange-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900 flex items-center gap-2">
                        <span className="bg-orange-600 text-white font-extrabold px-1.5 py-0.5 rounded text-[10px]">
                          Nagad
                        </span>
                        <span>Merchant Payment</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1">
                      Send payment to verified Nagad Merchant Number: <strong>{settings.nagadMerchantNumber}</strong>
                    </p>

                    {paymentMethod === 'nagad' && (
                      <div className="mt-3 p-3 bg-white rounded-xl border border-orange-200 space-y-2 text-xs">
                        <p className="text-[11px] text-orange-900 font-medium">
                          1. Open Nagad App & select "Merchant Pay" or Dial *167#.<br />
                          2. Enter Merchant Number: <strong>{settings.nagadMerchantNumber}</strong>.<br />
                          3. Enter Amount: <strong>৳{estimatedTotal.toLocaleString()}</strong>.<br />
                          4. Reference: <strong>ZONIX</strong>.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          <input
                            type="text"
                            required
                            placeholder="Nagad Sender Number"
                            value={paymentSenderNumber}
                            onChange={(e) => setPaymentSenderNumber(e.target.value)}
                            className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Transaction ID (TrxID)"
                            value={paymentTransactionId}
                            onChange={(e) => setPaymentTransactionId(e.target.value)}
                            className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none font-mono uppercase"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Placement */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-gray-900 pb-2 border-b border-gray-100">
                Order Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
              </h2>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.selectedVariant || ''}`} className="flex gap-3 text-xs">
                    <img
                      src={
                        item.product.images?.[0] ||
                        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80'
                      }
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg bg-gray-50 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{item.product.name}</p>
                      {item.selectedVariant && (
                        <p className="text-[11px] text-gray-400">Variant: {item.selectedVariant}</p>
                      )}
                      <p className="text-[11px] text-gray-500">
                        Qty: {item.quantity} × ৳{item.product.price.toLocaleString()}
                      </p>
                    </div>
                    <span className="font-bold text-gray-900 shrink-0">
                      ৳{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon input */}
              <div className="pt-3 border-t border-gray-100">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Have a Coupon Code?</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="e.g. ZONIX10, EID500"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none uppercase font-mono"
                    />
                    <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-1.5 bg-gray-900 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </div>

                {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-emerald-700 font-medium mt-1">{couponSuccess}</p>}
              </div>

              {/* Total calculations */}
              <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">৳{subtotal.toLocaleString()}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount Coupon ({appliedCoupon?.code})</span>
                    <span>-৳{couponDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-gray-400" />
                    Delivery Charge ({isInsideDhaka ? 'Inside Dhaka' : 'Outside Dhaka'})
                  </span>
                  <span className="font-semibold text-gray-900">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase">Free</span>
                    ) : (
                      `৳${deliveryFee}`
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-gray-900">Final Order Total</span>
                  <span className="text-2xl font-extrabold text-emerald-700">
                    ৳{estimatedTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{submitting ? 'Validating & Securing Order...' : 'Confirm Order Now'}</span>
              </button>

              <div className="space-y-1.5 pt-2 text-[11px] text-gray-400 text-center">
                <p className="flex items-center justify-center gap-1 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  100% Secure Server-Side Atomic Reservation
                </p>
                <p>Prices and stock levels are verified against live Firestore records.</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
