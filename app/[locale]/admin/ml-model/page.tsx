'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface ModelStats {
  accuracy: number;
  diagnosticsCount: number;
  supportedDiseases: number;
  lastUpdated: string;
}

interface Disease {
  id: string;
  name: string;
  confidence?: number;
}

export default function AdminMLModelPage() {
  const locale = useLocale();
  const [stats, setStats] = useState<ModelStats>({
    accuracy: 0,
    diagnosticsCount: 0,
    supportedDiseases: 0,
    lastUpdated: ''
  });
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState(false);
  const [newDisease, setNewDisease] = useState('');
  const [showAddDisease, setShowAddDisease] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Fetch model stats and diseases
  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      try {
        const [statsRes, diseasesRes] = await Promise.all([
          fetch(`${API_URL}/api/admin/ml-model/stats/`),
          fetch(`${API_URL}/api/admin/ml-model/diseases/`)
        ]);

        if (!mounted) return;

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }

        if (diseasesRes.ok) {
          const diseasesData = await diseasesRes.json();
          setDiseases(Array.isArray(diseasesData) ? diseasesData : diseasesData.results || []);
        }
      } catch (err) {
        console.error('Failed to fetch ML model data:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => { mounted = false; };
  }, [API_URL]);

  const handleTrainModel = async () => {
    setTraining(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/ml-model/train/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result = await response.json();
        alert('Entraînement du modèle démarré avec succès!');
        // Refresh stats after training
        setTimeout(() => window.location.reload(), 2000);
      } else {
        alert('Erreur lors du démarrage de l\'entraînement');
      }
    } catch (err) {
      console.error('Error training model:', err);
      alert('Erreur lors de l\'entraînement du modèle');
    } finally {
      setTraining(false);
    }
  };

  const handleDownloadModel = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/ml-model/download/`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ml-model.pkl';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Erreur lors du téléchargement du modèle');
      }
    } catch (err) {
      console.error('Error downloading model:', err);
      alert('Erreur lors du téléchargement du modèle');
    }
  };

  const handleUploadModel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('model_file', file);

    try {
      const response = await fetch(`${API_URL}/api/admin/ml-model/upload/`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert('Modèle uploadé avec succès!');
        window.location.reload();
      } else {
        alert('Erreur lors de l\'upload du modèle');
      }
    } catch (err) {
      console.error('Error uploading model:', err);
      alert('Erreur lors de l\'upload du modèle');
    }
  };

  const handleAddDisease = async () => {
    if (!newDisease.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/ml-model/diseases/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newDisease.trim()
        })
      });

      if (response.ok) {
        const newDiseaseData = await response.json();
        setDiseases([...diseases, newDiseaseData]);
        setNewDisease('');
        setShowAddDisease(false);
        alert('Maladie ajoutée avec succès!');
      } else {
        alert('Erreur lors de l\'ajout de la maladie');
      }
    } catch (err) {
      console.error('Error adding disease:', err);
      alert('Erreur lors de l\'ajout de la maladie');
    }
  };

  const handleDeleteDisease = async (diseaseId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette maladie?')) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/ml-model/diseases/${diseaseId}/`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setDiseases(diseases.filter(d => d.id !== diseaseId));
        alert('Maladie supprimée avec succès!');
      } else {
        alert('Erreur lors de la suppression de la maladie');
      }
    } catch (err) {
      console.error('Error deleting disease:', err);
      alert('Erreur lors de la suppression de la maladie');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-4xl mb-4">⏳</div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Chargement...</h3>
            <p className="text-gray-600">Chargement des données du modèle ML</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href={`/${locale}/admin/dashboard`} className="text-green-600 hover:text-green-700 mb-4 inline-block transition-colors">
            ← Retour au tableau de bord admin
          </Link>
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
                  <span className="font-bold text-green-600">{stats.accuracy.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-green-600 h-2 rounded-full transition-all duration-500 animate-fade-in" style={{ width: `${stats.accuracy}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Diagnostics effectués</span>
                  <span className="font-bold">{stats.diagnosticsCount.toLocaleString()}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Maladies supportées</span>
                  <span className="font-bold">{stats.supportedDiseases}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Dernière mise à jour</span>
                  <span className="font-bold">{new Date(stats.lastUpdated).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Model Actions */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-3">
              <Button 
                variant="primary" 
                fullWidth 
                onClick={handleTrainModel}
                disabled={training}
              >
                {training ? '🔄 Entraînement en cours...' : '🔄 Entraîner le modèle'}
              </Button>
              <Button variant="outline" fullWidth>
                📊 Voir les métriques détaillées
              </Button>
              <Button variant="outline" fullWidth onClick={handleDownloadModel}>
                📥 Télécharger le modèle
              </Button>
              <div className="relative">
                <input
                  type="file"
                  accept=".pkl,.h5,.joblib"
                  onChange={handleUploadModel}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" fullWidth>
                  📤 Uploader un nouveau modèle
                </Button>
              </div>
            </div>
          </Card>

          {/* Supported Diseases */}
          <Card className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Maladies supportées</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {diseases.map((disease) => (
                <div key={disease.id} className="bg-gray-50 p-3 rounded-lg text-sm">
                  <div className="flex items-center justify-between">
                    <span>{disease.name}</span>
                    <button 
                      onClick={() => handleDeleteDisease(disease.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {showAddDisease ? (
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={newDisease}
                  onChange={(e) => setNewDisease(e.target.value)}
                  placeholder="Nom de la nouvelle maladie"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Button onClick={handleAddDisease} disabled={!newDisease.trim()}>
                  Ajouter
                </Button>
                <Button variant="outline" onClick={() => {
                  setShowAddDisease(false);
                  setNewDisease('');
                }}>
                  Annuler
                </Button>
              </div>
            ) : (
              <Button variant="outline" className="mt-4" onClick={() => setShowAddDisease(true)}>
                + Ajouter une maladie
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

