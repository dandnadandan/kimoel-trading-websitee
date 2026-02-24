import { Category, Product, Order } from '@/types';
import { seedCategories, seedProducts } from './seedData';

// Simple in-memory database with localStorage persistence
class Database {
  private categories: Category[] = [];
  private products: Product[] = [];
  private orders: Order[] = [];
  private readonly STORAGE_KEY = 'kimoel_database';

  constructor() {
    this.loadFromStorage();
    if (this.categories.length === 0) {
      this.seedDatabase();
    }
  }

  private loadFromStorage() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        this.categories = parsed.categories || [];
        this.products = parsed.products || [];
        this.orders = parsed.orders || [];
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      const data = {
        categories: this.categories,
        products: this.products,
        orders: this.orders,
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  private seedDatabase() {
    this.categories = [...seedCategories];
    this.products = [...seedProducts];
    this.orders = [];
    this.saveToStorage();
  }

  // Categories
  getCategories(): Category[] {
    return this.categories.filter(cat => cat.isActive);
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return this.categories.find(cat => cat.slug === slug && cat.isActive);
  }

  getCategoryById(id: string): Category | undefined {
    return this.categories.find(cat => cat.id === id);
  }

  // Products
  getProducts(categorySlug?: string): Product[] {
    let products = this.products.filter(product => product.isActive);
    
    if (categorySlug) {
      const category = this.getCategoryBySlug(categorySlug);
      if (category) {
        products = products.filter(product => product.categoryId === category.id);
      }
    }
    
    return products;
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.products.find(product => product.slug === slug && product.isActive);
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  // Orders
  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
    const order: Order = {
      id: this.generateId(),
      orderNumber: this.generateOrderNumber(),
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.orders.push(order);
    this.saveToStorage();
    return order;
  }

  getOrders(): Order[] {
    return this.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find(order => order.id === id);
  }

  updateOrderStatus(id: string, status: Order['status']): Order | undefined {
    const orderIndex = this.orders.findIndex(order => order.id === id);
    if (orderIndex === -1) return undefined;
    
    this.orders[orderIndex].status = status;
    this.orders[orderIndex].updatedAt = new Date().toISOString();
    this.saveToStorage();
    return this.orders[orderIndex];
  }

  // Admin methods
  createCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Category {
    const newCategory: Category = {
      ...category,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.categories.push(newCategory);
    this.saveToStorage();
    return newCategory;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | undefined {
    const category = this.categories.find(cat => cat.id === id);
    if (category) {
      Object.assign(category, updates, { updatedAt: new Date().toISOString() });
      this.saveToStorage();
    }
    return category;
  }

  deleteCategory(id: string): boolean {
    const index = this.categories.findIndex(cat => cat.id === id);
    if (index !== -1) {
      this.categories.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.products.push(newProduct);
    this.saveToStorage();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const product = this.products.find(p => p.id === id);
    if (product) {
      Object.assign(product, updates, { updatedAt: new Date().toISOString() });
      this.saveToStorage();
    }
    return product;
  }

  deleteProduct(id: string): boolean {
    const index = this.products.findIndex(p => p.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateOrderNumber(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${year}${month}${day}-${random}`;
  }
}

export const db = new Database();
