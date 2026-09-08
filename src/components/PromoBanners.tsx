import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PromoBannersProps {
  onShopDiscovery: () => void;
  onShopGifts: () => void;
}

export const PromoBanners: React.FC<PromoBannersProps> = ({ onShopDiscovery, onShopGifts }) => {
  return (
    <section id="aura-promo-banners-section" className="w-full bg-[#FAF8F5] py-10 sm:py-16 border-b border-[#EAE3D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Tile 1: Discovery Sets (Dark Velvet Elegance) */}
          <div 
            id="banner-discovery-sets" 
            className="group relative bg-[#1B1917] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-hidden shadow-lg border border-[#2D2A26] min-h-[360px]"
          >
            {/* Background subtle texture/gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />

            {/* Content Left */}
            <div className="relative z-20 max-w-xs space-y-3">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#C9BFB0] font-medium block">
                Discovery Sets
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#FAF8F5] font-normal leading-tight">
                Find your <br />
                signature scent.
              </h3>
              <p className="text-[#B8B0A2] text-xs sm:text-sm font-light leading-relaxed">
                Explore our curated sets of six miniature flacons and discover the note accords that become uniquely yours.
              </p>
              <div className="pt-2">
                <button
                  id="promo-shop-discovery-btn"
                  onClick={onShopDiscovery}
                  className="inline-flex items-center space-x-2 text-[11px] sm:text-[12px] uppercase tracking-[0.2em] font-medium text-white border-b border-white/60 pb-1 hover:border-white transition-all group-hover:translate-x-1"
                >
                  <span>Shop Discovery Sets</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* High-res Image on Right */}
            <div className="absolute right-0 bottom-0 top-0 w-1/2 sm:w-7/12 overflow-hidden pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=800&q=85"
                alt="AURA Discovery Set Flacons in Velvet Box"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Tile 2: The Art of Gifting (Ivory & Grosgrain Elegance) */}
          <div 
            id="banner-gift-sets" 
            className="group relative bg-[#EFE9DF] text-[#141312] p-6 sm:p-8 lg:p-10 flex flex-col justify-between overflow-hidden shadow-sm border border-[#E0D7C8] min-h-[360px]"
          >
            {/* Background subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#EFE9DF] via-[#EFE9DF]/80 to-transparent z-10 pointer-events-none" />

            {/* Content Left */}
            <div className="relative z-20 max-w-xs space-y-3">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#7A7163] font-medium block">
                The Art of Gifting
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#141312] font-normal leading-tight">
                Gifts that speak <br />
                elegance.
              </h3>
              <p className="text-[#595246] text-xs sm:text-sm font-light leading-relaxed">
                Handcrafted linen coffers bound in black grosgrain ribbon with personalized calligraphy gift cards.
              </p>
              <div className="pt-2">
                <button
                  id="promo-shop-gifts-btn"
                  onClick={onShopGifts}
                  className="inline-flex items-center space-x-2 text-[11px] sm:text-[12px] uppercase tracking-[0.2em] font-medium text-[#141312] border-b border-[#141312]/60 pb-1 hover:border-[#141312] transition-all group-hover:translate-x-1"
                >
                  <span>Shop Gift Sets</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* High-res Image on Right */}
            <div className="absolute right-0 bottom-0 top-0 w-1/2 sm:w-7/12 overflow-hidden pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=85"
                alt="AURA Luxury Gifting Coffer"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
