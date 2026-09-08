import React from 'react';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';

interface JournalPageProps {
  onSelectCategory: (cat: string) => void;
}

export const JournalPage: React.FC<JournalPageProps> = ({ onSelectCategory }) => {
  const articles = [
    {
      id: 'rose-harvest',
      title: 'Dawn in Isparta: Harvesting Damask Roses Before the Sun Rises',
      category: 'Sourcing & Terroir',
      readTime: '4 min read',
      date: 'May 24, 2026',
      image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=85',
      snippet: 'Why thirty thousand rose petals gathered by hand between 5:00 AM and 7:30 AM are required to produce a single ounce of AURA absolute oil.'
    },
    {
      id: 'sillage-layering',
      title: 'The Architecture of Sillage: How to Wear Fragrance for 14 Hours',
      category: 'Olfactory Guide',
      readTime: '6 min read',
      date: 'April 12, 2026',
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=85',
      snippet: 'Pulse points are only the beginning. Discover the subtle interplay between pure perfume oils, moisture barriers, and wool cashmere fibers.'
    },
    {
      id: 'amber-resins',
      title: 'Aged Resins: The Mystery of Somali Frankincense and Baltic Amber',
      category: 'Ingredient Spotlight',
      readTime: '5 min read',
      date: 'March 08, 2026',
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=85',
      snippet: 'Exploring the crystalline tear droplets secreted by ancient desert trees and how they lend timeless golden warmth to AURA formulations.'
    }
  ];

  return (
    <div id="aura-journal-page" className="w-full bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="border-b border-[#EAE3D6] pb-8">
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#8C8476] font-semibold block mb-2">
            The AURA Gazette
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#141312] font-normal">
            Olfactory Journal & Notes
          </h1>
          <p className="text-sm text-[#615A4F] font-light mt-2 max-w-xl">
            Essays on raw botanical harvests, ancient extraction techniques, and the art of wearing scent with intention.
          </p>
        </div>

        {/* Featured Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <article 
              key={art.id} 
              className="bg-white border border-[#ECE4D8] overflow-hidden group hover:border-[#141312] transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] bg-[#F2ECE1] overflow-hidden">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#8A8174]">
                    <span>{art.category}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {art.readTime}</span>
                  </div>
                  <h3 className="font-serif text-xl text-[#141312] font-medium leading-snug group-hover:text-[#8A6724] transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-xs text-[#635B4F] leading-relaxed font-light">
                    {art.snippet}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-[#F2ECE1]">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#141312] group-hover:text-[#8A6724] flex items-center gap-1.5 transition-colors">
                  Read Full Chronicle <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
};
