import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotalPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = useCart();

  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#FAF8F5] min-h-[70vh] flex items-center justify-center py-20">
        <div className="max-w-md mx-auto text-center px-4">
          <h1 className="font-serif text-3xl font-normal text-stone-900 mb-3">Your Shopping Bag is Empty</h1>
          <p className="text-xs text-stone-500 mb-8 leading-relaxed">
            Discover our luxury heavyweight Oxford shirts, pleated wool trousers, and cashmere overcoats.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-stone-900 text-white px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-stone-800 transition-colors shadow-md"
          >
            Explore Ready-to-Wear
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-baseline mb-8 border-b border-stone-200 pb-4">
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
            Your Shopping Bag
          </h1>
          <button
            onClick={clearCart}
            className="text-xs uppercase tracking-wider text-stone-500 hover:text-red-700 transition-colors"
          >
            Empty Bag
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Cart Items Table */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-stone-200 divide-y divide-stone-200">
              {cartItems.map((item) => {
                const itemLink = item.product ? `/product/${item.product}` : '/shop';
                return (
                  <div key={item.cartKey} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                    <Link to={itemLink} className="flex-shrink-0 group" title={`View ${item.name}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-28 object-cover object-top bg-stone-100 group-hover:opacity-85 transition-opacity"
                      />
                    </Link>
                    <div className="flex-1 space-y-1">
                      <Link to={itemLink} className="block group" title={`View ${item.name}`}>
                        <h3 className="font-serif text-lg text-stone-900 font-normal group-hover:text-stone-600 transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-stone-700 font-medium">
                        Size: <span className="font-bold text-stone-900">{item.selectedSize}</span> · Color: {item.selectedColor}
                      </p>
                      <p className="text-xs text-stone-400">Unit Price: ${item.price.toLocaleString()} USD</p>
                    </div>

                  {/* Quantity */}
                  <div className="flex items-center border border-stone-300">
                    <button
                      onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                      className="p-2 text-stone-600 hover:bg-stone-100"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="px-3 text-xs font-semibold text-stone-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                      className="p-2 text-stone-600 hover:bg-stone-100"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Total item price & delete */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <span className="text-base font-semibold text-stone-900">
                      ${(item.price * item.quantity).toLocaleString()} USD
                    </span>
                    <button
                      onClick={() => removeFromCart(item.cartKey)}
                      className="text-stone-400 hover:text-red-700"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
            </div>

            <div className="bg-[#F4EFEA] p-4 border border-stone-200 flex items-center gap-3 text-xs text-stone-700">
              <Truck size={18} className="text-stone-800 flex-shrink-0" />
              <span>
                All orders are dispatched in bespoke recycled cardboard garment boxes with signature tissue wrapping and express tracking.
              </span>
            </div>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-stone-200 p-6 space-y-6 sticky top-28">
              <h2 className="font-serif text-xl font-normal text-stone-900 border-b border-stone-200 pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">${subtotalPrice.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Courier</span>
                  <span className="font-semibold text-stone-900">
                    {shippingPrice === 0 ? 'Complimentary' : `$${shippingPrice.toLocaleString()} USD`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Sales Tax (8%)</span>
                  <span className="font-semibold text-stone-900">${taxPrice.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-3 text-sm font-semibold text-stone-900">
                  <span>Total Amount</span>
                  <span>${totalPrice.toLocaleString()} USD</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-stone-900 text-white py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                Proceed to Checkout <ArrowRight size={14} />
              </button>

              <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-stone-500">
                <ShieldCheck size={14} className="text-stone-800" />
                <span>30-Day Complimentary Exchanges & Returns</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
