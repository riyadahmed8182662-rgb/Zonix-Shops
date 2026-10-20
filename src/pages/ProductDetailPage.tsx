/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  ShoppingCart,
  Zap,
  Tag,
  Share2
} from 'lucide-react';
import { Product, StoreSettings } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailPageProps {
  product: Product;
  settings: StoreSettings;
  onBack: () => void;
  onProceedToCheckout: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  settings,
  onBack,
  onProceedToCheckout
}) => {
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>(
    product.attributes?.sizes?.[0] || product.attributes?.colors?.[0] || ''
  );
  const [addedNotice, setAddedNotice] = useState(false);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'];

  const discountPercent =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity, selectedVariant);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) return;
    addToCart(product, quantity, selectedVariant);
    onProceedToCheckout();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-emerald-600 mb-6 group transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Catalog</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xs">
        {/* Gallery Column */}
        <div className="space-y-4">
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 relative group flex items-center justify-center">
            <img
              src={images[selectedImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 bg-red-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> -{discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-gray-50 shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-emerald-600 shadow-xs scale-102'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Column */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-lg">
                {product.categoryName}
              </span>
              <span className="text-gray-400 font-mono text-[11px]">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Ratings & Brand */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1 font-bold text-gray-800">{product.rating || 4.8}</span>
                <span className="ml-1 text-gray-400">({product.reviewsCount || 24} customer ratings)</span>
              </div>
              {product.attributes?.brand && (
                <span className="text-gray-500 font-medium">Brand: <strong className="text-gray-800">{product.attributes.brand}</strong></span>
              )}
            </div>

            {/* Price section */}
            <div className="pt-2 pb-4 border-y border-gray-100 flex items-baseline gap-3">
              <div className="text-3xl font-extrabold text-gray-900">
                ৳{product.price.toLocaleString()}
              </div>
              {product.originalPrice > product.price && (
                <>
                  <div className="text-base text-gray-400 line-through">
                    ৳{product.originalPrice.toLocaleString()}
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Save ৳{(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 font-medium">Availability:</span>
              {product.stock <= 0 ? (
                <span className="text-red-600 font-bold">Currently Out of Stock</span>
              ) : product.stock < 10 ? (
                <span className="text-orange-600 font-bold">
                  Low Stock — Only {product.stock} units remaining!
                </span>
              ) : (
                <span className="text-emerald-700 font-bold">
                  In Stock ({product.stock} verified units in warehouse)
                </span>
              )}
            </div>

            {/* Variant options if available */}
            {product.attributes?.sizes && product.attributes.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">Select Size:</label>
                <div className="flex flex-wrap gap-2">
                  {product.attributes.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedVariant(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedVariant === s
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.attributes?.colors && product.attributes.colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">Select Color:</label>
                <div className="flex flex-wrap gap-2">
                  {product.attributes.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedVariant(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedVariant === c
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-bold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 text-gray-600 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="p-2 hover:bg-gray-100 text-gray-600 disabled:opacity-40 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="py-3 px-6 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-sm rounded-xl flex items-center justify-center gap-2 border border-emerald-200 transition-colors disabled:opacity-50"
              >
                {addedNotice ? <Check className="w-5 h-5 text-emerald-600" /> : <ShoppingCart className="w-5 h-5" />}
                <span>{addedNotice ? 'Added to Cart!' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Zap className="w-5 h-5" />
                <span>Buy Now (Cash on Delivery)</span>
              </button>
            </div>
          </div>

          {/* Delivery & Warranty Guarantees */}
          <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600">
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-gray-900">Fast Delivery</p>
                <p className="text-[11px] text-gray-500">Dhaka: ৳{settings.deliveryChargeInsideDhaka} (24h) | Outside: ৳{settings.deliveryChargeOutsideDhaka}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-gray-900">7-Day Easy Return</p>
                <p className="text-[11px] text-gray-500">Full replacement if damaged</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-gray-900">Warranty</p>
                <p className="text-[11px] text-gray-500">{product.attributes?.warranty || '100% Genuine Guaranteed'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Specifications Section */}
      <div className="mt-8 bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xs">
        <h3 className="text-lg font-extrabold text-gray-900 mb-4 pb-2 border-b border-gray-100">
          Product Description & Overview
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {product.description}
        </p>

        {product.attributes && (
          <div className="mt-6">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
              Specifications & Attributes
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(product.attributes).map(([key, value]) => {
                if (!value || (Array.isArray(value) && value.length === 0)) return null;
                return (
                  <div key={key} className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                    <span className="text-gray-400 capitalize block text-[10px]">{key}</span>
                    <span className="font-bold text-gray-800">
                      {Array.isArray(value) ? value.join(', ') : String(value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
