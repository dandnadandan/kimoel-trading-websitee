import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Index from '@/pages/Index';
import CategoryPage from '@/pages/CategoryPage';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';
import AdminLogin from '@/pages/AdminLogin';
import Admin from '@/pages/Admin';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<CategoryPage />} />
          <Route path="/products/:categorySlug" element={<CategoryPage />} />
          <Route path="/products/:categorySlug/:productSlug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route 
            path="/admin/login" 
            element={
              <AuthProvider>
                <AdminLogin />
              </AuthProvider>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <AuthProvider>
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              </AuthProvider>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
