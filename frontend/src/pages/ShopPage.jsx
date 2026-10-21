import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/api';

const CATEGORIES = ['All', 'Shirts', 'Pants', 'Outerwear', 'Knitwear'];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

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
        console.error('Failed to fetch garments', err);
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
    setMaxPrice(1000);
    setInStockOnly(false);
    setSearchParams({});
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      {/* Editorial Header */}
      <div className="border-b border-stone-200/80 py-10 sm:py-14 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500 block mb-1 font-semibold">
            Autumn / Winter 2026 Lookbook
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 tracking-tight">
            Ready-to-Wear Collection
          </h1>
          <p className="max-w-lg mx-auto text-xs sm:text-sm text-stone-500 mt-2.5 font-light leading-relaxed">
            Essential Oxford shirts, pleated virgin wool trousers, structured overshirts, and organic fleece loungewear.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Sleek Filter & Category Toolbar */}
        <div className="border-b border-stone-200 pb-5 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.18em] font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#1C1917] text-white shadow-sm'
                    : 'bg-white border border-stone-200/90 text-stone-700 hover:border-stone-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right Toolbar Controls */}
          <div className="flex items-center justify-between md:justify-end gap-4">
            <span className="text-xs text-stone-500 font-light">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Garment' : 'Garments'}
            </span>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-stone-200 px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-stone-900 uppercase tracking-wider cursor-pointer"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs border border-stone-200 bg-white text-stone-800 hover:border-stone-400 uppercase tracking-wider"
            >
              <SlidersHorizontal size={13} />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Collapsible Refine Drawer */}
        {filtersOpen && (
          <div className="bg-white border border-stone-200 p-6 mb-8 space-y-4 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <span className="font-serif text-base font-normal text-stone-900">Refine Collection</span>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-stone-500 hover:text-stone-900 flex items-center gap-1 uppercase tracking-wider font-medium"
              >
                <RotateCcw size={12} /> Reset Filters
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="text-[11px] uppercase tracking-widest text-stone-700 font-semibold block mb-2">
                  Max Price: ${maxPrice.toLocaleString()} USD
                </label>
                <input
                  type="range"
                  min="150"
                  max="1000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-stone-900 cursor-pointer"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-stone-700 select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-stone-900 w-4 h-4 rounded-none cursor-pointer"
                  />
                  <span>Show In-Stock Garments Only</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="animate-pulse bg-[#F0EEE9] aspect-[3/4]" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-white border border-stone-200/80 p-8">
            <h2 className="font-serif text-2xl text-stone-900 mb-2">No Matching Garments Found</h2>
            <p className="text-xs text-stone-500 mb-6 font-light">
              Try adjusting your category filter, price slider, or search keywords.
            </p>
            <button
              onClick={handleResetFilters}
              className="bg-[#1C1917] text-white px-6 py-2.5 text-xs uppercase tracking-widest font-medium hover:bg-stone-800 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
