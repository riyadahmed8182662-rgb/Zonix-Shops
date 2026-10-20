/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  Phone,
  Truck,
  ShieldCheck,
  Menu,
  Heart,
  ChevronDown,
  PackageCheck,
  ShieldAlert,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { StoreSettings, Category } from '../types';
import { MobileDrawer } from './MobileDrawer';

interface NavbarProps {
  settings: StoreSettings;
  categories: Category[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  currentView: string;
  onNavigate: (view: string, data?: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  categories,
  searchQuery,
  onSearchChange,
  onOpenAuth,
  currentView,
  onNavigate
}) => {
  const { user, userProfile, isAdmin, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-gray-100">
        {/* Top Notification Announcement Bar */}
        <div className="bg-emerald-950 text-emerald-100 text-xs py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <span className="bg-emerald-700 text-white px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase">
                Notice
              </span>
              <span className="truncate max-w-md">{settings.bannerNotice}</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-300" />
                Inside Dhaka: ৳{settings.deliveryChargeInsideDhaka} | Outside: ৳{settings.deliveryChargeOutsideDhaka}
              </span>
              <a
                href={`tel:${settings.supportPhone}`}
                className="hover:text-white flex items-center gap-1 font-medium hidden sm:flex"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-300" />
                {settings.supportPhone}
              </a>
            </div>
          </div>
        </div>

        {/* Main Header Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            {/* Hamburger Menu Trigger (Mobile) */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2 -ml-1 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors md:hidden focus:outline-none"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Custom ZonixShop Logo */}
            <div
              onClick={() => onNavigate('home')}
              className="flex items-center cursor-pointer select-none group py-0.5 shrink-0"
            >
              <img
                src="/assets/aistudio/file_00000000903c82119a2402c1123cd3f9_094b811e.png"
                alt="ZonixShop - Fashion for Everyone"
                className="h-9 sm:h-12 w-auto object-contain group-hover:scale-102 transition-transform drop-shadow-xs"
              />
            </div>

            {/* Search Input Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products in Bangladesh (Gadgets, Saree, Panjabi, Electronics)..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-gray-900"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-2 text-xs text-gray-400 hover:text-gray-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Track Order quick link (Desktop) */}
              <button
                onClick={() => onNavigate('track-order')}
                className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  currentView === 'track-order'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <PackageCheck className="w-4 h-4 text-emerald-600" />
                <span>Track Order</span>
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => onNavigate('wishlist')}
                className="relative p-2 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors"
                title="View Wishlist"
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white font-extrabold text-[10px] w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-xs">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                title="View Cart"
              >
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white font-extrabold text-[10px] w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-xs">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Account / Auth Dropdown */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border border-gray-200 hover:border-emerald-500 bg-gray-50 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center shrink-0">
                      {userProfile?.displayName
                        ? userProfile.displayName.charAt(0).toUpperCase()
                        : user.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline text-xs font-semibold text-gray-700 max-w-[100px] truncate">
                      {userProfile?.displayName || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-900 truncate">
                          {userProfile?.displayName || 'Customer'}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-bold bg-purple-100 text-purple-700 rounded">
                            Verified Admin
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => onNavigate('account')}
                        className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        My Orders & Profile
                      </button>

                      <button
                        onClick={() => onNavigate('track-order')}
                        className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <PackageCheck className="w-4 h-4 text-gray-400" />
                        Track My Shipment
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => onNavigate('admin')}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-purple-700 hover:bg-purple-50 flex items-center gap-2 border-t border-gray-100"
                        >
                          <ShieldAlert className="w-4 h-4 text-purple-600" />
                          Admin Operations Portal
                        </button>
                      )}

                      <div className="border-t border-gray-100 mt-1">
                        <button
                          onClick={() => logout()}
                          className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => onOpenAuth('login')}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Search Input */}
          <div className="mt-2.5 md:hidden">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products in Bangladesh..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 text-gray-900"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* Categories Bar (Desktop) */}
        <div className="hidden md:block bg-gray-50/90 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-6 overflow-x-auto py-2 text-xs font-medium scrollbar-none">
              <button
                onClick={() => onNavigate('home')}
                className={`hover:text-emerald-600 transition-colors whitespace-nowrap ${
                  currentView === 'home' ? 'text-emerald-700 font-bold' : 'text-gray-600'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('all-products')}
                className="text-gray-600 hover:text-emerald-600 transition-colors whitespace-nowrap"
              >
                All Products
              </button>
              <button
                onClick={() => onNavigate('new-arrivals')}
                className="text-gray-600 hover:text-emerald-600 transition-colors whitespace-nowrap"
              >
                New Arrivals
              </button>
              <button
                onClick={() => onNavigate('featured')}
                className="text-gray-600 hover:text-emerald-600 transition-colors whitespace-nowrap"
              >
                Featured
              </button>
              <button
                onClick={() => onNavigate('best-sellers')}
                className="text-gray-600 hover:text-emerald-600 transition-colors whitespace-nowrap"
              >
                Best Sellers
              </button>
              <button
                onClick={() => onNavigate('offers')}
                className="text-pink-600 font-bold hover:text-pink-700 transition-colors whitespace-nowrap flex items-center gap-1"
              >
                <span>Offers & Discounts</span>
              </button>

              <div className="ml-auto flex items-center gap-3 text-emerald-800 text-[11px] font-semibold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  100% Authentic
                </span>
                <span>•</span>
                <span>Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Complete Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        onNavigate={onNavigate}
        onOpenAuth={onOpenAuth}
        settings={settings}
      />
    </>
  );
};
