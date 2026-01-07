'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';

interface Parcelle {
  id: string;
  nom: string;
  culture: string;
  localisation: string;
  superficie: number;
  datePlantation: string;
  stade: string;
  etatSante: 'excellent' | 'bon' | 'moyen' | 'critique';
  notes: string;
  photo?: string;
}

export default function DashboardPlantesPage() {
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const [showParcelleModal, setShowParcelleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingParcelle, setEditingParcelle] = useState<Parcelle | null>(null);
  const [parcelles, setParcelles] = useState<Parcelle[]>([]);
  const [meteo, setMeteo] = useState<any>(null);

  // API URL - sera configuré pour le back-end
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Fetch weather data from API
  useEffect(() => {
    let mounted = true;
    async function loadWeather() {
      try {
        const response = await fetch(`${API_URL}/api/weather/`);
        if (!mounted) return;
        
        if (response.ok) {
          const data = await response.json();
          setMeteo(data);
        }
      } catch (err) {
        console.error('Failed to fetch weather data', err);
      }
    }
    loadWeather();
    return () => { mounted = false; };
  }, [API_URL]);

  // Fetch parcels from API
  useEffect(() => {
    let mounted = true;
    async function loadParcels() {
      try {
        const response = await fetch(`${API_URL}/api/farmer/parcels/`);
        if (!mounted) return;
        
        if (response.ok) {
          const data = await response.json();
          setParcelles(Array.isArray(data) ? data : data.results || []);
        }
      } catch (err) {
        console.error('Failed to fetch parcels', err);
      }
    }
    loadParcels();
    return () => { mounted = false; };
  }, [API_URL]);

  const handleCreateParcelle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch(`${API_URL}/api/farmer/parcels/`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const nouvelleParcelle = await response.json();
        setParcelles([...parcelles, nouvelleParcelle]);
        setShowParcelleModal(false);
        e.currentTarget.reset();
      } else {
        console.error('Failed to create parcel');
      }
    } catch (err) {
      console.error('Error creating parcel', err);
    }
  };

  const handleEditParcelle = (parcelle: Parcelle) => {
    setEditingParcelle(parcelle);
    setShowEditModal(true);
  };

  const handleUpdateParcelle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingParcelle) return;
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch(`${API_URL}/api/farmer/parcels/${editingParcelle.id}/`, {
        method: 'PUT',
        body: formData,
      });
      
      if (response.ok) {
        const updatedParcelle = await response.json();
        setParcelles(parcelles.map(p => p.id === editingParcelle.id ? updatedParcelle : p));
        setShowEditModal(false);
        setEditingParcelle(null);
      } else {
        console.error('Failed to update parcel');
      }
    } catch (err) {
      console.error('Error updating parcel', err);
    }
  };

  const handleDeleteParcelle = async (parcelleId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette parcelle ?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/farmer/parcels/${parcelleId}/`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setParcelles(parcelles.filter(p => p.id !== parcelleId));
      } else {
        console.error('Failed to delete parcel');
      }
    } catch (err) {
      console.error('Error deleting parcel', err);
    }
  };

  const getEtatSanteColor = (etat: string) => {
    switch (etat) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'bon': return 'bg-blue-100 text-blue-800';
      case 'moyen': return 'bg-yellow-100 text-yellow-800';
      case 'critique': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMeteoIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'ensoleillé': return '☀️';
      case 'nuageux': return '☁️';
      case 'pluvieux': return '🌧️';
      case 'orageux': return '⛈️';
      default: return '🌤️';
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/${locale}/dashboard_agri`} className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <span className="mr-2">←</span>
            Retour au dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🌱 Gestion des Plantes</h1>
          <p className="text-gray-600">Suivi technique de vos parcelles et conditions météo</p>
        </div>

        {/* Météo Actuelle */}
        {meteo && (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">🌤️ État Météo - {meteo.region}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="text-3xl mb-2">{getMeteoIcon(meteo.prevision)}</div>
                  <p className="text-sm text-gray-600">Condition</p>
                  <p className="font-semibold">{meteo.prevision}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🌡️</div>
                  <p className="text-sm text-gray-600">Température</p>
                  <p className="font-semibold">{meteo.temperature}°C</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">💧</div>
                  <p className="text-sm text-gray-600">Humidité</p>
                  <p className="font-semibold">{meteo.humidite}%</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">💨</div>
                  <p className="text-sm text-gray-600">Vent</p>
                  <p className="font-semibold">{meteo.vent} km/h</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">🌧️</div>
                  <p className="text-sm text-gray-600">Pluie</p>
                  <p className="font-semibold">{meteo.pluie} mm</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-2">☀️</div>
                  <p className="text-sm text-gray-600">Ensoleillement</p>
                  <p className="font-semibold">{meteo.soleil}</p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Actions Rapides */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Liste des Parcelles */}
          <Card className="lg:col-span-2">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">📍 Mes Parcelles</h3>
                <Button 
                  variant="primary" 
                  onClick={() => setShowParcelleModal(true)}
                >
                  + Nouvelle parcelle
                </Button>
              </div>
              
              {parcelles.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🌱</div>
                  <p className="text-gray-600 mb-4">Aucune parcelle enregistrée</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowParcelleModal(true)}
                  >
                    Enregistrer votre première parcelle
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {parcelles.map((parcelle) => (
                    <div key={parcelle.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-48 bg-gray-200">
                        {parcelle.photo ? (
                          <img
                            src={parcelle.photo}
                            alt={parcelle.culture}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-4xl">
                            🌱
                          </div>
                        )}
                        <span className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs ${getEtatSanteColor(parcelle.etatSante)}`}>
                          {parcelle.etatSante}
                        </span>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{parcelle.nom}</h4>
                            <p className="text-sm text-gray-600">{parcelle.culture} • {parcelle.localisation}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-gray-500">Superficie</p>
                            <p className="text-sm font-medium">{parcelle.superficie} ha</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Date plantation</p>
                            <p className="text-sm font-medium">{parcelle.datePlantation}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Stade</p>
                            <p className="text-sm font-medium">{parcelle.stade}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">ID</p>
                            <p className="text-sm font-medium">#{parcelle.id.slice(-6)}</p>
                          </div>
                        </div>
                        
                        {parcelle.notes && (
                          <p className="text-sm text-gray-600 mb-3">{parcelle.notes}</p>
                        )}
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditParcelle(parcelle)}
                            className="flex-1"
                          >
                            ✏️ Modifier
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteParcelle(parcelle.id)}
                            className="flex-1 text-red-600 hover:text-red-700 hover:border-red-300"
                          >
                            🗑️ Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Statistiques */}
          <Card>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Statistiques</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total parcelles</span>
                  <span className="text-2xl font-bold text-green-600">{parcelles.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Superficie totale</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {parcelles.reduce((sum, p) => sum + p.superficie, 0)} ha
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Parcelles saines</span>
                  <span className="text-2xl font-bold text-green-600">
                    {parcelles.filter(p => p.etatSante === 'excellent' || p.etatSante === 'bon').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Attention requise</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {parcelles.filter(p => p.etatSante === 'moyen' || p.etatSante === 'critique').length}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Modal Ajout Parcelle */}
        <Modal 
          isOpen={showParcelleModal} 
          onClose={() => setShowParcelleModal(false)} 
          title="Enregistrer une nouvelle parcelle"
        >
          <form onSubmit={handleCreateParcelle}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la parcelle</label>
                  <input
                    type="text"
                    name="nom"
                    required
                    placeholder="ex: Champ Nord"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Culture</label>
                  <input
                    type="text"
                    name="culture"
                    required
                    placeholder="ex: Tomates"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Photo de la plante</label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">Formats acceptés: JPG, PNG, GIF (max 5MB)</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                  <input
                    type="text"
                    name="localisation"
                    required
                    placeholder="ex: Guidimaka"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Superficie (ha)</label>
                  <input
                    type="number"
                    name="superficie"
                    step="0.1"
                    required
                    placeholder="ex: 2.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date plantation</label>
                  <input
                    type="date"
                    name="datePlantation"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stade</label>
                  <select
                    name="stade"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="semis">Semis</option>
                    <option value="levée">Levée</option>
                    <option value="croissance">Croissance</option>
                    <option value="floraison">Floraison</option>
                    <option value="recolte">Récolte</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">État de santé</label>
                <select
                  name="etatSante"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Sélectionner...</option>
                  <option value="excellent">Excellent</option>
                  <option value="bon">Bon</option>
                  <option value="moyen">Moyen</option>
                  <option value="critique">Critique</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  rows={3}
                  placeholder="Observations particulières..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" variant="primary">
                  Enregistrer la parcelle
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowParcelleModal(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          </form>
        </Modal>

        {/* Modal Modification */}
        <Modal 
          isOpen={showEditModal} 
          onClose={() => {
            setShowEditModal(false);
            setEditingParcelle(null);
          }} 
          title="Modifier la parcelle"
        >
          {editingParcelle && (
            <form onSubmit={handleUpdateParcelle}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la parcelle</label>
                    <input
                      type="text"
                      name="nom"
                      defaultValue={editingParcelle.nom}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Culture</label>
                    <input
                      type="text"
                      name="culture"
                      defaultValue={editingParcelle.culture}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Photo de la plante</label>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Laissez vide pour conserver l'image actuelle</p>
                  {editingParcelle.photo && (
                    <img 
                      src={editingParcelle.photo} 
                      alt="Photo actuelle" 
                      className="mt-2 h-20 w-20 object-cover rounded"
                    />
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                    <input
                      type="text"
                      name="localisation"
                      defaultValue={editingParcelle.localisation}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Superficie (ha)</label>
                    <input
                      type="number"
                      name="superficie"
                      step="0.1"
                      defaultValue={editingParcelle.superficie}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date plantation</label>
                    <input
                      type="date"
                      name="datePlantation"
                      defaultValue={editingParcelle.datePlantation}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stade</label>
                    <select
                      name="stade"
                      defaultValue={editingParcelle.stade}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="semis">Semis</option>
                      <option value="levée">Levée</option>
                      <option value="croissance">Croissance</option>
                      <option value="floraison">Floraison</option>
                      <option value="recolte">Récolte</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">État de santé</label>
                  <select
                    name="etatSante"
                    defaultValue={editingParcelle.etatSante}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="bon">Bon</option>
                    <option value="moyen">Moyen</option>
                    <option value="critique">Critique</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    name="notes"
                    defaultValue={editingParcelle.notes}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" variant="primary">
                    Mettre à jour
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingParcelle(null);
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Modal>
      </div>
    </div>
  );
}
