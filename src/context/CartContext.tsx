import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariation } from '../types';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, variation?: ProductVariation, size?: string, quantity?: number) => boolean;
  buyNow: (product: Product, variation?: ProductVariation, size?: string, quantity?: number) => boolean;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQty: number) => boolean;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'aura_perfume_cart_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to local storage', e);
    }
  }, [items]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (
    product: Product,
    variation?: ProductVariation,
    size?: string,
    quantity: number = 1
  ): boolean => {
    const selectedSize = size || product.sizeOptions?.[0] || '50ml / 1.7 fl oz';
    const effectiveVariation = variation || product.variations?.[0];
    const variationId = effectiveVariation?.id;
    const itemId = `${product.id}-${variationId || 'default'}-${selectedSize}`;

    const unitPrice = effectiveVariation?.price !== undefined && effectiveVariation.price > 0
      ? effectiveVariation.price
      : product.price;

    const maxStock = effectiveVariation?.stock !== undefined ? effectiveVariation.stock : product.stock;
    const itemImage = effectiveVariation?.image || product.images[0];

    if (maxStock <= 0) {
      return false;
    }

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((it) => it.id === itemId);
      if (existingIndex > -1) {
        const existing = prevItems[existingIndex];
        const updatedQty = Math.min(existing.quantity + quantity, maxStock);
        const updated = [...prevItems];
        updated[existingIndex] = { ...existing, quantity: updatedQty, maxStock };
        return updated;
      } else {
        const newItem: CartItem = {
          id: itemId,
          productId: product.id,
          productName: product.name,
          slug: product.slug,
          variationId: effectiveVariation?.id,
          variationName: effectiveVariation?.name,
          variationColor: effectiveVariation?.color,
          selectedSize,
          quantity: Math.min(quantity, maxStock),
          price: unitPrice,
          image: itemImage,
          sku: effectiveVariation?.sku || product.sku,
          maxStock
        };
        return [...prevItems, newItem];
      }
    });

    setIsOpen(true);
    return true;
  };

  const buyNow = (
    product: Product,
    variation?: ProductVariation,
    size?: string,
    quantity: number = 1
  ): boolean => {
    const selectedSize = size || product.sizeOptions?.[0] || '50ml / 1.7 fl oz';
    const effectiveVariation = variation || product.variations?.[0];
    const variationId = effectiveVariation?.id;
    const itemId = `${product.id}-${variationId || 'default'}-${selectedSize}`;

    const unitPrice = effectiveVariation?.price !== undefined && effectiveVariation.price > 0
      ? effectiveVariation.price
      : product.price;

    const maxStock = effectiveVariation?.stock !== undefined ? effectiveVariation.stock : product.stock;
    const itemImage = effectiveVariation?.image || product.images[0];

    if (maxStock <= 0) {
      return false;
    }

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((it) => it.id === itemId);
      if (existingIndex > -1) {
        const existing = prevItems[existingIndex];
        const updatedQty = Math.min(existing.quantity + quantity, maxStock);
        const updated = [...prevItems];
        updated[existingIndex] = { ...existing, quantity: updatedQty, maxStock };
        return updated;
      } else {
        const newItem: CartItem = {
          id: itemId,
          productId: product.id,
          productName: product.name,
          slug: product.slug,
          variationId: effectiveVariation?.id,
          variationName: effectiveVariation?.name,
          variationColor: effectiveVariation?.color,
          selectedSize,
          quantity: Math.min(quantity, maxStock),
          price: unitPrice,
          image: itemImage,
          sku: effectiveVariation?.sku || product.sku,
          maxStock
        };
        return [...prevItems, newItem];
      }
    });

    // Close drawer if open so direct checkout takes focus
    setIsOpen(false);
    return true;
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((it) => it.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQty: number): boolean => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return true;
    }

    let success = true;
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === itemId) {
          if (newQty > it.maxStock) {
            success = false;
            return { ...it, quantity: it.maxStock };
          }
          return { ...it, quantity: newQty };
        }
        return it;
      })
    );
    return success;
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, it) => acc + it.quantity, 0);
  const subtotal = Math.round(items.reduce((acc, it) => acc + it.price * it.quantity, 0) * 100) / 100;
  const freeShippingThreshold = 75;
  const shipping = subtotal === 0 ? 0 : subtotal >= freeShippingThreshold ? 0 : 15;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;
  const amountToFreeShipping = Math.max(0, Math.round((freeShippingThreshold - subtotal) * 100) / 100);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addToCart,
        buyNow,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shipping,
        tax,
        total,
        freeShippingThreshold,
        amountToFreeShipping
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
