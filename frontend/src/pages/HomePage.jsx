import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, ShieldCheck, Sparkles, Scissors } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/api';
import { CATEGORIES } from '../data/mockProducts';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await productService.getAll();
        setFeaturedProducts(data.products.slice(0, 4));
      } catch (err) {
        console.error('Failed to load featured garments', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="bg-[#FAF8F5]">
      
      {/* 1. HERO SECTION (Editorial High-Fashion Lookbook) */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-stone-900 text-white overflow-hidden">
        {/* Editorial Fashion Photography Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
            alt="Atelier Luxury Fashion Ready-to-Wear"
            className="w-full h-full object-cover object-top brightness-[0.72] scale-105 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[#FAF8F5] text-[11px] uppercase tracking-[0.25em] mb-6">
            <Sparkles size={12} className="text-[#D5C4B3]" /> Autumn / Winter 2026 Collection
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white mb-6 leading-[1.1]">
            Modern Tailoring & <br className="hidden sm:inline" />
            <span className="italic font-light">Everyday Luxury.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-200 font-light leading-relaxed mb-10 tracking-wide">
            Substantial heavyweight Oxford shirts, pleated Italian virgin wool trousers, and Scottish cashmere overcoats. Built with architectural restraint and uncompromising natural fibers.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto bg-[#FAF8F5] text-stone-900 px-8 py-4 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-stone-200 transition-colors flex items-center justify-center gap-2 group shadow-lg"
            >
              Explore Collection
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/shop?category=Shirts"
              className="w-full sm:w-auto bg-transparent border border-white/60 text-white px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              View Shirts & Pants
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C7355] font-semibold block mb-2">
            The Wardrobe Archive
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
            Shop by Wardrobe Category
          </h2>
          <div className="w-12 h-[1px] bg-[#8C7355] mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.name}`}
              className="group relative aspect-[3/4] overflow-hidden bg-stone-200 block shadow-sm border border-stone-200"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] uppercase tracking-[0.25em] text-stone-300">Category</span>
                <h3 className="font-serif text-2xl font-normal mt-1">{cat.name}</h3>
                <p className="text-xs text-stone-200 mt-2 line-clamp-2 font-light opacity-90">
                  {cat.tagline}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-[#FAF8F5] font-medium tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                  <span>Shop {cat.name}</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED HANDCRAFTED GARMENTS */}
      <section className="bg-white border-y border-stone-200 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C7355] font-semibold block mb-2">
                Seasonal Lookbook
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
                Featured Tailoring & Essentials
              </h2>
            </div>
            <Link
              to="/shop"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-stone-800 hover:text-stone-500 transition-colors border-b border-stone-800 pb-0.5 self-start"
            >
              View Entire Collection <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="animate-pulse bg-stone-100 aspect-[3/4] border border-stone-200" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. THE ATELIER PHILOSOPHY BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 relative aspect-[4/5] bg-stone-100 overflow-hidden shadow-xl border border-stone-200">
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200&auto=format&fit=crop"
              alt="Tailor cutting pattern on fabric"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-6 border border-stone-200">
              <p className="font-serif text-base italic text-stone-800">
                “True luxury is found in weight, drape, and the quiet precision of single-needle construction.”
              </p>
              <p className="text-[10px] uppercase tracking-widest text-stone-500 mt-2">
                The Atelier Design Manifesto
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C7355] font-semibold block">
              Ethical Sourcing & Heritage Weaves
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-900 leading-tight">
              An antidote to synthetic fast fashion.
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed font-light">
              We reject polyester blends, seasonal disposability, and cheap fast-fashion shortcuts. Every garment in our collection is crafted with natural fibers sourced directly from historic mills: Kurabo shuttle looms in Okayama, Biella wool flannels in Northern Italy, and organic combed cottons.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed font-light">
              Cut in relaxed contemporary proportions that outlive fleeting micro-trends, each shirt and trouser softens and molds to your frame with age.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-stone-200">
              <div>
                <span className="font-serif text-3xl text-stone-900 font-semibold block">100%</span>
                <span className="text-xs text-stone-500 uppercase tracking-wider">Natural Fibers</span>
              </div>
              <div>
                <span className="font-serif text-3xl text-stone-900 font-semibold block">30-Day</span>
                <span className="text-xs text-stone-500 uppercase tracking-wider">Complimentary Returns</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-stone-900 text-white px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-stone-800 transition-colors"
              >
                Shop Ready-to-Wear Collection <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 5. CALLOUT BANNER */}
      <section className="bg-[#1C1917] text-white py-16 border-t border-stone-800">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Scissors className="mx-auto text-[#BBA28C] mb-4" size={32} />
          <h2 className="font-serif text-2xl sm:text-4xl font-normal mb-4">
            Looking for Custom Tailoring or Size Inquiries?
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto mb-8 font-light leading-relaxed">
            Our styling concierge assists with garment measurements, fabric swatch requests, and tailored styling advice.
          </p>
          <div className="inline-flex flex-wrap gap-4 justify-center">
            <Link
              to="/shop"
              className="bg-[#FAF8F5] text-stone-900 px-6 py-3 text-xs uppercase tracking-[0.18em] font-medium hover:bg-stone-200 transition-colors"
            >
              Browse Complete Lookbook
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
