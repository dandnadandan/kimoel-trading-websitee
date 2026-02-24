import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { getProductById } from '@/services/api';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  addedAt: string;
}

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<{ [key: string]: Product }>({});

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Fetch product details for cart items
  useEffect(() => {
    const fetchProducts = async () => {
      const productPromises = cartItems.map(async (item) => {
        const response = await getProductById(item.productId);
        return { id: item.productId, product: response.data };
      });

      try {
        const results = await Promise.all(productPromises);
        const productMap: { [key: string]: Product } = {};
        results.forEach(({ id, product }) => {
          if (product) {
            productMap[id] = product;
          }
        });
        setProducts(productMap);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    if (cartItems.length > 0) {
      fetchProducts();
    }
  }, [cartItems]);

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const product = products[productId];
    if (product && newQuantity > product.stockQty) {
      toast.error(`Only ${product.stockQty} items available in stock`);
      return;
    }

    const updatedCart = cartItems.map(item =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    // Trigger custom event for header updates
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const removeItem = (productId: string) => {
    const updatedCart = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    toast.success('Item removed from cart');
    
    // Trigger custom event for header updates
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    toast.success('Cart cleared');
    
    // Trigger custom event for header updates
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products[item.productId];
      if (!product) return total;
      return total + (item.price * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-14 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center py-12">
              <div className="text-gray-400 mb-6">
                <ShoppingCart className="h-16 w-16 mx-auto" />
              </div>
              <h2 className="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Add some products to get started!</p>
              <Link to="/products">
                <Button size="lg">
                  Continue Shopping
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="py-14 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-brand-blue-dark mb-2">Shopping Cart</h1>
                <p className="text-gray-600">{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
              </div>
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => {
                  const product = products[item.productId];
                  if (!product) return null;

                  return (
                    <motion.div
                      key={item.productId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Card className="p-4">
                        <div className="flex gap-4">
                          {/* Product Image */}
                          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1">
                            <div className="flex justify-between mb-2">
                              <div>
                                <h4 className="font-semibold text-brand-blue-dark">
                                  {product.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  ₱{item.price.toFixed(2)} each
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.productId)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                                  className="w-16 text-center"
                                  min="1"
                                  max={product.stockQty}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                  disabled={item.quantity >= product.stockQty}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-brand-blue-dark">
                                  ₱{(item.price * item.quantity).toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {item.quantity <= product.stockQty 
                                    ? `${product.stockQty - item.quantity} available`
                                    : 'Exceeds stock'
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-4">
                  <h2 className="text-xl font-bold text-brand-blue-dark mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span>Subtotal ({itemCount} items)</span>
                      <span className="font-semibold">₱{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-brand-blue-dark">₱{subtotal.toFixed(2)}</span>
                    </div>
                  </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => navigate('/checkout')}
                    size="lg"
                    className="w-full"
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                  <Link to="/products">
                    <Button variant="outline" size="lg" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Order Information</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Free shipping on all orders</li>
                    <li>• Secure payment processing</li>
                    <li>• 30-day return policy</li>
                    <li>• 24/7 customer support</li>
                  </ul>
                </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
