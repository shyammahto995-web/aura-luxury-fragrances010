import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, User, Menu, X, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';

interface HeaderProps {
  onNavigate: (view: string, params?: any) => void;
  currentView: string;
  onOpenSearch: () => void;
  onOpenAdminLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  currentView,
  onOpenSearch,
  onOpenAdminLogin
}) => {
  const { totalItems, openCart } = useCart();
  const { isAdmin } = useAdmin();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: string, params?: any) => {
    onNavigate(view, params);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Luxury Announcement Bar */}
      <div 
        id="aura-announcement-bar" 
        className="bg-[#141312] text-[#EBE6DD] px-4 py-2 text-center text-[11px] md:text-[12px] uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-3 border-b border-[#242220]"
      >
        <span>Free Shipping on Orders Over ₹75</span>
        <span className="text-[#8E867A] font-light">|</span>
        <span>Complimentary Samples With Every Order</span>
      </div>

      {/* Main Nav Bar */}
      <nav 
        id="aura-main-navigation" 
        className={`w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#FAF8F5]/95 backdrop-blur-md shadow-sm border-b border-[#E8E2D8] py-3.5' 
            : 'bg-[#FAF8F5] border-b border-[#EFE9DF] py-4 md:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              id="aura-mobile-menu-btn"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-[#2B2927] hover:text-black focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Desktop Navigation Links (Left) */}
          <div className="hidden lg:flex items-center space-x-7 text-[12px] uppercase tracking-[0.18em] font-medium text-[#4A4641]">
            <button
              id="nav-shop"
              onClick={() => handleNavClick('shop')}
              className={`hover:text-[#11100F] transition-colors py-1 relative ${
                currentView === 'shop' ? 'text-[#11100F] font-semibold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#11100F]' : ''
              }`}
            >
              Shop
            </button>
            <button
              id="nav-best-sellers"
              onClick={() => handleNavClick('shop', { filter: 'best-sellers' })}
              className="hover:text-[#11100F] transition-colors py-1"
            >
              Best Sellers
            </button>
            <button
              id="nav-collections"
              onClick={() => handleNavClick('shop', { filter: 'collections' })}
              className="hover:text-[#11100F] transition-colors py-1"
            >
              Collections
            </button>
            <button
              id="nav-discovery-sets"
              onClick={() => handleNavClick('shop', { category: 'Discovery Sets' })}
              className="hover:text-[#11100F] transition-colors py-1"
            >
              Discovery Sets
            </button>
            <button
              id="nav-about"
              onClick={() => handleNavClick('about')}
              className="hover:text-[#11100F] transition-colors py-1"
            >
              About
            </button>
            <button
              id="nav-journal"
              onClick={() => handleNavClick('journal')}
              className="hover:text-[#11100F] transition-colors py-1"
            >
              Journal
            </button>
          </div>

          {/* Brand Logo / Wordmark (Centered) */}
          <div className="flex-1 lg:flex-initial text-center">
            <button
              id="aura-brand-logo-btn"
              onClick={() => handleNavClick('home')}
              className="group inline-flex flex-col items-center justify-center focus:outline-none"
            >
              <span className="font-serif text-2xl sm:text-3xl md:text-[32px] tracking-[0.35em] uppercase text-[#141312] font-medium group-hover:text-[#3B3428] transition-colors ml-[0.35em]">
                AURA
              </span>
              <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.4em] text-[#7A746B] mt-0.5 ml-[0.4em] font-medium">
                Haute Parfumerie
              </span>
            </button>
          </div>

          {/* Header Action Icons (Right) */}
          <div className="flex items-center space-x-4 sm:space-x-5 text-[#2B2927]">
            {/* Search Icon */}
            <button
              id="aura-search-trigger-btn"
              onClick={onOpenSearch}
              className="p-1.5 hover:text-black transition-colors"
              aria-label="Search fragrances"
            >
              <Search className="w-[19px] h-[19px] stroke-[1.75]" />
            </button>

            {/* Admin / Account Icon */}
            <button
              id="aura-account-trigger-btn"
              onClick={() => {
                if (isAdmin) {
                  handleNavClick('admin');
                } else {
                  onOpenAdminLogin();
                }
              }}
              className={`p-1.5 transition-colors flex items-center gap-1 text-[11px] font-medium tracking-wider ${
                isAdmin 
                  ? 'text-[#8A6724] bg-[#F7EFE1] px-2.5 py-1 rounded-full border border-[#E6D6B8]' 
                  : 'hover:text-black'
              }`}
              title={isAdmin ? 'Admin Portal Active' : 'Admin & Staff Access'}
            >
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#8A6724]" />
                  <span className="hidden md:inline uppercase text-[10px] tracking-[0.15em] font-semibold">Admin</span>
                </>
              ) : (
                <User className="w-[19px] h-[19px] stroke-[1.75]" />
              )}
            </button>

            {/* Cart Icon */}
            <button
              id="aura-cart-trigger-btn"
              onClick={openCart}
              className="p-1.5 hover:text-black transition-colors relative"
              aria-label={`Shopping bag with ${totalItems} items`}
            >
              <ShoppingBag className="w-[20px] h-[20px] stroke-[1.75]" />
              {totalItems > 0 && (
                <span 
                  id="aura-cart-count-badge" 
                  className="absolute -top-1 -right-1 bg-[#141312] text-white text-[10px] w-[18px] h-[18px] rounded-full flex items-center justify-center font-medium tracking-tight"
                >
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          id="aura-mobile-nav-drawer" 
          className="lg:hidden bg-[#FAF8F5] border-b border-[#E8E2D8] px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top duration-200"
        >
          <div className="flex flex-col space-y-3 text-[13px] uppercase tracking-[0.2em] text-[#3D3A36] font-medium">
            <button
              id="mobile-nav-home"
              onClick={() => handleNavClick('home')}
              className="text-left py-2 border-b border-[#F0EAE0] hover:text-black"
            >
              Home
            </button>
            <button
              id="mobile-nav-shop"
              onClick={() => handleNavClick('shop')}
              className="text-left py-2 border-b border-[#F0EAE0] hover:text-black"
            >
              Shop All Fragrances
            </button>
            <button
              id="mobile-nav-best-sellers"
              onClick={() => handleNavClick('shop', { filter: 'best-sellers' })}
              className="text-left py-2 border-b border-[#F0EAE0] hover:text-black"
            >
              Best Sellers
            </button>
            <button
              id="mobile-nav-collections"
              onClick={() => handleNavClick('shop', { filter: 'collections' })}
              className="text-left py-2 border-b border-[#F0EAE0] hover:text-black"
            >
              Collections
            </button>
            <button
              id="mobile-nav-discovery"
              onClick={() => handleNavClick('shop', { category: 'Discovery Sets' })}
              className="text-left py-2 border-b border-[#F0EAE0] hover:text-black"
            >
              Discovery Sets
            </button>
            <button
              id="mobile-nav-about"
              onClick={() => handleNavClick('about')}
              className="text-left py-2 border-b border-[#F0EAE0] hover:text-black"
            >
              About The House
            </button>
            <button
              id="mobile-nav-journal"
              onClick={() => handleNavClick('journal')}
              className="text-left py-2 border-b border-[#F0EAE0] hover:text-black"
            >
              Olfactory Journal
            </button>
            <button
              id="mobile-nav-admin"
              onClick={() => {
                if (isAdmin) {
                  handleNavClick('admin');
                } else {
                  onOpenAdminLogin();
                  setMobileMenuOpen(false);
                }
              }}
              className="text-left py-2 text-[#8A6724] font-semibold flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isAdmin ? 'Admin Dashboard' : 'Admin Portal Login'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
