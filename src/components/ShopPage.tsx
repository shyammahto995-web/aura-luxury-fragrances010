import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, X, ArrowUpDown, Search, RotateCcw } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ShopPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  initialCategory?: string;
  initialFilter?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  onSelectProduct,
  initialCategory,
  initialFilter
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedCollection, setSelectedCollection] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [selectedFamily, setSelectedFamily] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<string>('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState<string>(
    initialFilter === 'best-sellers' ? 'best-selling' : 'featured'
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Available unique lists
  const categories = ['All', 'Women', 'Men', 'Unisex', 'Gift Sets', 'Perfume Oils', 'Discovery Sets'];
  const collections = ['All', 'Artisanal Heritage', 'Midnight Nocturne', 'Solar Radiance', 'Private Reserve'];
  const families = ['All', 'Woody', 'Floral', 'Amber', 'Citrus', 'Oriental', 'Gourmand'];
  const genders = ['All', 'Women', 'Men', 'Unisex'];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const notes = [...(product.topNotes || []), ...(product.heartNotes || []), ...(product.baseNotes || [])].join(' ').toLowerCase();
        const matches =
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          product.shortDescription.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.collection.toLowerCase().includes(q) ||
          product.fragranceFamily.toLowerCase().includes(q) ||
          notes.includes(q);
        if (!matches) return false;
      }

      // Category
      if (selectedCategory !== 'All' && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Collection
      if (selectedCollection !== 'All' && product.collection !== selectedCollection) {
        return false;
      }

      // Gender
      if (selectedGender !== 'All') {
        if (selectedGender === 'Unisex' && product.gender !== 'Unisex') return false;
        if (selectedGender !== 'Unisex' && product.gender !== selectedGender && product.gender !== 'Unisex') {
          return false;
        }
      }

      // Fragrance Family
      if (selectedFamily !== 'All' && product.fragranceFamily !== selectedFamily) {
        return false;
      }

      // Stock
      if (inStockOnly && product.stock <= 0) {
        return false;
      }

      // Price Range
      if (priceRange === 'under-100' && product.price >= 100) return false;
      if (priceRange === '100-150' && (product.price < 100 || product.price > 150)) return false;
      if (priceRange === 'over-150' && product.price <= 150) return false;

      return true;
    }).sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'best-selling':
          return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
        case 'featured':
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedCollection,
    selectedGender,
    selectedFamily,
    priceRange,
    inStockOnly,
    sortOption
  ]);

  const activeFilterCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedCollection !== 'All' ? 1 : 0) +
    (selectedGender !== 'All' ? 1 : 0) +
    (selectedFamily !== 'All' ? 1 : 0) +
    (priceRange !== 'All' ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const resetAllFilters = () => {
    setSelectedCategory('All');
    setSelectedCollection('All');
    setSelectedGender('All');
    setSelectedFamily('All');
    setPriceRange('All');
    setInStockOnly(false);
    setSearchQuery('');
    setSortOption('featured');
  };

  return (
    <div id="aura-shop-page" className="w-full bg-[#FAF8F5] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title & Breadcrumbs */}
        <div className="mb-8 border-b border-[#EAE3D6] pb-6">
          <div className="flex items-center space-x-2 text-[11px] uppercase tracking-[0.2em] text-[#8C8476] mb-2 font-medium">
            <span>Home</span>
            <span>/</span>
            <span className="text-[#141312]">Haute Parfumerie Catalog</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#141312] font-normal tracking-tight">
            The Fragrance Collection
          </h1>
          <p className="text-sm text-[#665F52] mt-2 max-w-2xl font-light">
            Discover artisanal formulations crafted with rare natural absolutes, resinous woods, and intoxicating floral extracts.
          </p>
        </div>

        {/* Filter & Sort Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FCFAF7] border border-[#ECE5D8] p-4 mb-8">
          
          {/* Search Field */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8173]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by note, collection, name..."
              className="w-full bg-[#FAF8F5] border border-[#E0D7C9] pl-9 pr-8 py-2 text-xs sm:text-sm text-[#141312] placeholder-[#8A8173] focus:outline-none focus:border-[#141312] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A8173] hover:text-black"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Action: Mobile Toggle + Sort Dropdown */}
          <div className="flex items-center justify-between md:justify-end gap-3">
            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center space-x-2 px-4 py-2 border border-[#DDD3C4] text-xs uppercase tracking-wider font-medium text-[#2B2926] bg-white"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters ({activeFilterCount})</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider text-[#7A7265] hidden sm:inline font-medium">Sort:</span>
              <div className="relative inline-block">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-white border border-[#DDD3C4] px-3 py-2 text-xs uppercase tracking-wider font-medium text-[#141312] focus:outline-none focus:border-[#141312] cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="best-selling">Best Selling</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest Releases</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* Active Filter Badges */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
            <span className="text-[#857B6D] font-medium mr-1 uppercase tracking-wider text-[10px]">Active Filters:</span>
            {selectedCategory !== 'All' && (
              <span className="bg-[#F0EBE1] text-[#2E2A25] px-2.5 py-1 flex items-center gap-1 border border-[#DDD3C4]">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('All')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedCollection !== 'All' && (
              <span className="bg-[#F0EBE1] text-[#2E2A25] px-2.5 py-1 flex items-center gap-1 border border-[#DDD3C4]">
                Collection: {selectedCollection}
                <button onClick={() => setSelectedCollection('All')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedFamily !== 'All' && (
              <span className="bg-[#F0EBE1] text-[#2E2A25] px-2.5 py-1 flex items-center gap-1 border border-[#DDD3C4]">
                Family: {selectedFamily}
                <button onClick={() => setSelectedFamily('All')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedGender !== 'All' && (
              <span className="bg-[#F0EBE1] text-[#2E2A25] px-2.5 py-1 flex items-center gap-1 border border-[#DDD3C4]">
                Gender: {selectedGender}
                <button onClick={() => setSelectedGender('All')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {priceRange !== 'All' && (
              <span className="bg-[#F0EBE1] text-[#2E2A25] px-2.5 py-1 flex items-center gap-1 border border-[#DDD3C4]">
                Price: {priceRange}
                <button onClick={() => setPriceRange('All')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {inStockOnly && (
              <span className="bg-[#F0EBE1] text-[#2E2A25] px-2.5 py-1 flex items-center gap-1 border border-[#DDD3C4]">
                In Stock Only
                <button onClick={() => setInStockOnly(false)}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button
              onClick={resetAllFilters}
              className="text-[#96681E] hover:underline font-medium ml-2 flex items-center gap-1 uppercase tracking-wider text-[10px]"
            >
              <RotateCcw className="w-3 h-3" /> Clear All
            </button>
          </div>
        )}

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Filters Sidebar (1 col) */}
          <aside className="hidden lg:block space-y-6 bg-[#FCFAF7] p-5 border border-[#ECE5D8]">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D6]">
              <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#141312]">
                Filter Fragrances
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetAllFilters}
                  className="text-[10px] uppercase tracking-wider text-[#9E9588] hover:text-[#141312]"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#736B5E] mb-2.5">
                Category
              </h4>
              <div className="space-y-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left text-xs py-1 px-2 transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#141312] text-white font-medium'
                        : 'text-[#4A453D] hover:text-black hover:bg-[#F2ECE1]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Fragrance Family */}
            <div className="pt-4 border-t border-[#EAE3D6]">
              <h4 className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#736B5E] mb-2.5">
                Olfactory Family
              </h4>
              <div className="space-y-1.5">
                {families.map((fam) => (
                  <button
                    key={fam}
                    onClick={() => setSelectedFamily(fam)}
                    className={`block w-full text-left text-xs py-1 px-2 transition-colors ${
                      selectedFamily === fam
                        ? 'bg-[#141312] text-white font-medium'
                        : 'text-[#4A453D] hover:text-black hover:bg-[#F2ECE1]'
                    }`}
                  >
                    {fam}
                  </button>
                ))}
              </div>
            </div>

            {/* Collection */}
            <div className="pt-4 border-t border-[#EAE3D6]">
              <h4 className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#736B5E] mb-2.5">
                Collection
              </h4>
              <div className="space-y-1.5">
                {collections.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedCollection(col)}
                    className={`block w-full text-left text-xs py-1 px-2 transition-colors ${
                      selectedCollection === col
                        ? 'bg-[#141312] text-white font-medium'
                        : 'text-[#4A453D] hover:text-black hover:bg-[#F2ECE1]'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div className="pt-4 border-t border-[#EAE3D6]">
              <h4 className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#736B5E] mb-2.5">
                Gender Expression
              </h4>
              <div className="space-y-1.5">
                {genders.map((gen) => (
                  <button
                    key={gen}
                    onClick={() => setSelectedGender(gen)}
                    className={`block w-full text-left text-xs py-1 px-2 transition-colors ${
                      selectedGender === gen
                        ? 'bg-[#141312] text-white font-medium'
                        : 'text-[#4A453D] hover:text-black hover:bg-[#F2ECE1]'
                    }`}
                  >
                    {gen}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="pt-4 border-t border-[#EAE3D6]">
              <h4 className="text-[11px] uppercase tracking-[0.15em] font-medium text-[#736B5E] mb-2.5">
                Price
              </h4>
              <div className="space-y-1.5 text-xs text-[#4A453D]">
                <label className="flex items-center space-x-2 cursor-pointer py-0.5">
                  <input
                    type="radio"
                    name="price"
                    checked={priceRange === 'All'}
                    onChange={() => setPriceRange('All')}
                    className="accent-[#141312]"
                  />
                  <span>All Prices</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer py-0.5">
                  <input
                    type="radio"
                    name="price"
                    checked={priceRange === 'under-100'}
                    onChange={() => setPriceRange('under-100')}
                    className="accent-[#141312]"
                  />
                  <span>Under ₹100</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer py-0.5">
                  <input
                    type="radio"
                    name="price"
                    checked={priceRange === '100-150'}
                    onChange={() => setPriceRange('100-150')}
                    className="accent-[#141312]"
                  />
                  <span>₹100 – ₹150</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer py-0.5">
                  <input
                    type="radio"
                    name="price"
                    checked={priceRange === 'over-150'}
                    onChange={() => setPriceRange('over-150')}
                    className="accent-[#141312]"
                  />
                  <span>Over ₹150</span>
                </label>
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="pt-4 border-t border-[#EAE3D6]">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#141312] w-4 h-4 rounded-none"
                />
                <span className="text-xs font-medium text-[#2E2A25]">In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid (3 cols) */}
          <main className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4 text-xs text-[#7A7366]">
              <span>Showing {filteredProducts.length} of {products.length} fragrances</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-[#FCFAF7] border border-[#EAE3D6] p-12 text-center space-y-4">
                <p className="font-serif text-2xl text-[#141312]">No fragrances matched your selection</p>
                <p className="text-xs text-[#70695D] max-w-sm mx-auto font-light">
                  Try adjusting your filters, clearing search criteria, or exploring our iconic best sellers.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="inline-flex items-center space-x-2 bg-[#141312] text-white px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={onSelectProduct}
                  />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative ml-auto w-full max-w-xs bg-[#FAF8F5] h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD0]">
                <h3 className="font-serif text-lg text-[#141312]">Refine Selection</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1 text-[#4A453D]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category */}
              <div>
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#141312] mb-2">Category</h4>
                <div className="space-y-1">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCategory(c)}
                      className={`block w-full text-left text-xs py-1.5 px-2 ${
                        selectedCategory === c ? 'bg-[#141312] text-white' : 'text-[#4A453D]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Family */}
              <div className="pt-3 border-t border-[#EAE3D6]">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#141312] mb-2">Fragrance Family</h4>
                <div className="space-y-1">
                  {families.map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFamily(f)}
                      className={`block w-full text-left text-xs py-1.5 px-2 ${
                        selectedFamily === f ? 'bg-[#141312] text-white' : 'text-[#4A453D]'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock */}
              <div className="pt-3 border-t border-[#EAE3D6]">
                <label className="flex items-center space-x-2 text-xs">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-[#141312]"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-[#EAE3D6] space-y-2">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-[#141312] text-white py-3 text-xs uppercase tracking-widest font-semibold"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              <button
                onClick={resetAllFilters}
                className="w-full text-center text-xs text-[#7A7265] py-2 uppercase tracking-wider"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
