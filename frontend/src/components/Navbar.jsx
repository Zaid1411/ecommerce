import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, Shield, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { totalItems, openCart } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-stone-200 transition-all duration-300">
      {/* Top Editorial Announcement Bar */}
      <div className="bg-[#1C1917] text-[#FAF8F5] text-[11px] tracking-widest uppercase font-medium py-2 px-4 text-center border-b border-stone-800">
        <span className="opacity-90">Autumn/Winter Ready-to-Wear Collection • Complimentary Express Delivery Over $300</span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-800 hover:text-stone-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Left: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8 text-[12px] tracking-[0.18em] uppercase font-medium text-stone-700">
            <Link to="/shop" className="hover:text-stone-900 transition-colors py-1 border-b border-transparent hover:border-stone-900">
              All Apparel
            </Link>
            <Link to="/shop?category=Shirts" className="hover:text-stone-900 transition-colors py-1 border-b border-transparent hover:border-stone-900">
              Shirts
            </Link>
            <Link to="/shop?category=Pants" className="hover:text-stone-900 transition-colors py-1 border-b border-transparent hover:border-stone-900">
              Pants & Trousers
            </Link>
            <Link to="/shop?category=Outerwear" className="hover:text-stone-900 transition-colors py-1 border-b border-transparent hover:border-stone-900">
              Outerwear
            </Link>
            <Link to="/shop?category=Knitwear" className="hover:text-stone-900 transition-colors py-1 border-b border-transparent hover:border-stone-900">
              Knitwear
            </Link>
          </nav>

          {/* Center: Brand Wordmark */}
          <div className="flex-1 lg:flex-initial text-center lg:text-left">
            <Link to="/" className="inline-block group">
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] font-normal text-stone-900 uppercase block group-hover:opacity-80 transition-opacity">
                ATELIER
              </span>
              <span className="text-[9px] tracking-[0.3em] uppercase text-stone-500 font-sans block text-center">
                Modern Ready-to-Wear
              </span>
            </Link>
          </div>

          {/* Right: Actions (Search, Account, Cart) */}
          <div className="flex items-center space-x-5 text-stone-800">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1 hover:text-stone-600 transition-colors"
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>

            {/* User Account / Profile */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-1.5 py-1 text-xs tracking-wider uppercase text-stone-800 hover:text-stone-600">
                  <User size={19} strokeWidth={1.5} />
                  <span className="hidden md:inline font-medium max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white border border-stone-200 shadow-xl rounded-none py-2 hidden group-hover:block z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-xs text-stone-500">Signed in as</p>
                    <p className="text-xs font-semibold text-stone-900 truncate">{user.email}</p>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center px-4 py-2 text-xs tracking-wider uppercase text-amber-800 hover:bg-stone-50 font-semibold"
                    >
                      <Shield size={14} className="mr-2" />
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-xs tracking-wider uppercase text-stone-700 hover:bg-stone-50"
                  >
                    My Wardrobe & Orders
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left flex items-center px-4 py-2 text-xs tracking-wider uppercase text-stone-700 hover:bg-stone-50"
                  >
                    <LogOut size={14} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="p-1 hover:text-stone-600 transition-colors flex items-center space-x-1 text-xs tracking-wider uppercase"
                title="Account"
              >
                <User size={20} strokeWidth={1.5} />
                <span className="hidden md:inline">Sign In</span>
              </Link>
            )}

            {/* Shopping Bag Button */}
            <button
              onClick={openCart}
              className="relative p-1 hover:text-stone-600 transition-colors flex items-center space-x-1.5"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={21} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-stone-900 text-stone-50 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Search Bar */}
        {searchOpen && (
          <div className="py-4 border-t border-stone-200 animate-fadeIn">
            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto flex items-center gap-3">
              <input
                type="text"
                placeholder="Search pleated trousers, oxford shirts, cashmere overcoats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 bg-white border border-stone-300 px-4 py-2 text-sm focus:outline-none focus:border-stone-800"
              />
              <button
                type="submit"
                className="bg-stone-900 text-white px-5 py-2 text-xs uppercase tracking-widest font-medium hover:bg-stone-800"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-2"
              >
                <X size={18} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-stone-200 px-6 py-6 space-y-4">
          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm tracking-widest uppercase font-medium text-stone-900"
          >
            All Apparel
          </Link>
          <Link
            to="/shop?category=Shirts"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm tracking-widest uppercase font-medium text-stone-700"
          >
            Shirts & Overshirts
          </Link>
          <Link
            to="/shop?category=Pants"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm tracking-widest uppercase font-medium text-stone-700"
          >
            Pants & Trousers
          </Link>
          <Link
            to="/shop?category=Outerwear"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm tracking-widest uppercase font-medium text-stone-700"
          >
            Outerwear & Coats
          </Link>
          <Link
            to="/shop?category=Knitwear"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm tracking-widest uppercase font-medium text-stone-700"
          >
            Merino & Cashmere Knitwear
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm tracking-widest uppercase font-bold text-amber-900 pt-2 border-t border-stone-200"
            >
              Admin Studio
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
