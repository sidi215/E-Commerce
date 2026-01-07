'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import CardPlant from '@/components/CardPlant';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';

export default function MyPlantsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    plantingDate: '',
    image: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const emptyInputRef = useRef<HTMLInputElement | null>(null);

  // Liste des plantes (à charger depuis le backend)
  const [plants, setPlants] = useState<Array<any>>([]);

  const handleAddPlant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      alert('Veuillez ajouter une photo de la plante (obligatoire).');
      return;
    }
    const newPlant = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      healthStatus: 'healthy' as const,
      location: formData.location,
      lastWatered: 'Jamais',
      image: formData.image,
    };
    setPlants([...plants, newPlant]);
    setFormData({ name: '', type: '', location: '', plantingDate: '', image: '' });
    setImagePreview(null);
    setShowAddModal(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      setImagePreview(dataUrl);
      setFormData((prev) => ({ ...prev, image: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  // Used when user selects a photo directly from the empty-state card.
  const handleImageSelectFromEmpty = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      setImagePreview(dataUrl);
      setFormData((prev) => ({ ...prev, image: dataUrl }));
      setShowAddModal(true);
    };
    reader.readAsDataURL(file);
  };

  const plantTypes = ['Légume', 'Fruit', 'Céréale', 'Herbe', 'Autre'];
  const regions = ['Guidimaka', 'Gorgol', 'Brakna', 'Tarza', 'Autre'];

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link href="../dashboard_agri/dashboard" className="text-sm text-green-600 hover:underline">← Retour</Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">🌱 Mes Plantes</h1>
            <p className="text-gray-600">Gérez et suivez la santé de vos cultures</p>
          </div>
          <div className="flex items-center gap-4">
            
            <Button variant="primary" size="lg" onClick={() => setShowAddModal(true)}>
              + Ajouter une plante
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{plants.length}</div>
              <div className="text-sm text-gray-600">Total plantes</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {plants.filter(p => p.healthStatus === 'healthy').length}
              </div>
              <div className="text-sm text-gray-600">En bonne santé</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {plants.filter(p => p.healthStatus === 'warning').length}
              </div>
              <div className="text-sm text-gray-600">Attention</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {plants.filter(p => p.healthStatus === 'sick').length}
              </div>
              <div className="text-sm text-gray-600">Malades</div>
            </div>
          </Card>
        </div>

        {/* Plants Grid */}
        {plants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants.map((plant) => (
              <CardPlant key={plant.id} {...plant} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune plante enregistrée</h3>
            <p className="text-gray-600 mb-4">Commencez par ajouter votre première plante</p>
            <div className="mt-6">
              <div className="max-w-md mx-auto border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center gap-4">
                <div className="text-4xl">📷</div>
                <div className="text-sm text-gray-500">Photo de la plante</div>
                <input
                  ref={emptyInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelectFromEmpty}
                  className="hidden"
                />
                <Button variant="primary" onClick={() => emptyInputRef.current?.click()}>
                  Choisir une photo
                </Button>
                <div className="mt-2">
                  <Button variant="outline" onClick={() => setShowAddModal(true)}>Ajouter une plante</Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Add Plant Modal */}
        <Modal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setFormData({ name: '', type: '', location: '', plantingDate: '', image: '' });
            setImagePreview(null);
          }}
          title="Ajouter une nouvelle plante"
        >
          <form onSubmit={handleAddPlant} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la plante
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Ex: Tomates, Dattes..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionnez un type</option>
                {plantTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localisation
              </label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              >
                <option value="">Sélectionnez une région</option>
                {regions.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de plantation
              </label>
              <input
                type="date"
                value={formData.plantingDate}
                onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="plant-photo" className="block text-sm font-medium text-gray-700 mb-2">
                Photo de la plante (obligatoire)
              </label>
              <input
                id="plant-photo"
                aria-describedby="plant-photo-help"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageChange}
                className="w-full"
                required
              />
              <p id="plant-photo-help" className="text-xs text-gray-500 mt-1">
                Prenez une photo claire de la plante — feuille + tige ou le fruit. Evitez les ombres; rapprochez-vous pour montrer le détail.
              </p>
              {imagePreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imagePreview} alt="Aperçu plante" className="mt-2 w-full h-40 object-cover rounded-lg" />
              )}
            </div>
           
            <div className="flex gap-4">
              <Button type="submit" variant="primary" fullWidth>
                Ajouter
              </Button>
              <Button type="button" variant="outline" fullWidth onClick={() => setShowAddModal(false)}>
                Annuler
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}

