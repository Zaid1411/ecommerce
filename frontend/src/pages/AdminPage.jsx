import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Package,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { productService, orderService } from '../services/api';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export default function AdminPage() {
  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'new-product'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Dining',
    price: 2500,
    countInStock: 5,
    leadTime: 'Handcrafted to order (4 weeks)',
    timberFinish: 'Natural American White Oak',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1200&auto=format&fit=crop',
    description: '',
    dimensions: '2000mm L x 950mm W x 750mm H',
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const prodData = await productService.getAll();
        setProducts(prodData.products || MOCK_PRODUCTS);

        try {
          const ordData = await orderService.getAllAdmin();
          setOrders(ordData || []);
        } catch (e) {
          // Demo fallback orders
          setOrders([
            {
              _id: 'NZ-WW-109482',
              user: { name: 'Sarah Jenkins', email: 'sarah.j@nzarchitects.co.nz' },
              totalPrice: 5300,
              createdAt: new Date().toISOString(),
              status: 'In Workshop Handcrafted',
              orderItems: [{ name: 'Otago Solid White Oak Dining Table', qty: 1 }],
            },
            {
              _id: 'NZ-WW-109481',
              user: { name: 'Marcus Sterling', email: 'marcus@studioalmond.nz' },
              totalPrice: 3700,
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              status: 'Dispatched',
              orderItems: [{ name: 'Fiordland Bouclé Lounge Chair', qty: 2 }],
            },
          ]);
        }
      } catch (err) {
        console.error('Failed to load admin data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const triggerNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // Delete product handler
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to remove this piece from the catalog?')) {
      try {
        await productService.delete(id);
      } catch (e) {
        console.warn('Backend delete unavailable, removing from local state');
      }
      setProducts((prev) => prev.filter((p) => (p.id || p._id) !== id));
      triggerNotification('Piece removed from catalog successfully.');
    }
  };

  // Stock quick adjustment
  const handleStockChange = (id, newStock) => {
    setProducts((prev) =>
      prev.map((p) => ((p.id || p._id) === id ? { ...p, countInStock: Math.max(0, newStock) } : p))
    );
    triggerNotification('Stock inventory updated.');
  };

  // Order status update
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
    } catch (e) {
      console.warn('Backend update unavailable, updating local state');
    }
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
    );
    triggerNotification(`Order #${orderId} marked as ${newStatus}.`);
  };

  // Create product submission
  const handleCreateProductSubmit = async (e) => {
    e.preventDefault();
    try {
      let created;
      try {
        created = await productService.create(newProduct);
      } catch (err) {
        created = {
          ...newProduct,
          _id: `prod-${Date.now()}`,
          id: `prod-${Date.now()}`,
        };
      }
      setProducts([created, ...products]);
      triggerNotification(`New handcrafted piece "${newProduct.name}" published!`);
      setActiveTab('products');
      setNewProduct({
        name: '',
        category: 'Dining',
        price: 2500,
        countInStock: 5,
        leadTime: 'Handcrafted to order (4 weeks)',
        timberFinish: 'Natural American White Oak',
        image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1200&auto=format&fit=crop',
        description: '',
        dimensions: '2000mm L x 950mm W x 750mm H',
      });
    } catch (err) {
      alert('Error creating piece: ' + err.message);
    }
  };

  // Unauthorized view guard
  if (!user || !isAdmin) {
    return (
      <div className="bg-[#FAF8F5] min-h-[75vh] flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-white border border-stone-200 p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 text-amber-900 border border-amber-200 rounded-full flex items-center justify-center mx-auto">
            <Lock size={20} />
          </div>
          <h1 className="font-serif text-2xl text-stone-900 font-normal">Restricted Admin Studio</h1>
          <p className="text-xs text-stone-600 leading-relaxed font-light">
            You must be logged in as an authorized Woodwright Administrator to access inventory, manage catalog pieces, and update client commissions.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-block bg-stone-900 text-white px-6 py-3 text-xs uppercase tracking-widest font-medium hover:bg-stone-800"
            >
              Sign In As Admin (Use Quick Demo Button)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate high-level stats
  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
  const totalStockCount = products.reduce((acc, p) => acc + (p.countInStock || 0), 0);
  const lowStockCount = products.filter((p) => (p.countInStock || 0) <= 5).length;

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-3xl sm:text-4xl font-normal text-stone-900">
                Nelson Workshop Studio
              </span>
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] uppercase font-semibold px-2 py-0.5 tracking-wider">
                Admin Console
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Logged in as {user.name} ({user.email}) • Real-time inventory & commission management
            </p>
          </div>

          <button
            onClick={() => setActiveTab('new-product')}
            className="self-start sm:self-auto bg-stone-900 text-white px-5 py-2.5 text-xs uppercase tracking-widest font-medium hover:bg-stone-800 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={15} /> Commission New Piece
          </button>
        </div>

        {/* Toast Notification */}
        {notification && (
          <div className="p-3 bg-stone-900 text-white text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 size={16} className="text-[#8C7355]" />
            <span>{notification}</span>
          </div>
        )}

        {/* 4 Metric KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white border border-stone-200 p-5 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-stone-500">Gross Commissions</span>
            <p className="font-serif text-2xl text-stone-900 font-semibold">${totalRevenue.toLocaleString()} NZD</p>
            <span className="text-[10px] text-emerald-700 font-medium">Across {orders.length} orders</span>
          </div>

          <div className="bg-white border border-stone-200 p-5 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-stone-500">Active Pieces in Archive</span>
            <p className="font-serif text-2xl text-stone-900 font-semibold">{products.length}</p>
            <span className="text-[10px] text-stone-500">Bespoke catalog lines</span>
          </div>

          <div className="bg-white border border-stone-200 p-5 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-stone-500">Total Workshop Stock</span>
            <p className="font-serif text-2xl text-stone-900 font-semibold">{totalStockCount}</p>
            <span className="text-[10px] text-stone-500">Units in inventory</span>
          </div>

          <div className="bg-white border border-stone-200 p-5 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-stone-500">Low Stock Attention</span>
            <p className="font-serif text-2xl text-amber-800 font-semibold">{lowStockCount}</p>
            <span className="text-[10px] text-amber-700">Pieces below 5 units</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-stone-200 flex gap-6 text-xs uppercase tracking-wider font-medium">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'products' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Catalog Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'orders' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            Commission Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('new-product')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'new-product' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            + Create New Piece
          </button>
        </div>

        {/* TAB 1: PRODUCTS TABLE */}
        {activeTab === 'products' && (
          <div className="bg-white border border-stone-200 overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-[#FAF8F5] text-[10px] uppercase tracking-wider text-stone-500 border-b border-stone-200">
                <tr>
                  <th className="p-4">Piece</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Inventory Units</th>
                  <th className="p-4">Timber Finish</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {products.map((p) => {
                  const pId = p.id || p._id;
                  return (
                    <tr key={pId} className="hover:bg-stone-50/70 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={p.image || (p.images && p.images[0])}
                          alt={p.name}
                          className="w-12 h-14 object-cover bg-stone-100 flex-shrink-0"
                        />
                        <div>
                          <p className="font-serif text-sm text-stone-900 font-medium">{p.name}</p>
                          <span className="text-[10px] text-stone-400">ID: {pId}</span>
                        </div>
                      </td>
                      <td className="p-4">{p.category}</td>
                      <td className="p-4 font-semibold text-stone-900">${p.price.toLocaleString()} NZD</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={p.countInStock}
                            onChange={(e) => handleStockChange(pId, Number(e.target.value))}
                            className="w-16 border border-stone-300 px-2 py-1 text-xs focus:outline-none focus:border-stone-900"
                          />
                          <span className={`text-[10px] ${p.countInStock <= 4 ? 'text-amber-700 font-semibold' : 'text-stone-400'}`}>
                            {p.countInStock <= 4 ? 'Low Stock' : 'In Stock'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-[#8C7355] text-xs font-medium">{p.timberFinish || 'Standard Oak'}</td>
                      <td className="p-4 text-right space-x-2">
                        <Link
                          to={`/product/${pId}`}
                          className="inline-block p-1 text-stone-500 hover:text-stone-900"
                          title="View on Storefront"
                        >
                          <ArrowUpRight size={16} />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(pId)}
                          className="p-1 text-stone-400 hover:text-red-700 transition-colors"
                          title="Delete Piece"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: ORDERS TABLE */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-stone-200 overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-[#FAF8F5] text-[10px] uppercase tracking-wider text-stone-500 border-b border-stone-200">
                <tr>
                  <th className="p-4">Commission ID</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Date Commissioned</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Workshop Status</th>
                  <th className="p-4">Status Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="p-4 font-mono font-semibold text-stone-900">#{o._id}</td>
                    <td className="p-4">
                      <p className="font-medium text-stone-900">{o.user?.name || o.shippingAddress?.fullName || 'Client'}</p>
                      <p className="text-[10px] text-stone-400">{o.user?.email || o.shippingAddress?.email || 'N/A'}</p>
                    </td>
                    <td className="p-4 text-stone-500">
                      {new Date(o.createdAt).toLocaleDateString('en-NZ', { dateStyle: 'medium' })}
                    </td>
                    <td className="p-4 font-semibold text-stone-900">${o.totalPrice.toLocaleString()} NZD</td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                        {o.status || 'In Workshop'}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={o.status || 'In Workshop Handcrafted'}
                        onChange={(e) => handleOrderStatusChange(o._id, e.target.value)}
                        className="border border-stone-300 bg-white px-2 py-1 text-xs focus:outline-none focus:border-stone-900"
                      >
                        <option value="In Workshop Handcrafted">In Workshop Handcrafted</option>
                        <option value="Quality Inspection Passed">Quality Inspection Passed</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: CREATE PRODUCT FORM */}
        {activeTab === 'new-product' && (
          <div className="bg-white border border-stone-200 p-8 max-w-3xl shadow-sm">
            <h2 className="font-serif text-2xl font-normal text-stone-900 border-b border-stone-200 pb-3 mb-6">
              Commission & Publish a New Piece
            </h2>

            <form onSubmit={handleCreateProductSubmit} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
                    Piece Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tasman Solid Oak Credenza"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
                    Architectural Room Category *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none focus:border-stone-900"
                  >
                    <option value="Living">Living</option>
                    <option value="Dining">Dining</option>
                    <option value="Bedroom">Bedroom</option>
                    <option value="Workspace">Workspace</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
                    Price (NZD) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
                    Available Stock Count *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProduct.countInStock}
                    onChange={(e) => setNewProduct({ ...newProduct, countInStock: Number(e.target.value) })}
                    className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
                    Lead Time
                  </label>
                  <input
                    type="text"
                    value={newProduct.leadTime}
                    onChange={(e) => setNewProduct({ ...newProduct, leadTime: e.target.value })}
                    className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
                  High-Resolution Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
                  Timber Finish & Species *
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.timberFinish}
                  onChange={(e) => setNewProduct({ ...newProduct, timberFinish: e.target.value })}
                  className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider text-stone-700 font-semibold block mb-1">
                  Architectural Description & Joinery Details
                </label>
                <textarea
                  rows="3"
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Describe timber grain, mortise-and-tenon joints, organic wax finishes..."
                  className="w-full border border-stone-300 p-2.5 text-xs focus:outline-none focus:border-stone-900"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="px-6 py-2.5 border border-stone-300 text-stone-700 uppercase tracking-wider hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-stone-900 text-white px-8 py-2.5 uppercase tracking-widest font-medium hover:bg-stone-800 shadow-sm"
                >
                  Publish Piece to Storefront
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
