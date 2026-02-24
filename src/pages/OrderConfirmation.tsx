import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { getOrderById } from '@/services/api';
import { Order } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, User, Phone, Mail, MapPin, CreditCard, CheckCircle } from "lucide-react";

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  const { data: orderResponse, isLoading, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId!),
    enabled: !!orderId,
  });

  const order = orderResponse?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-14 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center">
              <div className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order || !orderResponse?.success) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-14 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-red-600 mb-4">Order Not Found</h2>
              <p className="text-gray-600 mb-6">The order you're looking for doesn't exist.</p>
              <Link to="/products">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <section className="py-14 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-brand-blue-dark mb-4">
                Order Confirmed!
              </h1>
              <p className="text-xl text-gray-600 mb-2">
                Thank you for your order request
              </p>
              <p className="text-lg text-gray-500">
                Order #{order.orderNumber}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Order Number</p>
                        <p className="font-semibold">{order.orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-semibold">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-3">Items Ordered</h3>
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">Product #{item.productId}</p>
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
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-semibold">₱{order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="text-green-600">Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>To be calculated</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-brand-blue-dark">₱{order.subtotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="font-medium">{order.customerInfo.name}</p>
                        </div>
                      </div>
                      {order.customerInfo.company && (
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Company</p>
                            <p className="font-medium">{order.customerInfo.company}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{order.customerInfo.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{order.customerInfo.phone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Shipping Address</p>
                        <p className="font-medium whitespace-pre-line">{order.customerInfo.address}</p>
                      </div>
                    </div>
                    {order.customerInfo.notes && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Order Notes</p>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm">{order.customerInfo.notes}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Next Steps */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle>What's Next?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 font-semibold text-sm">1</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">Order Review</h4>
                          <p className="text-sm text-gray-600">
                            Our team will review your order within 24 hours
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 font-semibold text-sm">2</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">Contact & Quote</h4>
                          <p className="text-sm text-gray-600">
                            We'll contact you with a detailed quote and delivery timeline
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 font-semibold text-sm">3</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">Payment & Processing</h4>
                          <p className="text-sm text-gray-600">
                            Confirm quote and arrange payment to process your order
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 font-semibold text-sm">4</span>
                        </div>
                        <div>
                          <h4 className="font-semibold">Delivery</h4>
                          <p className="text-sm text-gray-600">
                            Your order will be shipped to your specified address
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">Need Help?</h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Email: support@kimoel.com</li>
                        <li>• Phone: +1 (555) 123-4567</li>
                        <li>• Hours: Mon-Fri 9AM-5PM EST</li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <Link to="/products">
                        <Button variant="outline" size="lg" className="w-full">
                          Continue Shopping
                        </Button>
                      </Link>
                      <Link to="/cart">
                        <Button variant="outline" size="lg" className="w-full">
                          View Cart
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
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

export default OrderConfirmation;
