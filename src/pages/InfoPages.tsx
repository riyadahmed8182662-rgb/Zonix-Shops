/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  HelpCircle,
  FileText,
  Lock,
  Send
} from 'lucide-react';
import { StoreSettings } from '../types';

interface InfoPagesProps {
  pageType:
    | 'about'
    | 'contact'
    | 'faq'
    | 'shipping'
    | 'return'
    | 'privacy'
    | 'terms'
    | 'not-found';
  settings: StoreSettings;
  onBackToShop: () => void;
  onNavigate: (view: string) => void;
}

export const InfoPages: React.FC<InfoPagesProps> = ({
  pageType,
  settings,
  onBackToShop,
  onNavigate
}) => {
  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // FAQ open item
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactMessage('');
      setContactSubmitted(false);
    }, 4000);
  };

  const FAQS = [
    {
      q: 'How long does delivery take across Bangladesh?',
      a: `Inside Dhaka City, orders are delivered within 24 to 48 hours. For outside Dhaka across all 64 districts (Chattogram, Sylhet, Rajshahi, Khulna, Barishal, Rangpur, Mymensingh, etc.), parcels are delivered within 48 to 72 hours via our official courier partners Steadfast, Pathao, and RedX.`
    },
    {
      q: 'How much are the delivery charges?',
      a: `Standard delivery fee is ৳${settings.deliveryChargeInsideDhaka} inside Dhaka City, and ৳${settings.deliveryChargeOutsideDhaka} for all areas outside Dhaka. Orders over ৳${settings.freeShippingThreshold.toLocaleString()} qualify for 100% FREE delivery nationwide.`
    },
    {
      q: 'Can I pay with Cash on Delivery (COD)?',
      a: 'Yes! We support Cash on Delivery nationwide. You can inspect the package upon receipt at your doorstep before paying the delivery rider.'
    },
    {
      q: 'How do I pay via bKash or Nagad?',
      a: `You can choose bKash or Nagad at checkout. Make a payment to our verified merchant number (${settings.bkashMerchantNumber} for bKash, ${settings.nagadMerchantNumber} for Nagad), and enter your Transaction ID (TrxID) in the checkout form for instant order matching.`
    },
    {
      q: 'What is the return and replacement policy?',
      a: 'We offer an easy 7-day return and replacement policy for defective, incorrect, or damaged products. Simply open a support ticket from your account or reach our customer hotline to request a hassle-free courier pickup.'
    },
    {
      q: 'Are all products authentic?',
      a: 'Yes, 100%. ZonixShop only sources brand-new, genuine items with official manufacturer warranties and authentic serial numbers.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in">
      <button
        onClick={onBackToShop}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-emerald-600 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Store</span>
      </button>

      {/* ABOUT US */}
      {pageType === 'about' && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xs space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold uppercase">
            <span>Our Story</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            About ZonixShop Bangladesh
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Founded with a vision to redefine online retail in Bangladesh, <strong>ZonixShop</strong> combines modern e-commerce reliability with authentic local and international products. We bridge the gap between quality manufacturers and discerning customers across all 64 districts.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <ShieldCheck className="w-6 h-6 text-emerald-600 mb-2" />
              <h3 className="font-bold text-xs text-gray-900">Genuine Catalog</h3>
              <p className="text-[11px] text-gray-500 mt-1">Direct brand warranties without imitation goods.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <Truck className="w-6 h-6 text-emerald-600 mb-2" />
              <h3 className="font-bold text-xs text-gray-900">Fast Nationwide Shipping</h3>
              <p className="text-[11px] text-gray-500 mt-1">24h in Dhaka, 48-72h outside through premier couriers.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <RotateCcw className="w-6 h-6 text-emerald-600 mb-2" />
              <h3 className="font-bold text-xs text-gray-900">Buyer Protection</h3>
              <p className="text-[11px] text-gray-500 mt-1">7-day easy return policy and responsive Dhaka support.</p>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT US */}
      {pageType === 'contact' && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xs space-y-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Contact Us</h1>
            <p className="text-xs text-gray-500 mt-1">
              Have questions about your order, bulk corporate purchases, or brand partnerships? Get in touch with our Dhaka team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Details */}
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-3">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-emerald-950">Customer Hotline</h4>
                    <p className="text-emerald-800 font-semibold">{settings.supportPhone}</p>
                    <p className="text-[10px] text-emerald-700">Saturday – Thursday: 9:00 AM – 10:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-emerald-950">Email Support</h4>
                    <p className="text-emerald-800">{settings.supportEmail}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-emerald-950">Corporate Headquarters</h4>
                    <p className="text-emerald-800">{settings.address}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-1">WhatsApp Quick Support</h4>
                <p className="text-gray-500 text-[11px] mb-2">Message us directly on WhatsApp for instantaneous assistance.</p>
                <a
                  href={`https://wa.me/8801700123456?text=Hi%20ZonixShop%2C%20I%20have%20an%20inquiry`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-[11px] hover:bg-emerald-700 transition-colors"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Direct Message Form */}
            <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
              {contactSubmitted ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold">Message Delivered</p>
                    <p className="text-[11px]">Thank you! Our support officer will reach back via phone or email shortly.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Riyad Ahmed"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">Message / Inquiry</label>
                    <textarea
                      rows={3}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="How can our support team assist you today?"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* FAQ */}
      {pageType === 'faq' && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xs space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h1>
            <p className="text-xs text-gray-500 mt-1">
              Everything you need to know about deliveries, payment options, and customer protection at ZonixShop.
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="py-4">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex justify-between items-center text-left text-xs font-bold text-gray-900 hover:text-emerald-700 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-emerald-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="text-xs text-gray-600 leading-relaxed mt-2 pt-1 pl-1">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SHIPPING POLICY */}
      {pageType === 'shipping' && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xs space-y-6 text-xs text-gray-600 leading-relaxed">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Shipping & Delivery Policy</h1>
          <p>
            At <strong>ZonixShop Bangladesh</strong>, we are committed to prompt, secure, and reliable parcel delivery across all 64 administrative districts in Bangladesh.
          </p>

          <h3 className="text-sm font-bold text-gray-900 pt-2">1. Delivery Zones & Timelines</h3>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Inside Dhaka City:</strong> Orders placed before 4:00 PM are dispatched same-day and delivered within 24 to 48 hours. Standard fee: ৳{settings.deliveryChargeInsideDhaka}.</li>
            <li><strong>Outside Dhaka (Nationwide):</strong> Deliveries to all other districts (Chittagong, Sylhet, Rajshahi, Khulna, etc.) take 48 to 72 hours. Standard fee: ৳{settings.deliveryChargeOutsideDhaka}.</li>
            <li><strong>Free Shipping Threshold:</strong> All cart totals exceeding ৳{settings.freeShippingThreshold.toLocaleString()} qualify for 100% free delivery nationwide.</li>
          </ul>

          <h3 className="text-sm font-bold text-gray-900 pt-2">2. Courier Partners</h3>
          <p>We work exclusively with certified logistics providers: Steadfast Courier, Pathao Parcel, and RedX Logistics. Each shipment is assigned an official tracking code viewable in our live Order Tracker.</p>

          <h3 className="text-sm font-bold text-gray-900 pt-2">3. Package Inspection</h3>
          <p>Customers are encouraged to check the outer parcel packaging before accepting and paying cash to the delivery rider.</p>
        </div>
      )}

      {/* RETURN & REFUND POLICY */}
      {pageType === 'return' && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xs space-y-6 text-xs text-gray-600 leading-relaxed">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Return & Refund Policy</h1>
          <p>We want you to shop with complete peace of mind. ZonixShop provides an official <strong>7-Day Easy Return & Replacement Guarantee</strong>.</p>

          <h3 className="text-sm font-bold text-gray-900 pt-2">1. Eligibility for Return</h3>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Item delivered is physically damaged, defective, or dead-on-arrival.</li>
            <li>Product differs from the specifications or variant selected on the website.</li>
            <li>Product is returned in its original box with all accompanying cables, manuals, and accessories intact.</li>
          </ul>

          <h3 className="text-sm font-bold text-gray-900 pt-2">2. Refund Timeline</h3>
          <p>Once our quality assurance team inspects the returned parcel at our Banani hub, refunds are processed within 3 business days directly to your bKash, Nagad, or original payment method.</p>
        </div>
      )}

      {/* PRIVACY POLICY */}
      {pageType === 'privacy' && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xs space-y-6 text-xs text-gray-600 leading-relaxed">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Privacy & Data Security Policy</h1>
          <p>Your privacy is of paramount importance to ZonixShop. We enforce strict data protection practices conforming to global security standards.</p>

          <h3 className="text-sm font-bold text-gray-900 pt-2">1. Information We Collect</h3>
          <p>We only collect information necessary to fulfill your purchases: name, delivery address, phone number, and email. We do not store sensitive payment credentials, bKash PINs, or bank passwords.</p>

          <h3 className="text-sm font-bold text-gray-900 pt-2">2. Role-Based Access Control</h3>
          <p>Customer orders and profile records are secured via strict Firestore Security Rules. No third party or unauthorized user can access your personal information.</p>
        </div>
      )}

      {/* TERMS & CONDITIONS */}
      {pageType === 'terms' && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-100 shadow-xs space-y-6 text-xs text-gray-600 leading-relaxed">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Terms & Conditions</h1>
          <p>By using the ZonixShop website and placing an order, you agree to comply with our service terms under the laws of Bangladesh.</p>

          <h3 className="text-sm font-bold text-gray-900 pt-2">1. Pricing & Stock</h3>
          <p>All prices are listed in Bangladeshi Taka (৳). While we strive for accuracy, inventory and prices are locked atomically upon order submission.</p>

          <h3 className="text-sm font-bold text-gray-900 pt-2">2. Order Confirmation</h3>
          <p>Cash on Delivery orders are verified prior to courier dispatch. ZonixShop reserves the right to cancel orders with unverified or fraudulent phone numbers.</p>
        </div>
      )}

      {/* 404 NOT FOUND */}
      {pageType === 'not-found' && (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs max-w-md mx-auto space-y-4">
          <span className="text-5xl font-black text-emerald-600 font-mono">404</span>
          <h2 className="text-lg font-bold text-gray-900">Page Not Found</h2>
          <p className="text-xs text-gray-500">
            The destination you requested does not exist or may have been moved.
          </p>
          <button
            onClick={onBackToShop}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            Return to Homepage
          </button>
        </div>
      )}
    </div>
  );
};
