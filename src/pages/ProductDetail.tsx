import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { getProductBySlug, getProducts } from '@/services/api';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Plus, Minus, Check, Package, Truck, Shield } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetail: React.FC = () => {
  const { categorySlug, productSlug } = useParams<{ categorySlug: string; productSlug: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const { data: productResponse, isLoading: productLoading } = useQuery({
    queryKey: ['product', productSlug],
    queryFn: () => getProductBySlug(productSlug!),
    enabled: !!productSlug,
  });

  const { data: relatedProductsResponse } = useQuery({
    queryKey: ['products', categorySlug],
    queryFn: () => getProducts(categorySlug),
    enabled: !!categorySlug,
  });

  const product = productResponse?.data;
  const relatedProducts = relatedProductsResponse?.data?.filter(p => p.id !== product?.id).slice(0, 4) || [];

  const handleAddToCart = () => {
    if (!product) return;
    
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already in cart
    const existingItemIndex = existingCart.findIndex((item: any) => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      // Update quantity
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      existingCart.push({
        productId: product.id,
        quantity: quantity,
        price: product.price,
        addedAt: new Date().toISOString()
      });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Trigger custom event for header updates
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    toast.success(`Added ${quantity} × ${product.name} to cart`);
  };

  const updateQuantity = (newQuantity: number) => {
    if (product && newQuantity >= 1 && newQuantity <= product.stockQty) {
      setQuantity(newQuantity);
    }
  };

  if (productLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-14 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div className="h-96 bg-gray-200 rounded-xl"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product || !productResponse?.success) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-14 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-red-600 mb-4">Product Not Found</h2>
              <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
              <Link to={`/products/${categorySlug}`}>
                <Button>Back to Category</Button>
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
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
              <Link to="/" className="hover:text-brand-blue-dark">Home</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-brand-blue-dark">Products</Link>
              <span>/</span>
              <Link to={`/products/${categorySlug}`} className="hover:text-brand-blue-dark">
                {categorySlug?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Link>
              <span>/</span>
              <span className="text-brand-blue-dark font-medium">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="aspect-square overflow-hidden rounded-xl bg-white">
                  <img
                    src={product.images[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors ${
                          selectedImageIndex === index ? 'border-brand-blue-dark' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-brand-blue-dark mb-4">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-3xl font-bold text-brand-blue-dark">
                      ₱{product.price.toFixed(2)}
                    </span>
                    <Badge variant={product.stockQty > 0 ? "default" : "destructive"}>
                      {product.stockQty > 0 ? `In Stock (${product.stockQty})` : 'Out of Stock'}
                    </Badge>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <Separator />

                {/* Quantity Selector */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="font-medium">Quantity:</span>
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(quantity - 1)}
                        disabled={quantity <= 1}
                        className="rounded-r-none"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => updateQuantity(parseInt(e.target.value) || 1)}
                        className="w-16 text-center rounded-none border-x-0"
                        min="1"
                        max={product.stockQty}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(quantity + 1)}
                        disabled={quantity >= product.stockQty}
                        className="rounded-l-none"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stockQty === 0}
                    size="lg"
                    className="w-full"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {product.stockQty > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>

                <Separator />

                {/* Product Features */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-5 w-5 text-brand-blue-dark" />
                    <span>Premium Quality</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-5 w-5 text-brand-blue-dark" />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-5 w-5 text-brand-blue-dark" />
                    <span>Warranty Included</span>
                  </div>
                </div>

                {/* Specifications */}
                {Object.keys(product.specs).length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                    <div className="bg-white rounded-lg p-4 space-y-2">
                      {Object.entries(product.specs).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b last:border-b-0">
                          <span className="font-medium capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="text-gray-600">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-brand-blue-dark mb-6">Related Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((relatedProduct) => (
                    <motion.div
                      key={relatedProduct.id}
                      whileHover={{ y: -6 }}
                      transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    >
                      <Card className="group cursor-pointer rounded-2xl overflow-hidden transition-shadow md:hover:shadow-xl">
                        <Link to={`/products/${categorySlug}/${relatedProduct.slug}`}>
                          <div className="aspect-[4/3] overflow-hidden">
                            <img
                              src={relatedProduct.images[0]}
                              alt={relatedProduct.name}
                              className="w-full h-full object-cover transition-transform duration-300 md:group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-brand-blue-dark mb-2 transition-colors duration-300 md:group-hover:text-[#FFD700]">
                              {relatedProduct.name}
                            </h3>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-brand-blue-dark">
                                ₱{relatedProduct.price.toFixed(2)}
                              </span>
                              <Badge variant={relatedProduct.stockQty > 0 ? "default" : "destructive"}>
                                {relatedProduct.stockQty > 0 ? 'In Stock' : 'Out'}
                              </Badge>
                            </div>
                          </CardContent>
                        </Link>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
