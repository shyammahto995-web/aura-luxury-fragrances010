import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        const notes = [...(p.topNotes || []), ...(p.heartNotes || []), ...(p.baseNotes || [])].join(' ').toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.collection.toLowerCase().includes(q) ||
          p.fragranceFamily.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          notes.includes(q)
        );
      }).slice(0, 6)
    : [];

  const suggestedQueries = ['Damask Rose', 'Oud', 'Solar Radiance', 'Vanilla', 'Discovery', 'Nocturne'];

  return (
    <div id="aura-search-modal" className="fixed inset-0 z-50 flex flex-col justify-start">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Search Header Container */}
      <div className="relative z-10 w-full bg-[#FAF8F5] border-b border-[#E0D7C9] shadow-2xl animate-in slide-in-from-top duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          
          {/* Input Header */}
          <div className="flex items-center justify-between border-b border-[#141312] pb-3">
            <div className="flex items-center flex-1 space-x-3">
              <Search className="w-5 h-5 text-[#141312]" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by perfume name, accord (rose, oud, amber), or collection..."
                className="w-full bg-transparent text-base sm:text-lg text-[#141312] placeholder-[#8A8173] focus:outline-none font-serif"
              />
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#544E43] hover:text-black transition-colors"
              aria-label="Close search"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </button>
          </div>

          {/* Quick Suggestions when empty */}
          {!query.trim() && (
            <div className="pt-5 space-y-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C8476] font-semibold block">
                Popular Olfactory Inquiries
              </span>
              <div className="flex flex-wrap gap-2">
                {suggestedQueries.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="text-xs bg-[#F2ECE1] text-[#3D3830] hover:bg-[#141312] hover:text-white px-3 py-1.5 transition-colors border border-[#DDD3C4]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {query.trim() && (
            <div className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C8476] font-semibold">
                  Fragrances Found ({results.length})
                </span>
              </div>

              {results.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#70685D] font-light">
                  No scents found for &ldquo;{query}&rdquo;. Try exploring our floral or woody collections.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto pb-4">
                  {results.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        onSelectProduct(product);
                        onClose();
                      }}
                      className="flex items-center space-x-3 p-3 bg-[#FCFAF7] border border-[#ECE5D8] hover:border-[#141312] transition-colors cursor-pointer group"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-14 h-16 object-contain bg-[#F2ECE1] border border-[#DDD3C4] p-1"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] uppercase tracking-wider text-[#8A8174] block">
                          {product.collection}
                        </span>
                        <h4 className="font-serif text-sm text-[#141312] font-semibold truncate group-hover:text-[#8A6724] transition-colors">
                          {product.name}
                        </h4>
                        <span className="text-xs font-semibold text-[#141312]">
                          ₹{product.price.toFixed(2)}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#A89F90] group-hover:text-[#141312] group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
