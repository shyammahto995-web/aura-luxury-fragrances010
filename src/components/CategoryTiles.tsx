import React from 'react';
import { Sparkles, Compass, Gem, Gift, Droplets, Layers } from 'lucide-react';

interface CategoryTilesProps {
  onSelectCategory: (category: string) => void;
}

export const CategoryTiles: React.FC<CategoryTilesProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'women',
      name: "Women's Perfumes",
      categoryKey: 'Women',
      icon: Sparkles,
      desc: 'Solar florals & soft ambers'
    },
    {
      id: 'men',
      name: "Men's Perfumes",
      categoryKey: 'Men',
      icon: Compass,
      desc: 'Dark woods & cured leathers'
    },
    {
      id: 'unisex',
      name: 'Unisex Fragrances',
      categoryKey: 'Unisex',
      icon: Gem,
      desc: 'Boundary-free olfactory art'
    },
    {
      id: 'gift-sets',
      name: 'Gift Sets & Coffers',
      categoryKey: 'Gift Sets',
      icon: Gift,
      desc: 'Linen presentation gift boxes'
    },
    {
      id: 'perfume-oils',
      name: 'Perfume Oils & Rollers',
      categoryKey: 'Perfume Oils',
      icon: Droplets,
      desc: 'Pure alcohol-free elixirs'
    },
    {
      id: 'discovery-sets',
      name: 'Discovery Sets',
      categoryKey: 'Discovery Sets',
      icon: Layers,
      desc: 'Miniature flacon wardrobes'
    }
  ];

  return (
    <section id="aura-category-tiles-section" className="w-full bg-[#FAF8F5] py-8 sm:py-12 border-b border-[#EAE3D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                id={`cat-tile-${cat.id}`}
                onClick={() => onSelectCategory(cat.categoryKey)}
                className="group flex flex-col items-center justify-center p-5 bg-[#FCFAF7] border border-[#E9E2D5] rounded-none hover:border-[#141312] hover:bg-white hover:shadow-md transition-all duration-300 text-center cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#F4EFE6] flex items-center justify-center text-[#4A443A] group-hover:bg-[#141312] group-hover:text-[#FAF8F5] transition-colors mb-3">
                  <Icon className="w-4 h-4 stroke-[1.5]" />
                </div>
                <h3 className="text-[11px] sm:text-[12px] uppercase tracking-[0.16em] font-semibold text-[#1F1D1A] group-hover:text-black transition-colors leading-tight">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-[#787166] mt-1 font-light hidden sm:block">
                  {cat.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
