'use client';

import Card from '@/components/Card';
import Button from '@/components/Button';

export default function AdminMLModelPage() {
  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🤖 Gestion du Modèle ML</h1>
          <p className="text-gray-600">Gérez le modèle d'intelligence artificielle de diagnostic</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Model Stats */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Statistiques du modèle</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Précision globale</span>
                  <span className="font-bold text-green-600">87.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-green-600 h-2 rounded-full transition-all duration-500 animate-fade-in" style={{ width: '87.5%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Diagnostics effectués</span>
                  <span className="font-bold">1,234</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Maladies supportées</span>
                  <span className="font-bold">15</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Dernière mise à jour</span>
                  <span className="font-bold">2024-01-15</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Model Actions */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-3">
              <Button variant="primary" fullWidth>
                🔄 Entraîner le modèle
              </Button>
              <Button variant="outline" fullWidth>
                📊 Voir les métriques détaillées
              </Button>
              <Button variant="outline" fullWidth>
                📥 Télécharger le modèle
              </Button>
              <Button variant="outline" fullWidth>
                📤 Uploader un nouveau modèle
              </Button>
            </div>
          </Card>

          {/* Supported Diseases */}
          <Card className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Maladies supportées</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'Mildiou de la tomate',
                'Oïdium',
                'Pourriture des racines',
                'Taches foliaires',
                'Rouille',
                'Anthracnose',
                'Flétrissement bactérien',
                'Virus de la mosaïque',
                'Nématodes',
                'Champignons',
                'Maladies des dattes',
                'Maladies des oignons',
                'Maladies des pommes de terre',
                'Maladies des melons',
                'Maladies des carottes',
              ].map((disease, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg text-sm">
                  <div className="flex items-center justify-between">
                    <span>{disease}</span>
                    <button className="text-red-500 hover:text-red-700">✕</button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4">
              + Ajouter une maladie
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

