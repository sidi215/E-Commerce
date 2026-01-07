'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function AdminProductsPage() {
  const locale = useLocale();
  const [searchTerm, setSearchTerm] = useState('');

  // Products will be loaded from backend API
  const [products, setProducts] = useState<Array<any>>([]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.farmer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href={`/${locale}/admin/dashboard`} className="text-green-600 hover:text-green-700 mb-4 inline-block transition-colors">
            ← Retour au tableau de bord admin
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📦 Gestion des Produits</h1>
          <p className="text-gray-600">Gérez tous les produits sur la plateforme</p>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un produit ou agriculteur..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <div key={product.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4">👨‍🌾 {product.farmer}</p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Prix</span>
                  <span className="font-semibold">{product.price} MRU</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock</span>
                  <span className={`font-semibold ${product.quantity === 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {product.quantity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Statut</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.status === 'active' ? 'Actif' : 'Rupture de stock'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" fullWidth>Modifier</Button>
                <Button variant="danger" size="sm" fullWidth>Supprimer</Button>
              </div>
            </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

