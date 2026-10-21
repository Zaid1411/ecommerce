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
    totalPrice,
  } = useCart();

  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#FAF8F5] min-h-[70vh] flex items-center justify-center py-20">
        <div className="max-w-md mx-auto text-center px-4">
          <h1 className="font-serif text-3xl font-normal text-stone-900 mb-3">Your Bespoke Selection is Empty</h1>
          <p className="text-xs text-stone-500 mb-8 leading-relaxed">
            Every Woodwright piece is made to order with sustainably harvested timbers and bespoke craftsmanship.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-stone-900 text-white px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-stone-800 transition-colors shadow-md"
          >
            Explore Handcrafted Collection
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
            Your Bespoke Selection
          </h1>
          <button
            onClick={clearCart}
            className="text-xs uppercase tracking-wider text-stone-500 hover:text-red-700 transition-colors"
          >
            Clear Selection
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Cart Items Table */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-stone-200 divide-y divide-stone-200">
              {cartItems.map((item) => (
                <div key={item.cartKey} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-28 object-cover bg-stone-100 flex-shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <h3 className="font-serif text-lg text-stone-900 font-normal">{item.name}</h3>
                    <p className="text-xs text-[#8C7355] font-medium">Selected Finish: {item.selectedFinish}</p>
                    <p className="text-xs text-stone-400">Unit Price: ${item.price.toLocaleString()} NZD</p>
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
                      ${(item.price * item.quantity).toLocaleString()} NZD
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
              ))}
            </div>

            <div className="bg-[#F4EFEA] p-4 border border-stone-200 flex items-center gap-3 text-xs text-stone-700">
              <Truck size={18} className="text-[#8C7355] flex-shrink-0" />
              <span>
                All orders are secured with dedicated, insured furniture transport and white-glove placement in your residence.
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
                  <span className="font-semibold text-stone-900">${subtotalPrice.toLocaleString()} NZD</span>
                </div>
                <div className="flex justify-between">
                  <span>White-Glove Delivery</span>
                  <span className="font-semibold text-stone-900">
                    {shippingPrice === 0 ? 'Complimentary' : `$${shippingPrice.toLocaleString()} NZD`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-stone-200 pt-3 text-sm font-semibold text-stone-900">
                  <span>Estimated Total (incl. GST)</span>
                  <span>${totalPrice.toLocaleString()} NZD</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-stone-900 text-white py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                Proceed to Checkout <ArrowRight size={14} />
              </button>

              <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-stone-500">
                <ShieldCheck size={14} className="text-[#8C7355]" />
                <span>10-Year Master Craftsman Structural Warranty</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
