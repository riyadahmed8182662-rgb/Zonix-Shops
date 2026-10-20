/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

interface WishlistPageProps {
  onBackToShop: () => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onBackToShop, onSelectProduct }) => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addedIds, setAddedIds] = React.useState<string[]>([]);

  const handleMoveToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Back button */}
      <button
        onClick={onBackToShop}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-emerald-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Continue Shopping</span>
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">My Wishlist</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            You have {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved in your wishlist.
          </p>
        </div>

        {wishlist.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-xs text-red-600 hover:text-red-700 font-semibold px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors"
          >
            Clear Wishlist
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-pink-50 text-pink-400 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Your Wishlist is Empty</h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6">
            Explore our collections and tap the heart icon on any product to save it here for later.
          </p>
          <button
            onClick={onBackToShop}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Discover Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => {
            const isAdded = addedIds.includes(product.id);
            const isOutOfStock = product.stock <= 0;

            return (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWishlist(product.id);
                  }}
                  className="absolute top-3 right-3 z-10 w-7 h-7 bg-white/90 hover:bg-red-50 rounded-full flex items-center justify-center text-gray-400 hover:text-red-600 shadow-xs transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Image */}
                <div className="relative aspect-square w-full overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img
                    src={
                      product.images?.[0] ||
                      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider">
                      {product.categoryName}
                    </span>
                    <h3 className="mt-1 text-xs font-bold text-gray-900 group-hover:text-emerald-600 line-clamp-2 transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-extrabold text-gray-900">
                        ৳{product.price.toLocaleString()}
                      </div>
                      {product.originalPrice > product.price && (
                        <div className="text-[11px] text-gray-400 line-through">
                          ৳{product.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleMoveToCart(product, e)}
                      disabled={isOutOfStock}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isOutOfStock
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Move to Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
