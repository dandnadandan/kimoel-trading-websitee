import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Truck, User, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getProducts, createOrder, getProductById } from "@/services/api";
import { CartItem, Product } from "@/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface CustomerInfo {
  name: string;
  company?: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<{ [key: string]: Product }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

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

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      toast.error('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customerInfo,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: cartItems.reduce((total, item) => {
          const product = products[item.productId];
          if (!product) return total;
          return total + (item.price * item.quantity);
        }, 0),
        status: 'pending' as const
      };

      const response = await createOrder(orderData);
      
      if (response.success && response.data) {
        // Clear cart
        localStorage.removeItem('cart');
        // Trigger cart update event
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        
        toast.success('Order placed successfully!');
        navigate(`/order-confirmation/${response.data.id}`);
      } else {
        toast.error(response.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      toast.error('Failed to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products[item.productId];
      if (!product) return total;
      return total + (item.price * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-14 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-600 mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Add some products before checkout!</p>
              <Link to="/products">
                <Button size="lg">
                  Continue Shopping
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
            <div className="flex items-center mb-8">
              <Link to="/cart">
                <Button variant="outline" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Cart
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-brand-blue-dark">Checkout</h1>
                <p className="text-gray-600">Complete your order details</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Customer Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={customerInfo.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company (Optional)</Label>
                        <Input
                          id="company"
                          value={customerInfo.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          placeholder="Acme Corporation"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Shipping Address *</Label>
                      <Textarea
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="123 Main Street, City, State, ZIP Code"
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="notes">Order Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={customerInfo.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Special instructions or requirements..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cartItems.map((item) => {
                      const product = products[item.productId];
                      if (!product) return null;

                      return (
                        <div key={item.productId} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{product.name}</h4>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity} × ₱{item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-brand-blue-dark">
                              ₱{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-semibold">₱{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="text-green-600">Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>Calculated later</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-brand-blue-dark">₱{subtotal.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">Order Information</h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• This is a quote request</li>
                        <li>• We'll contact you within 24 hours</li>
                        <li>• Payment details discussed later</li>
                        <li>• Free shipping on all orders</li>
                      </ul>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        'Processing...'
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Place Order Request
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      By placing this order, you agree to our terms and conditions
                    </p>
                  </CardContent>
                </Card>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
