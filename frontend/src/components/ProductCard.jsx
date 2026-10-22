import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart, showNotification } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const productId = product.id || product._id;

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !isWishlisted;
    setIsWishlisted(next);
    if (showNotification) {
      showNotification(next ? `Saved "${product.name}" to private wardrobe wishlist.` : `Removed from wishlist.`);
    }
  };

  return (
    <div className="group flex flex-col">
      {/* Product Image Frame (3:4 Portrait Ratio) */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F0EEE9] rounded-none">
        <Link to={`/product/${productId}`} className="block w-full h-full" aria-label={product.name}>
          <img
            src={product.image || (product.images && product.images[0])}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Minimal Badges on Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none z-10">
          {product.isFeatured && (
            <span className="bg-[#1C1917] text-[#FAF8F5] text-[9px] uppercase tracking-[0.2em] px-2 py-0.5 font-medium shadow-sm">
              New In
            </span>
          )}
          {product.fabric && (
            <span className="bg-white/95 backdrop-blur-sm text-stone-700 text-[9px] uppercase tracking-wider px-2 py-0.5 border border-stone-200/60 shadow-sm hidden sm:inline-block">
              {product.fabric.split(',')[0]}
            </span>
          )}
        </div>

        {/* Wishlist Heart on Top Right (H&M Studio Style) */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-stone-700 hover:text-stone-900 transition-all z-10 shadow-sm focus:outline-none"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            size={15}
            className={`transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-stone-700'}`}
          />
        </button>

        {/* Quick Add Action on Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex gap-2 z-10">
          <Link
            to={`/product/${productId}`}
            className="flex-1 bg-white/95 backdrop-blur-sm text-stone-900 text-[10px] uppercase tracking-[0.2em] py-2.5 font-semibold text-center hover:bg-stone-900 hover:text-white transition-colors shadow-md"
          >
            View Details
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, 1, product.defaultSize || 'M');
            }}
            className="bg-[#1C1917] text-white text-[10px] uppercase tracking-[0.18em] px-3.5 py-2.5 font-medium hover:bg-stone-800 transition-colors shadow-md flex items-center justify-center gap-1.5"
            title="Quick Add Size M to Bag"
          >
            <ShoppingBag size={13} />
            <span className="hidden sm:inline">Add (M)</span>
          </button>
        </div>
      </div>

      {/* Product Meta Details */}
      <div className="pt-3 pb-1 flex flex-col space-y-1">
        <div className="flex justify-between items-start gap-2">
          <Link to={`/product/${productId}`} className="block flex-1">
            <h3 className="font-sans text-[13px] font-medium text-stone-900 group-hover:text-stone-600 transition-colors line-clamp-1 tracking-wide">
              {product.name}
            </h3>
          </Link>
        </div>

        <p className="text-[11px] text-stone-500 tracking-wide">
          {product.color} · <span className="uppercase text-[10px] tracking-wider text-stone-400">{product.category}</span>
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[13px] font-semibold text-stone-900 tracking-tight">
            ${product.price.toLocaleString()} <span className="text-[10px] font-normal text-stone-500">USD</span>
          </span>

          {/* Sizes Available */}
          <div className="flex items-center gap-1 text-[10px] text-stone-500 font-medium">
            {(product.sizes || ['S', 'M', 'L', 'XL']).map((s) => (
              <Link
                key={s}
                to={`/product/${productId}?size=${s}`}
                className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center border border-stone-200 bg-white hover:border-stone-900 hover:bg-stone-900 hover:text-white transition-all text-[9px] sm:text-[10px] font-semibold cursor-pointer shadow-2xs"
                title={`View ${product.name} in size ${s}`}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
