/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { CustomerAccountPage } from './pages/CustomerAccountPage';
import { WishlistPage } from './pages/WishlistPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { InfoPages } from './pages/InfoPages';
import { AuthModal } from './pages/AuthModal';
import { Product, Category, Banner, StoreSettings, Coupon, Order } from './types';
import {
  fetchProducts,
  fetchCategories,
  fetchBanners,
  fetchActiveCoupons,
  fetchStoreSettings,
  seedInitialDatabaseIfEmpty,
  DEFAULT_STORE_SETTINGS
} from './services/storeService';

function MainApp() {
  const [currentView, setCurrentView] = useState<string>('home');

  // Application Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);

  // View & Filter States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [trackOrderNumber, setTrackOrderNumber] = useState<string | undefined>(undefined);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const initData = async () => {
    setLoading(true);
    try {
      // Seed if fresh database
      await seedInitialDatabaseIfEmpty();

      const [prods, cats, bns, cps, stngs] = await Promise.all([
        fetchProducts(false),
        fetchCategories(),
        fetchBanners(),
        fetchActiveCoupons(),
        fetchStoreSettings()
      ]);

      setProducts(prods || []);
      setCategories(cats || []);
      setBanners(bns || []);
      setCoupons(cps || []);
      if (stngs) setSettings(stngs);
    } catch (err) {
      console.error('Initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  const handleNavigate = (view: string, data?: any) => {
    if (view === 'category') {
      setSelectedCategory(data);
      setCurrentView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'product') {
      setSelectedProduct(data);
      setCurrentView('product-detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (view === 'track-order') {
      setTrackOrderNumber(data);
      setCurrentView('track-order');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navbar */}
      <Navbar
        settings={settings}
        categories={categories}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (currentView !== 'home' && currentView !== 'all-products') {
            setCurrentView('all-products');
          }
        }}
        onOpenAuth={handleOpenAuth}
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* Cart Drawer */}
      <CartDrawer
        settings={settings}
        onProceedToCheckout={() => setCurrentView('checkout')}
        onStartShopping={() => setCurrentView('home')}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {loading ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-gray-500">Connecting to ZonixShop Bangladesh...</p>
          </div>
        ) : (
          <>
            {/* 1. HOME VIEW */}
            {currentView === 'home' && (
              <HomePage
                products={products}
                categories={categories}
                banners={banners}
                coupons={coupons}
                settings={settings}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                onSelectCategory={(catId) => setSelectedCategory(catId)}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  setCurrentView('product-detail');
                }}
                onNavigate={handleNavigate}
              />
            )}

            {/* 2. ALL PRODUCTS */}
            {currentView === 'all-products' && (
              <CatalogPage
                title="All Products Catalog"
                subtitle="Explore our complete verified selection across electronics, fashion, and home lifestyle."
                mode="all"
                products={products}
                categories={categories}
                selectedCategoryId={selectedCategory}
                searchQuery={searchQuery}
                onSelectCategory={(catId) => setSelectedCategory(catId)}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  setCurrentView('product-detail');
                }}
                onBackToHome={() => setCurrentView('home')}
              />
            )}

            {/* 3. CATEGORIES DIRECTORY */}
            {currentView === 'categories-view' && (
              <CatalogPage
                title="Product Categories"
                mode="categories-view"
                products={products}
                categories={categories}
                selectedCategoryId={selectedCategory}
                searchQuery={searchQuery}
                onSelectCategory={(catId) => {
                  setSelectedCategory(catId);
                  setCurrentView('all-products');
                }}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  setCurrentView('product-detail');
                }}
                onBackToHome={() => setCurrentView('home')}
              />
            )}

            {/* 4. NEW ARRIVALS */}
            {currentView === 'new-arrivals' && (
              <CatalogPage
                title="New Arrivals"
                subtitle="Freshly listed products, seasonal festive wear, and new tech launches."
                mode="new-arrivals"
                products={products}
                categories={categories}
                selectedCategoryId={selectedCategory}
                searchQuery={searchQuery}
                onSelectCategory={(catId) => setSelectedCategory(catId)}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  setCurrentView('product-detail');
                }}
                onBackToHome={() => setCurrentView('home')}
              />
            )}

            {/* 5. FEATURED PRODUCTS */}
            {currentView === 'featured' && (
              <CatalogPage
                title="Featured Selections"
                subtitle="Handpicked top quality items recommended by our Dhaka curators."
                mode="featured"
                products={products}
                categories={categories}
                selectedCategoryId={selectedCategory}
                searchQuery={searchQuery}
                onSelectCategory={(catId) => setSelectedCategory(catId)}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  setCurrentView('product-detail');
                }}
                onBackToHome={() => setCurrentView('home')}
              />
            )}

            {/* 6. BEST SELLERS */}
            {currentView === 'best-sellers' && (
              <CatalogPage
                title="Best Sellers"
                subtitle="Most popular and top-rated items with verified customer reviews."
                mode="best-sellers"
                products={products}
                categories={categories}
                selectedCategoryId={selectedCategory}
                searchQuery={searchQuery}
                onSelectCategory={(catId) => setSelectedCategory(catId)}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  setCurrentView('product-detail');
                }}
                onBackToHome={() => setCurrentView('home')}
              />
            )}

            {/* 7. OFFERS & DISCOUNTS */}
            {currentView === 'offers' && (
              <CatalogPage
                title="Offers & Discounts"
                subtitle="Special price drops, seasonal discounts, and combo savings."
                mode="offers"
                products={products}
                categories={categories}
                selectedCategoryId={selectedCategory}
                searchQuery={searchQuery}
                onSelectCategory={(catId) => setSelectedCategory(catId)}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  setCurrentView('product-detail');
                }}
                onBackToHome={() => setCurrentView('home')}
              />
            )}

            {/* 8. WISHLIST */}
            {currentView === 'wishlist' && (
              <WishlistPage
                onBackToShop={() => setCurrentView('home')}
                onSelectProduct={(p) => {
                  setSelectedProduct(p);
                  setCurrentView('product-detail');
                }}
              />
            )}

            {/* 9. PRODUCT DETAILS */}
            {currentView === 'product-detail' && selectedProduct && (
              <ProductDetailPage
                product={selectedProduct}
                settings={settings}
                onBack={() => setCurrentView('home')}
                onProceedToCheckout={() => setCurrentView('checkout')}
              />
            )}

            {/* 10. CHECKOUT */}
            {currentView === 'checkout' && (
              <CheckoutPage
                settings={settings}
                onBack={() => setCurrentView('home')}
                onOrderPlaced={(order) => {
                  setLastPlacedOrder(order);
                  setCurrentView('order-success');
                }}
                onOpenAuth={() => handleOpenAuth('login')}
              />
            )}

            {/* 11. ORDER SUCCESS */}
            {currentView === 'order-success' && lastPlacedOrder && (
              <OrderSuccessPage
                order={lastPlacedOrder}
                onTrackOrder={(orderNumber) => {
                  setTrackOrderNumber(orderNumber);
                  setCurrentView('track-order');
                }}
                onContinueShopping={() => setCurrentView('home')}
              />
            )}

            {/* 12. TRACK ORDER */}
            {currentView === 'track-order' && (
              <OrderTrackingPage
                initialOrderNumber={trackOrderNumber}
                onNavigateHome={() => setCurrentView('home')}
              />
            )}

            {/* 13. CUSTOMER ACCOUNT & ORDERS */}
            {currentView === 'account' && (
              <CustomerAccountPage
                onTrackOrder={(orderNumber) => {
                  setTrackOrderNumber(orderNumber);
                  setCurrentView('track-order');
                }}
                onOpenAuth={() => handleOpenAuth('login')}
              />
            )}

            {/* 14. ADMIN DASHBOARD */}
            {currentView === 'admin' && (
              <AdminDashboard onBackToShop={() => setCurrentView('home')} />
            )}

            {/* 15. INFORMATIONAL & POLICY PAGES */}
            {[
              'about',
              'contact',
              'faq',
              'shipping',
              'return',
              'privacy',
              'terms',
              'not-found'
            ].includes(currentView) && (
              <InfoPages
                pageType={currentView as any}
                settings={settings}
                onBackToShop={() => setCurrentView('home')}
                onNavigate={handleNavigate}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer settings={settings} onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <MainApp />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
