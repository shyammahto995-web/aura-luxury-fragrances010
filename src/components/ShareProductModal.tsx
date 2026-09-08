import React, { useState } from 'react';
import { X, Check, Copy, Share2, MessageCircle, Send } from 'lucide-react';
import { Product } from '../types';

interface ShareProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareProductModal: React.FC<ShareProductModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  // Generate dynamic unique product URL
  const productSlug = product.slug || product.id;
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/product/${productSlug}` 
    : `/product/${productSlug}`;

  const shareTitle = `${product.name} — AURA Haute Parfumerie`;
  const shareText = `Discover ${product.name}, a luxury artisanal fragrance by AURA. ${product.shortDescription || ''}`;

  const handleCopyLink = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch (err) {
      console.error('Failed to copy share link', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed, no error needed
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`${shareTitle}\n${shareText}\n${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`${shareTitle}\n${shareText}`);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      id="aura-share-modal-overlay" 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div 
        id="aura-share-modal" 
        className="relative w-full max-w-md bg-[#FAF8F5] border border-[#E5DDD0] shadow-2xl p-6 sm:p-7 text-[#141312] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-share-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#7A7265] hover:text-[#141312] transition-colors"
          aria-label="Close share dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C8273] font-medium block">
            AURA Olfactory Curation
          </span>
          <h3 className="font-serif text-xl sm:text-2xl text-[#141312] font-normal tracking-tight mt-0.5">
            Share Fragrance
          </h3>
        </div>

        {/* Product Snippet Preview */}
        <div className="flex items-center space-x-3.5 p-3 bg-white border border-[#ECE5D8] mb-5">
          <div className="w-14 h-16 bg-[#F6F1EA] border border-[#EBE3D7] shrink-0 p-1 flex items-center justify-center">
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[9px] uppercase tracking-wider text-[#8A8174] block">
              {product.collection} · {product.category}
            </span>
            <h4 className="font-serif text-sm font-semibold text-[#141312] truncate">
              {product.name}
            </h4>
            <p className="text-xs font-medium text-[#141312] mt-0.5">
              ₹{product.price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Sharing Channels */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            {/* WhatsApp */}
            <button
              id="share-whatsapp-btn"
              type="button"
              onClick={handleWhatsAppShare}
              className="flex flex-col items-center justify-center p-3 border border-[#E2D9CB] bg-white hover:border-[#141312] hover:bg-[#F5EFE6] transition-all group"
            >
              <div className="w-9 h-9 rounded-full bg-[#EBF7EE] text-[#1E7E34] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-4 h-4 fill-current" />
              </div>
              <span className="text-[11px] font-medium text-[#141312]">WhatsApp</span>
            </button>

            {/* Facebook */}
            <button
              id="share-facebook-btn"
              type="button"
              onClick={handleFacebookShare}
              className="flex flex-col items-center justify-center p-3 border border-[#E2D9CB] bg-white hover:border-[#141312] hover:bg-[#F5EFE6] transition-all group"
            >
              <div className="w-9 h-9 rounded-full bg-[#EBF0F9] text-[#1877F2] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <span className="font-bold text-sm leading-none">f</span>
              </div>
              <span className="text-[11px] font-medium text-[#141312]">Facebook</span>
            </button>

            {/* X / Twitter */}
            <button
              id="share-twitter-btn"
              type="button"
              onClick={handleTwitterShare}
              className="flex flex-col items-center justify-center p-3 border border-[#E2D9CB] bg-white hover:border-[#141312] hover:bg-[#F5EFE6] transition-all group"
            >
              <div className="w-9 h-9 rounded-full bg-[#F0EFEB] text-[#141312] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <span className="font-bold text-xs leading-none">𝕏</span>
              </div>
              <span className="text-[11px] font-medium text-[#141312]">X / Twitter</span>
            </button>

            {/* Native device share */}
            <button
              id="share-native-btn"
              type="button"
              onClick={handleNativeShare}
              className="flex flex-col items-center justify-center p-3 border border-[#E2D9CB] bg-white hover:border-[#141312] hover:bg-[#F5EFE6] transition-all group"
            >
              <div className="w-9 h-9 rounded-full bg-[#EAE6DF] text-[#141312] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <Share2 className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium text-[#141312]">More Options</span>
            </button>
          </div>

          {/* Copy Link Input Bar */}
          <div className="pt-2">
            <label className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#6E6659] block mb-1.5">
              Unique Product Link
            </label>
            <div className="flex items-center border border-[#DDD3C4] bg-white">
              <input
                type="text"
                readOnly
                value={shareUrl}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="flex-1 px-3 py-2.5 text-xs text-[#3D3830] bg-transparent focus:outline-none select-all font-mono"
              />
              <button
                id="copy-product-link-btn"
                type="button"
                onClick={handleCopyLink}
                className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5 shrink-0 ${
                  copied 
                    ? 'bg-[#2E7D32] text-white' 
                    : 'bg-[#141312] text-white hover:bg-[#332E29]'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
            {copied && (
              <p className="text-[11px] text-emerald-800 font-medium mt-1.5 flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Link copied to clipboard! Ready to paste & share.</span>
              </p>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-4 border-t border-[#EAE3D6] text-center">
          <p className="text-[11px] text-[#7A7265] font-light">
            Recipients will land directly on the <strong className="font-medium text-[#141312]">{product.name}</strong> presentation.
          </p>
        </div>
      </div>
    </div>
  );
};
