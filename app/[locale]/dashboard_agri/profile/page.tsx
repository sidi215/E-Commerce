'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    region: '',
    userType: 'Agriculteur',
    joinDate: '',
    totalSales: 0,
    totalRevenue: 0,
    rating: 0,
  });
  const [loading, setLoading] = useState(true);

  // API URL - sera configuré pour le back-end
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Fetch profile data from API
  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      try {
        const response = await fetch(`${API_URL}/api/farmer/profile/`);
        if (!mounted) return;
        
        if (response.ok) {
          const data = await response.json();
          setProfileData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            region: data.region || '',
            userType: data.user_type || 'Agriculteur',
            joinDate: data.join_date || '',
            totalSales: data.total_sales || 0,
            totalRevenue: data.total_revenue || 0,
            rating: data.rating || 0,
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile data', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadProfile();
    return () => { mounted = false; };
  }, [API_URL]);

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_URL}/api/farmer/profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          region: profileData.region,
        }),
      });
      
      if (response.ok) {
        setIsEditing(false);
      } else {
        console.error('Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile', err);
    }
  };

  const locale = useLocale();

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Chargement...</h3>
            <p className="text-gray-600">Chargement du profil depuis le serveur</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <Link href={`/${locale}/dashboard_agri`} className="text-sm text-gray-600 hover:underline">← {"Retour au tableau"}</Link>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">👤 Mon Profil</h1>
          <p className="text-gray-600">Gérez vos informations personnelles</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Informations personnelles</h2>
                <Button
                  variant={isEditing ? 'secondary' : 'outline'}
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                  {isEditing ? 'Enregistrer' : 'Modifier'}
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Région
                  </label>
                  {isEditing ? (
                    <select
                      value={profileData.region}
                      onChange={(e) => setProfileData({ ...profileData, region: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option>Guidimaka</option>
                      <option>Gorgol</option>
                      <option>Brakna</option>
                      <option>Tarza</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{profileData.region}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de compte
                  </label>
                  <p className="text-gray-900">{profileData.userType}</p>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Changer le mot de passe</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <Button variant="primary">Mettre à jour le mot de passe</Button>
              </div>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <Card>
              <div className="text-center mb-4">
                  <div className="w-28 h-28 bg-green-100 rounded-full flex flex-col items-center justify-center text-center mx-auto mb-4">
                    <div className="text-4xl">👤</div>
                    <div className="text-sm font-medium mt-1">Mon Profil</div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{profileData.name}</h3>
                  <p className="text-gray-600">{profileData.userType}</p>
              </div>
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Membre depuis</span>
                  <span className="font-medium">{new Date(profileData.joinDate).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Note</span>
                  <span className="font-medium">⭐ {profileData.rating}</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Statistiques</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold text-green-600">{profileData.totalSales}</div>
                  <div className="text-sm text-gray-600">Ventes totales</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{profileData.totalRevenue.toLocaleString()} MRU</div>
                  <div className="text-sm text-gray-600">Revenus totaux</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

