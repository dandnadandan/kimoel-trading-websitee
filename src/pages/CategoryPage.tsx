import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { getCategoryBySlug, getProducts } from '@/services/api';
import { Category, Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'newest'>('name');
  const [priceRange, setPriceRange] = useState<'all' | '0-1000' | '1000-3000' | '3000+'>('all');

  const { data: categoryResponse, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', categorySlug],
    queryFn: () => getCategoryBySlug(categorySlug!),
    enabled: !!categorySlug,
  });

  const { data: productsResponse, isLoading: productsLoading } = useQuery({
    queryKey: ['products', categorySlug],
    queryFn: () => getProducts(categorySlug),
    enabled: !!categorySlug,
  });

  const category = categoryResponse?.data;
  let products = productsResponse?.data || [];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesPrice = true;
    if (priceRange === '0-1000') {
      matchesPrice = product.price <= 1000;
    } else if (priceRange === '1000-3000') {
      matchesPrice = product.price > 1000 && product.price <= 3000;
    } else if (priceRange === '3000+') {
      matchesPrice = product.price > 3000;
    }

    return matchesSearch && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'price') {
      return a.price - b.price;
    } else if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  const gridVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0 },
  };

  if (categoryLoading || productsLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-14 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-xl p-4">
                    <div className="h-40 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!category || !categoryResponse?.success) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-14 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-red-600 mb-4">Category Not Found</h2>
              <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
              <Link to="/products">
                <Button>Back to Products</Button>
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
              <span className="text-brand-blue-dark font-medium">{category.name}</span>
            </nav>

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
              <Link to="/products">
                <Button variant="outline" className="mb-2 sm:mb-0">
                  ← Back to Categories
                </Button>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-brand-blue-dark text-center w-full sm:w-auto">
                {category.name}
              </h1>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={(value: 'name' | 'price' | 'newest') => setSortBy(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price">Price: Low to High</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>

                {/* Price Range */}
                <Select value={priceRange} onValueChange={(value: 'all' | '0-1000' | '1000-3000' | '3000+') => setPriceRange(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Price range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="0-1000">Under $1,000</SelectItem>
                    <SelectItem value="1000-3000">$1,000 - $3,000</SelectItem>
                    <SelectItem value="3000+">Over $3,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {sortedProducts.length} of {products.length} products
              </p>
            </div>

            {/* Products Grid */}
            {sortedProducts.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={gridVariants}
              >
                {sortedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  >
                    <Card className="group cursor-pointer rounded-2xl overflow-hidden transition-shadow md:hover:shadow-xl">
                      <Link to={`/products/${categorySlug}/${product.slug}`}>
                        <div className="aspect-[4/3] overflow-hidden">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 md:group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <CardContent className="p-4 sm:p-6">
                          <h3 className="text-lg sm:text-xl font-semibold text-brand-blue-dark mb-2 transition-colors duration-300 md:group-hover:text-[#FFD700]">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xl font-bold text-brand-blue-dark">
                              ₱{product.price.toFixed(2)}
                            </span>
                            <span className={`text-sm px-2 py-1 rounded ${
                              product.stockQty > 0 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.stockQty > 0 ? `In Stock (${product.stockQty})` : 'Out of Stock'}
                            </span>
                          </div>
                          <Button className="w-full" disabled={product.stockQty === 0}>
                            {product.stockQty > 0 ? 'View Details' : 'Out of Stock'}
                          </Button>
                        </CardContent>
                      </Link>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Filter className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
