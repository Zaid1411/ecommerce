import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const productId = product.id || product._id;

  return (
    <div className="group flex flex-col justify-between bg-white border border-stone-200/70 hover:border-stone-400 transition-all duration-300">
      <div>
        {/* Product Image & Badges */}
        <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
          <Link to={`/product/${productId}`}>
            <img
              src={product.image || (product.images && product.images[0])}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
            {product.isFeatured && (
              <span className="bg-[#1C1917]/90 text-[#FAF8F5] text-[9px] uppercase tracking-widest px-2.5 py-1 font-medium">
                Featured
              </span>
            )}
            {product.leadTime && (
              <span className="bg-white/90 backdrop-blur-sm text-stone-800 text-[9px] uppercase tracking-wider px-2 py-0.5 border border-stone-200">
                {product.leadTime}
              </span>
            )}
          </div>

          {/* Quick Hover Action Bar */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <Link
              to={`/product/${productId}`}
              className="bg-white/95 text-stone-900 text-xs px-3 py-2 uppercase tracking-wider font-medium hover:bg-stone-900 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Eye size={13} /> View Piece
            </Link>
            <button
              onClick={() => addToCart(product, 1)}
              className="bg-stone-900 text-white text-xs px-3 py-2 uppercase tracking-wider font-medium hover:bg-stone-800 transition-colors flex items-center gap-1.5"
            >
              <ShoppingBag size={13} /> Quick Add
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 sm:p-5">
          <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-stone-500 mb-1.5">
            <span>{product.category}</span>
            {product.rating && (
              <div className="flex items-center gap-1 text-stone-700">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-stone-400">({product.numReviews})</span>
              </div>
            )}
          </div>

          <Link to={`/product/${productId}`} className="block">
            <h3 className="font-serif text-base sm:text-lg font-normal text-stone-900 group-hover:text-stone-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {product.timberFinish && (
            <p className="text-xs text-[#8C7355] mt-1 font-medium truncate">
              {product.timberFinish}
            </p>
          )}
        </div>
      </div>

      {/* Price & Footnote */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 flex items-baseline justify-between border-t border-stone-100">
        <span className="text-sm sm:text-base font-semibold text-stone-900">
          ${product.price.toLocaleString()} <span className="text-[10px] font-normal text-stone-500">NZD</span>
        </span>
        <span className="text-[10px] text-stone-400 tracking-wider uppercase">
          {product.countInStock > 0 ? 'Made to Order' : 'Sold Out'}
        </span>
      </div>
    </div>
  );
}
