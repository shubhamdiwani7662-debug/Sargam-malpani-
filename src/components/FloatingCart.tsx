import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface FloatingCartProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const FloatingCart: React.FC<FloatingCartProps> = ({ currentRoute, navigate }) => {
  const { cartCount, cartGrandTotal, cartSubtotal } = useStore();

  // Hidden on empty cart or on routes: home, checkout, admin, staff-login
  const excludedRoutes = ['home', 'checkout', 'admin', 'staff-login', 'order-confirmation'];
  if (cartCount === 0 || excludedRoutes.includes(currentRoute)) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none animate-in slide-in-from-bottom-5 duration-300">
      <div className="pointer-events-auto w-full max-w-md bg-[#272321] text-white rounded-2xl shadow-2xl border border-white/10 p-3 sm:p-3.5 flex items-center justify-between gap-4 backdrop-blur-md">
        
        {/* Cart Info Lockup */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C92520] flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <span>Cart</span>
              <span>·</span>
              <span>{cartCount} {cartCount === 1 ? 'Item' : 'Items'}</span>
            </div>
            <div className="text-base font-extrabold text-white tracking-tight tabular-nums">
              ₹{cartGrandTotal > 0 ? cartGrandTotal : cartSubtotal}
            </div>
          </div>
        </div>

        {/* View Cart Button */}
        <button
          onClick={() => navigate('cart')}
          className="bg-[#C92520] hover:bg-[#B01E1A] text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 shrink-0 active:scale-95"
        >
          <span>View Cart</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
