import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Truck, Check, ArrowRight, Plus, Minus, TreePine, Sparkles } from 'lucide-react';
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
  const [selectedFinish, setSelectedFinish] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs');
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const data = await productService.getById(id);
        setProduct(data);
        setSelectedImage(data.image || (data.images && data.images[0]));
        setSelectedFinish(data.timberFinish || (data.finishes && data.finishes[0]) || 'Natural Oak');
        
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
        <h2 className="font-serif text-2xl text-stone-900 mb-4">Piece Not Found</h2>
        <p className="text-xs text-stone-500 mb-6">The furniture item you requested may have been archived.</p>
        <Link
          to="/shop"
          className="inline-block bg-stone-900 text-white px-6 py-3 text-xs uppercase tracking-widest"
        >
          Return to Collection
        </Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const finishes = product.finishes || [product.timberFinish || 'Standard Natural Oak'];

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedFinish);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-24">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-xs text-stone-500 flex items-center gap-2">
        <Link to="/" className="hover:text-stone-900">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-stone-900">Collection</Link>
        <span>/</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-stone-900">{product.category}</Link>
        <span>/</span>
        <span className="text-stone-900 font-medium truncate">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Gallery Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-[4/5] bg-stone-100 overflow-hidden border border-stone-200 relative">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-500"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-widest font-medium border border-stone-200 text-stone-800">
                {product.leadTime || 'Handcrafted to order'}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 aspect-square border-2 overflow-hidden transition-all ${
                      selectedImage === img ? 'border-stone-900 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Specifications & Add to Selection */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              
              {/* Category & Rating */}
              <div className="flex justify-between items-center text-xs text-stone-500 uppercase tracking-widest">
                <span>{product.category} Collection</span>
                {product.rating && (
                  <div className="flex items-center gap-1 text-stone-800">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{product.rating}</span>
                    <span className="text-stone-400">({product.numReviews} client reviews)</span>
                  </div>
                )}
              </div>

              {/* Title & Price */}
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal leading-tight">
                  {product.name}
                </h1>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-semibold text-stone-900">
                    ${product.price.toLocaleString()}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-stone-500">NZD (incl. GST)</span>
                </div>
              </div>

              {/* Editorial Description */}
              <p className="text-sm text-stone-600 font-light leading-relaxed border-t border-stone-200 pt-5">
                {product.description}
              </p>

              {/* Timber Finish Selector */}
              <div className="border-t border-stone-200 pt-5">
                <label className="text-xs uppercase tracking-widest text-stone-700 font-semibold block mb-3">
                  Selected Timber / Finish: <span className="text-[#8C7355] font-normal">{selectedFinish}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {finishes.map((finish) => (
                    <button
                      key={finish}
                      onClick={() => setSelectedFinish(finish)}
                      className={`px-4 py-2 text-xs tracking-wider uppercase font-medium border transition-all ${
                        selectedFinish === finish
                          ? 'border-stone-900 bg-stone-900 text-white'
                          : 'border-stone-300 bg-white text-stone-700 hover:border-stone-500'
                      }`}
                    >
                      {finish}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper & Add Button */}
              <div className="border-t border-stone-200 pt-5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-stone-300 bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-3 text-stone-600 hover:bg-stone-100"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 text-sm font-semibold text-stone-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-3 text-stone-600 hover:bg-stone-100"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-stone-900 text-white py-3.5 px-6 text-xs uppercase tracking-[0.2em] font-medium hover:bg-stone-800 transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    Add to Bespoke Selection
                  </button>
                </div>

                <p className="text-[11px] text-stone-500 text-center tracking-wide">
                  ✓ Ready for dispatch or made-to-order in Nelson • Complimentary shipping on orders over $3,000 NZD
                </p>
              </div>

              {/* Guarantees */}
              <div className="bg-[#F4EFEA] p-4 border border-stone-200 space-y-2 text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#8C7355]" />
                  <span>10-Year Master Craftsman Structural Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <TreePine size={16} className="text-[#8C7355]" />
                  <span>100% Solid Certified American Hardwoods (Zero MDF)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-[#8C7355]" />
                  <span>Specialist White-Glove Furniture Delivery & Placement</span>
                </div>
              </div>

            </div>

            {/* Architectural Specs Tabs */}
            <div className="border-t border-stone-200 pt-6">
              <div className="flex border-b border-stone-200 mb-4 text-xs uppercase tracking-wider font-medium">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2 mr-6 border-b-2 transition-colors ${
                    activeTab === 'specs' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'
                  }`}
                >
                  Dimensions & Joinery
                </button>
                <button
                  onClick={() => setActiveTab('care')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'care' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400 hover:text-stone-700'
                  }`}
                >
                  Timber Care
                </button>
              </div>

              {activeTab === 'specs' ? (
                <div className="text-xs text-stone-600 space-y-2 leading-relaxed">
                  <p><strong className="text-stone-900">Standard Dimensions:</strong> {product.dimensions || 'Custom architectural sizing on request.'}</p>
                  <p><strong className="text-stone-900">Construction:</strong> {product.craftsmanship || 'Mortise and tenon solid hardwood joinery.'}</p>
                  <p><strong className="text-stone-900">Finish:</strong> Matte organo-wax polyurethane sealant resisting spills and UV fading.</p>
                </div>
              ) : (
                <div className="text-xs text-stone-600 space-y-2 leading-relaxed">
                  <p>Clean regularly with a soft, lint-free microfibre cloth dampened with warm water.</p>
                  <p>Avoid harsh chemical household cleaners or silicone polishes.</p>
                  <p>Natural timber breathes and matures gracefully with age, developing a rich organic patina.</p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Related Furniture Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-28 border-t border-stone-200 pt-16">
            <div className="text-center mb-12">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#8C7355] font-semibold block mb-1">
                Harmonious Living
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal">
                Pieces from the Same Collection
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id || p._id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
