'use client';

import Card from '@/components/Card';
import Button from '@/components/Button';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function OrdersPage() {
  // Les commandes seront chargées depuis l'API backend
  const orders: Array<any> = [];
  const locale = useLocale();

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusText = {
    completed: 'Terminée',
    pending: 'En attente',
    processing: 'En cours',
    cancelled: 'Annulée',
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="../dashboard_ach" className="text-sm text-green-600 hover:underline"> ←Retour</Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📦 Mes Commandes</h1>
          <p className="text-gray-600">Suivez l'historique de vos commandes</p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Commande {order.id}</h3>
                  <p className="text-sm text-gray-600">
                    Date : {new Date(order.date).toLocaleDateString('fr-FR')} | 
                    Agriculteur : {order.farmer}
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status as keyof typeof statusColors]}`}>
                    {statusText[order.status as keyof typeof statusText]}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Articles :</h4>
                <ul className="space-y-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.name} - {item.quantity} {item.unit}
                      </span>
                      <span className="text-gray-900 font-medium">
                        {item.price * item.quantity} MRU
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between items-center border-t pt-4">
                <div>
                  <span className="text-sm text-gray-600">Total :</span>
                  <span className="text-2xl font-bold text-gray-900 ml-2">{order.total} MRU</span>
                </div>
                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <Button variant="danger" size="sm">
                      Annuler
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Détails
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {orders.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune commande</h3>
            <p className="text-gray-600 mb-4">Vous n'avez pas encore passé de commande</p>
            <a href="/dashboard_ach">
              <Button variant="primary">
                Explorer le marché
              </Button>
            </a>
          </Card>
        )}
      </div>
    </div>
  );
}

