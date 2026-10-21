import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingCart } from './components/FloatingCart';
import { BranchModal } from './components/BranchModal';

// Views
import { HomeView } from './views/HomeView';
import { AboutView } from './views/AboutView';
import { CategoriesView } from './views/CategoriesView';
import { StoresView } from './views/StoresView';
import { ContactView } from './views/ContactView';
import { LegalView } from './views/LegalView';
import { ShopView } from './views/ShopView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { OrderConfirmationView } from './views/OrderConfirmationView';
import { CustomerAccountView } from './views/CustomerAccountView';
import { StaffLoginView } from './views/StaffLoginView';
import { AdminView } from './views/AdminView';

function AppContent() {
  const { isBranchModalOpen, setIsBranchModalOpen } = useStore();

  // Route state
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParam, setRouteParam] = useState<string | undefined>(undefined);

  // Sync with browser URL / hash
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.replace(/^\//, '');
      const hash = window.location.hash.replace(/^#\/?/, '');
      const activePath = hash || path;

      if (activePath.startsWith('shop/category/')) {
        setCurrentRoute('shop');
        setRouteParam(activePath.replace('shop/category/', ''));
      } else if (activePath.startsWith('orders/')) {
        setCurrentRoute('order-confirmation');
        setRouteParam(activePath.replace('orders/', ''));
      } else if (activePath === 'shop') {
        setCurrentRoute('shop');
        setRouteParam(undefined);
      } else if (activePath === 'cart') {
        setCurrentRoute('cart');
      } else if (activePath === 'checkout') {
        setCurrentRoute('checkout');
      } else if (activePath === 'account' || activePath === 'account/orders') {
        setCurrentRoute('account');
      } else if (activePath === 'staff-login') {
        setCurrentRoute('staff-login');
      } else if (activePath.startsWith('admin')) {
        setCurrentRoute('admin');
      } else if (activePath === 'about') {
        setCurrentRoute('about');
      } else if (activePath === 'categories') {
        setCurrentRoute('categories');
      } else if (activePath === 'stores') {
        setCurrentRoute('stores');
      } else if (activePath === 'contact') {
        setCurrentRoute('contact');
      } else if (activePath === 'privacy') {
        setCurrentRoute('privacy');
      } else if (activePath === 'terms') {
        setCurrentRoute('terms');
      } else {
        setCurrentRoute('home');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = (route: string, param?: string) => {
    setCurrentRoute(route);
    setRouteParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update browser URL hash for clean SPA bookmarking and back-button support
    if (route === 'shop' && param) {
      window.location.hash = `/shop/category/${param}`;
    } else if (route === 'order-confirmation' && param) {
      window.location.hash = `/orders/${param}`;
    } else if (route === 'home') {
      window.location.hash = '/';
    } else {
      window.location.hash = `/${route}`;
    }
  };

  const renderView = () => {
    switch (currentRoute) {
      case 'home':
        return <HomeView navigate={navigate} />;
      case 'about':
        return <AboutView navigate={navigate} />;
      case 'categories':
        return <CategoriesView navigate={navigate} />;
      case 'stores':
        return <StoresView navigate={navigate} />;
      case 'contact':
        return <ContactView />;
      case 'privacy':
        return <LegalView initialTab="privacy" />;
      case 'terms':
        return <LegalView initialTab="terms" />;
      case 'shop':
        return <ShopView initialCategoryId={routeParam} navigate={navigate} />;
      case 'cart':
        return <CartView navigate={navigate} />;
      case 'checkout':
        return <CheckoutView navigate={navigate} />;
      case 'order-confirmation':
        return <OrderConfirmationView orderNumber={routeParam || ''} navigate={navigate} />;
      case 'account':
        return <CustomerAccountView navigate={navigate} />;
      case 'staff-login':
        return <StaffLoginView navigate={navigate} />;
      case 'admin':
        return <AdminView navigate={navigate} />;
      default:
        return <HomeView navigate={navigate} />;
    }
  };

  const isAdminView = currentRoute === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F4] text-[#272321]">
      {/* Global Branch Selector Modal */}
      <BranchModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
        onSelectSuccess={() => {
          if (currentRoute === 'home') {
            navigate('shop');
          }
        }}
      />

      {/* Header (hidden in Admin dashboard) */}
      {!isAdminView && (
        <Header currentRoute={currentRoute} navigate={navigate} />
      )}

      {/* Main View */}
      <div className="flex-1">
        {renderView()}
      </div>

      {/* Floating Bottom Cart Bar */}
      {!isAdminView && (
        <FloatingCart currentRoute={currentRoute} navigate={navigate} />
      )}

      {/* Corporate Footer (hidden in Admin dashboard) */}
      {!isAdminView && (
        <Footer navigate={navigate} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
