import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Global Toast banner inside CartProvider
function NotificationBanner() {
  const { notification } = useCart();
  if (!notification) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 bg-[#1C1917] text-[#FAF8F5] text-xs px-5 py-3 shadow-2xl border border-stone-700 flex items-center gap-2 animate-bounce">
      <span className="w-2 h-2 rounded-full bg-[#8C7355]" />
      <span>{notification}</span>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-[#FAF8F5] text-stone-900 font-sans selection:bg-[#8C7355] selection:text-white">
            <Navbar />
            <CartDrawer />
            <NotificationBanner />

            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route
                  path="*"
                  element={
                    <div className="py-28 text-center bg-[#FAF8F5]">
                      <h2 className="font-serif text-3xl font-normal text-stone-900 mb-2">404 - Space Not Found</h2>
                      <p className="text-xs text-stone-500 mb-6">The page you are looking for does not exist in our archive.</p>
                      <a href="/" className="inline-block bg-stone-900 text-white px-6 py-3 text-xs uppercase tracking-widest">
                        Return Home
                      </a>
                    </div>
                  }
                />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
