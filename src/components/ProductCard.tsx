import React, { useState } from 'react';
import { Plus, Check, Share2 } from 'lucide-react';
import { Product, ProductVariation } from '../types';
import { useCart } from '../context/CartContext';
import { ShareProductModal } from './ShareProductModal';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onBuyNow?: (product: Product, variation?: ProductVariation) => void;
  onShare?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onSelect,
  onBuyNow,
  onShare
}) => {
  const { addToCart, buyNow } = useCart();
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>(
    product.variations && product.variations.length > 0 ? product.variations[0] : undefined
  );
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Active displayed image: prioritize custom valid variation image, otherwise product primaryImage, hover secondary image, or first image
  const mainImage = product.primaryImage || (product.images && product.images.length > 0 ? product.images[0] : '');
  const hoverImage = (product.productImages && product.productImages.length > 1)
    ? product.productImages[1]
    : (product.images && product.images.length > 1 ? product.images[1] : mainImage);

  const hasValidVariationImage = Boolean(
    selectedVariation?.image &&
    !selectedVariation.image.includes('kommodo.ai') &&
    selectedVariation.image.trim() !== ''
  );

  const displayImage = hasValidVariationImage
    ? selectedVariation!.image
    : isHovered && hoverImage && hoverImage !== mainImage
      ? hoverImage
      : mainImage;

  // Active price: variation price override if available, else product price
  const displayPrice = selectedVariation?.price !== undefined && selectedVariation.price > 0
    ? selectedVariation.price
    : product.price;

  const displayCompareAt = selectedVariation?.compareAtPrice || product.compareAtPrice;
  const currentStock = selectedVariation?.stock !== undefined ? selectedVariation.stock : product.stock;
  const isOutOfStock = currentStock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    const success = addToCart(product, selectedVariation, product.sizeOptions?.[0], 1);
    if (success) {
      setAddedAnim(true);
      setTimeout(() => setAddedAnim(false), 1200);
    }
  };

  const handleBuyNowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    if (onBuyNow) {
      onBuyNow(product, selectedVariation);
    } else {
      buyNow(product, selectedVariation, product.sizeOptions?.[0], 1);
      // Trigger navigation via parent if available
      onSelect(product);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) {
      onShare(product);
    } else {
      setIsShareModalOpen(true);
    }
  };

  const handleVariationClick = (e: React.MouseEvent, variation: ProductVariation) => {
    e.stopPropagation();
    setSelectedVariation(variation);
  };

  // Format notes preview
  const notesPreview = [...(product.topNotes || []).slice(0, 1), ...(product.heartNotes || []).slice(0, 1), ...(product.baseNotes || []).slice(0, 1)]
    .map(n => n.split(' ')[0])
    .join(' · ');

  return (
    <>
      <div
        id={`product-card-${product.id}`}
        onClick={() => onSelect(product)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex flex-col bg-[#FCFAF7] border border-[#EBE3D7] hover:border-[#201E1C] hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
      >
        {/* Badges: Featured / Best Seller / Low Stock */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 pointer-events-none">
          {product.bestSeller && (
            <span className="bg-[#141312] text-white text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 font-medium">
              Best Seller
            </span>
          )}
          {!product.bestSeller && product.featured && (
            <span className="bg-[#F0EBE1] text-[#3B362F] text-[9px] uppercase tracking-[0.18em] px-2 py-0.5 font-medium border border-[#DDD3C4]">
              Featured
            </span>
          )}
          {currentStock > 0 && currentStock <= 8 && (
            <span className="bg-[#FFF3E8] text-[#8C4A19] text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 font-medium border border-[#F2D7C2]">
              Only {currentStock} left
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-[#EAE6E1] text-[#7A746B] text-[9px] uppercase tracking-[0.15em] px-2 py-0.5 font-medium">
              Sold Out
            </span>
          )}
        </div>

        {/* Top Right Actions: Share Button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            type="button"
            id={`share-btn-${product.id}`}
            onClick={handleShareClick}
            className="p-1.5 rounded-full bg-white/95 hover:bg-white text-[#575043] hover:text-[#141312] shadow-xs border border-[#E2D8C9] hover:scale-105 transition-all"
            title="Share Fragrance"
            aria-label={`Share ${product.name}`}
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Image Container with smooth aspect ratio and transition */}
        <div className="relative w-full aspect-[4/5] bg-[#F6F1EA] overflow-hidden p-6 flex items-center justify-center">
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-contain object-center transition-all duration-500 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
          />

          {/* Quick View hint on desktop hover */}
          <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <span className="bg-white/95 text-[#141312] text-[10px] uppercase tracking-[0.2em] font-medium px-4 py-1.5 shadow-sm border border-[#ECE4D8]">
              View Details
            </span>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between border-t border-[#EFE9DE] bg-[#FCFAF7]">
          <div>
            {/* Category & Family */}
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#857B6D] font-medium mb-1">
              {product.category} · {product.fragranceFamily}
            </p>

            {/* Product Name */}
            <h3 className="font-serif text-base sm:text-lg text-[#141312] font-semibold tracking-wide group-hover:text-[#4A3D2A] transition-colors leading-snug">
              {product.name}
            </h3>

            {/* Key Fragrance Notes */}
            <p className="text-[11px] text-[#696155] font-light mt-1 line-clamp-1">
              {notesPreview || product.shortDescription}
            </p>
          </div>

          {/* Variations Swatches (if available) */}
          {product.variations && product.variations.length > 1 && (
            <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-[#F2ECE1]">
              <span className="text-[9px] uppercase tracking-wider text-[#8A8174] font-medium mr-1">
                Editions:
              </span>
              <div className="flex items-center space-x-1.5">
                {product.variations.map((v) => {
                  const isSelected = selectedVariation?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      title={v.name}
                      onClick={(e) => handleVariationClick(e, v)}
                      className={`w-3.5 h-3.5 rounded-full border transition-all ${
                        isSelected 
                          ? 'ring-1 ring-offset-1 ring-[#141312] scale-110' 
                          : 'border-[#CCC3B6] hover:scale-105'
                      }`}
                      style={{ backgroundColor: v.color }}
                    />
                  );
                })}
              </div>
              {selectedVariation && (
                <span className="text-[9px] text-[#554E44] italic ml-auto truncate max-w-[80px]">
                  {selectedVariation.name}
                </span>
              )}
            </div>
          )}

          {/* Price and Action Buttons */}
          <div className="mt-4 pt-3 border-t border-[#F2ECE1]">
            <div className="flex items-baseline justify-between mb-3">
              <div className="flex items-baseline space-x-2">
                <span className="text-sm sm:text-[15px] font-semibold text-[#141312] tracking-tight">
                  ₹{displayPrice.toFixed(2)}
                </span>
                {displayCompareAt && displayCompareAt > displayPrice && (
                  <span className="text-xs text-[#9E9587] line-through">
                    ₹{displayCompareAt.toFixed(2)}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-[#807769] font-light">
                {product.sizeOptions?.[0] || '50ml'}
              </span>
            </div>

            {/* Direct BUY NOW and Add to Bag Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                id={`buy-now-card-${product.id}`}
                onClick={handleBuyNowClick}
                disabled={isOutOfStock}
                className="flex-1 py-2 px-3 text-[10px] uppercase tracking-[0.2em] font-semibold bg-[#141312] text-white hover:bg-[#302B25] active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs text-center flex items-center justify-center gap-1"
                title={isOutOfStock ? 'Sold Out' : 'Direct Checkout'}
              >
                <span>Buy Now</span>
              </button>

              <button
                type="button"
                id={`quick-add-${product.id}`}
                onClick={handleQuickAdd}
                disabled={isOutOfStock}
                className={`py-2 px-2.5 border transition-all text-xs font-medium flex items-center justify-center ${
                  isOutOfStock
                    ? 'border-[#E2DAD0] bg-[#ECE8E1] text-[#9E988E] cursor-not-allowed'
                    : addedAnim
                    ? 'border-[#2E7D32] bg-[#2E7D32] text-white'
                    : 'border-[#DDD3C4] bg-white text-[#141312] hover:border-[#141312] hover:bg-[#F6F1EA]'
                }`}
                aria-label={`Add ${product.name} to bag`}
                title={isOutOfStock ? 'Sold Out' : 'Add to Bag'}
              >
                {addedAnim ? (
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                ) : (
                  <Plus className="w-3.5 h-3.5 stroke-[2]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Product Dialog */}
      <ShareProductModal
        product={product}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </>
  );
};
