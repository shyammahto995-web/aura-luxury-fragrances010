import React from 'react';
import { ArrowRight, Sparkles, Clock, PackageCheck, HeartHandshake } from 'lucide-react';

interface HeroProps {
  onExplore: () => void;
  onShopAll: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onShopAll }) => {
  return (
    <section id="aura-hero-section" className="relative w-full bg-[#FAF7F2] border-b border-[#EAE3D6] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Actions (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left space-y-6 z-10">
            <div className="inline-flex items-center space-x-2">
              <span className="w-6 h-[1px] bg-[#968E82]" />
              <span className="text-[11px] sm:text-[12px] uppercase tracking-[0.25em] text-[#6D665B] font-medium">
                Crafted for Moments
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#141312] leading-[1.12] tracking-tight font-normal">
              Scents that <br className="hidden sm:inline" />
              <span className="italic font-light">become part</span> <br />
              of you.
            </h1>

            <p className="text-[#595349] text-sm sm:text-base leading-relaxed max-w-md font-light">
              Luxury fragrances, thoughtfully handcrafted with rare natural botanicals, aged ambers, and sustainable resins gathered from the world&apos;s most storied terroirs.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                id="hero-primary-cta"
                onClick={onExplore}
                className="inline-flex items-center justify-center space-x-3 bg-[#141312] text-white hover:bg-[#2B2824] px-7 py-3.5 text-[12px] uppercase tracking-[0.2em] font-medium transition-all shadow-sm hover:shadow active:scale-[0.99]"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-secondary-cta"
                onClick={onShopAll}
                className="inline-flex items-center justify-center border border-[#CEC5B8] bg-transparent text-[#2B2824] hover:bg-[#F2ECE2] px-6 py-3.5 text-[12px] uppercase tracking-[0.2em] font-medium transition-colors"
              >
                <span>Shop Fragrances</span>
              </button>
            </div>

            {/* Micro quote */}
            <div className="pt-4 border-t border-[#E8E0D2] flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#B29255]" />
              <p className="text-[12px] italic text-[#787063]">
                &ldquo;Every formulation is a personal signature that lingers like an unforgettable memory.&rdquo;
              </p>
            </div>
          </div>

          {/* Center Column: Hero Product Composition Image (5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full max-w-[480px] aspect-[4/5] overflow-hidden rounded-sm bg-[#F0EAE1] shadow-2xl border border-[#E5DDD0]">
              <img
                src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85"
                alt="AURA Haute Parfumerie Flacon Composition"
                className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                loading="eager"
              />
              
              {/* Subtle Gradient Overlay for Editorial Depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

              {/* Minimalist Floating Label on Image */}
              <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-md px-4 py-2.5 shadow-md border border-[#EFE9E0]">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#857B6D] font-medium">Iconic Edition</p>
                <p className="font-serif text-[15px] text-[#141312] font-semibold">Élan Extrait de Parfum</p>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Minimal Craft Badges (2 cols) */}
          <div className="lg:col-span-2 flex flex-col justify-center space-y-6 lg:border-l lg:border-[#E8DFD0] lg:pl-6">
            <div className="flex items-start space-x-3.5 group">
              <div className="w-8 h-8 rounded-full bg-[#EFE9DE] flex items-center justify-center text-[#544D42] shrink-0 group-hover:bg-[#E5DCCE] transition-colors">
                <Sparkles className="w-4 h-4 stroke-[1.5]" />
              </div>
              <div>
                <h2 className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#1F1D1A]">Finest Ingredients</h2>
                <p className="text-[11px] text-[#70685C] leading-snug mt-0.5">Rare natural absolutes from Grasse & Florence</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 group">
              <div className="w-8 h-8 rounded-full bg-[#EFE9DE] flex items-center justify-center text-[#544D42] shrink-0 group-hover:bg-[#E5DCCE] transition-colors">
                <Clock className="w-4 h-4 stroke-[1.5]" />
              </div>
              <div>
                <h2 className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#1F1D1A]">Long Lasting Scents</h2>
                <p className="text-[11px] text-[#70685C] leading-snug mt-0.5">25–30% concentrated extrait formulations</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 group">
              <div className="w-8 h-8 rounded-full bg-[#EFE9DE] flex items-center justify-center text-[#544D42] shrink-0 group-hover:bg-[#E5DCCE] transition-colors">
                <PackageCheck className="w-4 h-4 stroke-[1.5]" />
              </div>
              <div>
                <h2 className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#1F1D1A]">Elegant Packaging</h2>
                <p className="text-[11px] text-[#70685C] leading-snug mt-0.5">Handcrafted crystal with magnetic closures</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 group">
              <div className="w-8 h-8 rounded-full bg-[#EFE9DE] flex items-center justify-center text-[#544D42] shrink-0 group-hover:bg-[#E5DCCE] transition-colors">
                <HeartHandshake className="w-4 h-4 stroke-[1.5]" />
              </div>
              <div>
                <h2 className="text-[11px] uppercase tracking-[0.16em] font-semibold text-[#1F1D1A]">Made With Passion</h2>
                <p className="text-[11px] text-[#70685C] leading-snug mt-0.5">Bottled in limited, serialized micro-batches</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
