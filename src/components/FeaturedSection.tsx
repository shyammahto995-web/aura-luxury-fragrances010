import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface FeaturedSectionProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onViewAll: () => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  products,
  onSelectProduct,
  onViewAll
}) => {
  // Select top featured or best-selling fragrances
  const featuredProducts = products.filter(p => p.featured || p.bestSeller).slice(0, 5);

  return (
    <section id="aura-featured-fragrances" className="w-full bg-[#FAF8F5] py-12 sm:py-16 md:py-20 border-b border-[#EAE3D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 pb-4 border-b border-[#ECE5D8] gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#7A7265] font-medium block mb-1">
              Curated Selection
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#141312] font-normal tracking-tight">
              Featured Fragrances
            </h2>
          </div>

          <button
            id="view-all-fragrances-link"
            onClick={onViewAll}
            className="group inline-flex items-center space-x-2 text-[12px] uppercase tracking-[0.2em] font-medium text-[#1F1D1A] hover:text-[#7A6028] transition-colors self-start sm:self-auto"
          >
            <span>View All Fragrances</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* 5-Column Responsive Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
