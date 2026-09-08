import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryTiles } from './components/CategoryTiles';
import { FeaturedSection } from './components/FeaturedSection';
import { PromoBanners } from './components/PromoBanners';
import { BrandStory } from './components/BrandStory';
import { ValueProps } from './components/ValueProps';
import { Footer } from './components/Footer';
import { ShopPage } from './components/ShopPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CheckoutPage } from './components/CheckoutPage';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutPage } from './components/AboutPage';
import { JournalPage } from './components/JournalPage';
import { Product, Order } from './types';

function MainApp() {
  const { isAdmin } = useAdmin();

  // Navigation state
  // 'home' | 'shop' | 'product' | 'checkout' | 'about' | 'journal' | 'admin'
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParams, setViewParams] = useState<{ category?: string; filter?: string }>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Products state from backend
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Load products from API
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to load products from server', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Navigation Handler
  const handleNavigate = (view: string, params?: { category?: string; filter?: string }) => {
    setCurrentView(view);
    if (params) {
      setViewParams(params);
    } else {
      setViewParams({});
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Product Selection Handler (Opens Product Detail Page)
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Admin view and user is an authenticated admin, show the full Admin Dashboard
  if (currentView === 'admin' && isAdmin) {
    return (
      <AdminDashboard
        products={products}
        onRefreshProducts={fetchProducts}
        onReturnToStore={() => handleNavigate('home')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#141312] selection:bg-[#EAE0D0] selection:text-[#141312]">
      
      {/* Luxury Sticky Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
      />

      {/* Main Page Views */}
      <main className="flex-grow">
        {/* VIEW 1: HOMEPAGE */}
        {currentView === 'home' && (
          <>
            <Hero
              onExplore={() => handleNavigate('shop', { filter: 'collections' })}
              onShopAll={() => handleNavigate('shop')}
            />
            
            <CategoryTiles
              onSelectCategory={(category) => handleNavigate('shop', { category })}
            />

            <FeaturedSection
              products={products}
              onSelectProduct={handleSelectProduct}
              onViewAll={() => handleNavigate('shop')}
            />

            <PromoBanners
              onShopDiscovery={() => handleNavigate('shop', { category: 'Discovery Sets' })}
              onShopGifts={() => handleNavigate('shop', { category: 'Gift Sets' })}
            />

            <BrandStory
              onLearnMore={() => handleNavigate('about')}
            />

            <ValueProps />
          </>
        )}

        {/* VIEW 2: SHOP CATALOG */}
        {currentView === 'shop' && (
          <ShopPage
            products={products}
            onSelectProduct={handleSelectProduct}
            initialCategory={viewParams.category}
            initialFilter={viewParams.filter}
          />
        )}

        {/* VIEW 3: PRODUCT DETAIL PAGE */}
        {currentView === 'product' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            onBack={() => handleNavigate('shop')}
            onSelectProduct={handleSelectProduct}
            onDirectCheckout={() => handleNavigate('checkout')}
          />
        )}

        {/* VIEW 4: CHECKOUT FLOW */}
        {currentView === 'checkout' && (
          <CheckoutPage
            onBackToShop={() => handleNavigate('shop')}
            onOrderSuccess={(order: Order) => {
              // Refresh catalog in case stock deducted
              fetchProducts();
            }}
          />
        )}

        {/* VIEW 5: ABOUT THE HOUSE */}
        {currentView === 'about' && (
          <AboutPage
            onBackToShop={() => handleNavigate('shop')}
          />
        )}

        {/* VIEW 6: OLFACTORY JOURNAL */}
        {currentView === 'journal' && (
          <JournalPage
            onSelectCategory={(category) => handleNavigate('shop', { category })}
          />
        )}
      </main>

      {/* Luxury Espresso Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenAdminLogin={() => {
          if (isAdmin) {
            handleNavigate('admin');
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        onCheckout={() => handleNavigate('checkout')}
        onViewCartPage={() => handleNavigate('shop')}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={handleSelectProduct}
      />

      {/* Admin Login Dialog */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => handleNavigate('admin')}
      />

    </div>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AdminProvider>
  );
}
