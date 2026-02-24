import { db } from '@/data/database';
import { ApiResponse, Category, Product, Order } from '@/types';

// Categories API
export const getCategories = (): Promise<ApiResponse<Category[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const categories = db.getCategories();
        resolve({ success: true, data: categories });
      } catch (error) {
        resolve({ success: false, error: 'Failed to fetch categories' });
      }
    }, 100); // Simulate network delay
  });
};

export const getCategoryBySlug = (slug: string): Promise<ApiResponse<Category>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const category = db.getCategoryBySlug(slug);
        if (category) {
          resolve({ success: true, data: category });
        } else {
          resolve({ success: false, error: 'Category not found' });
        }
      } catch (error) {
        resolve({ success: false, error: 'Failed to fetch category' });
      }
    }, 100);
  });
};

// Products API
export const getProducts = (categorySlug?: string): Promise<ApiResponse<Product[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const products = db.getProducts(categorySlug);
        resolve({ success: true, data: products });
      } catch (error) {
        resolve({ success: false, error: 'Failed to fetch products' });
      }
    }, 100);
  });
};

export const getProductBySlug = (slug: string): Promise<ApiResponse<Product>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const product = db.getProductBySlug(slug);
        if (product) {
          resolve({ success: true, data: product });
        } else {
          resolve({ success: false, error: 'Product not found' });
        }
      } catch (error) {
        resolve({ success: false, error: 'Failed to fetch product' });
      }
    }, 100);
  });
};

export const getProductById = (id: string): Promise<ApiResponse<Product>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const product = db.getProductById(id);
        if (product) {
          resolve({ success: true, data: product });
        } else {
          resolve({ success: false, error: 'Product not found' });
        }
      } catch (error) {
        resolve({ success: false, error: 'Failed to fetch product' });
      }
    }, 100);
  });
};

// Orders API
export const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Order>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const order = db.createOrder(orderData);
        resolve({ success: true, data: order, message: 'Order created successfully' });
      } catch (error) {
        resolve({ success: false, error: 'Failed to create order' });
      }
    }, 200);
  });
};

export const getOrders = (): Promise<ApiResponse<Order[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const orders = db.getOrders();
        resolve({ success: true, data: orders });
      } catch (error) {
        resolve({ success: false, error: 'Failed to fetch orders' });
      }
    }, 100);
  });
};

export const getOrderById = (id: string): Promise<ApiResponse<Order>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const order = db.getOrderById(id);
        if (order) {
          resolve({ success: true, data: order });
        } else {
          resolve({ success: false, error: 'Order not found' });
        }
      } catch (error) {
        resolve({ success: false, error: 'Failed to fetch order' });
      }
    }, 100);
  });
};

export const updateOrderStatus = (id: string, status: Order['status']): Promise<ApiResponse<Order>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const order = db.updateOrderStatus(id, status);
        if (order) {
          resolve({ success: true, data: order, message: 'Order status updated successfully' });
        } else {
          resolve({ success: false, error: 'Order not found' });
        }
      } catch (error) {
        resolve({ success: false, error: 'Failed to update order status' });
      }
    }, 100);
  });
};

// Admin API
export const adminApi = {
  // Categories
  createCategory: (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Category>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const category = db.createCategory(categoryData);
          resolve({ success: true, data: category, message: 'Category created successfully' });
        } catch (error) {
          resolve({ success: false, error: 'Failed to create category' });
        }
      }, 100);
    });
  },

  updateCategory: (id: string, updates: Partial<Category>): Promise<ApiResponse<Category>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const category = db.updateCategory(id, updates);
          if (category) {
            resolve({ success: true, data: category, message: 'Category updated successfully' });
          } else {
            resolve({ success: false, error: 'Category not found' });
          }
        } catch (error) {
          resolve({ success: false, error: 'Failed to update category' });
        }
      }, 100);
    });
  },

  deleteCategory: (id: string): Promise<ApiResponse<void>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const success = db.deleteCategory(id);
          if (success) {
            resolve({ success: true, message: 'Category deleted successfully' });
          } else {
            resolve({ success: false, error: 'Category not found' });
          }
        } catch (error) {
          resolve({ success: false, error: 'Failed to delete category' });
        }
      }, 100);
    });
  },

  // Products
  createProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Product>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const product = db.createProduct(productData);
          resolve({ success: true, data: product, message: 'Product created successfully' });
        } catch (error) {
          resolve({ success: false, error: 'Failed to create product' });
        }
      }, 100);
    });
  },

  updateProduct: (id: string, updates: Partial<Product>): Promise<ApiResponse<Product>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const product = db.updateProduct(id, updates);
          if (product) {
            resolve({ success: true, data: product, message: 'Product updated successfully' });
          } else {
            resolve({ success: false, error: 'Product not found' });
          }
        } catch (error) {
          resolve({ success: false, error: 'Failed to update product' });
        }
      }, 100);
    });
  },

  deleteProduct: (id: string): Promise<ApiResponse<void>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const success = db.deleteProduct(id);
          if (success) {
            resolve({ success: true, message: 'Product deleted successfully' });
          } else {
            resolve({ success: false, error: 'Product not found' });
          }
        } catch (error) {
          resolve({ success: false, error: 'Failed to delete product' });
        }
      }, 100);
    });
  },

  // Orders
  updateOrderStatus: (id: string, status: Order['status']): Promise<ApiResponse<Order>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const order = db.updateOrderStatus(id, status);
          if (order) {
            resolve({ success: true, data: order, message: 'Order status updated successfully' });
          } else {
            resolve({ success: false, error: 'Order not found' });
          }
        } catch (error) {
          resolve({ success: false, error: 'Failed to update order status' });
        }
      }, 100);
    });
  },
};
