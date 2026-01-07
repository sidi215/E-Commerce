export interface User {
  id: string | number;
  username?: string;
  email?: string;
  role?: 'agriculteur' | 'acheteur' | string;
}

export interface Farmer {
  id: string | number;
  name: string;
  region?: string;
  location?: string;
  lat?: number;
  lng?: number;
  phone?: string;
  email?: string;
  products?: string[] | Array<{ id?: string | number; name: string }>;
  hasProducts?: boolean;
}

export interface Product {
  id: string | number;
  name: string;
  price?: number;
  unit?: string;
  image_url?: string;
  farmer?: string | number;
  farmer_name?: string;
  region?: string;
  quantity?: number;
  rating?: number;
  category?: string;
}

export interface OrderItem {
  product: string | number;
  quantity: number;
}

export interface Order {
  id?: string | number;
  buyer?: string | number;
  items?: OrderItem[];
  total?: number;
  status?: string;
}

export default {};
