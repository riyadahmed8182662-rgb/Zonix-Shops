/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, ShoppingCart, Check, Zap, Heart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const discountPercent =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const imageSrc =
    product.images?.[0] ||
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80';

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Badges on top left */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start pointer-events-none">
        {discountPercent > 0 && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
            <Zap className="w-3 h-3" /> -{discountPercent}%
          </span>
        )}
        {product.featured && (
          <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wide">
            Featured
          </span>
        )}
      </div>

      {/* Wishlist Heart & Stock badge on top right */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        <button
          onClick={handleWishlistToggle}
          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shadow-xs ${
            isFavorited
              ? 'bg-red-50 text-red-500 hover:bg-red-100'
              : 'bg-white/90 text-gray-400 hover:text-red-500 hover:bg-white'
          }`}
          title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {product.stock <= 0 ? (
          <span className="bg-gray-800/80 backdrop-blur-xs text-white text-[9px] font-medium px-2 py-0.5 rounded-full">
            Out of Stock
          </span>
        ) : product.stock < 10 ? (
          <span className="bg-orange-500/90 backdrop-blur-xs text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">
            {product.stock} Left
          </span>
        ) : (
          <span className="bg-emerald-600/90 backdrop-blur-xs text-white text-[9px] font-medium px-2 py-0.5 rounded-full">
            In Stock
          </span>
        )}
      </div>

      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50 flex items-center justify-center">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
            {product.categoryName}
          </span>
          <h3 className="mt-1 text-xs font-bold text-gray-900 group-hover:text-emerald-600 line-clamp-2 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mt-1.5 flex items-center gap-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3 h-3 fill-current" />
              <span className="ml-1 text-[11px] font-bold text-gray-700">{product.rating || 4.8}</span>
            </div>
            <span className="text-gray-400 text-[10px]">({product.reviewsCount || 24})</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-sm font-extrabold text-gray-900">
              ৳{product.price.toLocaleString()}
            </div>
            {product.originalPrice > product.price && (
              <div className="text-[10px] text-gray-400 line-through">
                ৳{product.originalPrice.toLocaleString()}
              </div>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={product.stock <= 0}
            className={`p-2 rounded-xl transition-all flex items-center justify-center ${
              product.stock <= 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : added
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white'
            }`}
            title={product.stock <= 0 ? 'Out of stock' : 'Add to Cart'}
          >
            {added ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
