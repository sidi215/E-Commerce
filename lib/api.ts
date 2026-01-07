import { Product, Farmer, Order } from '@/types/api';

// Mock data for development
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Tomates Fraîches',
    price: 25,
    unit: 'kg',
    farmer: 1,
    farmer_name: 'Ferme du Soleil',
    region: 'Tunis',
    quantity: 100,
    rating: 4.5,
    category: 'Légumes'
  },
  {
    id: 2,
    name: 'Pommes de Terre',
    price: 15,
    unit: 'kg',
    farmer: 1,
    farmer_name: 'Ferme du Soleil',
    region: 'Tunis',
    quantity: 200,
    rating: 4.2,
    category: 'Légumes'
  }
];

const mockSales: Sale[] = [
  {
    id: 1,
    product: 1,
    buyer: 2,
    quantity: 10,
    total: 250,
    status: 'completed',
    date: '2024-01-15'
  },
  {
    id: 2,
    product: 2,
    buyer: 3,
    quantity: 5,
    total: 75,
    status: 'pending',
    date: '2024-01-16'
  }
];

// API interface
export interface Sale {
  id: string | number;
  product: string | number;
  buyer: string | number;
  quantity: number;
  total: number;
  status?: string;
  date?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  }

  // Products
  async getProducts(): Promise<Product[]> {
    // In development, return mock data
    if (process.env.NODE_ENV === 'development') {
      return new Promise(resolve => setTimeout(() => resolve(mockProducts), 100));
    }
    
    const response = await fetch(`${this.baseUrl}/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    // In development, return mock data
    if (process.env.NODE_ENV === 'development') {
      const newProduct: Product = {
        id: mockProducts.length + 1,
        name: productData.name || 'Nouveau Produit',
        price: productData.price || 0,
        unit: productData.unit || 'kg',
        farmer: 1,
        farmer_name: 'Ferme du Soleil',
        region: 'Tunis',
        quantity: productData.quantity || 0,
        rating: 0,
        category: productData.category || 'Autre'
      };
      mockProducts.push(newProduct);
      return new Promise(resolve => setTimeout(() => resolve(newProduct), 100));
    }
    
    const response = await fetch(`${this.baseUrl}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    return response.json();
  }

  // Sales
  async getSales(): Promise<Sale[]> {
    // In development, return mock data
    if (process.env.NODE_ENV === 'development') {
      return new Promise(resolve => setTimeout(() => resolve(mockSales), 100));
    }
    
    const response = await fetch(`${this.baseUrl}/sales`);
    if (!response.ok) {
      throw new Error('Failed to fetch sales');
    }
    return response.json();
  }

  async createSale(saleData: Partial<Sale>): Promise<Sale> {
    const response = await fetch(`${this.baseUrl}/sales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saleData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create sale');
    }
    return response.json();
  }

  // Farmers
  async getFarmers(): Promise<Farmer[]> {
    const response = await fetch(`${this.baseUrl}/farmers`);
    if (!response.ok) {
      throw new Error('Failed to fetch farmers');
    }
    return response.json();
  }

  async getFarmer(id: string | number): Promise<Farmer> {
    const response = await fetch(`${this.baseUrl}/farmers/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch farmer');
    }
    return response.json();
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    const response = await fetch(`${this.baseUrl}/orders`);
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    return response.json();
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const response = await fetch(`${this.baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create order');
    }
    return response.json();
  }
}

export const api = new ApiClient();
export type { Product, Farmer, Order, Sale };
