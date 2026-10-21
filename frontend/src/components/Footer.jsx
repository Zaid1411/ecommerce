import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, TreePine, ArrowUpRight, CheckCircle2 } from 'lucide-react';

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
            <TreePine className="text-[#BBA28C] flex-shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-serif text-base text-white tracking-wide">Sustainably Harvested Timbers</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                We work exclusively with certified American Oak, Walnut, and native timbers harvested under strict environmental stewardship.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <Compass className="text-[#BBA28C] flex-shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-serif text-base text-white tracking-wide">Bespoke Architectural Customization</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Tailor dimensions, timber species, edge profiles, and Italian textile upholsteries to harmonize with your interior.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <ShieldCheck className="text-[#BBA28C] flex-shrink-0 mt-1" size={24} />
            <div>
              <h4 className="font-serif text-base text-white tracking-wide">10-Year Master Craftsman Warranty</h4>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Traditional mortise and tenon joinery ensures each heirloom piece withstands generations of family memories.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-14 border-b border-stone-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif text-2xl tracking-[0.25em] font-normal uppercase block text-white">
              WOODWRIGHT
            </span>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              New Zealand furniture makers committed to enduring simplicity, architectural proportions, and honest solid hardwoods. Handcrafted with reverence in our Nelson workshop.
            </p>
            <div className="pt-2 text-xs text-stone-400 space-y-1">
              <p>Showroom & Studio: 18 Vanguard St, Nelson, New Zealand</p>
              <p>Inquiries: concierge@woodwright.co.nz</p>
            </div>
          </div>

          {/* Nav Column 1 */}
          <div>
            <h5 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-200 mb-4">
              Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><Link to="/shop?category=Living" className="hover:text-white transition-colors">Living Room</Link></li>
              <li><Link to="/shop?category=Dining" className="hover:text-white transition-colors">Dining Tables & Chairs</Link></li>
              <li><Link to="/shop?category=Bedroom" className="hover:text-white transition-colors">Platform Beds & Suites</Link></li>
              <li><Link to="/shop?category=Workspace" className="hover:text-white transition-colors">Executive Desks & Storage</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Full Architectural Archive</Link></li>
            </ul>
          </div>

          {/* Nav Column 2 */}
          <div>
            <h5 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-200 mb-4">
              The Workshop
            </h5>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li><span className="hover:text-white transition-colors cursor-pointer">Timber Provenance</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Master Joinery Standards</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Bespoke Commissioning</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Care & Oil Refinishing</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Trade & Architect Program</span></li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div>
            <h5 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-stone-200 mb-4">
              Architectural Journal
            </h5>
            <p className="text-xs text-stone-400 mb-3 leading-relaxed">
              Subscribe to receive new collection debuts, timber releases, and studio journal essays.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs text-[#BBA28C] pt-2">
                <CheckCircle2 size={16} />
                <span>Thank you. You are subscribed.</span>
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
                  Join Journal <ArrowUpRight size={12} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} WOODWRIGHT. Crafted in New Zealand. All rights reserved.</p>
          <div className="flex space-x-6">
            <span>Privacy Policy</span>
            <span>Terms of Craftsmanship</span>
            <span>Worldwide Shipping</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
