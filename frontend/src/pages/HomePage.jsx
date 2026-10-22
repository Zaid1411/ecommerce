import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Scissors, ShieldCheck, Truck } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/api';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await productService.getAll();
        setFeaturedProducts(data.products.slice(0, 4));
      } catch (err) {
        console.error('Failed to load garments', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="bg-[#FAF8F5]">
      
      {/* 1. HERO CAMPAIGN (H&M Studio Lookbook Style) */}
      <section className="relative w-full overflow-hidden bg-[#EAE8E3]">
        <div className="w-full relative aspect-[16/9] min-h-[500px] sm:min-h-[620px] max-h-[85vh]">
          <img
            src="/assets/hero_campaign.jpg"
            alt="Atelier Autumn/Winter Lookbook Campaign"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle Bottom Light Gradient for Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 sm:p-12 lg:p-16 text-white">
            <div className="max-w-2xl">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-semibold text-stone-200 mb-2 block">
                Autumn / Winter 2026 Collection
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.1]">
                Modern Tailoring & <br />
                <span className="italic font-light">Everyday Luxury.</span>
              </h1>
              <p className="text-xs sm:text-sm text-stone-200 max-w-lg mt-3 font-light leading-relaxed mb-6">
                Pleated Italian wool flannels, heavyweight Oxford shirts, and cashmere knitwear crafted with natural fibers and timeless proportions.
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <Link
                  to="/shop"
                  className="bg-white text-stone-900 px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-stone-200 transition-colors shadow-lg flex items-center gap-2 group"
                >
                  Shop The Lookbook
                  <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/shop?category=Pants"
                  className="bg-black/40 backdrop-blur-md border border-white/40 text-white px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-white hover:text-stone-900 transition-all"
                >
                  Tailored Trousers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TWO-COLUMN SPLIT CAMPAIGN (H&M Style Lookbook Banners) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Banner 1: The Shirt Edit */}
          <Link
            to="/shop?category=Shirts"
            className="group block"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-[#F0EEE9] shadow-sm">
              <img
                src="/assets/campaign_shirt_edit.jpg"
                alt="The Shirt Edit - Heavyweight Oxfords & French Linen"
                className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[9px] uppercase tracking-[0.25em] font-semibold text-stone-800 border border-stone-200/60">
                Capsule Drop
              </div>
            </div>
            <div className="pt-4 flex items-baseline justify-between">
              <div>
                <h2 className="font-serif text-2xl font-normal text-stone-900 group-hover:text-stone-600 transition-colors">
                  The Shirt Edit
                </h2>
                <p className="text-xs text-stone-500 mt-1 font-light">
                  Single-needle construction in 240 GSM organic Oxford & French linen.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-stone-900 group-hover:translate-x-1 transition-transform">
                <span>Shop</span>
                <ArrowRight size={13} />
              </div>
            </div>
          </Link>

          {/* Banner 2: Tailored Pants & Trousers */}
          <Link
            to="/shop?category=Pants"
            className="group block"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-[#F0EEE9] shadow-sm">
              <img
                src="/assets/campaign_trousers_edit.jpg"
                alt="Tailored Pants and Italian Wool Trousers"
                className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[9px] uppercase tracking-[0.25em] font-semibold text-stone-800 border border-stone-200/60">
                Architectural Cut
              </div>
            </div>
            <div className="pt-4 flex items-baseline justify-between">
              <div>
                <h2 className="font-serif text-2xl font-normal text-stone-900 group-hover:text-stone-600 transition-colors">
                  Tailored Trousers & Pants
                </h2>
                <p className="text-xs text-stone-500 mt-1 font-light">
                  Double-pleated Italian virgin wool flannels and relaxed loopback terry.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-stone-900 group-hover:translate-x-1 transition-transform">
                <span>Shop</span>
                <ArrowRight size={13} />
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* 3. NEW IN LOOKBOOK (4-Column Clean Product Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 border-b border-stone-200 pb-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-semibold block mb-1">
              Seasonal Essentials
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
              New In Lookbook
            </h2>
          </div>
          <Link
            to="/shop"
            className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-medium text-stone-900 hover:text-stone-600 transition-colors"
          >
            View All Garments <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="animate-pulse bg-[#F0EEE9] aspect-[3/4]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. THE FABRIC MANIFESTO (H&M Premium Selection Style) */}
      <section id="editorial" className="bg-white border-y border-stone-200/80 py-16 sm:py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 aspect-[4/5] bg-[#F0EEE9] overflow-hidden shadow-sm">
              <img
                src="/assets/campaign_craft_twill.jpg"
                alt="Structured Cotton Twill Overshirt Editorial"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-semibold block">
                Editorial • The Atelier Standard
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 leading-tight">
                Quiet luxury crafted with heritage European natural fibers.
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                We believe true elegance lies in the weight of combed cotton, the clean drape of super 120s virgin wool, and the architectural precision of single-needle stitching. Every garment is crafted to outlive fast-fashion micro-trends.
              </p>
              
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-stone-100">
                <div>
                  <span className="font-serif text-2xl text-stone-900 font-semibold block">100%</span>
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider">Natural Fibers</span>
                </div>
                <div>
                  <span className="font-serif text-2xl text-stone-900 font-semibold block">30 Days</span>
                  <span className="text-[11px] text-stone-500 uppercase tracking-wider">Complimentary Returns</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/shop"
                  className="inline-block bg-[#1C1917] text-white px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-stone-800 transition-colors shadow-sm"
                >
                  Explore Complete Lookbook
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
