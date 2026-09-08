import React from 'react';
import { ArrowLeft, Sparkles, Gem, Compass, Leaf } from 'lucide-react';

interface AboutPageProps {
  onBackToShop: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBackToShop }) => {
  return (
    <div id="aura-about-page" className="w-full bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Top Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#8C8476] font-semibold block">
            Haute Parfumerie Since Inception
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#141312] font-normal leading-tight">
            The Philosophy of <br />
            <span className="italic font-light">Intimate Resonance.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#5E574D] font-light leading-relaxed">
            AURA was conceived not to broadcast scent into a room, but to sculpt an indelible second skin—a fragrant presence that only those who enter your personal sphere will ever truly know.
          </p>
        </div>

        {/* Big Editorial Image */}
        <div className="relative aspect-[16/9] bg-[#EBE3D5] overflow-hidden border border-[#DDD3C4] shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1600&q=85"
            alt="AURA Fragrance Formulation Laboratory"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 text-white max-w-md">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#E0D7C9]">Grasse & Florence</span>
            <p className="font-serif text-xl sm:text-2xl mt-1">Master Perfumers blending micro-batches by hand.</p>
          </div>
        </div>

        {/* 3 Pillar Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <div className="bg-white p-6 border border-[#ECE4D8] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#8A6724]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-[#141312] font-semibold">28% Extrait Concentration</h3>
            <p className="text-xs text-[#635B4F] leading-relaxed font-light">
              While conventional commercial eau de parfum lingers at 12–15%, AURA hand-pours every flacon at a concentrated 28% Extrait de Parfum strength, delivering a richer and more intimate drydown.
            </p>
          </div>

          <div className="bg-white p-6 border border-[#ECE4D8] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#8A6724]">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-[#141312] font-semibold">Rare Botanical Absolutes</h3>
            <p className="text-xs text-[#635B4F] leading-relaxed font-light">
              From dawn-harvested Damask rose petals in Isparta to cold-pressed Calabrian bergamot and wild harvested Moroccan cedarwood, our ingredients are traceable directly to individual family terroirs.
            </p>
          </div>

          <div className="bg-white p-6 border border-[#ECE4D8] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#8A6724]">
              <Gem className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-[#141312] font-semibold">Architectural Flacons</h3>
            <p className="text-xs text-[#635B4F] leading-relaxed font-light">
              Crafted from ultra-pure optical glass with custom-weighted caps, magnetic closures, and precision atomizers engineered to produce a micro-fine ambient mist.
            </p>
          </div>
        </div>

        {/* Sustainability commitment */}
        <div className="bg-[#F4EFE6] border border-[#E2D8C7] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center space-x-2 text-[#4D6346] text-xs uppercase tracking-wider font-semibold">
              <Leaf className="w-4 h-4" />
              <span>Ethical Luxury Commitment</span>
            </div>
            <h4 className="font-serif text-2xl text-[#141312]">100% Vegan, Cruelty-Free & Refillable</h4>
            <p className="text-xs text-[#595246] font-light leading-relaxed">
              We never test on animals. All paper packaging is FSC-certified virgin cotton paper with zero plastic film wrapping, bound only by pure grosgrain ribbon.
            </p>
          </div>
          <button
            onClick={onBackToShop}
            className="shrink-0 bg-[#141312] text-white px-7 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#2B2824] transition-colors"
          >
            Explore The Fragrances
          </button>
        </div>

      </div>
    </div>
  );
};
