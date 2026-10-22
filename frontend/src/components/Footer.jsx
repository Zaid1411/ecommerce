import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Scissors, ArrowUpRight, CheckCircle2, X } from 'lucide-react';

const FOOTER_MODAL_DATA = {
  'Okayama Denim Looming': {
    tag: 'Japanese Heritage Craft',
    title: 'Okayama Low-Tension Shuttle Looming',
    content: 'Woven in Kojima, Kurashiki on vintage Toyoda G3 shuttle looms operating at slow speeds. We utilize custom ring-spun African long-staple cotton dyed in natural botanical indigo vats. The selvedge edge is finished with an antique pink ticker line, producing authentic slub character that softens with wear.'
  },
  'Biella Wool Provenance': {
    tag: 'Italian Alpine Weaving',
    title: 'Biella Wool Provenance & Spinning',
    content: 'Our double-faced flannels and Super 120s virgin wool are spun in the foothills of the Italian Alps in Biella. The glacial alpine water used in washing and milling results in exceptional yarn luster, soft hand-feel, and natural wrinkle resistance.'
  },
  'Garment Care & Steaming': {
    tag: 'Client Wardrobe Care',
    title: 'Garment Care & Archival Steaming',
    content: 'Natural fibers breathe naturally and require infrequent washing. We recommend airing garments after wear and using a handheld garment steamer rather than a conventional pressing iron. Store knitwear flat to prevent shoulder misshaping, and hang outerwear on wide-contoured cedar hangers.'
  },
  'Tailoring Alterations Guide': {
    tag: 'Sartorial Construction',
    title: 'Tailoring & Alterations Architecture',
    content: 'All ATELIER trousers and outerwear are constructed with intentional bespoke tolerances. Trousers include a 2-inch blind foldover hem for custom inseam lengthening and split-curtain waistbands allowing up to 1.5 inches of waist adjustment by any master tailor.'
  },
  'Sustainability Report': {
    tag: 'Responsible Manufacturing',
    title: 'Annual Sustainability & Mill Disclosure',
    content: 'ATELIER produces in limited seasonal drops to eliminate deadstock. 100% of our cotton is GOTS-certified organic, our wool is certified under the Responsible Wool Standard (RWS), and all shipments use biodegradable unbleached cardboard packaging with zero virgin single-use plastics.'
  },
  'Privacy Policy': {
    tag: 'Client Confidentiality',
    title: 'Digital Studio Privacy Commitment',
    content: 'ATELIER values your privacy. We never monetize, rent, or distribute personal customer data or fitting profiles to third-party ad networks. All payment card transactions are tokenized with end-to-end TLS 1.3 encryption.'
  },
  'Terms of Service': {
    tag: 'Studio Agreement',
    title: 'Client Terms of Service',
    content: 'By acquiring garments through ATELIER, you receive authentic handcrafted pieces. We warrant every piece against manufacturing defects for 12 months. Returns and exchanges in unworn condition with archival tags attached are honored within 30 days of delivery.'
  },
  'Worldwide Shipping': {
    tag: 'Global Logistics',
    title: 'Worldwide Express Courier Logistics',
    content: 'Complimentary tracked express courier delivery on all orders exceeding $300 USD. Orders placed before 2 PM CET dispatch same day via DHL Express Worldwide with signature delivery and carbon-neutral transit.'
  }
};

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [infoModal, setInfoModal] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const modalData = infoModal ? FOOTER_MODAL_DATA[infoModal] : null;

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
              <li>
                <button
                  id="footer-denim-btn"
                  type="button"
                  onClick={() => setInfoModal('Okayama Denim Looming')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Okayama Denim Looming
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setInfoModal('Biella Wool Provenance')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Biella Wool Provenance
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setInfoModal('Garment Care & Steaming')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Garment Care & Steaming
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setInfoModal('Tailoring Alterations Guide')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Tailoring Alterations Guide
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setInfoModal('Sustainability Report')}
                  className="hover:text-white transition-colors text-left cursor-pointer"
                >
                  Sustainability Report
                </button>
              </li>
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
                  className="w-full bg-[#FAF8F5] text-stone-900 py-2 text-[10px] uppercase tracking-[0.2em] font-medium hover:bg-stone-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
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
            <button
              type="button"
              onClick={() => setInfoModal('Privacy Policy')}
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setInfoModal('Terms of Service')}
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              id="footer-shipping-btn"
              type="button"
              onClick={() => setInfoModal('Worldwide Shipping')}
              className="hover:text-stone-300 transition-colors cursor-pointer"
            >
              Worldwide Shipping
            </button>
          </div>
        </div>

      </div>

      {/* FOOTER INFO MODAL */}
      {modalData && (
        <div
          onClick={() => setInfoModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-fadeIn cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-stone-900 border border-stone-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-left cursor-default"
          >
            <div className="flex items-start justify-between border-b border-stone-200 pb-3 mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#8C7355] font-semibold block">
                  {modalData.tag}
                </span>
                <h3 className="font-serif text-2xl text-stone-900 font-normal mt-0.5">
                  {modalData.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setInfoModal(null)}
                className="p-1 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed font-light mb-6">
              {modalData.content}
            </p>
            <div className="flex justify-end">
              <button
                id="close-footer-modal-btn"
                type="button"
                onClick={() => setInfoModal(null)}
                className="bg-stone-900 text-white px-6 py-2.5 text-xs uppercase tracking-wider font-medium hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
