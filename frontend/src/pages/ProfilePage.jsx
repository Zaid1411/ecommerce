import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Calendar, MapPin, Shield, CheckCircle2, Clock, FileText, Truck, Printer, X, ExternalLink, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedTracking, setSelectedTracking] = useState(null);
  const [supportModal, setSupportModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function loadOrders() {
      try {
        const data = await orderService.getMyOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn('Could not fetch orders from API:', err.message);
        // Fallback to local storage scoped strictly to this user's email
        let savedOrders = [];
        const userEmailKey = (user?.email || '').toLowerCase().trim();
        try {
          savedOrders = JSON.parse(localStorage.getItem(`atelier_orders_${userEmailKey}`) || '[]');
        } catch (e) {
          console.error('Failed to parse local user orders', e);
        }

        // Only show sample demo order if explicitly logged into the demo client account
        const defaultOrders = (userEmailKey === 'client@example.com') ? [
          {
            _id: 'ATL-ORD-892104',
            createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
            status: 'Dispatched via Express Courier',
            totalPrice: 560,
            orderItems: [
              {
                product: 'fash-002',
                name: 'Pleated Relaxed Wool Flannel Trousers',
                qty: 1,
                price: 340,
                selectedSize: 'M',
                selectedColor: 'Charcoal Melange',
                image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=400&auto=format&fit=crop'
              },
              {
                product: 'fash-001',
                name: 'Heavyweight Boxy Oxford Shirt',
                qty: 1,
                price: 220,
                selectedSize: 'L',
                selectedColor: 'Raw Ecru',
                image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=400&auto=format&fit=crop'
              }
            ],
            shippingAddress: {
              fullName: user.name || 'Sophie Montgomery',
              address: '742 Evergreen Terrace',
              city: 'New York',
              country: 'United States'
            }
          }
        ] : [];

        setOrders([...savedOrders, ...defaultOrders]);
      } finally {
        setLoadingOrders(false);
      }
    }

    loadOrders();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="bg-white border border-stone-200 p-6 sm:p-8 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#F4EFEA] text-stone-800 rounded-full flex items-center justify-center font-serif text-2xl font-normal border border-stone-300">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">{user.name}</h1>
                {user.isAdmin && (
                  <span className="bg-amber-100 text-amber-900 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 border border-amber-300">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-1">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.isAdmin && (
              <Link
                to="/admin"
                className="bg-amber-800 text-white px-5 py-2.5 text-xs uppercase tracking-wider font-medium hover:bg-amber-900 transition-colors"
              >
                Admin Studio
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="border border-stone-300 px-5 py-2.5 text-xs uppercase tracking-wider font-medium text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Order History */}
        <div className="space-y-6">
          <div className="border-b border-stone-200 pb-3 flex justify-between items-baseline">
            <h2 className="font-serif text-2xl font-normal text-stone-900 flex items-center gap-2">
              <Package size={22} className="text-[#8C7355]" />
              Wardrobe Order History
            </h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSupportModal(true)}
                className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle size={14} /> Client Care
              </button>
              <span className="text-xs text-stone-500">
                {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
              </span>
            </div>
          </div>

          {loadingOrders ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse bg-white border border-stone-200 h-36" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white border border-stone-200 p-12 text-center">
              <p className="font-serif text-lg text-stone-800 mb-2">No orders placed yet</p>
              <p className="text-xs text-stone-500 mb-6">
                When you order from ATELIER, your tracking details and order receipts will appear here.
              </p>
              <Link
                to="/shop"
                className="inline-block bg-stone-900 text-white px-6 py-3 text-xs uppercase tracking-widest font-medium"
              >
                Browse Collection
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
                  
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4 text-xs text-stone-600">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Order Number</span>
                      <span className="font-semibold text-stone-900 text-sm">#{order._id}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Date Placed</span>
                      <span className="font-medium text-stone-800">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Status</span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-stone-900 border border-stone-300 font-medium text-[11px]">
                        <Clock size={12} /> {order.status || 'Confirmed'}
                      </span>
                    </div>

                    <div className="space-y-1 sm:text-right">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Total Investment</span>
                      <span className="font-semibold text-stone-900 text-sm">
                        ${order.totalPrice.toLocaleString()} USD
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="divide-y divide-stone-100">
                    {order.orderItems.map((item, idx) => {
                      const itemProductLink = item.product ? `/product/${item.product}` : '/shop';
                      return (
                        <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                          <Link to={itemProductLink} className="flex-shrink-0 group">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-20 object-cover object-top bg-stone-100 group-hover:opacity-85 transition-opacity"
                            />
                          </Link>
                          <div className="flex-1 text-xs">
                            <Link to={itemProductLink} className="block group">
                              <h4 className="font-serif text-base text-stone-900 font-normal group-hover:text-stone-600 transition-colors">
                                {item.name}
                              </h4>
                            </Link>
                            <p className="text-stone-600 text-[11px] mt-0.5 font-medium">
                              Size: <span className="font-bold text-stone-900">{item.selectedSize || 'M'}</span> · Color: {item.selectedColor || 'Standard'}
                            </p>
                            <p className="text-stone-500 mt-1">
                              Quantity: {item.qty} × ${item.price.toLocaleString()} USD
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            <span className="text-sm font-semibold text-stone-900">
                              ${(item.price * item.qty).toLocaleString()} USD
                            </span>
                            <Link
                              to={itemProductLink}
                              className="text-[10px] uppercase tracking-wider text-stone-500 hover:text-stone-900 underline flex items-center gap-0.5"
                            >
                              <span>View Garment</span>
                              <ExternalLink size={10} />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Shipping Footer & Action Buttons */}
                  <div className="bg-[#FAF8F5] p-4 text-xs text-stone-600 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-stone-200">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#8C7355] flex-shrink-0" />
                      <span>
                        Delivering to: <strong className="text-stone-900">{order.shippingAddress ? `${order.shippingAddress.address}, ${order.shippingAddress.city}` : 'Client Address'}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        id="track-courier-btn"
                        type="button"
                        onClick={() => setSelectedTracking(order)}
                        className="bg-white border border-stone-300 px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium text-stone-800 hover:border-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Truck size={13} />
                        <span>Track Courier</span>
                      </button>
                      <button
                        id="view-receipt-btn"
                        type="button"
                        onClick={() => setSelectedReceipt(order)}
                        className="bg-stone-900 text-white px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText size={13} />
                        <span>View Receipt</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* RECEIPT / INVOICE MODAL */}
      {selectedReceipt && (
        <div
          onClick={() => setSelectedReceipt(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-stone-200 max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative text-left cursor-default"
          >
            <div className="flex items-start justify-between border-b border-stone-200 pb-4 mb-6">
              <div>
                <span className="font-serif text-xl tracking-[0.2em] font-normal uppercase block text-stone-900">
                  ATELIER
                </span>
                <span className="text-[10px] uppercase tracking-widest text-stone-500 block mt-0.5">
                  Official Client Invoice & Packing Manifest
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="p-1 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-stone-600 mb-6 border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Order Ref</span>
                <span className="font-semibold text-stone-900">#{selectedReceipt._id || 'ATL-ORD'}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Order Date</span>
                <span className="font-medium text-stone-800">
                  {selectedReceipt.createdAt ? new Date(selectedReceipt.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' }) : 'Today'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Client</span>
                <span className="font-medium text-stone-900">{user?.name || 'Client'}</span>
                <p className="text-stone-500 text-[11px]">{user?.email || 'client@atelier.com'}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Payment Status</span>
                <span className="text-emerald-700 font-semibold">Payment Verified (Test Mode)</span>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="space-y-3 mb-6">
              <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Garment Breakdown</span>
              <div className="divide-y divide-stone-100 border-y border-stone-100 py-1">
                {(selectedReceipt.orderItems || []).map((item, idx) => (
                  <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-medium text-stone-900">{item.name}</p>
                      <p className="text-[11px] text-stone-500">
                        Size: {item.selectedSize || 'M'} · Qty: {item.qty || 1} × ${(item.price || 0).toLocaleString()}
                      </p>
                    </div>
                    <span className="font-semibold text-stone-900">
                      ${((item.price || 0) * (item.qty || 1)).toLocaleString()} USD
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Row */}
            <div className="space-y-1.5 text-xs text-stone-600 border-b border-stone-200 pb-4 mb-6">
              <div className="flex justify-between">
                <span>Courier Service:</span>
                <span className="text-stone-900 font-medium">Complimentary Express (DHL)</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-stone-900 pt-1">
                <span>Total Amount Paid:</span>
                <span>${(selectedReceipt.totalPrice || 0).toLocaleString()} USD</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => window.print()}
                className="border border-stone-300 px-4 py-2 text-xs uppercase tracking-wider font-medium text-stone-700 hover:bg-stone-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer size={14} />
                <span>Print Invoice</span>
              </button>
              <button
                id="close-receipt-btn"
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="bg-stone-900 text-white px-6 py-2 text-xs uppercase tracking-wider font-medium hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRACKING MODAL */}
      {selectedTracking && (
        <div
          onClick={() => setSelectedTracking(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-stone-200 max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-left cursor-default"
          >
            <div className="flex items-start justify-between border-b border-stone-200 pb-3 mb-5">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#8C7355] font-semibold block">
                  DHL Express Worldwide
                </span>
                <h3 className="font-serif text-xl text-stone-900 font-normal mt-0.5">
                  Shipment Tracking
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTracking(null)}
                className="p-1 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-[#FAF8F5] p-3.5 border border-stone-200 text-xs text-stone-700 space-y-1 mb-5">
              <p>Tracking Code: <strong className="text-stone-900 font-mono">DHL-{String(selectedTracking._id || '').replace(/[^0-9]/g, '').slice(-8) || '89240177'}</strong></p>
              <p>Service: <strong>Insured Carbon-Neutral Air Courier</strong></p>
              <p>Estimated Delivery: <strong>2 Business Days</strong></p>
            </div>

            {/* Timeline */}
            <div className="space-y-4 text-xs text-stone-600 mb-6 pl-2 border-l-2 border-stone-300 ml-2">
              <div className="relative pl-4">
                <div className="absolute -left-[13px] top-0.5 w-3 h-3 bg-stone-900 rounded-full" />
                <p className="font-semibold text-stone-900">In Transit with Courier</p>
                <p className="text-[11px] text-stone-500">Departed Milan Logistics Facility</p>
              </div>
              <div className="relative pl-4">
                <div className="absolute -left-[13px] top-0.5 w-3 h-3 bg-stone-900 rounded-full" />
                <p className="font-semibold text-stone-900">Archival Packaging & Pressing</p>
                <p className="text-[11px] text-stone-500">Boxed in recycled unbleached fiber carton</p>
              </div>
              <div className="relative pl-4">
                <div className="absolute -left-[13px] top-0.5 w-3 h-3 bg-stone-900 rounded-full" />
                <p className="font-semibold text-stone-900">Order Placed & Verified</p>
                <p className="text-[11px] text-stone-500">Payment cleared successfully</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                id="close-tracking-btn"
                type="button"
                onClick={() => setSelectedTracking(null)}
                className="bg-stone-900 text-white px-5 py-2 text-xs uppercase tracking-wider font-medium hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUPPORT MODAL */}
      {supportModal && (
        <div
          onClick={() => setSupportModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-stone-200 max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-left cursor-default"
          >
            <div className="flex items-start justify-between border-b border-stone-200 pb-3 mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#8C7355] font-semibold block">
                  Private Client Concierge
                </span>
                <h3 className="font-serif text-xl text-stone-900 font-normal mt-0.5">
                  Order Assistance & Returns
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSupportModal(false)}
                className="p-1 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-light mb-4">
              Need to exchange a size, request alterations advice, or schedule courier collection for a return? Our studio concierge team is available Monday through Saturday.
            </p>
            <div className="bg-[#FAF8F5] p-3 border border-stone-200 text-xs space-y-1 mb-6 text-stone-700">
              <p>Email: <strong className="text-stone-900">concierge@atelier-apparel.com</strong></p>
              <p>Direct Phone: <strong className="text-stone-900">+1 (212) 555-0198</strong></p>
              <p>Hours: <strong>9 AM - 7 PM EST</strong></p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSupportModal(false)}
                className="bg-stone-900 text-white px-5 py-2 text-xs uppercase tracking-wider font-medium hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
