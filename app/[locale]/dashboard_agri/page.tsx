'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';

export default function FarmerDashboard() {
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const [showProductModal, setShowProductModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  // API URL - sera configuré pour le back-end
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Fetch products from API
  useEffect(() => {
    let mounted = true;
    async function loadProducts() {
      try {
        const response = await fetch(`${API_URL}/api/farmer/products/`);
        if (!mounted) return;
        
        if (response.ok) {
          const data = await response.json();
          setProducts(Array.isArray(data) ? data : data.results || []);
        }
      } catch (err) {
        console.error('Failed to fetch farmer products', err);
      }
    }
    loadProducts();
    return () => { mounted = false; };
  }, [API_URL]);

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch(`${API_URL}/api/farmer/products/`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const newProduct = await response.json();
        setProducts([...products, newProduct]);
        setShowProductModal(false);
        e.currentTarget.reset();
      } else {
        console.error('Failed to create product');
      }
    } catch (err) {
      console.error('Error creating product', err);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch(`${API_URL}/api/farmer/products/${editingProduct.id}/`, {
        method: 'PUT',
        body: formData,
      });
      
      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
        setShowEditModal(false);
        setEditingProduct(null);
      } else {
        console.error('Failed to update product');
      }
    } catch (err) {
      console.error('Error updating product', err);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/farmer/products/${productId}/`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setProducts(products.filter(p => p.id !== productId));
      } else {
        console.error('Failed to delete product');
      }
    } catch (err) {
      console.error('Error deleting product', err);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🌾 Tableau de Bord Agriculteur
          </h1>
          <p className="text-gray-600">Gérez vos produits, vos ventes et votre profil</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card hover className="bg-gradient-to-br from-green-50 to-green-100">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">👤 Mon Profil</h3>
              <p className="text-gray-700 mb-4">Gérez vos informations personnelles</p>
              <Link href={`/${locale}/dashboard_agri/profile`}>
                <Button variant="primary" fullWidth>Voir le profil</Button>
              </Link>
            </div>
          </Card>

          <Card hover className="bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">💬 Messagerie</h3>
              <p className="text-gray-700 mb-4">Communiquez avec les acheteurs</p>
              <Link href={`/${locale}/dashboard_agri/messagerie`}>
                <Button variant="primary" fullWidth>Messagerie</Button>
              </Link>
            </div>
          </Card>

          <Card hover className="bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">🤖 Diagnostics</h3>
              <p className="text-gray-700 mb-4">Analysez la santé de vos plantes</p>
              <Link href={`/${locale}/dashboard_agri/diagnostic`}>
                <Button variant="primary" fullWidth>Diagnostics</Button>
              </Link>
            </div>
          </Card>

          <Card hover className="bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">💰 Mes Ventes</h3>
              <p className="text-gray-700 mb-4">Suivez vos ventes et revenus</p>
              <Link href={`/${locale}/dashboard_agri/mes_ventes`}>
                <Button variant="primary" fullWidth>Mes Ventes</Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Additional Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card hover className="bg-gradient-to-br from-teal-50 to-teal-100">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">🌱 Gestion des Plantes</h3>
              <p className="text-gray-700 mb-4">Suivez vos parcelles et l'état météo</p>
              <Link href={`/${locale}/dashboard_agri/dashboard_meteo`}>
                <Button variant="primary" fullWidth>Gestion des Plantes</Button>
              </Link>
            </div>
          </Card>

          <Card hover className="bg-gradient-to-br from-indigo-50 to-indigo-100">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">📊 Rapports</h3>
              <p className="text-gray-700 mb-4">Analysez vos performances agricoles</p>
              <Button variant="outline" fullWidth disabled>Bientôt disponible</Button>
            </div>
          </Card>
        </div>

        {/* Products Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Product Management */}
          <Card className="lg:col-span-2">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">📦 Mes Produits</h3>
                <Button 
                  variant="primary" 
                  onClick={() => setShowProductModal(true)}
                >
                  + Ajouter un produit
                </Button>
              </div>
              
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">📦</div>
                  <p className="text-gray-600 mb-4">Aucun produit publié</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowProductModal(true)}
                  >
                    Publier votre premier produit
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-48 bg-gray-200">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-4xl">
                            🥬
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
                        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-lg font-bold text-green-600">
                            {product.price} {product.unit}
                          </span>
                          <span className="text-sm text-gray-500">
                            {product.quantity} {product.unit}
                          </span>
                        </div>
                        <div className="flex gap-2 mb-3">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {product.category}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            Disponible
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                            className="flex-1"
                          >
                            ✏️ Modifier
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
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

          {/* Stats */}
          <Card>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Statistiques</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Produits actifs</span>
                  <span className="text-2xl font-bold text-green-600">{products.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ventes ce mois</span>
                  <span className="text-2xl font-bold text-blue-600">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Revenus totaux</span>
                  <span className="text-2xl font-bold text-purple-600">45,000 MRU</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Notifications */}
        <Card>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🔔 Notifications</h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">Nouvelle commande de tomates</p>
                <p className="text-xs text-green-600">Il y a 2 heures</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">Message d'un acheteur</p>
                <p className="text-xs text-blue-600">Il y a 5 heures</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-800">Diagnostic disponible</p>
                <p className="text-xs text-purple-600">Hier</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Edit Product Modal */}
        <Modal 
          isOpen={showEditModal} 
          onClose={() => {
            setShowEditModal(false);
            setEditingProduct(null);
          }} 
          title="Modifier le produit"
        >
          {editingProduct && (
            <form onSubmit={handleUpdateProduct}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du produit
                  </label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingProduct.name}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo du produit
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Laissez vide pour conserver l'image actuelle</p>
                  {editingProduct.image && (
                    <img 
                      src={editingProduct.image} 
                      alt="Image actuelle" 
                      className="mt-2 h-20 w-20 object-cover rounded"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={editingProduct.description}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix
                    </label>
                    <input
                      type="number"
                      name="price"
                      step="0.01"
                      defaultValue={editingProduct.price}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unité
                    </label>
                    <input
                      type="text"
                      name="unit"
                      defaultValue={editingProduct.unit}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantité
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      defaultValue={editingProduct.quantity}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catégorie
                    </label>
                    <input
                      type="text"
                      name="category"
                      defaultValue={editingProduct.category}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
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
                      setEditingProduct(null);
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Modal>

        {/* Add Product Modal */}
        <Modal 
          isOpen={showProductModal} 
          onClose={() => setShowProductModal(false)} 
          title="Ajouter un produit"
        >
          <form onSubmit={handleCreateProduct}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du produit
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo du produit
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">Formats acceptés: JPG, PNG, GIF (max 5MB)</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix
                  </label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unité
                  </label>
                  <input
                    type="text"
                    name="unit"
                    defaultValue="kg"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantité
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <input
                    type="text"
                    name="category"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" variant="primary">
                  Ajouter le produit
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowProductModal(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
