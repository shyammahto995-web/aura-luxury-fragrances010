import React from 'react';
import { ArrowRight } from 'lucide-react';

interface BrandStoryProps {
  onLearnMore: () => void;
}

export const BrandStory: React.FC<BrandStoryProps> = ({ onLearnMore }) => {
  return (
    <section id="aura-brand-story-section" className="w-full bg-[#F5EFE6] py-16 sm:py-24 border-b border-[#E5DDD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Image composition on left (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] rounded-none overflow-hidden border border-[#DED4C5] shadow-xl bg-[#EBE3D5]">
              <img
                src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=85"
                alt="Artisanal Fragrance Formulations at AURA House"
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
            
            {/* Small offset caption box */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 bg-[#141312] text-white p-6 max-w-[240px] shadow-2xl border border-[#2B2926]">
              <p className="font-serif text-lg leading-tight font-normal text-[#E8E2D6]">Grasse, France & Florence, Italy</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#9E9588] mt-1 font-medium">Artisanal Distillation</p>
            </div>
          </div>

          {/* Narrative copy on right (7 cols) */}
          <div className="lg:col-span-7 space-y-6 lg:pl-6">
            <div className="inline-flex items-center space-x-2">
              <span className="w-6 h-[1px] bg-[#8A8173]" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#665F53] font-medium">
                The House of AURA
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#141312] font-normal leading-tight">
              Where memory, botanical rarity, and architectural sculpture unite.
            </h2>

            <p className="text-sm sm:text-base text-[#524B40] leading-relaxed font-light">
              Founded on the belief that a fragrance should never precede you loudly, but linger as an indelible intimate aura. We harvest exceptional raw absolutes—from dawn-picked Damask rose petals in Isparta to aged cedarwood heartwood in Morocco.
            </p>

            <p className="text-sm sm:text-base text-[#524B40] leading-relaxed font-light">
              Each flacon is individually weighed, hand-poured in small numbered batches, and matured for four to six months to allow the resins and essential oils to harmonize into a rich, long-lasting sillage.
            </p>

            <div className="pt-2">
              <button
                id="brand-story-read-more-btn"
                onClick={onLearnMore}
                className="inline-flex items-center space-x-2 text-[12px] uppercase tracking-[0.2em] font-medium text-[#141312] border-b-2 border-[#141312] pb-1 hover:text-[#7A6028] hover:border-[#7A6028] transition-colors"
              >
                <span>Discover Our Heritage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
