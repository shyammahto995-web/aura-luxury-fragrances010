import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Check, 
  Minus, 
  Plus, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Share2,
  Heart
} from 'lucide-react';
import { Product, ProductVariation } from '../types';
import { useCart } from '../context/CartContext';
import { ProductCard } from './ProductCard';
import { ShareProductModal } from './ShareProductModal';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onDirectCheckout: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onBack,
  onSelectProduct,
  onDirectCheckout
}) => {
  const { addToCart, buyNow } = useCart();

  // Selected variation state - defaults to first variation if product has variations
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>(
    product.variations && product.variations.length > 0 ? product.variations[0] : undefined
  );

  // Selected size state - defaults to first size option
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizeOptions && product.sizeOptions.length > 0 ? product.sizeOptions[0] : '50ml / 1.7 fl oz'
  );

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedToast, setAddedToast] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [variationError, setVariationError] = useState<string | null>(null);

  // Accordion open states
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    notes: true,
    craftsmanship: false,
    shipping: false,
    ingredients: false
  });

  // Whenever product changes or selected variation changes, update gallery
  useEffect(() => {
    if (product.variations && product.variations.length > 0) {
      setSelectedVariation(product.variations[0]);
    } else {
      setSelectedVariation(undefined);
    }
    if (product.sizeOptions && product.sizeOptions.length > 0) {
      setSelectedSize(product.sizeOptions[0]);
    }
    setQuantity(1);
    setActiveImageIndex(0);
    setVariationError(null);
  }, [product]);

  // When variation changes, reset active image index to 0
  const handleVariationSelect = (variation: ProductVariation) => {
    setSelectedVariation(variation);
    setVariationError(null);
    setActiveImageIndex(0);
    // Reset quantity if it exceeds variation stock
    if (quantity > variation.stock) {
      setQuantity(Math.max(1, variation.stock));
    }
  };

  // Determine current active gallery:
  // If variation has its own gallery or main image, use those!
  const currentGallery: string[] = React.useMemo(() => {
    const allProductImages = [
      ...(product.primaryImage ? [product.primaryImage] : []),
      ...(product.productImages || []),
      ...(product.images || [])
    ].filter((img, idx, arr) => img && !img.includes('kommodo.ai') && arr.indexOf(img) === idx);

    if (selectedVariation) {
      if (selectedVariation.gallery && selectedVariation.gallery.length > 0) {
        const validGal = selectedVariation.gallery.filter(img => img && !img.includes('kommodo.ai'));
        if (validGal.length > 0) return validGal;
      }
      if (selectedVariation.image && !selectedVariation.image.includes('kommodo.ai') && selectedVariation.image.trim() !== '') {
        return [selectedVariation.image, ...allProductImages.filter(img => img !== selectedVariation.image)];
      }
    }
    return allProductImages.length > 0 
      ? allProductImages 
      : ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=85'];
  }, [selectedVariation, product]);

  const activeImage = currentGallery[activeImageIndex] || currentGallery[0];

  // Pricing
  const currentPrice = selectedVariation?.price !== undefined && selectedVariation.price > 0
    ? selectedVariation.price
    : product.price;

  const currentCompareAt = selectedVariation?.compareAtPrice || product.compareAtPrice;

  // Stock
  const currentStock = selectedVariation?.stock !== undefined ? selectedVariation.stock : product.stock;
  const isOutOfStock = currentStock <= 0;
  const currentSKU = selectedVariation?.sku || product.sku;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    if (product.variations && product.variations.length > 0 && !selectedVariation) {
      setVariationError('Please select a flacon edition/color before adding to bag.');
      return;
    }
    setVariationError(null);
    const success = addToCart(product, selectedVariation, selectedSize, quantity);
    if (success) {
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2500);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    if (product.variations && product.variations.length > 0 && !selectedVariation) {
      setVariationError('Please select a flacon edition/color before continuing.');
      return;
    }
    setVariationError(null);
    const success = buyNow(product, selectedVariation, selectedSize, quantity);
    if (success) {
      onDirectCheckout();
    }
  };

  const toggleAccordion = (key: string) => {
    setOpenAccordions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Related products
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.fragranceFamily === product.fragranceFamily))
    .slice(0, 4);

  return (
    <div id="aura-product-detail-page" className="w-full bg-[#FAF8F5] min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#EAE3D6]">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-[0.2em] font-medium text-[#4A453D] hover:text-black transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Catalog</span>
          </button>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setWishlist(!wishlist)}
              className={`p-2 rounded-full border transition-colors ${
                wishlist 
                  ? 'border-red-300 text-red-600 bg-red-50' 
                  : 'border-[#DDD3C4] text-[#696155] hover:text-black hover:border-black'
              }`}
              title="Add to wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlist ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="p-2 rounded-full border border-[#DDD3C4] text-[#696155] hover:text-black hover:border-black transition-colors"
              title="Share fragrance"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Product Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pb-16">
          
          {/* Left Column: Image Gallery (7 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnail Gallery (vertical on desktop) */}
            {currentGallery.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
                {currentGallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-20 sm:w-20 sm:h-24 bg-[#F2ECE1] border transition-all overflow-hidden ${
                      activeImageIndex === idx 
                        ? 'border-[#141312] ring-1 ring-[#141312]' 
                        : 'border-[#DDD3C4] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} perspective ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="relative flex-1 aspect-[4/5] bg-[#F4EFE6] border border-[#E5DDD0] shadow-md overflow-hidden flex items-center justify-center">
              <img
                src={activeImage}
                alt={`${product.name} - ${selectedVariation?.name || 'Standard Flacon'}`}
                className="w-full h-full object-contain p-6 sm:p-10 transition-all duration-500 hover:scale-105"
              />

              {/* Variation Pill overlay */}
              {selectedVariation && (
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1.5 border border-[#E8DFD0] shadow-xs flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full border border-black/20"
                    style={{ backgroundColor: selectedVariation.color }}
                  />
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[#141312]">
                    {selectedVariation.name}
                  </span>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Product Narrative & Variation Controls (5 cols) */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* Category & Collection Tag */}
            <div>
              <div className="flex items-center space-x-2 text-[11px] uppercase tracking-[0.25em] text-[#857B6D] font-medium mb-1.5">
                <span>{product.collection}</span>
                <span>·</span>
                <span>{product.category}</span>
                <span>·</span>
                <span>{product.fragranceFamily}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl text-[#141312] font-normal tracking-tight">
                {product.name}
              </h1>

              {product.tagline && (
                <p className="text-xs sm:text-sm font-light italic text-[#6B6356] mt-1">
                  &ldquo;{product.tagline}&rdquo;
                </p>
              )}
            </div>

            {/* Price and SKU Display */}
            <div className="flex items-baseline justify-between border-y border-[#EAE3D6] py-3.5">
              <div className="flex items-baseline space-x-3">
                <span className="font-serif text-2xl sm:text-3xl text-[#141312] font-medium">
                  ₹{currentPrice.toFixed(2)}
                </span>
                {currentCompareAt && currentCompareAt > currentPrice && (
                  <span className="text-base text-[#9C9487] line-through">
                    ₹{currentCompareAt.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="text-[11px] uppercase tracking-wider text-[#8A8174]">
                SKU: <span className="text-[#141312] font-medium">{currentSKU}</span>
              </div>
            </div>

            {/* Short Narrative Description */}
            <p className="text-xs sm:text-sm text-[#4F493F] leading-relaxed font-light">
              {product.description}
            </p>

            {/* ===============================================================
                CRITICAL VARIATION REQUIREMENT: COLOR / FLACON FINISH SELECTOR
               =============================================================== */}
            {product.variations && product.variations.length > 0 && (
              <div id="product-variation-selector-block" className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="uppercase tracking-[0.18em] font-semibold text-[#141312]">
                    Flacon Edition & Color:
                  </span>
                  <span className="text-[#635C52] font-medium">
                    {selectedVariation?.name}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  {product.variations.map((v) => {
                    const isSelected = selectedVariation?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        id={`variation-option-${v.id}`}
                        type="button"
                        onClick={() => handleVariationSelect(v)}
                        className={`group relative flex items-center space-x-2.5 px-3.5 py-2 border transition-all ${
                          isSelected
                            ? 'border-[#141312] bg-white ring-1 ring-[#141312] shadow-xs'
                            : 'border-[#DDD4C5] bg-[#FAF8F5] hover:border-[#8C8476]'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                          style={{ backgroundColor: v.color }}
                        />
                        <span className="text-xs uppercase tracking-wider font-medium text-[#141312]">
                          {v.name}
                        </span>
                        {v.price && v.price !== product.price && (
                          <span className="text-[10px] text-[#8A6724] font-semibold">
                            (+₹{(v.price - product.price).toFixed(0)})
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Options */}
            {product.sizeOptions && product.sizeOptions.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="uppercase tracking-[0.18em] font-semibold text-[#141312]">
                    Flacon Size:
                  </span>
                  <span className="text-[#635C52]">{selectedSize}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.sizeOptions.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 px-3 text-xs uppercase tracking-wider font-medium border text-center transition-all ${
                          isSelected
                            ? 'border-[#141312] bg-[#141312] text-white shadow-xs'
                            : 'border-[#DDD4C5] bg-white text-[#38342D] hover:border-[#8C8476]'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity and Inventory Status */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-[0.18em] font-semibold text-[#141312]">
                  Quantity:
                </span>
                <span className={`text-[11px] font-medium ${isOutOfStock ? 'text-red-600' : currentStock <= 5 ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {isOutOfStock ? 'Sold Out' : currentStock <= 8 ? `Only ${currentStock} flacons remaining` : 'In Stock & Ready to Dispatch'}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                {/* Stepper */}
                <div className="flex items-center border border-[#DDD4C5] bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-2.5 text-[#544D42] hover:text-black disabled:opacity-30"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-semibold text-[#141312]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    disabled={quantity >= currentStock || isOutOfStock}
                    className="p-2.5 text-[#544D42] hover:text-black disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal preview for multiple */}
                {quantity > 1 && (
                  <span className="text-xs text-[#7A7265]">
                    Total: <strong className="text-[#141312]">₹{(currentPrice * quantity).toFixed(2)}</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Variation Selection Error Warning */}
            {variationError && (
              <div className="p-3 bg-[#FFF5F2] border border-[#FADBD3] text-[#B8381D] text-xs font-medium">
                {variationError}
              </div>
            )}

            {/* Action Buttons: Add to Cart & Buy Now */}
            <div className="space-y-2.5 pt-2">
              <button
                id="pdp-add-to-cart-btn"
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-4 text-xs uppercase tracking-[0.25em] font-semibold transition-all shadow-sm flex items-center justify-center space-x-2 ${
                  isOutOfStock
                    ? 'bg-[#EAE4DC] text-[#968E82] cursor-not-allowed'
                    : addedToast
                    ? 'bg-[#2E7D32] text-white'
                    : 'bg-[#141312] text-white hover:bg-[#2B2824] active:scale-[0.99]'
                }`}
              >
                {addedToast ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Added to Your Collection</span>
                  </>
                ) : isOutOfStock ? (
                  <span>Sold Out</span>
                ) : (
                  <span>Add to Bag — ₹{(currentPrice * quantity).toFixed(2)}</span>
                )}
              </button>

              <button
                id="pdp-buy-now-btn"
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full py-3.5 border border-[#141312] bg-[#141312] text-white hover:bg-[#2B2824] text-xs uppercase tracking-[0.25em] font-semibold transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Value Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#EAE3D6] text-center">
              <div className="flex flex-col items-center p-2">
                <Truck className="w-4 h-4 text-[#5A5348] mb-1" />
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#141312]">Free Shipping</span>
                <span className="text-[9px] text-[#7A7366] font-light">On orders ₹75+</span>
              </div>
              <div className="flex flex-col items-center p-2">
                <Sparkles className="w-4 h-4 text-[#5A5348] mb-1" />
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#141312]">Free Samples</span>
                <span className="text-[9px] text-[#7A7366] font-light">Included in box</span>
              </div>
              <div className="flex flex-col items-center p-2">
                <RotateCcw className="w-4 h-4 text-[#5A5348] mb-1" />
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#141312]">30-Day Returns</span>
                <span className="text-[9px] text-[#7A7366] font-light">Unopened seal</span>
              </div>
            </div>

            {/* Accordion Detail Sections */}
            <div className="pt-2 divide-y divide-[#EAE3D6] border-t border-[#EAE3D6]">
              
              {/* Accordion 1: Olfactory Pyramid (Top, Heart, Base Notes) */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('notes')}
                  className="w-full py-3.5 flex items-center justify-between text-left text-xs uppercase tracking-[0.18em] font-semibold text-[#141312] hover:text-[#7A6028]"
                >
                  <span>Fragrance Notes & Pyramid</span>
                  {openAccordions.notes ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.notes && (
                  <div className="pb-4 space-y-3 text-xs text-[#524B40] font-light animate-in fade-in duration-200">
                    <div>
                      <strong className="font-semibold text-[#141312] uppercase tracking-wider text-[10px] block mb-0.5">Top Accords</strong>
                      <p>{product.topNotes?.join(', ') || 'Calabrian Bergamot, Pink Pepper'}</p>
                    </div>
                    <div>
                      <strong className="font-semibold text-[#141312] uppercase tracking-wider text-[10px] block mb-0.5">Heart Accords</strong>
                      <p>{product.heartNotes?.join(', ') || 'Damask Rose, Florentine Iris'}</p>
                    </div>
                    <div>
                      <strong className="font-semibold text-[#141312] uppercase tracking-wider text-[10px] block mb-0.5">Base Accords</strong>
                      <p>{product.baseNotes?.join(', ') || 'Cedarwood, Ambergris, Bourbon Vanilla'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Craftsmanship & Sillage */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('craftsmanship')}
                  className="w-full py-3.5 flex items-center justify-between text-left text-xs uppercase tracking-[0.18em] font-semibold text-[#141312] hover:text-[#7A6028]"
                >
                  <span>Craftsmanship & Extraction</span>
                  {openAccordions.craftsmanship ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.craftsmanship && (
                  <div className="pb-4 text-xs text-[#524B40] font-light leading-relaxed space-y-2 animate-in fade-in duration-200">
                    <p>
                      Bottled at a concentrated 28% Extrait de Parfum strength. Matured over 120 days in temperature-controlled glass carboys to allow resinous woods and volatile flower oils to merge seamlessly.
                    </p>
                    <p>
                      Projection: Radiant 6-8 feet sillage for initial 4 hours, settling into an intimate 12+ hour aura on skin and cashmere.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Shipping & Delivery */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full py-3.5 flex items-center justify-between text-left text-xs uppercase tracking-[0.18em] font-semibold text-[#141312] hover:text-[#7A6028]"
                >
                  <span>Delivery & Complimentary Samples</span>
                  {openAccordions.shipping ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.shipping && (
                  <div className="pb-4 text-xs text-[#524B40] font-light leading-relaxed space-y-2 animate-in fade-in duration-200">
                    <p>
                      Orders placed before 2:00 PM EST ship same day in our signature rigid black embossed box. Every order includes two complimentary 2ml extrait sample vials of your choice at checkout.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 4: Ingredients & Safety */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion('ingredients')}
                  className="w-full py-3.5 flex items-center justify-between text-left text-xs uppercase tracking-[0.18em] font-semibold text-[#141312] hover:text-[#7A6028]"
                >
                  <span>Ingredients & Formulation</span>
                  {openAccordions.ingredients ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.ingredients && (
                  <div className="pb-4 text-[11px] text-[#696155] font-light leading-relaxed animate-in fade-in duration-200">
                    <p>
                      Organic Cane Alcohol (Alcohol Denat.), Parfum (Fragrance), Aqua (Water), Limonene, Linalool, Citronellol, Geraniol, Coumarin, Benzyl Benzoate, Alpha-Isomethyl Ionone, Eugenol. 100% Cruelty-Free, Paraben-Free, Phthalate-Free.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Related Fragrances Section */}
        {relatedProducts.length > 0 && (
          <div className="pt-12 border-t border-[#EAE3D6]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[11px] uppercase tracking-[0.25em] text-[#857B6D] font-medium block mb-1">
                  Complimentary Accords
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#141312] font-normal">
                  You May Also Admire
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onSelect={onSelectProduct}
                  onBuyNow={(prod, varItem) => {
                    buyNow(prod, varItem, prod.sizeOptions?.[0], 1);
                    onDirectCheckout();
                  }}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Share Product Dialog */}
      <ShareProductModal
        product={product}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </div>
  );
};
