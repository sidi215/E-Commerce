'use client';
'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { Farmer } from '@/types/farmer';
import Card from '@/components/Card';
import CardProduct from '@/components/CardProduct';
import Button from '@/components/Button';
import Modal from '@/components/Modal';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('@/components/FarmersMap'), {
  ssr: false,
});

export default function BuyersPage() {
  const t = useTranslations('buyers');
  const locale = useLocale();
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [showFarmerModal, setShowFarmerModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // Immediate input state (debounced into `searchTerm`)
  const [searchInput, setSearchInput] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [productsFromApi, setProductsFromApi] = useState<any[]>([]);

  // Debounce the search input to avoid filtering on every keystroke
  useEffect(() => {
    const id = setTimeout(() => {
      setSearchTerm(searchInput.trim());
    }, 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  // Farmers are loaded from API; no client-side sample data
  const effectiveFarmers = farmers;
  const filteredFarmers = effectiveFarmers.filter((farmer) => {
    const matchesSearch = farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) || farmer.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || farmer.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  // Fetch farmers and products from backend API
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const [fRes, pRes] = await Promise.all([
          fetch(`${API_URL}/api/farmers/`),
          fetch(`${API_URL}/api/products/`),
        ]);

        if (!mounted) return;

        if (fRes.ok) {
          const fdata = await fRes.json();
          setFarmers(Array.isArray(fdata) ? fdata : fdata.results || []);
        }

        if (pRes.ok) {
          const pdata = await pRes.json();
          setProductsFromApi(Array.isArray(pdata) ? pdata : pdata.results || []);
        }
      } catch (err) {
        console.error('Failed to fetch API data', err);
      }
    }
    load();
    return () => { mounted = false; };
  }, [API_URL]);

  // Aggregate products published by farmers into a single list
  type ProductItem = { id: string; name: string; farmerId: string; farmerName: string; region: string; category: string; imageUrl?: string };

  const productCategory = (productName: string) => {
    const lower = productName.toLowerCase();
    if (['tomates', 'oignons', 'pommes de terre', 'carottes'].some((p) => lower.includes(p))) return 'Légumes';
    if (['dattes', 'melons'].some((p) => lower.includes(p))) return 'Fruits';
    return 'Autres';
  };

  const allProducts: ProductItem[] = (productsFromApi && productsFromApi.length > 0)
    ? productsFromApi.map((p: any) => {
        const farmer = (farmers || []).find((f: any) => String(f.id) === String(p.farmer));
        return {
          id: String(p.id),
          name: p.name,
          farmerId: String(p.farmer),
          farmerName: farmer?.name || p.farmer_name || 'Producteur',
          region: farmer?.region || p.region || '',
          category: p.category || productCategory(p.name),
          imageUrl: p.image_url || '',
        };
      })
    : [];

  const filteredProducts = allProducts.filter((prod) => {
    const matchesText = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) || prod.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) || prod.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || prod.region === selectedRegion;
    const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
    return matchesText && matchesRegion && matchesCategory;
  });

  // Cart and product detail modal
  const [cart, setCart] = useState<{ productId: string; qty: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  const getImageUrl = (prod: any) => prod?.imageUrl || prod?.image_url || `https://via.placeholder.com/600x400.png?text=${encodeURIComponent(prod?.name || 'Produit')}`;

  const addToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.productId === productId);
      if (existing) return prev.map((p) => (p.productId === productId ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { productId, qty: 1 }];
    });
    // simple UX: close modal after adding
    setShowProductModal(false);
  };

  const handleMarkerClick = (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    setShowFarmerModal(true);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🛒 {t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
          
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card hover className="bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center justify-between p-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">👥 Profils d'Agriculteurs</h3>
                <p className="text-gray-700 mb-4">Voir les profils complets des agriculteurs</p>
                <Link href={`/${locale}/dashboard_ach/farmers`}>
                  <Button variant="primary" fullWidth>Voir les profils</Button>
                </Link>
              </div>
              <div className="text-6xl opacity-20">👥</div>
            </div>
          </Card>

          <Card hover className="bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center justify-between p-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">💬 Messagerie</h3>
                <p className="text-gray-700 mb-4">Contacter directement un producteur</p>
                <Link href={`/${locale}/dashboard_ach/messagerie`}>
                  <Button variant="primary" fullWidth>Accéder à la messagerie</Button>
                </Link>
              </div>
              <div className="text-6xl opacity-20">💬</div>
            </div>
          </Card>
        </div>

        {/* Products List */}
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-xl font-medium text-gray-700 mb-2">Marketplace</h3>
          <p className="text-gray-600 mb-6">Découvrez tous les produits disponibles sur la marketplace</p>
          <Link href={`/${locale}/dashboard_ach/marketplace/public`}>
            <Button variant="primary" size="lg">
              🛒 Voir la Marketplace
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}

