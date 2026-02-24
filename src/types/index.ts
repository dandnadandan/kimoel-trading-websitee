export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  images: string[];
  price: number;
  stockQty: number;
  description: string;
  specs: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerInfo: {
    name: string;
    company?: string;
    email: string;
    phone: string;
    address: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  type: 'gcash' | 'cod' | 'bank_transfer';
  details: {
    gcashNumber?: string;
    gcashName?: string;
    referenceNumber?: string;
    bankName?: string;
    accountNumber?: string;
    accountName?: string;
  };
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  addedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
