/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import {
  X,
  ShoppingBag,
  Home,
  Grid,
  Sparkles,
  Award,
  Zap,
  Tag,
  Heart,
  PackageCheck,
  User,
  Package,
  LogIn,
  UserPlus,
  LogOut,
  Info,
  Phone,
  HelpCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  FileText,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { StoreSettings } from '../types';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, data?: any) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  settings: StoreSettings;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenAuth,
  settings
}) => {
  const { user, userProfile, isAdmin, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleNavClick = (view: string, data?: any) => {
    onNavigate(view, data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-xs sm:max-w-sm bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-left duration-300">
          {/* Drawer Header & Custom ZonixShop Logo */}
          <div className="p-4 bg-gradient-to-r from-gray-900 to-gray-950 text-white flex items-center justify-between border-b border-gray-800">
            <div
              onClick={() => handleNavClick('home')}
              className="flex items-center cursor-pointer"
            >
              <img
                src="/assets/aistudio/file_00000000903c82119a2402c1123cd3f9_094b811e.png"
                alt="ZonixShop - Fashion for Everyone"
                className="h-9 w-auto object-contain"
              />
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Welcome Banner if logged in */}
          {user && (
            <div className="px-4 py-3 bg-emerald-50/80 border-b border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">
                    {userProfile?.displayName || user.email?.split('@')[0]}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              {isAdmin && (
                <span className="px-2 py-0.5 text-[9px] font-bold bg-purple-100 text-purple-700 rounded-full">
                  Admin
                </span>
              )}
            </div>
          )}

          {/* Scrollable Navigation Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs text-gray-700 divide-y divide-gray-100">
            {/* MAIN NAVIGATION */}
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Main Navigation
              </div>

              <button
                onClick={() => handleNavClick('home')}
                className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-medium text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Home className="w-4 h-4 text-emerald-600" />
                  <span>Home</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </button>

              <button
                onClick={() => handleNavClick('all-products')}
                className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-medium text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-emerald-600" />
                  <span>All Products</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </button>

              <button
                onClick={() => handleNavClick('categories-view')}
                className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-medium text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Grid className="w-4 h-4 text-emerald-600" />
                  <span>Categories</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </button>

              <button
                onClick={() => handleNavClick('new-arrivals')}
                className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-medium text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>New Arrivals</span>
                </span>
                <span className="text-[9px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.5 rounded">New</span>
              </button>

              <button
                onClick={() => handleNavClick('featured')}
                className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-medium text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Featured Products</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </button>

              <button
                onClick={() => handleNavClick('best-sellers')}
                className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-medium text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-red-500" />
                  <span>Best Sellers</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </button>

              <button
                onClick={() => handleNavClick('offers')}
                className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-medium text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Tag className="w-4 h-4 text-pink-500" />
                  <span>Offers & Discounts</span>
                </span>
                <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">Sale</span>
              </button>
            </div>

            {/* SHOPPING */}
            <div className="pt-4 space-y-1">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Shopping & Tracking
              </div>

              <button
                onClick={() => handleNavClick('wishlist')}
                className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-pink-50 hover:text-pink-700 transition-colors font-medium text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-pink-500" />
                  <span>My Wishlist</span>
                </span>
                {wishlistCount > 0 ? (
                  <span className="bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                )}
              </button>

              <button
                onClick={() => {
                  onClose();
                  setIsCartOpen(true);
                }}
                className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-medium text-left"
              >
                <span className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  <span>Shopping Cart</span>
                </span>
                {itemCount > 0 ? (
                  <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                )}
              </button>

              <button
                onClick={() => handleNavClick('track-order')}
                className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-medium text-left"
              >
                <span className="flex items-center gap-2.5">
                  <PackageCheck className="w-4 h-4 text-emerald-600" />
                  <span>Track My Order</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </button>
            </div>

            {/* CUSTOMER ACCOUNT */}
            <div className="pt-4 space-y-1">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Customer Account
              </div>

              {user ? (
                <>
                  <button
                    onClick={() => handleNavClick('account')}
                    className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-gray-100 transition-colors font-medium text-left"
                  >
                    <span className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-gray-600" />
                      <span>My Profile & Address</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                  </button>

                  <button
                    onClick={() => handleNavClick('account')}
                    className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-gray-100 transition-colors font-medium text-left"
                  >
                    <span className="flex items-center gap-2.5">
                      <Package className="w-4 h-4 text-gray-600" />
                      <span>My Orders</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium text-left"
                  >
                    <span className="flex items-center gap-2.5">
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sign Out</span>
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAuth('login');
                    }}
                    className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-emerald-50 text-emerald-800 transition-colors font-semibold text-left"
                  >
                    <span className="flex items-center gap-2.5">
                      <LogIn className="w-4 h-4 text-emerald-600" />
                      <span>Login to Account</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenAuth('register');
                    }}
                    className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-gray-100 transition-colors font-medium text-left"
                  >
                    <span className="flex items-center gap-2.5">
                      <UserPlus className="w-4 h-4 text-gray-500" />
                      <span>Sign Up (Register)</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                  </button>
                </>
              )}
            </div>

            {/* INFORMATION & POLICIES */}
            <div className="pt-4 space-y-1">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                Information & Support
              </div>

              <button
                onClick={() => handleNavClick('about')}
                className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-gray-100 transition-colors font-medium text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Info className="w-4 h-4 text-gray-500" />
                  <span>About Us</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </button>

              <button
                onClick={() => handleNavClick('contact')}
                className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-gray-100 transition-colors font-medium text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>Contact Us</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </button>

              <button
                onClick={() => handleNavClick('faq')}
                className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-gray-100 transition-colors font-medium text-left"
              >
                <span className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-gray-500" />
                  <span>FAQ & Help</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </button>

              <button
                onClick={() => handleNavClick('shipping')}
                className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-gray-100 transition-colors font-medium text-left"
              >
                <span className="flex items-center gap-2.5">
                  <Truck className="w-4 h-4 text-gray-500" />
                  <span>Shipping Policy</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </button>

              <button
                onClick={() => handleNavClick('return')}
                className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-gray-100 transition-colors font-medium text-left"
              >
                <span className="flex items-center gap-2.5">
                  <RotateCcw className="w-4 h-4 text-gray-500" />
                  <span>Return & Refund Policy</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </button>

              <button
                onClick={() => handleNavClick('privacy')}
                className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-gray-100 transition-colors font-medium text-left"
              >
                <span className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-gray-500" />
                  <span>Privacy Policy</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </button>

              <button
                onClick={() => handleNavClick('terms')}
                className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-gray-100 transition-colors font-medium text-left"
              >
                <span className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span>Terms & Conditions</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              </button>
            </div>

            {/* ADMIN DASHBOARD (Strictly verified) */}
            {isAdmin && (
              <div className="pt-4 space-y-1">
                <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wider mb-2">
                  Administration
                </div>

                <button
                  onClick={() => handleNavClick('admin')}
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold transition-colors text-left border border-purple-200"
                >
                  <span className="flex items-center gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-purple-600" />
                    <span>Admin Operations Portal</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-purple-500" />
                </button>
              </div>
            )}
          </div>

          {/* Drawer Footer Hotline */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-500 space-y-1">
            <p className="font-semibold text-gray-800">Support Hotline: {settings.supportPhone}</p>
            <p>Cash on Delivery across all 64 districts in Bangladesh</p>
          </div>
        </div>
      </div>
    </div>
  );
};
