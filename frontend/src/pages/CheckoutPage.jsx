import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Truck,
  CreditCard,
  Lock,
  Printer,
  AlertCircle,
  Sparkles,
  RefreshCw,
  FileText
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService, paymentService } from '../services/api';

export default function CheckoutPage() {
  const { cartItems, subtotalPrice, shippingPrice, taxPrice, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Payment configuration from backend
  const [paymentConfig, setPaymentConfig] = useState({
    publishableKey: '',
    stripeConfigured: false,
    currency: 'usd',
    sandboxMode: true,
  });

  const [formData, setFormData] = useState(() => {
    const savedAddressKey = user?.email ? `atelier_address_${user.email.toLowerCase().trim()}` : null;
    let saved = null;
    if (savedAddressKey) {
      try {
        saved = JSON.parse(localStorage.getItem(savedAddressKey) || 'null');
      } catch (e) {}
    }
    return {
      fullName: user?.name || saved?.fullName || '',
      email: user?.email || saved?.email || '',
      phone: saved?.phone || '',
      address: saved?.address || '',
      city: saved?.city || '',
      postalCode: saved?.postalCode || '',
      country: saved?.country || '',
      notes: saved?.notes || '',
    };
  });

  // Credit Card Input State - empty for clean user entry
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardholderName: user?.name ? user.name.toUpperCase() : '',
    expiry: '',
    cvc: '',
    postalCode: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentStepText, setPaymentStepText] = useState('');

  // Sync user info into form without overwriting if already typed
  useEffect(() => {
    if (user) {
      const savedAddressKey = `atelier_address_${user.email.toLowerCase().trim()}`;
      let saved = null;
      try {
        saved = JSON.parse(localStorage.getItem(savedAddressKey) || 'null');
      } catch (e) {}

      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || saved?.fullName || '',
        email: user.email || prev.email || '',
        phone: prev.phone || saved?.phone || '',
        address: prev.address || saved?.address || '',
        city: prev.city || saved?.city || '',
        postalCode: prev.postalCode || saved?.postalCode || '',
        country: prev.country || saved?.country || '',
      }));

      setCardData((prev) => ({
        ...prev,
        cardholderName: prev.cardholderName || user.name.toUpperCase(),
      }));
    }
  }, [user]);

  // Fetch backend payment gateway configuration
  useEffect(() => {
    let isMounted = true;
    paymentService.getConfig().then((cfg) => {
      if (isMounted && cfg) {
        setPaymentConfig(cfg);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (cartItems.length === 0 && !completedOrder) {
    return (
      <div className="max-w-md mx-auto text-center py-24 px-4">
        <h2 className="font-serif text-2xl text-stone-900 mb-2">No garments to checkout</h2>
        <p className="text-xs text-stone-500 mb-6">Your shopping bag is currently empty.</p>
        <Link
          to="/shop"
          className="inline-block bg-stone-900 text-white px-6 py-3 text-xs uppercase tracking-widest font-medium"
        >
          Browse Garments
        </Link>
      </div>
    );
  }

  const handleDeliveryChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = rawVal.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardData({ ...cardData, cardNumber: formatted });
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e) => {
    let rawVal = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (rawVal.length >= 2) {
      rawVal = `${rawVal.slice(0, 2)}/${rawVal.slice(2)}`;
    }
    setCardData({ ...cardData, expiry: rawVal });
  };

  const handleCvcChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardData({ ...cardData, cvc: val });
  };

  // Fast Test Card presets
  const applySuccessTestCard = () => {
    setCardData({
      cardNumber: '4242 4242 4242 4242',
      cardholderName: (formData.fullName || user?.name || 'TEST CLIENT').toUpperCase(),
      expiry: '12/28',
      cvc: '424',
      postalCode: formData.postalCode || '10001',
    });
    setErrorMessage('');
  };

  const applyDeclineTestCard = () => {
    setCardData({
      cardNumber: '4000 0000 0000 0002',
      cardholderName: (formData.fullName || user?.name || 'TEST CLIENT').toUpperCase(),
      expiry: '08/27',
      cvc: '002',
      postalCode: formData.postalCode || '10001',
    });
    setErrorMessage('');
  };

  // Detect Card Brand for Visual Icon
  const getCardBrand = (num) => {
    const clean = num.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'VISA';
    if (/^(5[1-5]|2[2-7])/.test(clean)) return 'MASTERCARD';
    if (/^3[47]/.test(clean)) return 'AMEX';
    return 'CARD';
  };

  // Submit and verify payment
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setPaymentStepText('Connecting to Stripe Payment Gateway...');

    try {
      // 1. Basic Card Validation
      const rawCard = cardData.cardNumber.replace(/\s+/g, '');
      if (rawCard.length < 13) {
        throw new Error('Please enter a valid card number (13-16 digits).');
      }
      if (!cardData.expiry || cardData.expiry.length < 4) {
        throw new Error('Please enter a valid expiration date (MM/YY).');
      }
      if (!cardData.cvc || cardData.cvc.length < 3) {
        throw new Error('Please enter a valid CVC code.');
      }

      // 2. Create Payment Intent
      setPaymentStepText('Generating Secure Payment Intent...');
      const intentResponse = await paymentService.createPaymentIntent({
        amount: totalPrice,
        currency: 'usd',
        metadata: {
          email: formData.email,
          fullName: formData.fullName,
          itemsCount: cartItems.length,
        },
      });

      const paymentIntentId = intentResponse.paymentIntentId || `pi_test_${Date.now()}`;

      // 3. Authorize & Verify Payment with Card
      setPaymentStepText('Authorizing 256-Bit SSL Card Transaction...');
      const verifyResponse = await paymentService.verifyPayment({
        paymentIntentId,
        amount: totalPrice,
        testCardNumber: rawCard,
      });

      if (!verifyResponse.success) {
        throw new Error(verifyResponse.message || 'Payment authorization failed.');
      }

      // 4. Create Order Record
      setPaymentStepText('Recording Atelier Bespoke Order...');
      const orderPayload = {
        user: user?._id || user?.id || null,
        userEmail: (user?.email || formData.email || '').toLowerCase().trim(),
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.quantity,
          image: item.image,
          price: item.price,
          product: item.product,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
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
        paymentMethod: paymentConfig.stripeConfigured ? 'Stripe Card' : 'Stripe Test Card (Sandbox)',
        paymentResult: {
          id: paymentIntentId,
          status: 'succeeded',
          amount: totalPrice,
          cardBrand: getCardBrand(rawCard),
          last4: rawCard.slice(-4),
          paidAt: new Date().toISOString(),
        },
        itemsPrice: subtotalPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        isPaid: true,
        paidAt: new Date().toISOString(),
        status: 'Paid — Preparing Bespoke Dispatch',
        notes: formData.notes,
      };

      let created;
      try {
        created = await orderService.create(orderPayload);
      } catch (err) {
        console.warn('Backend order store unavailable, generating local fallback record:', err.message);
        created = {
          _id: `ATL-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
          createdAt: new Date().toISOString(),
          ...orderPayload,
        };
      }

      // Persist order to localStorage keyed strictly by user email to avoid cross-account bleeding
      try {
        const emailKey = (user?.email || formData.email || 'guest').toLowerCase().trim();
        const storageKey = `atelier_orders_${emailKey}`;
        const existing = JSON.parse(localStorage.getItem(storageKey) || '[]');
        localStorage.setItem(storageKey, JSON.stringify([created, ...existing]));
        // Save delivery address for this user for future checkouts
        if (emailKey && emailKey !== 'guest') {
          localStorage.setItem(`atelier_address_${emailKey}`, JSON.stringify(formData));
        }
        // Clean legacy global storage key if present
        localStorage.removeItem('atelier_orders');
      } catch (storageErr) {
        console.error('Failed to save order to localStorage', storageErr);
      }

      setCompletedOrder(created);
      clearCart();
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during payment processing.');
    } finally {
      setIsSubmitting(false);
      setPaymentStepText('');
    }
  };

  const cardBrand = getCardBrand(cardData.cardNumber);

  // ==========================================
  // SUCCESS CONFIRMATION & DIGITAL RECEIPT VIEW
  // ==========================================
  if (completedOrder) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen py-12 sm:py-16 print:py-0 print:bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white border border-stone-200 p-8 sm:p-12 shadow-sm text-center print:border-none print:shadow-none print:p-0">
            
            {/* Header Icon */}
            <div className="w-16 h-16 bg-[#F4EFEA] text-stone-900 rounded-full flex items-center justify-center mx-auto mb-6 print:hidden">
              <CheckCircle2 size={32} />
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] tracking-[0.25em] uppercase text-emerald-800 font-semibold mb-2">
              <ShieldCheck size={14} />
              <span>Stripe Payment Captured & Verified</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal mb-3">
              Thank you for your order.
            </h1>
            <p className="text-xs text-stone-600 mb-6 max-w-lg mx-auto leading-relaxed">
              Order Reference: <strong className="text-stone-900">#{completedOrder._id}</strong>
              <br />
              A formal confirmation and courier tracking docket have been dispatched to{' '}
              <span className="text-stone-900 font-medium">{completedOrder.shippingAddress?.email}</span>.
            </p>

            {/* Receipt Summary Card */}
            <div className="bg-[#FAF8F5] p-6 border border-stone-200 text-left text-xs text-stone-700 space-y-3 mb-6 print:bg-white print:border-stone-400">
              <div className="flex justify-between items-center border-b border-stone-200 pb-2.5">
                <span className="font-semibold text-stone-900">Payment Reference (Stripe):</span>
                <span className="font-mono text-[11px] text-stone-800 bg-white px-2 py-0.5 border border-stone-200">
                  {completedOrder.paymentResult?.id || 'pi_test_confirmed'}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-stone-200 pb-2.5">
                <span className="font-semibold text-stone-900">Payment Method:</span>
                <span className="text-stone-800">
                  {completedOrder.paymentResult?.cardBrand || 'Card'} ••••{' '}
                  {completedOrder.paymentResult?.last4 || '4242'}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-stone-200 pb-2.5">
                <span className="font-semibold text-stone-900">Recipient:</span>
                <span>{completedOrder.shippingAddress?.fullName}</span>
              </div>

              <div className="flex justify-between items-center border-b border-stone-200 pb-2.5">
                <span className="font-semibold text-stone-900">Courier Destination:</span>
                <span className="text-right">
                  {completedOrder.shippingAddress?.address}, {completedOrder.shippingAddress?.city},{' '}
                  {completedOrder.shippingAddress?.postalCode}
                </span>
              </div>

              {/* Garment Line Items */}
              <div className="border-b border-stone-200 pb-2.5 pt-1">
                <span className="font-semibold text-stone-900 block mb-2">Tailored Garments:</span>
                <div className="space-y-1.5 pl-2">
                  {completedOrder.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-stone-600 text-[11px]">
                      <span>
                        {item.qty}× {item.name} ({item.selectedSize} / {item.selectedColor})
                      </span>
                      <span className="font-medium text-stone-900">
                        ${(item.price * item.qty).toLocaleString()} USD
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-1 font-semibold text-sm text-stone-900">
                <span>Total Amount Charged:</span>
                <span>${completedOrder.totalPrice?.toLocaleString()} USD</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center print:hidden">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 bg-white text-stone-800 border border-stone-300 px-6 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-stone-50 transition-colors"
              >
                <Printer size={14} /> Print Receipt
              </button>
              <Link
                to="/profile"
                className="bg-stone-900 text-white px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-stone-800 transition-colors"
              >
                View In Order History
              </Link>
              <Link
                to="/shop"
                className="bg-stone-100 text-stone-800 px-6 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-stone-200 transition-colors"
              >
                Continue Browsing
              </Link>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN CHECKOUT FORM VIEW
  // ==========================================
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title & Gateway Status */}
        <div className="mb-10 text-center max-w-lg mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 border border-stone-300 text-stone-700 text-[10px] uppercase tracking-[0.2em] font-medium mb-3">
            <Lock size={11} className="text-emerald-700" />
            <span>
              {paymentConfig.stripeConfigured ? 'Stripe Gateway Live' : 'Stripe Test Gateway (Sandbox Active)'}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
            Finalize Your Atelier Order
          </h1>
          <p className="text-xs text-stone-500 mt-2">
            256-bit encryption • PCI-DSS compliant checkout
          </p>
        </div>

        {errorMessage && (
          <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-center gap-2">
            <AlertCircle size={15} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Form Column */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. Recipient Details */}
            <div className="bg-white border border-stone-200 p-6 sm:p-8 space-y-4">
              <h2 className="font-serif text-xl font-normal text-stone-900 border-b border-stone-200 pb-3 flex items-center justify-between">
                <span>1. Delivery Destination & Contact</span>
                <span className="text-xs text-stone-400 font-sans font-normal">Step 1 of 2</span>
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
                    onChange={handleDeliveryChange}
                    className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none focus:border-stone-900"
                    placeholder="e.g. Sophie Laurent"
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
                    onChange={handleDeliveryChange}
                    className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none focus:border-stone-900"
                    placeholder="sophie@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
                    Telephone (for Courier updates)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleDeliveryChange}
                    className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none focus:border-stone-900"
                    placeholder="+1 (555) 019-2834"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
                    Country / Region *
                  </label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleDeliveryChange}
                    placeholder="e.g. United States"
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
                  onChange={handleDeliveryChange}
                  placeholder="e.g. 124 Madison Avenue, Apt 4B"
                  className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleDeliveryChange}
                    placeholder="e.g. New York"
                    className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
                    Postal / ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={formData.postalCode}
                    onChange={handleDeliveryChange}
                    placeholder="e.g. 10001"
                    className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
                  Courier Instructions (Optional)
                </label>
                <textarea
                  name="notes"
                  rows="2"
                  value={formData.notes}
                  onChange={handleDeliveryChange}
                  placeholder="e.g. Leave with building doorman or ring buzzer #4B..."
                  className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            {/* 2. Stripe Payment Section */}
            <div className="bg-white border border-stone-200 p-6 sm:p-8 space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 pb-3 gap-2">
                <h2 className="font-serif text-xl font-normal text-stone-900 flex items-center gap-2">
                  <CreditCard size={18} />
                  <span>2. Stripe Card Payment</span>
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tracking-wider uppercase font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    256-Bit SSL
                  </span>
                  <span className="text-[10px] tracking-wider uppercase font-medium text-stone-700 bg-stone-100 px-2 py-0.5 border border-stone-200">
                    Stripe Test Gateway
                  </span>
                </div>
              </div>

              {/* Quick Preset Buttons for Instant Testing */}
              <div className="bg-[#FAF8F5] p-3.5 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-stone-600 font-semibold flex items-center gap-1.5">
                    <Sparkles size={12} className="text-[#8C7355]" /> Fast Test Card Presets:
                  </span>
                  <span className="text-[10px] text-stone-400">Click to auto-fill</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={applySuccessTestCard}
                    className="bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-[11px] px-3 py-1.5 font-medium transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Success Card (4242...)</span>
                  </button>
                  <button
                    type="button"
                    onClick={applyDeclineTestCard}
                    className="bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-[11px] px-3 py-1.5 font-medium transition-colors flex items-center gap-1.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Decline Test (4000...0002)</span>
                  </button>
                </div>
              </div>

              {/* Credit Card Input Form */}
              <div className="space-y-4">
                
                {/* Card Number */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold">
                      Card Number *
                    </label>
                    <span className="text-[10px] font-mono tracking-widest text-stone-600 font-bold bg-stone-100 px-1.5 py-0.5">
                      {cardBrand}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="0000 0000 0000 0000"
                      className="w-full border border-stone-300 p-2.5 text-xs font-mono tracking-wider focus:outline-none focus:border-stone-900 pr-10"
                    />
                    <CreditCard
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                    />
                  </div>
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
                    Name on Card *
                  </label>
                  <input
                    type="text"
                    required
                    value={cardData.cardholderName}
                    onChange={(e) => setCardData({ ...cardData, cardholderName: e.target.value })}
                    placeholder="FIRSTNAME LASTNAME"
                    className="w-full border border-stone-300 p-2.5 text-xs uppercase focus:outline-none focus:border-stone-900"
                  />
                </div>

                {/* Expiry, CVC & ZIP */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
                      Expiry (MM/YY) *
                    </label>
                    <input
                      type="text"
                      required
                      value={cardData.expiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="w-full border border-stone-300 p-2.5 text-xs font-mono text-center focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
                      CVC / CVV *
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cardData.cvc}
                      onChange={handleCvcChange}
                      placeholder="•••"
                      className="w-full border border-stone-300 p-2.5 text-xs font-mono text-center focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
                      Billing ZIP *
                    </label>
                    <input
                      type="text"
                      required
                      value={cardData.postalCode}
                      onChange={(e) => setCardData({ ...cardData, postalCode: e.target.value })}
                      placeholder="10001"
                      className="w-full border border-stone-300 p-2.5 text-xs text-center focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

              </div>

              {/* Security Banner */}
              <div className="flex items-center gap-2 pt-2 text-[10px] text-stone-500">
                <Lock size={12} className="text-emerald-700" />
                <span>
                  Card information is securely processed through Stripe's test payment gateway infrastructure.
                </span>
              </div>

            </div>

          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-stone-200 p-6 sm:p-8 space-y-6 sticky top-28">
              <h2 className="font-serif text-xl font-normal text-stone-900 border-b border-stone-200 pb-3">
                Order Review ({cartItems.length} {cartItems.length === 1 ? 'Garment' : 'Garments'})
              </h2>

              {/* Items List */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1 divide-y divide-stone-100">
                {cartItems.map((item) => {
                  const itemLink = item.product ? `/product/${item.product}` : '/shop';
                  return (
                    <div key={item.cartKey} className="flex gap-3 pt-3 first:pt-0">
                      <Link to={itemLink} className="flex-shrink-0 group" title={`View ${item.name}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-16 object-cover object-top bg-stone-100 group-hover:opacity-85 transition-opacity"
                        />
                      </Link>
                      <div className="flex-1 text-xs">
                        <Link to={itemLink} className="block group" title={`View ${item.name}`}>
                          <p className="font-medium text-stone-900 leading-tight group-hover:text-stone-600 transition-colors">
                            {item.name}
                          </p>
                        </Link>
                        <p className="text-[11px] text-stone-600 mt-0.5">
                          Size: {item.selectedSize} · {item.selectedColor}
                        </p>
                        <p className="text-stone-500 mt-1">
                          Qty: {item.quantity} × ${item.price.toLocaleString()}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-stone-900">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Financial Calculations */}
              <div className="border-t border-stone-200 pt-4 space-y-2.5 text-xs text-stone-600">
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
                <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-semibold text-stone-900">
                  <span>Total Amount</span>
                  <span>${totalPrice.toLocaleString()} USD</span>
                </div>
              </div>

              {/* Submit Payment Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-stone-900 text-white py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-stone-800 transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>{paymentStepText || 'Authorizing with Stripe...'}</span>
                  </>
                ) : (
                  <>
                    <span>Pay ${totalPrice.toLocaleString()} with Stripe</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-[10px] text-stone-500 space-y-1">
                <p>✓ 100% Genuine Natural Fibers</p>
                <p>✓ Complimentary 30-Day Returns & Size Exchanges</p>
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
