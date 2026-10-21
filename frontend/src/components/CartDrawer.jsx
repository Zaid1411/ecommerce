import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const {
    cartItems,
    isDrawerOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotalPrice,
    shippingPrice,
    totalPrice,
  } = useCart();

  const navigate = useNavigate();

  if (!isDrawerOpen) return null;

  const handleCheckoutClick = () => {
    closeCart();
    navigate('/checkout');
  };

  const freeShippingThreshold = 300;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotalPrice);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] text-stone-900 shadow-2xl flex flex-col border-l border-stone-200">
          
          {/* Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-normal tracking-wide text-stone-900">
                Your Shopping Bag
              </h2>
              <p className="text-[11px] uppercase tracking-widest text-stone-500 mt-0.5">
                {cartItems.length} {cartItems.length === 1 ? 'Garment' : 'Garments'}
              </p>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-stone-400 hover:text-stone-700 transition-colors"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Complimentary Shipping Progress Banner */}
          <div className="bg-[#F4EFEA] px-6 py-3 border-b border-stone-200 text-xs text-stone-700">
            {amountToFreeShipping > 0 ? (
              <p className="flex items-center gap-1.5">
                <Truck size={14} className="text-stone-800" />
                Add <span className="font-semibold text-stone-900">${amountToFreeShipping.toLocaleString()}</span> more for complimentary express delivery.
              </p>
            ) : (
              <p className="flex items-center gap-1.5 text-stone-900 font-medium">
                <Truck size={14} className="text-stone-800" />
                Complimentary express shipping unlocked!
              </p>
            )}
            <div className="w-full bg-stone-200 h-1 mt-2 rounded-full overflow-hidden">
              <div
                className="bg-stone-900 h-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (subtotalPrice / freeShippingThreshold) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <p className="font-serif text-lg text-stone-600 mb-2">Your shopping bag is empty</p>
                <p className="text-xs text-stone-500 mb-6 max-w-xs mx-auto">
                  Explore our seasonal drop of luxury shirts, pleated wool trousers, and cashmere outerwear.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/shop');
                  }}
                  className="inline-block bg-stone-900 text-stone-50 text-xs uppercase tracking-widest px-6 py-3 font-medium hover:bg-stone-800 transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.cartKey}
                  className="flex gap-4 pb-6 border-b border-stone-200 last:border-b-0"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover object-top rounded-none bg-stone-100 flex-shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-serif text-sm font-medium text-stone-900 leading-snug">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.cartKey)}
                          className="text-stone-400 hover:text-red-700 transition-colors p-0.5 ml-2"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-600 font-medium tracking-wide mt-1">
                        Size: <span className="font-bold text-stone-900">{item.selectedSize}</span> · Color: {item.selectedColor}
                      </p>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-300 bg-white">
                        <button
                          onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                          className="px-2 py-1 text-stone-600 hover:bg-stone-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 text-xs font-semibold text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                          className="px-2 py-1 text-stone-600 hover:bg-stone-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <p className="text-sm font-semibold text-stone-900">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Calculations */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-white space-y-4">
              <div className="space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-900">${subtotalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Delivery</span>
                  <span className="font-medium text-stone-900">
                    {shippingPrice === 0 ? 'Complimentary' : `$${shippingPrice.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-stone-100 pt-2 text-sm font-semibold text-stone-900">
                  <span>Estimated Total</span>
                  <span>${totalPrice.toLocaleString()} USD</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-stone-900 text-stone-50 py-3.5 text-xs tracking-[0.2em] uppercase font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight size={14} />
                </button>
                <button
                  onClick={closeCart}
                  className="w-full text-center text-xs tracking-wider uppercase text-stone-600 hover:text-stone-900 py-1"
                >
                  Continue Browsing
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-stone-500 pt-2">
                <ShieldCheck size={14} className="text-stone-800" />
                <span>30-Day Complimentary Returns & Exchanges</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
