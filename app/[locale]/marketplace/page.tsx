'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import ProductCard from '@/components/ProductCard';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function MarketplacePage() {
  const t = useTranslations('marketplace');
  const locale = useLocale();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // API URL - sera configuré pour le back-end
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Fetch products from API
  useEffect(() => {
    let mounted = true;
    async function loadProducts() {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/products/`);
        if (!mounted) return;
        
        if (response.ok) {
          const data = await response.json();
          setProducts(Array.isArray(data) ? data : data.results || []);
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadProducts();
    return () => { mounted = false; };
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

  const categories = ['Légumes', 'Fruits', 'Céréales', 'Autres'];

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Chargement...</h3>
            <p className="text-gray-600">Chargement des produits depuis le serveur</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🛒 {t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Région</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">Toutes les régions</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-600">
              {products.length === 0 
                ? "Aucun produit disponible pour le moment" 
                : "Essayez de modifier vos filtres de recherche"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                unit={product.unit}
                image={product.image}
                farmer={product.farmer}
                location={product.location}
                quantity={product.quantity}
                rating={product.rating}
                isDashboard={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
