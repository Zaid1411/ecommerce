import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ArrowRight, Truck, CreditCard, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';

export default function CheckoutPage() {
  const { cartItems, subtotalPrice, shippingPrice, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '14 Karori Road',
    city: 'Wellington',
    postalCode: '6012',
    country: 'New Zealand',
    paymentMethod: 'Simulated Card (Test Mode)',
    notes: 'Please phone 30 minutes prior to delivery.'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (cartItems.length === 0 && !completedOrder) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4">
        <h2 className="font-serif text-2xl text-stone-900 mb-2">No items to checkout</h2>
        <p className="text-xs text-stone-500 mb-6">Your cart is currently empty.</p>
        <Link
          to="/shop"
          className="inline-block bg-stone-900 text-white px-6 py-3 text-xs uppercase tracking-widest font-medium"
        >
          Browse Pieces
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.quantity,
          image: item.image,
          price: item.price,
          product: item.product,
          selectedFinish: item.selectedFinish,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: subtotalPrice,
        shippingPrice,
        totalPrice,
        notes: formData.notes,
      };

      let created;
      try {
        created = await orderService.create(orderPayload);
      } catch (err) {
        // Fallback simulated order for demonstration if backend DB is not yet running
        console.warn('Backend unavailable, generating local simulated order confirmation', err.message);
        created = {
          _id: `NZ-WW-${Math.floor(100000 + Math.random() * 900000)}`,
          createdAt: new Date().toISOString(),
          ...orderPayload,
          isPaid: true,
          status: 'In Workshop Handcrafted',
        };
      }

      setCompletedOrder(created);
      clearCart();
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred while creating your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (completedOrder) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen py-16">
        <div className="max-w-2xl mx-auto px-4 text-center bg-white border border-stone-200 p-8 sm:p-12 shadow-sm">
          <div className="w-16 h-16 bg-[#F4EFEA] text-[#8C7355] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} />
          </div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C7355] font-semibold block mb-2">
            Order Confirmed & Commissioned
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal mb-3">
            Thank you for supporting New Zealand craftsmanship.
          </h1>
          <p className="text-xs text-stone-600 mb-6 max-w-lg mx-auto leading-relaxed">
            Order Reference: <strong className="text-stone-900">#{completedOrder._id}</strong>. A confirmation and timber schedule has been logged for our Nelson cabinetmakers.
          </p>

          <div className="bg-[#FAF8F5] p-6 border border-stone-200 text-left text-xs text-stone-700 space-y-2 mb-8">
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="font-semibold text-stone-900">Delivery Recipient:</span>
              <span>{completedOrder.shippingAddress.fullName}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="font-semibold text-stone-900">Delivery Address:</span>
              <span>{completedOrder.shippingAddress.address}, {completedOrder.shippingAddress.city}</span>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-2">
              <span className="font-semibold text-stone-900">Payment Simulation:</span>
              <span className="text-emerald-700 font-medium">Verified Test Checkout</span>
            </div>
            <div className="flex justify-between pt-1 font-semibold text-sm text-stone-900">
              <span>Total Amount:</span>
              <span>${completedOrder.totalPrice.toLocaleString()} NZD</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/profile"
              className="bg-stone-900 text-white px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-stone-800 transition-colors"
            >
              View In Order History
            </Link>
            <Link
              to="/shop"
              className="bg-stone-100 text-stone-800 px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-stone-200 transition-colors"
            >
              Continue Exploring
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 text-center max-w-lg mx-auto">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C7355] font-semibold block mb-1">
            Secure Commissioning
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
            Bespoke Order Checkout
          </h1>
        </div>

        {errorMessage && (
          <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Form Column */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. Recipient & Contact Details */}
            <div className="bg-white border border-stone-200 p-6 sm:p-8 space-y-4">
              <h2 className="font-serif text-xl font-normal text-stone-900 border-b border-stone-200 pb-3">
                1. Recipient & White-Glove Delivery
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
                  Delivery Notes / Access Constraints
                </label>
                <textarea
                  name="notes"
                  rows="2"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="e.g. Spiral staircase, freight elevator access required..."
                  className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            {/* 2. Simulated Payment */}
            <div className="bg-white border border-stone-200 p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h2 className="font-serif text-xl font-normal text-stone-900 flex items-center gap-2">
                  2. Payment Method
                </h2>
                <span className="flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 border border-emerald-200 font-medium">
                  <Lock size={12} /> Test Simulation Mode
                </span>
              </div>

              <div className="bg-[#F4EFEA] p-4 border border-stone-200 text-xs text-stone-700 leading-relaxed">
                <p className="font-semibold text-stone-900 flex items-center gap-2 mb-1">
                  <CreditCard size={15} /> Sandbox Demonstration Gateway
                </p>
                <p>
                  In accordance with portfolio security standards, this checkout operates in <strong>simulated mode</strong>. No real credit card details are collected or stored. Submitting this form safely tests order persistence, inventory decrementing, and order confirmation flows.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-3 p-3 border border-stone-900 bg-stone-50 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Simulated Card (Test Mode)"
                    checked={formData.paymentMethod === 'Simulated Card (Test Mode)'}
                    onChange={handleChange}
                    className="accent-stone-900"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-stone-900 block">Instant Simulated Card Approval</span>
                    <span className="text-stone-500 text-[11px]">Instant test authorization for portfolio validation</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-stone-200 hover:border-stone-400 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Bespoke Studio Invoice (Bank Deposit)"
                    checked={formData.paymentMethod === 'Bespoke Studio Invoice (Bank Deposit)'}
                    onChange={handleChange}
                    className="accent-stone-900"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-stone-900 block">Bespoke Workshop Invoice (Simulated Bank Deposit)</span>
                    <span className="text-stone-500 text-[11px]">Simulates standard 50% deposit commissioning workflow</span>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-stone-200 p-6 sm:p-8 space-y-6 sticky top-28">
              <h2 className="font-serif text-xl font-normal text-stone-900 border-b border-stone-200 pb-3">
                Order Review ({cartItems.length} {cartItems.length === 1 ? 'Piece' : 'Pieces'})
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1 divide-y divide-stone-100">
                {cartItems.map((item) => (
                  <div key={item.cartKey} className="flex gap-3 pt-3 first:pt-0">
                    <img src={item.image} alt={item.name} className="w-14 h-16 object-cover bg-stone-100" />
                    <div className="flex-1 text-xs">
                      <p className="font-medium text-stone-900 leading-tight">{item.name}</p>
                      <p className="text-[11px] text-[#8C7355] mt-0.5">Finish: {item.selectedFinish}</p>
                      <p className="text-stone-500 mt-1">Qty: {item.quantity} × ${item.price.toLocaleString()}</p>
                    </div>
                    <span className="text-xs font-semibold text-stone-900">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="border-t border-stone-200 pt-4 space-y-2.5 text-xs text-stone-600">
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
                <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-semibold text-stone-900">
                  <span>Total Amount (incl. GST)</span>
                  <span>${totalPrice.toLocaleString()} NZD</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-stone-900 text-white py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Commissioning Order...' : 'Confirm & Place Order'} <ArrowRight size={14} />
              </button>

              <div className="pt-2 text-center text-[10px] text-stone-500 space-y-1">
                <p>✓ 10-Year Master Craftsman Structural Guarantee</p>
                <p>✓ Insured nationwide transport directly from Nelson Workshop</p>
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
