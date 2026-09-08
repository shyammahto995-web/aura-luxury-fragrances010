import React, { useState } from 'react';
import { Instagram, Facebook, Share2, Twitter, Check } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, params?: any) => void;
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdminLogin }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer id="aura-luxury-footer" className="w-full bg-[#11100F] text-[#FAF8F5] pt-16 pb-12 border-t border-[#262422]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-[#262320]">
          
          {/* Column 1: Newsletter Signup (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#9E9588] font-medium block">
              Stay in the Know
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal leading-tight">
              Be the first to discover new scents and exclusive offers.
            </h3>
            <p className="text-xs text-[#A69E92] font-light leading-relaxed">
              Receive complimentary invitations to private reserve launches, olfactory masterclasses, and limited discovery previews.
            </p>

            <form onSubmit={handleSubscribe} className="pt-2">
              <div className="flex items-center max-w-sm border-b border-[#4A453E] focus-within:border-white transition-colors pb-1">
                <input
                  id="footer-newsletter-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-transparent text-sm text-white placeholder-[#787166] focus:outline-none py-1.5"
                  required
                />
                <button
                  id="footer-subscribe-btn"
                  type="submit"
                  className="text-[11px] uppercase tracking-[0.2em] text-[#EFEAE1] hover:text-white font-semibold ml-3 shrink-0 transition-colors"
                >
                  {subscribed ? <span className="flex items-center text-emerald-400 gap-1"><Check className="w-3.5 h-3.5" /> Subscribed</span> : 'Subscribe'}
                </button>
              </div>
            </form>
          </div>

          {/* Column 2: Shop Links (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-[#C2B7A7] font-semibold">
              Shop
            </h4>
            <ul className="space-y-2 text-[12px] text-[#A69E92] font-light">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors">
                  All Fragrances
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'Women' })} className="hover:text-white transition-colors">
                  Women&apos;s Perfumes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'Men' })} className="hover:text-white transition-colors">
                  Men&apos;s Perfumes
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'Unisex' })} className="hover:text-white transition-colors">
                  Unisex Fragrances
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'Gift Sets' })} className="hover:text-white transition-colors">
                  Gift Sets & Coffers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'Discovery Sets' })} className="hover:text-white transition-colors">
                  Discovery Sets
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'Perfume Oils' })} className="hover:text-white transition-colors">
                  Perfume Oils & Rollers
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: About Links (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-[#C2B7A7] font-semibold">
              About
            </h4>
            <ul className="space-y-2 text-[12px] text-[#A69E92] font-light">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Our Story
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Ingredients & Sourcing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Sustainability
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('journal')} className="hover:text-white transition-colors">
                  Olfactory Journal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Contact The Atelier
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Help Links (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.25em] text-[#C2B7A7] font-semibold">
              Help
            </h4>
            <ul className="space-y-2 text-[12px] text-[#A69E92] font-light">
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  FAQ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Returns Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  id="footer-admin-link"
                  onClick={onOpenAdminLogin} 
                  className="text-[#B5914E] hover:text-[#D4B06D] font-medium transition-colors"
                >
                  Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Brand Identity & Socials (2 cols) */}
          <div className="md:col-span-2 flex flex-col justify-between space-y-4">
            <div>
              <div className="font-serif text-2xl tracking-[0.35em] text-white font-medium">
                AURA
              </div>
              <div className="text-[8px] uppercase tracking-[0.4em] text-[#8C8476] mt-0.5">
                PARFUMS
              </div>
            </div>

            <div className="flex items-center space-x-4 text-[#A89E90]">
              <a href="#instagram" className="hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#facebook" className="hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#twitter" className="hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#share" className="hover:text-white transition-colors" aria-label="Share">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Sub-footer Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7A7366] font-light">
          <p>© 2026 AURA Parfums. Handcrafted Haute Parfumerie. All rights reserved.</p>
          <div className="flex space-x-6 mt-3 sm:mt-0">
            <span>Formulated in Grasse</span>
            <span>·</span>
            <span>Distilled in Florence</span>
            <span>·</span>
            <span>Bottled in Paris</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
