// src/pages/OrderConfirmation.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowLeft } from 'lucide-react';

interface Order {
  _id: string;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
  total: number;
  date: string;
}

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`http://localhost:5000/api/commandes/${id}`);
        if (!response.ok) throw new Error('Commande non trouvée');
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Commande non trouvée</h1>
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Merci pour votre commande !</h1>
          <p className="text-gray-600 mb-6">
            Un email de confirmation a été envoyé à {order.customerInfo.email}
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-blue-800 text-sm">
              <strong>✓ Commande envoyée sur WhatsApp</strong><br />
              Vous avez été redirigé vers WhatsApp pour nous notifier. 
              Notre équipe traitera votre commande dans les plus brefs délais.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-gray-600" />
              <h2 className="font-semibold text-gray-900">Détails de la commande</h2>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">Commande #{order._id.slice(-8)}</p>
            <p className="text-sm text-gray-600 mb-4">
              {new Date(order.date).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>

            <div className="space-y-2 mb-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.productName} x{item.quantity}
                    {item.size && ` - Taille ${item.size}`}
                    {item.color && ` - ${item.color}`}
                  </span>
                  <span className="text-gray-900 font-medium">
                    {(item.price * item.quantity)} FCFA
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span>{order.total} FCFA</span>
            </div>
          </div>

          <Link
            to="/#collection"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continuer vos achats
          </Link>
        </div>
      </div>
    </div>
  );
}