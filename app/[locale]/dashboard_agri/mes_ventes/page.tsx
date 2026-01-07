'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Modal from '@/components/Modal';

interface Sale {
  id: string;
  productId?: string;
  productName: string;
  productImage: string;
  origin: string; // Nom de la plante d'origine
  farmerId?: string;
  farmerName?: string;
  buyerId?: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  status: 'pending_payment' | 'ready_for_shipment' | 'shipped' | 'completed' | 'cancelled';
  createdAt: string;
  harvestDate: string;
  location: string;
}

export default function MesVentesPage() {
  const t = useTranslations('dashboard');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  // API URL - sera configuré pour le back-end
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Fetch sales from API
  useEffect(() => {
    let mounted = true;
    async function loadSales() {
      try {
        const response = await fetch(`${API_URL}/api/farmer/sales/`);
        if (!mounted) return;
        
        if (response.ok) {
          const data = await response.json();
          setSales(Array.isArray(data) ? data : data.results || []);
        }
      } catch (err) {
        console.error('Failed to fetch sales', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadSales();
    return () => { mounted = false; };
  }, [API_URL]);

  const getStatusColor = (status: Sale['status']) => {
    switch (status) {
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ready_for_shipment':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Sale['status']) => {
    switch (status) {
      case 'pending_payment':
        return 'En attente de paiement';
      case 'ready_for_shipment':
        return 'Prêt pour expédition';
      case 'shipped':
        return 'Expédié';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  const updateSaleStatus = async (saleId: string, newStatus: Sale['status']) => {
    try {
      const response = await fetch(`${API_URL}/api/farmer/sales/${saleId}/status/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        setSales(sales.map(sale => 
          sale.id === saleId ? { ...sale, status: newStatus } : sale
        ));
      } else {
        console.error('Failed to update sale status');
      }
    } catch (err) {
      console.error('Error updating sale status', err);
    }
  };

  const filteredSales = filterStatus === 'all' 
    ? sales 
    : sales.filter(sale => sale.status === filterStatus);

  const stats = {
    total: sales.length,
    pending_payment: sales.filter(s => s.status === 'pending_payment').length,
    ready_for_shipment: sales.filter(s => s.status === 'ready_for_shipment').length,
    shipped: sales.filter(s => s.status === 'shipped').length,
    completed: sales.filter(s => s.status === 'completed').length,
    totalRevenue: sales
      .filter(s => s.status === 'completed')
      .reduce((sum, s) => sum + s.totalPrice, 0)
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard_agri">
              <Button variant="outline" size="sm">
                ← Retour au dashboard
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🌾 Mes Ventes</h1>
          <p className="text-gray-600">Suivez vos ventes de produits récoltés</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats.total}</div>
            <div className="text-gray-600 text-sm">Total des ventes</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-yellow-600">{stats.pending_payment}</div>
            <div className="text-gray-600 text-sm">En attente de paiement</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.ready_for_shipment}</div>
            <div className="text-gray-600 text-sm">Prêts pour expédition</div>
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats.totalRevenue.toFixed(2)} €</div>
            <div className="text-gray-600 text-sm">Revenus totaux</div>
          </Card>
        </div>

        {/* Filtres */}
        <Card className="mb-6">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-medium text-gray-700">Filtrer par statut:</span>
            {[
              { value: 'all', label: 'Tous' },
              { value: 'pending_payment', label: 'En attente de paiement' },
              { value: 'ready_for_shipment', label: 'Prêt pour expédition' },
              { value: 'shipped', label: 'Expédié' },
              { value: 'completed', label: 'Terminé' }
            ].map(filter => (
              <Button
                key={filter.value}
                variant={filterStatus === filter.value ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(filter.value)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </Card>

        {/* Liste des ventes */}
        <div className="space-y-4">
          {filteredSales.map(sale => (
            <Card key={sale.id} hover={true}>
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Image produit */}
                <div className="lg:w-48">
                  <img 
                    src={sale.productImage} 
                    alt={sale.productName}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>

                {/* Informations principales */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{sale.productName}</h3>
                      <p className="text-sm text-gray-600 mb-2">📍 {sale.origin}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>📅 Récolté le: {sale.harvestDate}</span>
                        <span>📍 {sale.location}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(sale.status)}`}>
                      {getStatusText(sale.status)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Quantité</div>
                      <div className="font-semibold">{sale.quantity} {sale.unit}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Prix unitaire</div>
                      <div className="font-semibold">{sale.unitPrice} €/{sale.unit}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Total</div>
                      <div className="font-semibold text-green-600">{sale.totalPrice} €</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Date de vente</div>
                      <div className="font-semibold">{sale.createdAt}</div>
                    </div>
                  </div>

                  {/* Informations acheteur */}
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">👤 Acheteur</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Nom:</span> {sale.buyerName}
                      </div>
                      <div>
                        <span className="text-gray-600">Email:</span> {sale.buyerEmail}
                      </div>
                      <div>
                        <span className="text-gray-600">Téléphone:</span> {sale.buyerPhone}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedSale(sale);
                        setShowDetailsModal(true);
                      }}
                    >
                      👁️ Voir détails
                    </Button>
                    
                    {sale.status === 'pending_payment' && (
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => updateSaleStatus(sale.id, 'ready_for_shipment')}
                      >
                        ✅ Confirmer paiement
                      </Button>
                    )}
                    
                    {sale.status === 'ready_for_shipment' && (
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => updateSaleStatus(sale.id, 'shipped')}
                      >
                        🚚 Marquer comme expédié
                      </Button>
                    )}
                    
                    {sale.status === 'shipped' && (
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => updateSaleStatus(sale.id, 'completed')}
                      >
                        ✅ Confirmer livraison
                      </Button>
                    )}
                    
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => updateSaleStatus(sale.id, 'cancelled')}
                    >
                      ❌ Annuler
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Modal détails */}
        {showDetailsModal && selectedSale && (
          <Modal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            title={`Détails de la vente - ${selectedSale.productName}`}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Informations produit</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-gray-600">Produit:</span> {selectedSale.productName}</div>
                    <div><span className="text-gray-600">Origine:</span> {selectedSale.origin}</div>
                    <div><span className="text-gray-600">Quantité:</span> {selectedSale.quantity} {selectedSale.unit}</div>
                    <div><span className="text-gray-600">Prix unitaire:</span> {selectedSale.unitPrice} €</div>
                    <div><span className="text-gray-600">Total:</span> {selectedSale.totalPrice} €</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Informations acheteur</h4>
                  <div className="space-y-1 text-sm">
                    <div><span className="text-gray-600">Nom:</span> {selectedSale.buyerName}</div>
                    <div><span className="text-gray-600">Email:</span> {selectedSale.buyerEmail}</div>
                    <div><span className="text-gray-600">Téléphone:</span> {selectedSale.buyerPhone}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Informations logistiques</h4>
                <div className="space-y-1 text-sm">
                  <div><span className="text-gray-600">Date de récolte:</span> {selectedSale.harvestDate}</div>
                  <div><span className="text-gray-600">Lieu:</span> {selectedSale.location}</div>
                  <div><span className="text-gray-600">Date de vente:</span> {selectedSale.createdAt}</div>
                  <div><span className="text-gray-600">Statut actuel:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium border ${getStatusColor(selectedSale.status)}`}>
                      {getStatusText(selectedSale.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Message si aucune vente */}
        {filteredSales.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-gray-500">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                {filterStatus === 'all' ? 'Aucune vente pour le moment' : `Aucune vente avec le statut: ${getStatusText(filterStatus as any)}`}
              </h3>
              <p className="text-gray-600">
                {filterStatus === 'all' 
                  ? 'Vos produits mis en vente apparaîtront ici dès que des acheteurs les commanderont.'
                  : 'Essayez de changer le filtre pour voir d\'autres ventes.'
                }
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}