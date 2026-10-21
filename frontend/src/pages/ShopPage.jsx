import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, RotateCcw, Check } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/api';

const CATEGORIES = ['All', 'Living', 'Dining', 'Bedroom', 'Workspace'];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    const cat = searchParams.get('category') || 'All';
    const q = searchParams.get('search') || '';
    setSelectedCategory(cat);
    setSearchQuery(q);
  }, [searchParams]);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const data = await productService.getAll({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: searchQuery || undefined,
        });
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  // Client-side filtering & sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Price filter
    result = result.filter((p) => p.price <= maxPrice);

    // In stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.countInStock > 0);
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [products, maxPrice, inStockOnly, sortBy]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('featured');
    setMaxPrice(5000);
    setInStockOnly(false);
    setSearchParams({});
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      {/* Editorial Header Banner */}
      <div className="bg-[#1C1917] text-white py-14 sm:py-20 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#BBA28C] block mb-2 font-medium">
            Handcrafted Catalog
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight">
            Architectural Collection
          </h1>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-stone-300 mt-3 font-light leading-relaxed">
            Every piece is made to order in New Zealand with FSC certified solid hardwoods, hand-finished to your custom specification.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Filter & Controls Toolbar */}
        <div className="bg-white border border-stone-200 p-4 mb-8 flex flex-wrap items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3.5 py-1.5 text-xs uppercase tracking-wider font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            {/* Sort Select */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 uppercase tracking-wider hidden md:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-stone-50 border border-stone-300 px-3 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-stone-800"
              >
                <option value="featured">Featured Pieces</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs border border-stone-300 bg-stone-50 text-stone-800"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
          </div>
        </div>

        {/* Layout Grid: Sidebar Filters + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Sidebar Filters */}
          <aside className={`lg:block ${mobileFiltersOpen ? 'block' : 'hidden'} lg:col-span-1 space-y-6`}>
            <div className="bg-white border border-stone-200 p-6 space-y-6">
              
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <span className="font-serif text-lg font-normal text-stone-900">Refine Search</span>
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-stone-500 hover:text-stone-900 flex items-center gap-1 uppercase tracking-wider"
                >
                  <RotateCcw size={12} /> Reset
                </button>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-xs uppercase tracking-widest text-stone-700 font-semibold block mb-2">
                  Maximum Price: ${maxPrice.toLocaleString()} NZD
                </label>
                <input
                  type="range"
                  min="1000"
                  max="5000"
                  step="250"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-stone-900 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                  <span>$1,000</span>
                  <span>$5,000+</span>
                </div>
              </div>

              {/* Stock Availability */}
              <div className="border-t border-stone-200 pt-4">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-stone-900 w-4 h-4 rounded-none"
                  />
                  <span>Show Ready-to-Ship Pieces Only</span>
                </label>
              </div>

              {/* Timber Guarantee Box */}
              <div className="border-t border-stone-200 pt-4 text-xs text-stone-500 space-y-2">
                <p className="font-medium text-stone-800">Custom Dimensions Available</p>
                <p className="text-[11px] leading-relaxed">
                  Every table, desk, and credenza can be tailored to custom architectural room specifications upon request.
                </p>
              </div>

            </div>
          </aside>

          {/* Product Listing Grid */}
          <main className="lg:col-span-3">
            
            {/* Header info */}
            <div className="flex justify-between items-center mb-6 text-xs text-stone-600">
              <p>
                Showing <span className="font-semibold text-stone-900">{filteredProducts.length}</span> handcrafted {filteredProducts.length === 1 ? 'piece' : 'pieces'}
                {searchQuery && (
                  <span> matching "<span className="italic font-medium">{searchQuery}</span>"</span>
                )}
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="animate-pulse bg-white border border-stone-200 aspect-[3/4]" />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white border border-stone-200 p-12 text-center my-8">
                <p className="font-serif text-xl text-stone-800 mb-2">No matching pieces found</p>
                <p className="text-xs text-stone-500 mb-6 max-w-sm mx-auto">
                  Try broadening your price range, clearing search terms, or exploring other room categories.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-stone-900 text-white text-xs uppercase tracking-widest px-6 py-3 font-medium hover:bg-stone-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            )}

          </main>
        </div>

      </div>
    </div>
  );
}
