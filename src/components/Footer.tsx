/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShoppingBag, Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';
import { StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings;
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  return (
    <footer className="bg-gray-950 text-gray-400 text-xs border-t border-gray-800">
      {/* Value Badges Banner */}
      <div className="border-b border-gray-800/80 py-8 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/30">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">Nationwide Delivery</h4>
              <p className="text-[11px] text-gray-400">All 64 districts in Bangladesh</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">100% Authentic</h4>
              <p className="text-[11px] text-gray-400">Directly sourced brand items</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/30">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">7 Days Easy Return</h4>
              <p className="text-[11px] text-gray-400">Hassle-free replacement policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">Cash on Delivery</h4>
              <p className="text-[11px] text-gray-400">Check before you pay</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <img
              src="/assets/aistudio/file_00000000903c82119a2402c1123cd3f9_094b811e.png"
              alt="ZonixShop - Fashion for Everyone"
              className="h-10 w-auto object-contain"
            />
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Leading Bangladeshi e-commerce destination for authentic electronics, lifestyle, fashion, and home products with lightning-fast delivery and verified customer satisfaction.
          </p>
          <div className="space-y-1 pt-2">
            <div className="flex items-center gap-2 text-[11px] text-gray-300">
              <Phone className="w-3.5 h-3.5 text-emerald-500" />
              <span>{settings.supportPhone}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-300">
              <Mail className="w-3.5 h-3.5 text-emerald-500" />
              <span>{settings.supportEmail}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-500" />
              <span>{settings.address}</span>
            </div>
          </div>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Customer Care</h4>
          <ul className="space-y-2 text-[11px]">
            <li>
              <button onClick={() => onNavigate('track-order')} className="hover:text-emerald-400 transition-colors">
                Track Your Shipment
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('account')} className="hover:text-emerald-400 transition-colors">
                Helpdesk & Support Tickets
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('account')} className="hover:text-emerald-400 transition-colors">
                Return & Refund Policy
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('account')} className="hover:text-emerald-400 transition-colors">
                Shipping & Delivery Timelines
              </button>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Popular Collections</h4>
          <ul className="space-y-2 text-[11px]">
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition-colors">
                Smart Watches & Audio
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition-colors">
                Traditional Dhakai Jamdani Sarees
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition-colors">
                Festive Cotton Panjabi
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition-colors">
                Mechanical Keyboards & Gadgets
              </button>
            </li>
          </ul>
        </div>

        {/* Payment & Security */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Accepted Payments</h4>
          <p className="text-[11px] text-gray-400 mb-3">
            Fast, secure and verified payments through Bangladesh's most popular channels:
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-pink-900/60 text-pink-300 font-bold px-2 py-1 rounded text-[10px] border border-pink-700/40">
              bKash
            </span>
            <span className="bg-orange-900/60 text-orange-300 font-bold px-2 py-1 rounded text-[10px] border border-orange-700/40">
              Nagad
            </span>
            <span className="bg-purple-900/60 text-purple-300 font-bold px-2 py-1 rounded text-[10px] border border-purple-700/40">
              Rocket
            </span>
            <span className="bg-emerald-950 text-emerald-300 font-bold px-2 py-1 rounded text-[10px] border border-emerald-700/40">
              Cash on Delivery
            </span>
          </div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-1.5">Courier Partners</h4>
          <p className="text-[10px] text-gray-500">Steadfast Courier • Pathao Parcel • RedX Logistics</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-900 py-4 text-center text-[11px] text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 ZonixShop Bangladesh. All rights reserved.</p>
          <p>Built with enterprise security, atomic inventory, and verified Bangladesh logistics.</p>
        </div>
      </div>
    </footer>
  );
};
