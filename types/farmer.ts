export interface Farmer {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  products: string[];
  hasProducts: boolean;
  phone?: string;
  email?: string;
  region?: string;
}

