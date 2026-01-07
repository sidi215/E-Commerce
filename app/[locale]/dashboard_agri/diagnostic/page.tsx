 'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';

export default function DiagnosticPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    disease: string;
    confidence: number;
    description: string;
    treatment: string[];
  } | null>(null);
  const [showResult, setShowResult] = useState(false);
  const locale = useLocale();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    // Simuler l'analyse ML (à remplacer par un appel API réel)
    setTimeout(() => {
      setResult({
        disease: 'Mildiou de la tomate',
        confidence: 87,
        description: 'Le mildiou est une maladie fongique courante qui affecte les plants de tomates. Elle se caractérise par des taches brunes sur les feuilles et les fruits.',
        treatment: [
          'Retirer les feuilles infectées immédiatement',
          'Appliquer un fongicide à base de cuivre',
          'Améliorer la circulation d\'air autour des plants',
          'Éviter l\'arrosage des feuilles',
          'Consulter un expert pour confirmation'
        ]
      });
      setIsAnalyzing(false);
      setShowResult(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🔍 Diagnostic IA des Maladies</h1>
          <p className="text-gray-600">
            Prenez une photo de votre plante malade et obtenez un diagnostic en quelques secondes
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Précision : 85-90% | Toujours vérifier avec un expert en cas de doute
          </p>
          <div className="mt-4">
            <Link href={`/${locale}/dashboard_agri`} className="inline-block text-sm text-green-600 hover:text-green-800">
              ← Retour
            </Link>
          </div>
        </div>

        <Card className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Étape 1 : Télécharger une photo</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors duration-300">
            {selectedImage ? (
              <div className="space-y-4 animate-scale-in">
                <div className="relative inline-block">
                  <img src={selectedImage} alt="Plante" className="max-h-64 mx-auto rounded-lg shadow-lg" />
                  <div className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md">
                    <span className="text-green-600 text-xl">✓</span>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setSelectedImage(null)}>
                  Changer l'image
                </Button>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div className="text-6xl mb-4 transform hover:scale-110 transition-transform duration-300">📷</div>
                <p className="text-gray-600 mb-4">Cliquez pour télécharger ou glissez-déposez une image</p>
                <label className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-green-700 transition-all duration-200 hover:shadow-lg active:scale-95">
                  Choisir un fichier
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </Card>

        {selectedImage && (
          <Card className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Étape 2 : Analyser</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>Conseil :</strong> Pour de meilleurs résultats, prenez la photo en plein jour avec une bonne lumière, 
                en vous concentrant sur les parties affectées de la plante (feuilles, tiges, fruits).
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              loading={isAnalyzing}
            >
              {!isAnalyzing && '🔬 Lancer l\'analyse IA'}
            </Button>
          </Card>
        )}

        {/* Result Modal */}
        <Modal
          isOpen={showResult}
          onClose={() => setShowResult(false)}
          title="Résultat du Diagnostic"
          size="lg"
        >
          {result && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{result.disease}</h3>
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {result.confidence}% de confiance
                  </span>
                </div>
                <p className="text-gray-700">{result.description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">💊 Traitement recommandé :</h4>
                <ul className="space-y-2">
                  {result.treatment.map((step, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-600 font-bold">{index + 1}.</span>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Important :</strong> Ce diagnostic est fourni à titre informatif. 
                  En cas de doute ou pour des cas graves, consultez toujours un expert agricole.
                </p>
              </div>

              <div className="flex gap-4">
                <Button variant="primary" fullWidth onClick={() => {
                  setShowResult(false);
                  setSelectedImage(null);
                  setResult(null);
                }}>
                  Nouveau diagnostic
                </Button>
                <Button variant="outline" fullWidth onClick={() => setShowResult(false)}>
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Supported Diseases */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🌿 Maladies supportées</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
            ].map((disease, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                {disease}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

