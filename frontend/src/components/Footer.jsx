import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Scissors, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#1C1917] text-[#FAF8F5] pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Propositions / Trust Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-14 border-b border-stone-800 text-stone-300">
          <div className="flex items-start space-x-4">
            <Scissors className="text-[#BBA28C] flex-shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-serif text-base text-white tracking-wide">Heritage European & Japanese Mills</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Super 120s Biella virgin wools, Okayama shuttle-loom selvedge denim, and organic long-staple combed cottons.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Compass className="text-[#BBA28C] flex-shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-serif text-base text-white tracking-wide">Architectural Silhouette & Proportions</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Tailored with intentional ease, clean drape, and single-needle craftsmanship designed to outlast micro-trends.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <ShieldCheck className="text-[#BBA28C] flex-shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-serif text-base text-white tracking-wide">30-Day Complimentary Exchanges</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Try garments on at home. Complimentary worldwide size exchanges and prepaid return shipping.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-14 border-b border-stone-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif text-2xl tracking-[0.25em] font-normal uppercase block text-white">
              ATELIER
            </span>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Modern luxury ready-to-wear rooted in natural fibers, quiet architectural tailoring, and honest European manufacturing.
            </p>
            <div className="pt-2 text-xs text-stone-400 space-y-1">
              <p>Studio Flagship: 42 Mercer Street, SoHo, New York</p>
              <p>Client Concierge: concierge@atelier-apparel.com</p>
            </div>
          </div>

          {/* Nav Column 1 */}
          <div>
            <h5 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-200 mb-4">
              Wardrobe
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><Link to="/shop?category=Shirts" className="hover:text-white transition-colors">Shirts & Overshirts</Link></li>
              <li><Link to="/shop?category=Pants" className="hover:text-white transition-colors">Pants & Trousers</Link></li>
              <li><Link to="/shop?category=Outerwear" className="hover:text-white transition-colors">Outerwear & Coats</Link></li>
              <li><Link to="/shop?category=Knitwear" className="hover:text-white transition-colors">Cashmere & Merino Knitwear</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Full Ready-to-Wear Archive</Link></li>
            </ul>
          </div>

          {/* Nav Column 2 */}
          <div>
            <h5 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-200 mb-4">
              Craft & Mills
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><span className="hover:text-white transition-colors cursor-pointer">Okayama Denim Looming</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Biella Wool Provenance</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Garment Care & Steaming</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Tailoring Alterations Guide</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Sustainability Report</span></li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div>
            <h5 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-200 mb-4">
              Seasonal Journal
            </h5>
            <p className="text-xs text-stone-400 mb-3 leading-relaxed">
              Subscribe to receive private capsule drops, fabric releases, and seasonal lookbooks.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-[#BBA28C] pt-2">
                <CheckCircle2 size={16} />
                <span>Thank you. You are on the private client list.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#BBA28C]"
                />
                <button
                  type="submit"
                  className="w-full bg-[#FAF8F5] text-stone-900 py-2 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-stone-200 transition-colors flex items-center justify-center gap-1"
                >
                  Join List <ArrowUpRight size={12} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} ATELIER. Modern Ready-to-Wear & Tailoring. All rights reserved.</p>
          <div className="flex space-x-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Worldwide Shipping</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
