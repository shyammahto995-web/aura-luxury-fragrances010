import React from 'react';
import { X, Minus, Plus, Trash2, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onCheckout: () => void;
  onViewCartPage: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout, onViewCartPage }) => {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    shipping,
    tax,
    total,
    amountToFreeShipping,
    freeShippingThreshold
  } = useCart();

  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div id="aura-cart-drawer-overlay" className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={closeCart}
      />

      {/* Slide-out Panel */}
      <div 
        id="aura-cart-drawer" 
        className="relative w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l border-[#E5DDD0]"
      >
        
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-[#ECE5D8] flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2.5">
            <ShoppingBag className="w-5 h-5 text-[#141312]" />
            <h2 className="font-serif text-xl sm:text-2xl text-[#141312] font-normal tracking-tight">
              Your Collection ({items.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>
          <button
            id="close-cart-drawer-btn"
            onClick={closeCart}
            className="p-1.5 text-[#666054] hover:text-black transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#F4EFE6] px-5 sm:px-6 py-3 border-b border-[#EAE3D6]">
          <div className="flex items-center justify-between text-xs text-[#4A453C] mb-1.5 font-medium">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#8A6724]" />
              {amountToFreeShipping > 0 ? (
                <>Add <strong className="text-[#141312]">₹{amountToFreeShipping.toFixed(2)}</strong> more for free shipping</>
              ) : (
                <span className="text-emerald-800 font-semibold">You unlocked complimentary shipping</span>
              )}
            </span>
            <span className="text-[10px] text-[#7A7265]">{progressPercent}%</span>
          </div>
          <div className="w-full bg-[#E0D7C9] h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#141312] h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 divide-y divide-[#EFE9DE]">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#EFEAE1] flex items-center justify-center text-[#8C8476]">
                <ShoppingBag className="w-7 h-7 stroke-[1.2]" />
              </div>
              <div className="space-y-1">
                <p className="font-serif text-xl text-[#141312]">Your shopping bag is empty</p>
                <p className="text-xs text-[#7A7265] max-w-xs font-light">
                  Explore our artisanal formulations and find scents that become part of you.
                </p>
              </div>
              <button
                onClick={() => {
                  closeCart();
                  onViewCartPage();
                }}
                className="bg-[#141312] text-white px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-medium"
              >
                Explore Fragrances
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex space-x-3.5">
                {/* Thumbnail */}
                <div className="w-20 h-24 bg-[#F2ECE1] border border-[#E0D7C9] shrink-0 p-1 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="font-serif text-base text-[#141312] font-medium leading-tight">
                        {item.productName}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#968E82] hover:text-red-700 p-1 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Variation badge & size */}
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-[#6E6659]">
                      {item.variationName && (
                        <span className="flex items-center gap-1.5 bg-[#F2ECE1] px-2 py-0.5 border border-[#E0D7C9]">
                          {item.variationColor && (
                            <span 
                              className="w-2.5 h-2.5 rounded-full border border-black/20"
                              style={{ backgroundColor: item.variationColor }}
                            />
                          )}
                          <span className="font-medium text-[#262422]">{item.variationName}</span>
                        </span>
                      )}
                      <span className="text-[#8A8173]">{item.selectedSize}</span>
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between mt-3 pt-2">
                    <div className="flex items-center border border-[#DDD3C4] bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-[#666054] hover:text-black"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-semibold text-[#141312]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="p-1 text-[#666054] hover:text-black disabled:opacity-30"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-semibold text-[#141312]">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-[#8C8476]">₹{item.price.toFixed(2)} each</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer Summary */}
        {items.length > 0 && (
          <div className="p-5 sm:p-6 bg-white border-t border-[#ECE5D8] space-y-3.5 shadow-lg">
            <div className="space-y-1.5 text-xs text-[#544D42]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[#141312]">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span>{shipping === 0 ? <strong className="text-emerald-700">Complimentary</strong> : `₹${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Sales Tax (8%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#141312] pt-2 border-t border-[#EAE3D6]">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                id="cart-drawer-checkout-btn"
                type="button"
                onClick={() => {
                  closeCart();
                  onCheckout();
                }}
                className="w-full py-3.5 bg-[#141312] text-white hover:bg-[#2B2824] text-xs uppercase tracking-[0.25em] font-semibold transition-all flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  closeCart();
                  onViewCartPage();
                }}
                className="w-full py-2.5 text-center text-xs uppercase tracking-[0.2em] font-medium text-[#6B6356] hover:text-black transition-colors"
              >
                View Full Bag Details
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
