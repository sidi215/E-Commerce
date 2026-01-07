'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';

// Force dynamic rendering to avoid SSR issues with translations
export const dynamic = 'force-dynamic';

interface Farmer {
  id: string;
  name: string;
  region: string;
  products: string[];
  rating: number;
  image: string;
  description: string;
  verified: boolean;
}

export default function FarmersListPage() {
  const locale = useLocale();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  // API URL - sera configuré pour le back-end
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/api/farmers/`);
        if (!mounted) return;
        
        if (response.ok) {
          const data = await response.json();
          setFarmers(Array.isArray(data) ? data : data.results || []);
        } else {
          setError('Failed to fetch farmers');
        }
      } catch (err) {
        if (mounted) setError('Error loading farmers');
        console.error('Failed to fetch farmers', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [API_URL]);

  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch = farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         farmer.products.some((product) => product.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRegion = selectedRegion === 'all' || farmer.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const regions = ['all', 'Guidimaka', 'Gorgol', 'Brakna', 'Tarza', 'Trarza', 'Autre'];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">⭐</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">⭐</span>);
    }
    
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">⭐</span>);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Chargement...</h3>
            <p className="text-gray-600">Chargement des agriculteurs depuis le serveur</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">❌</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Erreur</h3>
            <p className="text-gray-600">{error}</p>
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <Link href={`/${locale}/dashboard_ach`} className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
                <span className="mr-2">←</span>
                Retour au dashboard
              </Link>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">👥 Liste des Agriculteurs</h1>
              <p className="text-gray-600">Découvrez nos agriculteurs partenaires</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recherche
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un agriculteur..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Région
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region === 'all' ? 'Toutes les régions' : region}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Farmers Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Chargement...</div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-xl text-red-600">{error}</div>
          </div>
        ) : filteredFarmers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-600">Aucun agriculteur trouvé</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFarmers.map((farmer) => (
              <Card key={farmer.id} hover className="overflow-hidden">
                <div className="relative">
                  <img
                    src={farmer.image}
                    alt={farmer.name}
                    className="w-full h-48 object-cover"
                  />
                  {farmer.verified && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      ✓ Vérifié
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{farmer.name}</h3>
                    <div className="flex items-center">
                      {renderStars(farmer.rating)}
                      <span className="ml-2 text-sm text-gray-600">({farmer.rating})</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">📍 {farmer.region}</p>
                  <p className="text-gray-700 mb-4 text-sm">{farmer.description}</p>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Produits:</h4>
                    <div className="flex flex-wrap gap-2">
                      {farmer.products.map((product, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link href={`/${locale}/dashboard_ach/farmer/${farmer.id}`}>
                    <Button variant="primary" fullWidth>
                      Voir le profil
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
