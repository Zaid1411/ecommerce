import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, Shield, LogOut, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { totalItems, openCart } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/98 backdrop-blur-md border-b border-stone-200/80 transition-all duration-300">
      {/* Top Editorial Announcement Bar */}
      <div className="bg-[#1C1917] text-[#FAF8F5] text-[10px] tracking-[0.22em] uppercase font-medium py-2 px-4 text-center">
        <span>Autumn/Winter Lookbook • Express Delivery Over $300 • 30-Day Returns</span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-18 sm:h-20 gap-2 sm:gap-4">
          
          {/* Left Column: Mobile Hamburger / Desktop Apparel Categories */}
          <div className="flex items-center justify-start space-x-2 sm:space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-900 hover:text-stone-600 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="lg:hidden p-2 text-stone-800 hover:text-stone-600 focus:outline-none"
              aria-label="Search garments"
            >
              <Search size={19} strokeWidth={1.5} />
            </button>

            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-7 text-[10px] xl:text-[11px] tracking-[0.16em] xl:tracking-[0.2em] uppercase font-medium text-stone-700">
              <Link
                to="/shop"
                className={`hover:text-stone-900 transition-colors py-1 relative whitespace-nowrap ${
                  location.pathname === '/shop' && !location.search ? 'text-stone-900 font-semibold' : ''
                }`}
              >
                All
              </Link>
              <Link
                to="/shop?category=Shirts"
                className={`hover:text-stone-900 transition-colors py-1 relative whitespace-nowrap ${
                  location.search.includes('Shirts') ? 'text-stone-900 font-semibold' : ''
                }`}
              >
                Shirts
              </Link>
              <Link
                to="/shop?category=Pants"
                className={`hover:text-stone-900 transition-colors py-1 relative whitespace-nowrap ${
                  location.search.includes('Pants') ? 'text-stone-900 font-semibold' : ''
                }`}
              >
                Pants
              </Link>
              <Link
                to="/shop?category=Outerwear"
                className={`hover:text-stone-900 transition-colors py-1 relative whitespace-nowrap ${
                  location.search.includes('Outerwear') ? 'text-stone-900 font-semibold' : ''
                }`}
              >
                Outerwear
              </Link>
              <Link
                to="/shop?category=Knitwear"
                className={`hover:text-stone-900 transition-colors py-1 relative whitespace-nowrap ${
                  location.search.includes('Knitwear') ? 'text-stone-900 font-semibold' : ''
                }`}
              >
                Knitwear
              </Link>
            </nav>
          </div>

          {/* Center Column: Mathematically Centered Brand Logo */}
          <div className="flex items-center justify-center text-center px-2 sm:px-4">
            <Link to="/" className="inline-block group text-center">
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.25em] xl:tracking-[0.3em] font-normal text-stone-900 uppercase block group-hover:opacity-80 transition-opacity whitespace-nowrap">
                ATELIER
              </span>
              <span className="text-[8px] tracking-[0.35em] uppercase text-stone-500 font-sans block text-center">
                Studio Edition
              </span>
            </Link>
          </div>

          {/* Right Column: Actions (Editorial, Search, Account, Bag) */}
          <div className="flex items-center justify-end space-x-3 sm:space-x-5 xl:space-x-6 text-stone-800">
            {/* Desktop Editorial Link */}
            <Link
              to="/#editorial"
              className="hidden lg:inline-block text-[10px] xl:text-[11px] tracking-[0.16em] xl:tracking-[0.2em] uppercase font-medium text-stone-700 hover:text-stone-900 transition-colors py-1 whitespace-nowrap"
            >
              Editorial
            </Link>

            {/* Desktop Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden lg:flex items-center gap-1.5 p-1 text-xs uppercase tracking-wider text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
              aria-label="Search garments"
            >
              <Search size={18} strokeWidth={1.5} />
              <span className="text-[10px] xl:text-[11px] tracking-widest hidden xl:inline">Search</span>
            </button>

            {/* User Account / Profile */}
            {user ? (
              <div className="relative group">
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  className="flex items-center space-x-1.5 py-1 text-xs tracking-wider uppercase text-stone-800 hover:text-stone-600 focus:outline-none cursor-pointer"
                  aria-label="Account Profile"
                >
                  <User size={19} strokeWidth={1.5} />
                  <span className="hidden xl:inline font-medium max-w-[90px] truncate">
                    {isAdmin ? 'Admin' : (user.name && !user.name.toLowerCase().includes('editorial') ? user.name.split(' ')[0] : 'Account')}
                  </span>
                </button>
                {/* Backdrop to close dropdown on outside click */}
                {accountDropdownOpen && (
                  <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setAccountDropdownOpen(false)}
                  />
                )}
                {/* Dropdown */}
                <div className={`absolute right-0 mt-2 w-48 bg-white border border-stone-200 shadow-xl rounded-none py-2 z-50 animate-fadeIn ${
                  accountDropdownOpen ? 'block' : 'hidden group-hover:block'
                }`}>
                  <div className="px-4 py-2 border-b border-stone-100">
                    <p className="text-[10px] uppercase tracking-wider text-stone-400">
                      {isAdmin ? 'Studio Admin' : 'Client Profile'}
                    </p>
                    <p className="text-xs font-semibold text-stone-900 truncate">
                      {user.name === 'Editorial Director' ? 'Studio Director' : user.name}
                    </p>
                    <p className="text-[11px] text-stone-500 truncate">
                      {user.email === 'admin@woodwright.co.nz' ? 'admin@atelier.com' : user.email}
                    </p>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setAccountDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs tracking-wider uppercase text-amber-800 hover:bg-stone-50 font-semibold"
                    >
                      <Shield size={14} className="mr-2" />
                      Admin Studio
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setAccountDropdownOpen(false)}
                    className="block px-4 py-2 text-xs tracking-wider uppercase text-stone-700 hover:bg-stone-50"
                  >
                    Wardrobe & Orders
                  </Link>
                  <button
                    onClick={() => {
                      setAccountDropdownOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full text-left flex items-center px-4 py-2 text-xs tracking-wider uppercase text-stone-700 hover:bg-stone-50 cursor-pointer"
                  >
                    <LogOut size={14} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="p-1 hover:text-stone-600 transition-colors flex items-center space-x-1.5 text-xs tracking-wider uppercase"
                title="Client Sign In"
              >
                <User size={19} strokeWidth={1.5} />
                <span className="hidden xl:inline text-[11px] tracking-widest">Sign In</span>
              </Link>
            )}

            {/* Shopping Bag Button (Always Visible on Mobile & Desktop) */}
            <button
              onClick={openCart}
              className="relative p-1.5 hover:text-stone-600 transition-colors flex items-center space-x-1.5 group"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={20} strokeWidth={1.5} className="group-hover:scale-105 transition-transform" />
              <span className="hidden sm:inline text-[11px] tracking-widest font-medium uppercase text-stone-800">
                Bag
              </span>
              {totalItems > 0 && (
                <span className="bg-stone-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center -ml-1">
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
                placeholder="Search Oxford shirts, pleated trousers, overshirts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="flex-1 bg-white border border-stone-300 px-4 py-2.5 text-xs focus:outline-none focus:border-stone-900"
              />
              <button
                type="submit"
                className="bg-stone-900 text-white px-6 py-2.5 text-xs uppercase tracking-widest font-medium hover:bg-stone-800 transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-2"
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF8F5] border-b border-stone-200 px-6 py-6 space-y-4 animate-fadeIn">
          <Link
            to="/shop"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs tracking-[0.2em] uppercase font-semibold text-stone-900 py-1"
          >
            All Apparel
          </Link>
          <Link
            to="/shop?category=Shirts"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs tracking-[0.2em] uppercase font-medium text-stone-700 py-1"
          >
            Shirts & Overshirts
          </Link>
          <Link
            to="/shop?category=Pants"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs tracking-[0.2em] uppercase font-medium text-stone-700 py-1"
          >
            Pants & Trousers
          </Link>
          <Link
            to="/shop?category=Outerwear"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs tracking-[0.2em] uppercase font-medium text-stone-700 py-1"
          >
            Outerwear & Jackets
          </Link>
          <Link
            to="/shop?category=Knitwear"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs tracking-[0.2em] uppercase font-medium text-stone-700 py-1"
          >
            Knitwear & Fleece
          </Link>
          <Link
            to="/#editorial"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-xs tracking-[0.2em] uppercase font-medium text-stone-700 py-1"
          >
            Editorial Lookbook
          </Link>
          <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-wider">
            {user ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-amber-800 font-semibold"
                  >
                    Admin Studio
                  </Link>
                )}
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-stone-900 font-semibold">
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                    navigate('/');
                  }}
                  className="text-stone-500 hover:text-stone-900 cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-stone-900 font-semibold">
                Client Sign In
              </Link>
            )}
            <button
              onClick={() => { setMobileMenuOpen(false); openCart(); }}
              className="text-stone-900 font-semibold flex items-center gap-1 cursor-pointer"
            >
              Shopping Bag ({totalItems})
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
