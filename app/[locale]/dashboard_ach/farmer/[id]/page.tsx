'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';
import CardProduct from '@/components/CardProduct';

interface FarmerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  region: string;
  profilePhoto?: string;
  joinDate: string;
  rating: number;
  totalProducts: number;
  availableProducts: number;
  totalSales: number;
  totalRevenue: number;
  products: Array<{
    id: string;
    name: string;
    price: number;
    unit: string;
    quantity: number;
    category: string;
    status: 'available' | 'outOfStock';
    image?: string;
  }>;
}

export default function FarmerProfilePage() {
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations('farmerProfile');
  const farmerId = params.id as string;
  
  const [farmer, setFarmer] = useState<FarmerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState<number>(0);
  const [showAdded, setShowAdded] = useState<{ name: string } | null>(null);

  // initialize cart count from localStorage
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('cart') : null;
      const items = raw ? JSON.parse(raw) : [];
      setCartCount(Array.isArray(items) ? items.reduce((s: number, it: any) => s + (it.qty || 0), 0) : 0);
    } catch (err) {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    // Load farmer profile from backend
    let mounted = true;
    (async () => {
      try {
        const api = await import('@/lib/api');
        const data = await api.apiGet(`/api/farmers/${farmerId}/`);
        if (!mounted) return;
        if (!data) {
          setFarmer(null);
          setLoading(false);
          return;
        }
        // normalize fields to FarmerProfile shape where possible
        const fp: FarmerProfile = {
          id: String(data.id),
          name: data.name || data.username || 'Agriculteur',
          email: data.email || '',
          phone: data.phone || data.contact || '',
          location: data.location || data.city || '',
          region: data.region || '',
          profilePhoto: data.profile_image || data.image_url || '',
          joinDate: data.joinDate || data.created_at || new Date().toISOString(),
          rating: Number(data.rating || 0),
          totalProducts: Number(data.totalProducts || (data.products ? data.products.length : 0)),
          availableProducts: Number(data.availableProducts || 0),
          totalSales: Number(data.totalSales || 0),
          totalRevenue: Number(data.totalRevenue || 0),
          products: Array.isArray(data.products) ? data.products : [],
        } as FarmerProfile;
        setFarmer(fp);
      } catch (err) {
        console.error('Failed to load farmer profile', err);
        setFarmer(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [farmerId]);

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">🌾</div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="min-h-screen py-8 px-4 bg-gray-50 flex items-center justify-center">
        <Card className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Agriculteur non trouvé</h2>
          <p className="text-gray-600 mb-4">L'agriculteur que vous recherchez n'existe pas.</p>
          <Link href={`/${locale}/dashboard_ach`}>
            <Button variant="primary">Retour aux acheteurs</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/${locale}/dashboard_ach`} className="text-green-600 hover:text-green-700 mb-4 inline-block">
            ← Retour
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">👨‍🌾 {farmer.name}</h1>
          <p className="text-gray-600">{t('profile')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Informations principales */}
          <div className="lg:col-span-1 space-y-6">
            {/* Photo de profil et infos de base */}
            <Card>
              <div className="text-center mb-6">
                <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-4 border-4 border-green-200">
                  {farmer.profilePhoto ? (
                    <img src={farmer.profilePhoto} alt={farmer.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span>👨‍🌾</span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{farmer.name}</h2>
                <p className="text-gray-600">📍 {farmer.location}, {farmer.region}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-semibold">{farmer.rating}</span>
                  <span className="text-gray-500 text-sm">({farmer.totalSales} ventes)</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    📞 {t('phone')}
                  </span>
                  <a href={`tel:${farmer.phone}`} className="font-semibold text-green-600 hover:text-green-700">
                    {farmer.phone}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    📧 {t('email')}
                  </span>
                  <a href={`mailto:${farmer.email}`} className="font-semibold text-green-600 hover:text-green-700 text-sm">
                    {farmer.email}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    📅 {t('memberSince')}
                  </span>
                  <span className="font-medium">
                    {new Date(farmer.joinDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </Card>

            {/* Statistiques */}
            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{t('statistics')}</h3>
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{farmer.totalProducts}</div>
                  <div className="text-sm text-gray-600">{t('totalProducts')}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{farmer.availableProducts}</div>
                  <div className="text-sm text-gray-600">{t('availableProducts')}</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">{farmer.totalSales}</div>
                  <div className="text-sm text-gray-600">{t('totalSales')}</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="text-3xl font-bold text-yellow-600">{farmer.totalRevenue.toLocaleString()} MRU</div>
                  <div className="text-sm text-gray-600">{t('totalRevenue')}</div>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <Card>
              <div className="space-y-3">
                <Link href={`/${locale}/messaging?farmer=${farmer.id}`}>
                  <Button variant="primary" fullWidth>
                    💬 {t('sendMessage')}
                  </Button>
                </Link>
                <a href={`tel:${farmer.phone}`}>
                  <Button variant="outline" fullWidth>
                    📞 {t('call')}
                  </Button>
                </a>
              </div>
            </Card>
          </div>

          {/* Main Content - Produits */}
          <div className="lg:col-span-2">
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('products')} ({farmer.products.length})
                </h2>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {farmer.availableProducts} {t('available')}
                  </span>
                </div>
              </div>

              {farmer.products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {farmer.products.map((product) => (
                    <div key={product.id} className="animate-scale-in">
                      <CardProduct
                        id={product.id}
                        name={product.name}
                        price={product.price}
                        unit={product.unit}
                        image={product.image}
                        farmer={farmer.name}
                        location={farmer.location}
                        quantity={product.quantity}
                        rating={farmer.rating}
                        onAddToCart={(pid: string) => {
                          // find product details
                          const prod = farmer.products.find((p) => String(p.id) === String(pid)) as any;
                          try {
                            const raw = localStorage.getItem('cart');
                            const cart = raw ? JSON.parse(raw) : [];
                            const existing = cart.find((it: any) => String(it.productId) === String(pid));
                            if (existing) {
                              existing.qty = (existing.qty || 0) + 1;
                            } else {
                              cart.push({ productId: pid, qty: 1, name: prod?.name || product.name, price: prod?.price || product.price });
                            }
                            localStorage.setItem('cart', JSON.stringify(cart));
                            setCartCount(cart.reduce((s: number, it: any) => s + (it.qty || 0), 0));
                            setShowAdded({ name: prod?.name || product.name });
                            setTimeout(() => setShowAdded(null), 2500);
                          } catch (err) {
                            console.error('Failed to update cart', err);
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-600">{t('noProducts')}</p>
                </div>
              )}
            </Card>
          </div>
        </div>
        {/* Floating cart button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Link href={`/${locale}/dashboard_ach/commande_ach`} className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-full shadow-lg">
            🛒 Panier ({cartCount})
          </Link>
        </div>

        {/* Toast confirmation */}
        {showAdded && (
          <div className="fixed bottom-24 right-6 z-50">
            <div className="bg-green-600 text-white px-4 py-2 rounded shadow">Ajouté au panier: {showAdded.name}</div>
          </div>
        )}
      </div>
    </div>
  );
}

