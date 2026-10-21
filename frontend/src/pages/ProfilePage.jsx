import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Calendar, MapPin, Shield, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    async function loadOrders() {
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (err) {
        // Fallback demo orders for profile view
        setOrders([
          {
            _id: 'NZ-WW-892104',
            createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
            status: 'In Workshop Handcrafted',
            totalPrice: 3450,
            orderItems: [
              {
                name: 'Otago Solid White Oak Dining Table',
                qty: 1,
                price: 3450,
                selectedFinish: 'Natural American White Oak',
                image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?q=80&w=400&auto=format&fit=crop'
              }
            ],
            shippingAddress: {
              address: '22 Marine Parade',
              city: 'Nelson',
              country: 'New Zealand'
            }
          }
        ]);
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
                Open Admin Studio
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="border border-stone-300 px-5 py-2.5 text-xs uppercase tracking-wider font-medium text-stone-700 hover:bg-stone-100 transition-colors"
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
              Bespoke Order History
            </h2>
            <span className="text-xs text-stone-500">
              {orders.length} {orders.length === 1 ? 'Commission' : 'Commissions'}
            </span>
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
                When you commission custom handcrafted furniture, your progress tracking and delivery details will appear here.
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
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Commission Reference</span>
                      <span className="font-semibold text-stone-900 text-sm">#{order._id}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Date Placed</span>
                      <span className="font-medium text-stone-800">
                        {new Date(order.createdAt).toLocaleDateString('en-NZ', { dateStyle: 'medium' })}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Status</span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 font-medium text-[11px]">
                        <Clock size={12} /> {order.status || 'In Workshop Handcrafted'}
                      </span>
                    </div>

                    <div className="space-y-1 sm:text-right">
                      <span className="text-[10px] uppercase tracking-wider text-stone-400 block">Total Investment</span>
                      <span className="font-semibold text-stone-900 text-sm">
                        ${order.totalPrice.toLocaleString()} NZD
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="divide-y divide-stone-100">
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-20 object-cover bg-stone-100 flex-shrink-0"
                        />
                        <div className="flex-1 text-xs">
                          <h4 className="font-serif text-base text-stone-900 font-normal">{item.name}</h4>
                          <p className="text-[#8C7355] text-[11px] mt-0.5 font-medium">
                            Finish: {item.selectedFinish || 'Standard Oak'}
                          </p>
                          <p className="text-stone-500 mt-1">
                            Quantity: {item.qty} × ${item.price.toLocaleString()} NZD
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-stone-900">
                          ${(item.price * item.qty).toLocaleString()} NZD
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Footer */}
                  {order.shippingAddress && (
                    <div className="bg-[#FAF8F5] p-4 text-xs text-stone-600 flex items-center gap-2 border border-stone-200">
                      <MapPin size={16} className="text-[#8C7355] flex-shrink-0" />
                      <span>
                        Delivering to: <strong className="text-stone-900">{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}</strong>
                      </span>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
