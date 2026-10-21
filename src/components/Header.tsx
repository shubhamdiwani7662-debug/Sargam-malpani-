import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingCart, MapPin, ChevronDown, Menu, X, User } from 'lucide-react';

interface HeaderProps {
  currentRoute: string;
  navigate: (route: string, param?: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, navigate }) => {
  const { selectedBranch, setIsBranchModalOpen, cartCount, customer, staffUser } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', route: 'home' },
    { label: 'About Us', route: 'about' },
    { label: 'Departments', route: 'categories' },
    { label: 'Our Stores', route: 'stores' },
    { label: 'Contact', route: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Utility Bar for Branch & Delivery Status */}
      <div className="bg-[#641E24] text-white text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="text-[#EF8018] font-bold uppercase tracking-wider text-[11px]">Shopping At:</span>
            <button
              onClick={() => setIsBranchModalOpen(true)}
              className="flex items-center gap-1 hover:text-[#EF8018] transition-colors font-medium underline underline-offset-2"
              title="Change branch"
            >
              <MapPin className="w-3 h-3 text-[#EF8018]" />
              <span className="truncate max-w-[200px] sm:max-w-none">
                {selectedBranch ? selectedBranch.name : 'Choose Super Mart Branch'}
              </span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-200">
            <span>Free delivery on grocery orders above ₹{selectedBranch?.freeDeliveryThreshold ?? 499}</span>
            <span className="text-slate-400">·</span>
            <span>Customer Helpline: +91 2425 225 500</span>
            {staffUser && (
              <>
                <span className="text-slate-400">·</span>
                <button
                  onClick={() => navigate('admin')}
                  className="bg-[#C92520] hover:bg-[#B01E1A] text-white px-2 py-0.5 rounded text-[10px] font-bold"
                >
                  Admin Portal ({staffUser.role.replace('_', ' ')})
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation: 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3">
        <div className="flex items-center justify-between gap-8">
          
          {/* Zone 1: Brand Wordmark with Official Uploaded Logo */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C92520] rounded-lg p-1"
          >
            <img
              src="/assets/aistudio/images_50b51d64.png"
              alt="Malpani Sargam Super Mart"
              className="h-10 sm:h-12 w-auto object-contain shrink-0"
              onError={(e) => {
                // Graceful fallback if asset path differs
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="sr-only">
              <h1>Malpani Sargam Super Mart</h1>
            </div>
          </button>

          {/* Zone 2: 4–5 Single-Line Concise Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-[#272321]">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => navigate(link.route)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'text-[#C92520] font-bold'
                      : 'text-[#272321] hover:text-[#C92520]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#C92520] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions (Shop Online + Account + Cart) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Customer Account Button */}
            <button
              onClick={() => navigate('account')}
              aria-label="Customer Account"
              className="p-2 text-slate-700 hover:text-[#C92520] hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">
                {customer ? customer.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => navigate('cart')}
              aria-label="View Shopping Cart"
              className="relative p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4 text-[#C92520]" />
              <span className="hidden sm:inline text-xs font-bold">Cart</span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold leading-none text-white bg-[#C92520] rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Primary Action Button: Shop Online */}
            <button
              onClick={() => navigate('shop')}
              className="px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#C92520] hover:bg-[#B01E1A] rounded-lg shadow-xs hover:shadow transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <span>Shop Online</span>
              <span aria-hidden="true">→</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.route}
              onClick={() => {
                navigate(link.route);
                setMobileMenuOpen(false);
              }}
              className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                currentRoute === link.route
                  ? 'bg-red-50 text-[#C92520]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setIsBranchModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 rounded-lg"
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C92520]" />
                <span>{selectedBranch?.name || 'Choose Store'}</span>
              </span>
              <span className="text-[#C92520] font-semibold">Change</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
