'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import ProductCard from '@/components/ProductCard';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Link from 'next/link';

export default function MarketplaceDashboardPage() {
  const t = useTranslations('marketplace');
  const locale = useLocale();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<{ productId: string; qty: number }[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(`${API_URL}/api/products/`);
        if (response.ok) {
          const data = await response.json();
          setProducts(Array.isArray(data) ? data : data.results || []);
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [API_URL]);

  // Transform products for display
  const transformedProducts = products.map((p: any) => ({
    id: String(p.id),
    name: p.name,
    price: p.price || 0,
    unit: p.unit || 'kg',
    image: p.image_url || '',
    farmer: p.farmer_name || 'Producteur',
    location: p.region || 'Région',
    quantity: p.quantity || 0,
    rating: p.rating || 0,
    category: p.category || 'Autres',
  }));

  // Filter products
  const filteredProducts = transformedProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.farmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || product.location === selectedRegion;
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesRegion && matchesCategory;
  });

  // Add to cart function
  const addToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.productId === productId);
      if (existing) {
        return prev.map((p) => (p.productId === productId ? { ...p, qty: p.qty + 1 } : p));
      }
      return [...prev, { productId, qty: 1 }];
    });
  };

  const categories = ['Légumes', 'Fruits', 'Céréales', 'Autres'];
  const regions = ['Nouakchott', 'Nouadhibou', 'Kiffa', 'Kaédi', 'Rosso'];

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header with back button */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Link href={`/${locale}/dashboard_ach`} className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
                <span className="mr-2">←</span>
                Retour au dashboard
              </Link>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">🛒 {t('title')}</h1>
              <p className="text-gray-600">{t('subtitle')}</p>
            </div>
            {cart.length > 0 && (
              <div className="p-4 bg-green-100 rounded-lg">
                <p className="text-green-800">
                  🛒 Panier: {cart.reduce((sum, item) => sum + item.qty, 0)} articles
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Région</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">Toutes les régions</option>
                {regions.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedRegion('all');
                }}
                fullWidth
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </Card>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-600">Essayez de modifier vos filtres de recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                addToCart={addToCart}
                isDashboard={true} // Dashboard : ajoute au panier
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
