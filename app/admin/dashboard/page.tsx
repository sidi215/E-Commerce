'use client';

import CardStats from '@/components/CardStats';
import Card from '@/components/Card';

export default function AdminDashboardPage() {
  const stats = [
    { title: 'Utilisateurs totaux', value: 1250, icon: '👥', trend: { value: 12, isPositive: true } },
    { title: 'Agriculteurs', value: 850, icon: '👨‍🌾', trend: { value: 8, isPositive: true } },
    { title: 'Acheteurs', value: 400, icon: '🛒', trend: { value: 15, isPositive: true } },
    { title: 'Commandes ce mois', value: 342, icon: '📦', trend: { value: 22, isPositive: true } },
    { title: 'Revenus (MRU)', value: '1,245,000', icon: '💰', trend: { value: 18, isPositive: true } },
    { title: 'Diagnostics effectués', value: 1234, icon: '🔍', trend: { value: 25, isPositive: true } },
  ];

  const recentActivities = [
    { id: 1, type: 'user', message: 'Nouvel agriculteur inscrit : Amadou Diallo', time: 'Il y a 5 min' },
    { id: 2, type: 'order', message: 'Nouvelle commande : ORD-001', time: 'Il y a 12 min' },
    { id: 3, type: 'diagnostic', message: 'Diagnostic effectué : Mildiou détecté', time: 'Il y a 18 min' },
    { id: 4, type: 'user', message: 'Nouvel acheteur inscrit : Commerçant Kiffa', time: 'Il y a 25 min' },
  ];

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">⚙️ Tableau de bord Admin</h1>
          <p className="text-gray-600">Vue d'ensemble de la plateforme</p>
        </div>

        {/* Info Banner */}
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg animate-fade-in">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-2xl">ℹ️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Accès Admin
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Pour accéder à cette page, vous pouvez :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Cliquer sur le lien <strong>"⚙️ Admin"</strong> dans la barre de navigation (quand vous êtes connecté)</li>
                  <li>Accéder directement via l'URL : <code className="bg-blue-100 px-2 py-1 rounded">/admin/dashboard</code></li>
                </ul>
                <p className="mt-2 text-xs text-blue-600">
                  ⚠️ Note : Un système d'authentification complet sera implémenté pour sécuriser l'accès admin.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardStats {...stat} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Activités récentes</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl">
                    {activity.type === 'user' && '👤'}
                    {activity.type === 'order' && '📦'}
                    {activity.type === 'diagnostic' && '🔍'}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{activity.message}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Actions rapides</h2>
            <div className="space-y-3">
              <a
                href="/admin/users"
                className="block w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors text-center"
              >
                👥 Gérer les utilisateurs
              </a>
              <a
                href="/admin/products"
                className="block w-full border-2 border-green-600 text-green-600 px-4 py-3 rounded-lg hover:bg-green-50 transition-colors text-center"
              >
                📦 Gérer les produits
              </a>
              <a
                href="/admin/ml-model"
                className="block w-full border-2 border-green-600 text-green-600 px-4 py-3 rounded-lg hover:bg-green-50 transition-colors text-center"
              >
                🤖 Gérer le modèle ML
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

