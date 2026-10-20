/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  Filter,
  Grid,
  Sparkles,
  Zap,
  Award,
  Tag,
  Search,
  ChevronRight
} from 'lucide-react';
import { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';

interface CatalogPageProps {
  title: string;
  subtitle?: string;
  mode:
    | 'all'
    | 'category'
    | 'new-arrivals'
    | 'featured'
    | 'best-sellers'
    | 'offers'
    | 'categories-view'
    | 'search';
  products: Product[];
  categories: Category[];
  selectedCategoryId: string | null;
  searchQuery: string;
  onSelectCategory: (catId: string | null) => void;
  onSelectProduct: (product: Product) => void;
  onBackToHome: () => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  title,
  subtitle,
  mode,
  products,
  categories,
  selectedCategoryId,
  searchQuery,
  onSelectCategory,
  onSelectProduct,
  onBackToHome
}) => {
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [filterCat, setFilterCat] = useState<string | null>(selectedCategoryId);

  // If in categories-view mode, display the category directory grid
  if (mode === 'categories-view') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-emerald-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="mb-8 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Grid className="w-4 h-4" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">All Product Categories</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Browse through our verified departments to explore authentic products in Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => {
            const count = products.filter((p) => p.categoryId === c.id).length;
            return (
              <div
                key={c.id}
                onClick={() => onSelectCategory(c.id)}
                className="group bg-white rounded-3xl p-6 border border-gray-100 shadow-xs hover:shadow-xl hover:border-emerald-200 cursor-pointer transition-all flex items-center gap-5"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 shrink-0 group-hover:scale-105 transition-transform">
                  <img
                    src={c.image || 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&q=80'}
                    alt={c.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-sm text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {c.name}
                  </h3>
                  {c.description && (
                    <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{c.description}</p>
                  )}
                  <span className="text-[11px] font-semibold text-emerald-600 mt-2 inline-flex items-center gap-1">
                    <span>{count} {count === 1 ? 'Product' : 'Products'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Filter based on mode
  let filtered = [...products];

  if (mode === 'new-arrivals') {
    filtered.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  } else if (mode === 'featured') {
    filtered = filtered.filter((p) => p.featured || (p.rating && p.rating >= 4.8));
  } else if (mode === 'best-sellers') {
    filtered.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
  } else if (mode === 'offers') {
    filtered = filtered.filter((p) => p.originalPrice > p.price);
  }

  // Filter by category if selected
  if (filterCat) {
    filtered = filtered.filter((p) => p.categoryId === filterCat);
  }

  // Filter by search query if any
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }

  // Sort
  if (sortBy === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') filtered.sort((a, b) => b.price - a.price);
  if (sortBy === 'rating') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      <button
        onClick={onBackToHome}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-emerald-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{title}</h1>
          <p className="text-xs text-gray-500 mt-1">
            {subtitle || `Showing ${filtered.length} verified products available for nationwide delivery.`}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Filter dropdown */}
          <select
            value={filterCat || ''}
            onChange={(e) => setFilterCat(e.target.value || null)}
            className="px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium text-gray-700"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium text-gray-700"
          >
            <option value="default">Sort by: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs max-w-md mx-auto">
          <p className="font-bold text-gray-800 text-sm">No products found</p>
          <p className="text-xs text-gray-500 mt-1">Try resetting the category filter or searching with different terms.</p>
          <button
            onClick={() => setFilterCat(null)}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((prod) => (
            <ProductCard key={prod.id} product={prod} onSelect={onSelectProduct} />
          ))}
        </div>
      )}
    </div>
  );
};
