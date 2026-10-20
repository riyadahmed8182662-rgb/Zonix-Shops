/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Award,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  PackageCheck,
  Clock,
  Tag,
  Copy,
  Check,
  Percent,
  Star,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { Product, Category, Banner, StoreSettings, Coupon } from '../types';
import { ProductCard } from '../components/ProductCard';
import { INITIAL_BANNERS } from '../services/storeService';

interface HomePageProps {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  coupons: Coupon[];
  settings: StoreSettings;
  searchQuery: string;
  selectedCategory: string | null;
  onSelectCategory: (catId: string | null) => void;
  onSelectProduct: (product: Product) => void;
  onNavigate: (view: string, data?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  categories,
  banners,
  coupons,
  settings,
  searchQuery,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onNavigate
}) => {
  // Ensure 5 to 6 banners are active for smooth auto-rotation
  const displayBanners = (banners && banners.length >= 5) ? banners : INITIAL_BANNERS;
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [isBannerHovered, setIsBannerHovered] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  // Auto slide banners every 4.5 seconds (changes automatically)
  useEffect(() => {
    if (isBannerHovered || displayBanners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBannerIndex((prev) => (prev + 1) % displayBanners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isBannerHovered, displayBanners.length]);

  const handlePrevBanner = () => {
    setActiveBannerIndex((prev) => (prev - 1 + displayBanners.length) % displayBanners.length);
  };

  const handleNextBanner = () => {
    setActiveBannerIndex((prev) => (prev + 1) % displayBanners.length);
  };

  const handleBannerAction = (banner: Banner) => {
    if (banner.link && banner.link.startsWith('/category/')) {
      const catId = banner.link.replace('/category/', '');
      onNavigate('category', catId);
    } else if (banner.link === '/products' || banner.link === '/all-products') {
      onNavigate('all-products');
    } else {
      onNavigate('all-products');
    }
  };

  // Flash Sale Timer simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 47, seconds: 22 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  // Filter products by category & search
  const filteredProducts = products.filter((p) => {
    if (selectedCategory && p.categoryId !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Featured Products
  const featuredProducts = products.filter((p) => p.featured || (p.rating && p.rating >= 4.8));

  // New Arrivals: sorted by createdAt descending
  const newArrivals = [...products].sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA;
  });

  // Best Sellers: sorted by reviewsCount descending
  const bestSellers = [...products].sort((a, b) => {
    return (b.reviewsCount || 0) - (a.reviewsCount || 0);
  });

  // Highlight promo item for Featured Promotional Banner
  const promoProduct = products.find((p) => p.id === 'zx-pro-watch-ultra') || products[0];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 animate-in fade-in">
      {/* 3. AUTOMATIC HERO BANNER SLIDER (5 to 6 Auto-changing Banners) */}
      <section
        className="relative overflow-hidden bg-gray-950 text-white select-none group/slider"
        onMouseEnter={() => setIsBannerHovered(true)}
        onMouseLeave={() => setIsBannerHovered(false)}
        onTouchStart={() => setIsBannerHovered(true)}
        onTouchEnd={() => setIsBannerHovered(false)}
      >
        {/* Carousel slides container */}
        <div className="relative min-h-[420px] sm:min-h-[460px] md:min-h-[500px] lg:h-[520px] w-full overflow-hidden">
          {displayBanners.map((banner, index) => {
            const isActive = index === activeBannerIndex;
            return (
              <div
                key={banner.id || index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Background Image with subtle zoom on active */}
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className={`w-full h-full object-cover object-center transition-transform duration-7000 ease-out ${
                    isActive ? 'scale-105' : 'scale-100'
                  }`}
                />

                {/* Dark Gradient Overlays for High-Contrast Readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/85 sm:via-gray-950/75 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-transparent to-black/30" />

                {/* Decorative glow */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

                {/* Slide Content */}
                <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center relative z-20">
                  <div className="max-w-2xl space-y-4 sm:space-y-6 py-12">
                    {/* Badge & Tag */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider shadow-xs backdrop-blur-md">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{banner.tag || 'EXCLUSIVE DEAL'}</span>
                      </span>

                      {banner.badge && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
                          <Zap className="w-3 h-3 text-amber-400" />
                          <span>{banner.badge}</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white drop-shadow-md">
                      {banner.title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xs sm:text-sm md:text-base text-gray-200 leading-relaxed max-w-xl drop-shadow-sm font-medium">
                      {banner.subtitle}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={() => handleBannerAction(banner)}
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all transform hover:scale-103 cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>{banner.buttonText || 'Shop Now'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onNavigate('track-order')}
                        className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 flex items-center gap-2 transition-colors backdrop-blur-md cursor-pointer"
                      >
                        <PackageCheck className="w-4 h-4 text-emerald-400" />
                        <span>Track Order</span>
                      </button>
                    </div>

                    {/* Trust Specs */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] sm:text-xs text-gray-300 pt-2 font-medium">
                      <span className="flex items-center gap-1 text-white">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        100% Cash on Delivery
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-white">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Dhaka ৳{settings.deliveryChargeInsideDhaka} | All 64 Districts ৳{settings.deliveryChargeOutsideDhaka}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-300">
                        <Check className="w-3.5 h-3.5 text-amber-400" />
                        Authentic Guarantee
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prev & Next Navigation Buttons */}
        <button
          onClick={handlePrevBanner}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-emerald-600 text-white border border-white/10 backdrop-blur-md transition-all shadow-lg hover:scale-108 focus:outline-none cursor-pointer"
          aria-label="Previous Banner"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <button
          onClick={handleNextBanner}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-emerald-600 text-white border border-white/10 backdrop-blur-md transition-all shadow-lg hover:scale-108 focus:outline-none cursor-pointer"
          aria-label="Next Banner"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Bottom Pagination Dots & Live Status */}
        <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-30 flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-none">
          {/* Dots Indicator */}
          <div className="flex items-center gap-2 pointer-events-auto bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            {displayBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveBannerIndex(idx)}
                aria-label={`Go to banner ${idx + 1}`}
                className={`transition-all duration-300 rounded-full h-2.5 cursor-pointer ${
                  idx === activeBannerIndex
                    ? 'w-7 sm:w-8 bg-emerald-400'
                    : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Banner Counter & Auto-change status badge */}
          <div className="hidden sm:flex items-center gap-2 pointer-events-auto bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-semibold text-gray-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {activeBannerIndex + 1} / {displayBanners.length}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-[11px] text-gray-400">
              {isBannerHovered ? 'Paused' : 'Auto'}
            </span>
          </div>
        </div>
      </section>

      {/* 4. STORE BENEFITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-gray-900">24–48h Delivery</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Dhaka & all 64 districts</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-gray-900">Cash on Delivery</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Pay after parcel verification</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-gray-900">100% Genuine</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Official Brand Warranties</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-gray-900">7 Days Easy Return</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Hassle-free replacement</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED PROMOTIONAL BANNER & FLASH SALE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 rounded-3xl p-6 sm:p-10 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl shadow-red-600/15 relative overflow-hidden">
          <div className="space-y-3 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-yellow-300" />
              <span>Flash Deals Today</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black">Festival Super Savings are Live!</h2>
            <p className="text-xs sm:text-sm text-red-100 max-w-lg">
              Get up to 50% discount on AMOLED Smartwatches, Studio SoundPods, Embroidered Panjabis & Jamdani Sarees.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('offers')}
                className="px-5 py-2.5 bg-white hover:bg-gray-100 text-red-700 font-extrabold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
              >
                <span>View All Offers</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2.5 z-10">
            <div className="bg-black/30 backdrop-blur-xs px-4 py-3 rounded-2xl text-center min-w-[60px] border border-white/10">
              <span className="text-2xl font-black font-mono">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="block text-[10px] uppercase font-bold text-red-200">Hours</span>
            </div>
            <span className="text-2xl font-black">:</span>
            <div className="bg-black/30 backdrop-blur-xs px-4 py-3 rounded-2xl text-center min-w-[60px] border border-white/10">
              <span className="text-2xl font-black font-mono">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="block text-[10px] uppercase font-bold text-red-200">Mins</span>
            </div>
            <span className="text-2xl font-black">:</span>
            <div className="bg-black/30 backdrop-blur-xs px-4 py-3 rounded-2xl text-center min-w-[60px] border border-white/10">
              <span className="text-2xl font-black font-mono">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="block text-[10px] uppercase font-bold text-red-200">Secs</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SHOP BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Shop by Category</h2>
            <p className="text-xs text-gray-500 mt-0.5">Browse curated departments across Bangladesh</p>
          </div>
          <button
            onClick={() => onNavigate('categories-view')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id === selectedCategory ? null : cat.id)}
              className={`group p-4 rounded-3xl border text-center cursor-pointer transition-all duration-300 ${
                selectedCategory === cat.id
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-gray-100 bg-white hover:border-emerald-200 hover:shadow-xl'
              }`}
            >
              <div className="w-18 h-18 mx-auto rounded-2xl overflow-hidden bg-gray-50 mb-3 group-hover:scale-105 transition-transform duration-300">
                <img
                  src={
                    cat.image ||
                    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&q=80'
                  }
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-extrabold text-xs text-gray-900 group-hover:text-emerald-700 transition-colors">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FEATURED PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Handpicked Selections</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-0.5">Featured Products</h2>
          </div>
          <button
            onClick={() => onNavigate('featured')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.slice(0, 4).map((prod) => (
            <ProductCard key={prod.id} product={prod} onSelect={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* 8. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Just Added to Catalog</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-0.5">New Arrivals</h2>
          </div>
          <button
            onClick={() => onNavigate('new-arrivals')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.slice(0, 4).map((prod) => (
            <ProductCard key={prod.id} product={prod} onSelect={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* 9. BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-0.5">Best Sellers</h2>
          </div>
          <button
            onClick={() => onNavigate('best-sellers')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.slice(0, 4).map((prod) => (
            <ProductCard key={prod.id} product={prod} onSelect={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* 10. SPECIAL OFFERS & COUPONS */}
      {coupons.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs uppercase font-extrabold text-emerald-300 tracking-wider">
                  Verified Promotions
                </span>
                <h2 className="text-2xl font-black text-white mt-0.5">Active Discount Coupons</h2>
              </div>
              <p className="text-xs text-emerald-100 max-w-sm">
                Apply these codes during checkout to enjoy instant reductions on your order subtotal.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((coupon) => {
                const isCopied = copiedCoupon === coupon.code;
                return (
                  <div
                    key={coupon.code}
                    className="p-4 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/15 flex justify-between items-center gap-4 hover:bg-white/15 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-base text-amber-300">
                          {coupon.code}
                        </span>
                        <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
                          {coupon.discountType === 'percentage'
                            ? `${coupon.discountValue}% OFF`
                            : `৳${coupon.discountValue} OFF`}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-300 mt-1">
                        Min. order: ৳{coupon.minOrderValue.toLocaleString()}
                        {coupon.maxDiscount ? ` (Cap ৳${coupon.maxDiscount})` : ''}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopyCoupon(coupon.code)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                        isCopied
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white text-gray-900 hover:bg-emerald-400'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 11. TRUST AND BANGLADESH COVERAGE STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-extrabold text-gray-900">Need Assistance with an Order?</h3>
            <p className="text-xs text-gray-500">
              Our Dhaka support center is available 6 days a week to help with sizing, specifications, or courier tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`tel:${settings.supportPhone}`}
              className="px-5 py-2.5 bg-gray-900 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <span>Call {settings.supportPhone}</span>
            </a>

            <button
              onClick={() => onNavigate('contact')}
              className="px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
