import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import ProductModal from './components/ProductModal';
import Toast from './components/Toast';

// Pages
import HomePage from './pages/HomePage';
import ComponentsPage from './pages/ComponentsPage';
import PCBuilderPage from './pages/PCBuilderPage';
import ComparePage from './pages/ComparePage';
import MyBuildsPage from './pages/MyBuildsPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
function MainAppContent() {
  const {
    currentPage,
    userRole
  } = useApp();
  const renderActivePage = () => {
    if (userRole === 'admin' || currentPage === 'admin') {
      return <AdminDashboard />;
    }
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'components':
        return <ComponentsPage />;
      case 'builder':
        return <PCBuilderPage />;
      case 'compare':
        return <ComparePage />;
      case 'my-builds':
        return <MyBuildsPage />;
      case 'wishlist':
        return <WishlistPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'orders':
        return <OrdersPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };
  return <div className="app-root inline-app-0">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Page Area */}
      <div className="inline-app-1">
        {renderActivePage()}
      </div>

      {/* Footer (shown on storefront pages) */}
      {userRole !== 'admin' && currentPage !== 'admin' && <Footer />}

      {/* Global Modals & Notifications */}
      <AuthModal />
      <ProductModal />
      <Toast />
    </div>;
}
export default function App() {
  return <AppProvider>
      <MainAppContent />
    </AppProvider>;
}
