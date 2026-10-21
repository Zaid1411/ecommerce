import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Truck, Check, ArrowRight, Plus, Minus, Scissors, Sparkles, Heart } from 'lucide-react';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('fabric');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const data = await productService.getById(id);
        setProduct(data);
        setSelectedImage(data.image || (data.images && data.images[0]));
        setSelectedSize(data.defaultSize || (data.sizes && data.sizes[0]) || 'M');
        setSelectedColor(data.color || (data.colors && data.colors[0]) || 'Standard');
        
        // Load related
        const all = await productService.getAll();
        const related = (all.products || [])
          .filter((p) => (p.id || p._id) !== id && p.category === data.category)
          .slice(0, 3);
        setRelatedProducts(related);
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <div className="animate-pulse space-y-4 max-w-lg mx-auto">
          <div className="h-8 bg-stone-200 w-3/4 mx-auto" />
          <div className="h-4 bg-stone-200 w-1/2 mx-auto" />
          <div className="h-64 bg-stone-200 mt-8" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-serif text-2xl text-stone-900 mb-4">Garment Not Found</h2>
        <p className="text-xs text-stone-500 mb-6 font-light">
          The apparel item you requested may have sold out or been archived from the seasonal catalog.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-[#1C1917] text-white px-7 py-3 text-xs uppercase tracking-widest font-medium"
        >
          Return to Lookbook
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const sizes = product.sizes || ['S', 'M', 'L', 'XL'];
  const colors = product.colors || [product.color || 'Standard'];

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs text-stone-500 flex items-center gap-2 font-light">
        <Link to="/" className="hover:text-stone-900 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-stone-900 transition-colors">Apparel</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-stone-900 transition-colors">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-medium truncate">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          
          {/* Left: Gallery Column (Sticky on Desktop) */}
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-28 space-y-4">
              <div className="aspect-[3/4] bg-[#F0EEE9] overflow-hidden relative shadow-sm">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-all duration-700"
                />
                
                {/* Minimal Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                  <span className="bg-[#1C1917] text-[#FAF8F5] text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 font-medium shadow-sm">
                    {product.leadTime || 'In Stock'}
                  </span>
                  {product.fabric && (
                    <span className="bg-white/95 backdrop-blur-sm text-stone-800 text-[9px] uppercase tracking-wider px-2.5 py-1 border border-stone-200/80 shadow-sm">
                      {product.fabric.split(',')[0]}
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-stone-700 hover:text-stone-900 transition-all shadow-sm focus:outline-none"
                  aria-label="Wishlist toggle"
                >
                  <Heart
                    size={18}
                    className={`transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-stone-700'}`}
                  />
                </button>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-20 aspect-[3/4] overflow-hidden transition-all border-2 ${
                        selectedImage === img ? 'border-stone-900 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover object-center" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Specifications & Add to Bag */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 pt-2">
            <div className="space-y-6">
              
              {/* Category & Rating */}
              <div className="flex justify-between items-center text-xs text-stone-500 uppercase tracking-widest">
                <span className="font-semibold text-stone-700">{product.category} Collection</span>
                {product.rating && (
                  <div className="flex items-center gap-1.5 text-stone-800">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{product.rating}</span>
                    <span className="text-stone-400 font-light">({product.numReviews} reviews)</span>
                  </div>
                )}
              </div>

              {/* Title & Price */}
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal leading-tight">
                  {product.name}
                </h1>
                <div className="mt-3 flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-semibold text-stone-900">
                    ${product.price.toLocaleString()}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-stone-500 font-light">USD</span>
                </div>
              </div>

              {/* Editorial Description */}
              <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed border-t border-stone-200 pt-5">
                {product.description}
              </p>

              {/* Color Selector */}
              <div className="border-t border-stone-200 pt-5">
                <label className="text-xs uppercase tracking-widest text-stone-700 font-semibold block mb-3">
                  Colorway: <span className="text-stone-900 font-normal">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-4 py-2 text-xs tracking-wider uppercase font-medium border transition-all ${
                        selectedColor === c
                          ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizing Selector */}
              <div className="border-t border-stone-200 pt-5">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs uppercase tracking-widest text-stone-700 font-semibold">
                    Select Size: <span className="font-bold text-stone-900">{selectedSize}</span>
                  </label>
                  <span className="text-[11px] text-stone-500 hover:text-stone-900 underline cursor-pointer">
                    Size Guide
                  </span>
                </div>
                <div className="flex gap-2.5">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-12 h-12 text-xs font-semibold uppercase border transition-all flex items-center justify-center ${
                        selectedSize === s
                          ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                          : 'border-stone-200 bg-white text-stone-800 hover:border-stone-900'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {product.fit && (
                  <p className="text-[11px] text-stone-500 mt-2.5 font-light italic">
                    {product.fit}
                  </p>
                )}
              </div>

              {/* Quantity Stepper & Add to Bag */}
              <div className="border-t border-stone-200 pt-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-stone-300 bg-white h-12">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 h-full text-stone-600 hover:bg-stone-100 flex items-center justify-center transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 text-xs font-semibold text-stone-900 min-w-[36px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 h-full text-stone-600 hover:bg-stone-100 flex items-center justify-center transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 h-12 px-6 text-xs uppercase tracking-[0.2em] font-medium transition-all shadow-md flex items-center justify-center gap-2 ${
                      addedAnimation
                        ? 'bg-emerald-800 text-white'
                        : 'bg-[#1C1917] text-white hover:bg-stone-800'
                    }`}
                  >
                    {addedAnimation ? (
                      <>
                        <Check size={14} />
                        <span>Added to Bag</span>
                      </>
                    ) : (
                      <>
                        <span>Add to Bag (Size {selectedSize})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 border-t border-stone-200 pt-6 text-center text-stone-600 text-[11px]">
                <div className="space-y-1">
                  <Truck size={17} className="mx-auto text-stone-700" />
                  <p className="font-medium text-stone-900">Express Delivery</p>
                  <p className="text-[10px] text-stone-500 font-light">Dispatches in 24h</p>
                </div>
                <div className="space-y-1">
                  <ShieldCheck size={17} className="mx-auto text-stone-700" />
                  <p className="font-medium text-stone-900">30-Day Returns</p>
                  <p className="text-[10px] text-stone-500 font-light">Complimentary return</p>
                </div>
                <div className="space-y-1">
                  <Sparkles size={17} className="mx-auto text-stone-700" />
                  <p className="font-medium text-stone-900">Pure Fibers</p>
                  <p className="text-[10px] text-stone-500 font-light">Mill certified</p>
                </div>
              </div>

              {/* Accordion Specification Tabs */}
              <div className="border-t border-stone-200 pt-6 space-y-3">
                <div className="flex border-b border-stone-200 text-xs uppercase tracking-wider">
                  <button
                    onClick={() => setActiveTab('fabric')}
                    className={`pb-2.5 font-medium transition-colors ${
                      activeTab === 'fabric' ? 'border-b-2 border-stone-900 text-stone-900' : 'text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    Fabric & Mill
                  </button>
                  <button
                    onClick={() => setActiveTab('craft')}
                    className={`pb-2.5 font-medium transition-colors ml-6 ${
                      activeTab === 'craft' ? 'border-b-2 border-stone-900 text-stone-900' : 'text-stone-400 hover:text-stone-700'
                    }`}
                  >
                    Craftsmanship
                  </button>
                </div>

                <div className="text-xs text-stone-600 font-light leading-relaxed pt-2">
                  {activeTab === 'fabric' && (
                    <p>{product.fabric}. Sourced directly from certified heritage mills adhering to sustainable fiber harvesting standards.</p>
                  )}
                  {activeTab === 'craft' && (
                    <p>{product.craftsmanship || "Single-needle tailoring with reinforced seams and mother-of-pearl or horn button finishes."}</p>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-24 pt-12 border-t border-stone-200">
            <h2 className="font-serif text-2xl text-stone-900 mb-8 font-normal">
              Complete The Look
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id || rel._id} product={rel} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
