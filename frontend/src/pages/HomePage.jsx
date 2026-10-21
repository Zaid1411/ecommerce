import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, ShieldCheck, TreePine, Sparkles, Hammer } from 'lucide-react';
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
        console.error('Failed to load featured products', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="bg-[#FAF8F5]">
      
      {/* 1. HERO SECTION (Editorial Woodwrights Inspiration) */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-stone-900 text-white overflow-hidden">
        {/* Background Architectural Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
            alt="Woodwright Architectural Dining Room"
            className="w-full h-full object-cover object-center brightness-[0.7] scale-105 animate-pulse transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-[#FAF8F5] text-[11px] uppercase tracking-[0.25em] mb-6">
            <Sparkles size={12} className="text-[#D5C4B3]" /> Handcrafted in Nelson, New Zealand
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white mb-6 leading-[1.1]">
            Furniture Built to Last <br className="hidden sm:inline" />
            <span className="italic font-light">Generations.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-stone-200 font-light leading-relaxed mb-10 tracking-wide">
            Every piece is made to order in our South Island workshop. Solid sustainable hardwoods, honest mortise-and-tenon joinery, and bespoke finishes tailored for modern architectural spaces.
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
              to="/shop?category=Dining"
              className="w-full sm:w-auto bg-transparent border border-white/60 text-white px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              View Dining Pieces
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C7355] font-semibold block mb-2">
            Curated Spaces
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
            Shop by Architectural Room
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
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[10px] uppercase tracking-[0.25em] text-stone-300">Collection</span>
                <h3 className="font-serif text-2xl font-normal mt-1">{cat.name}</h3>
                <p className="text-xs text-stone-200 mt-2 line-clamp-2 font-light opacity-90">
                  {cat.tagline}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-[#FAF8F5] font-medium tracking-wider uppercase group-hover:translate-x-1 transition-transform">
                  <span>Explore Pieces</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FEATURED HANDCRAFTED PIECES */}
      <section className="bg-white border-y border-stone-200 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C7355] font-semibold block mb-2">
                South Island Workshop
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
                Featured Masterpieces
              </h2>
            </div>
            <Link
              to="/shop"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-stone-800 hover:text-stone-500 transition-colors border-b border-stone-800 pb-0.5 self-start"
            >
              View All Pieces <ArrowRight size={14} />
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

      {/* 4. THE WOODWRIGHT STORY / EDITORIAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 relative aspect-[4/5] bg-stone-100 overflow-hidden shadow-xl border border-stone-200">
            <img
              src="https://images.unsplash.com/photo-1540574163026-643ea20ade25?q=80&w=1200&auto=format&fit=crop"
              alt="Craftsman hand-planing timber in workshop"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-6 border border-stone-200">
              <p className="font-serif text-base italic text-stone-800">
                “There is an irreplaceable integrity in solid timber shaped slowly by human hands.”
              </p>
              <p className="text-[10px] uppercase tracking-widest text-stone-500 mt-2">
                David Macleod • Master Joiner, Nelson Workshop
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C7355] font-semibold block">
              The Craftsmanship Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-900 leading-tight">
              An antidote to disposable furniture.
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed font-light">
              We reject mass-produced MDF, toxic adhesives, and transient fast-furniture trends. Instead, our cabinetmakers cut, join, and oil every table, credenza, and bed from solid sustainably harvested American White Oak and Walnut.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed font-light">
              By controlling the entire process under one roof in Nelson, New Zealand, we offer bespoke adjustments in length, timber stain, and upholstery fabric to perfectly complement your architect’s vision.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-stone-200">
              <div>
                <span className="font-serif text-3xl text-stone-900 font-semibold block">28+</span>
                <span className="text-xs text-stone-500 uppercase tracking-wider">Years of Craftsmanship</span>
              </div>
              <div>
                <span className="font-serif text-3xl text-stone-900 font-semibold block">10-Yr</span>
                <span className="text-xs text-stone-500 uppercase tracking-wider">Structural Guarantee</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-stone-900 text-white px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-stone-800 transition-colors"
              >
                Request Custom Dimensions <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 5. BESPOKE COMMISSION CALLOUT BANNER */}
      <section className="bg-[#1C1917] text-white py-16 border-t border-stone-800">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Hammer className="mx-auto text-[#BBA28C] mb-4" size={32} />
          <h2 className="font-serif text-2xl sm:text-4xl font-normal mb-4">
            Need a Bespoke Size or Custom Timber Finish?
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto mb-8 font-light leading-relaxed">
            Our design concierge collaborates directly with interior architects, commercial specifiers, and discerning private clients.
          </p>
          <div className="inline-flex flex-wrap gap-4 justify-center">
            <Link
              to="/shop"
              className="bg-[#FAF8F5] text-stone-900 px-6 py-3 text-xs uppercase tracking-[0.18em] font-medium hover:bg-stone-200 transition-colors"
            >
              Browse Handcrafted Catalog
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
