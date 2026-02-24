import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/services/api';
import { Category } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const Products: React.FC = () => {
  const { data: categoriesResponse, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const categories = categoriesResponse?.data || [];

  const gridVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0 },
  };

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

  if (error || !categoriesResponse?.success) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-14 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-red-600 mb-4">Error Loading Categories</h2>
              <p className="text-gray-600">Please try again later.</p>
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
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-blue-dark mb-3 md:mb-4">
                Our Products
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our range of electrical, mechanical, automation, and tooling products.
              </p>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={gridVariants}
            >
              {categories.map((category) => (
                <Link key={category.id} to={`/products/${category.slug}`}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    variants={itemVariants}
                  >
                    <Card className="group text-left bg-white rounded-2xl overflow-hidden shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 md:hover:shadow-xl">
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-300 md:group-hover:scale-105"
                          loading="lazy"
                        />
                      </div>
                      <CardContent className="p-4 sm:p-5">
                        <h3 className="text-lg sm:text-xl font-semibold text-brand-blue-dark md:group-hover:text-[#FFD700] transition-colors duration-300">
                          {category.name}
                        </h3>
                        <p className="mt-1 text-sm sm:text-base text-gray-600">
                          {category.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
