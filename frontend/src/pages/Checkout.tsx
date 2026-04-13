import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Truck, MessageCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  deliveryInstructions?: string;
}

// Mon numéro WhatsApp (format international sans le +)
const MY_WHATSAPP_NUMBER = "221777203162";

// Configuration pour les cookies
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isRemembered, setIsRemembered] = useState(false);
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Dakar',
    country: 'Sénégal',
    deliveryInstructions: ''
  });

  // 👈 NOUVEAU : Charger les infos du client si cookie existe
  useEffect(() => {
    const loadCustomerData = async () => {
      try {
        const response = await fetch(`${API_URL}/customers/me`, {
          credentials: 'include' // Important pour envoyer le cookie
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.customer) {
            setFormData({
              firstName: data.customer.firstName || '',
              lastName: data.customer.lastName || '',
              email: data.customer.email || '',
              phone: data.customer.phone || '',
              address: data.customer.address?.street || '',
              city: data.customer.address?.city || 'Dakar',
              country: data.customer.address?.country || 'Sénégal',
              deliveryInstructions: data.customer.deliveryInstructions || ''
            });
            setIsRemembered(true);
          }
        }
      } catch (error) {
        console.error('Erreur chargement client:', error);
      }
    };
    
    loadCustomerData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateWhatsAppMessage = (orderData: any, orderId: string) => {
    const itemsList = orderData.items.map((item: any) => {
      let itemText = `• ${item.productName} x${item.quantity}`;
      if (item.size) itemText += ` (Taille: ${item.size})`;
      if (item.color) itemText += ` (Couleur: ${item.color})`;
      itemText += ` - ${item.totalPrice} FCFA`;
      return itemText;
    }).join('\n');

    const message = 
`NOUVELLE COMMANDE AVEON 🛒

Commande #${orderId.slice(-8)}

👤 Client: ${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}
📞 Téléphone: ${orderData.customerInfo.phone}
📧 Email: ${orderData.customerInfo.email}

📍 Adresse de livraison:
${orderData.customerInfo.address.street}
${orderData.customerInfo.address.city}, ${orderData.customerInfo.address.country}

📝 Instructions: ${orderData.customerInfo.deliveryInstructions || 'Aucune'}

📦 Articles commandés:
${itemsList}

💰 Total: ${orderData.total} FCFA
💳 Paiement: À la livraison

Merci de traiter cette commande rapidement ! 🙏`;

    return encodeURIComponent(message);
  };

  const redirectToWhatsApp = (orderData: any, orderId: string) => {
    const message = generateWhatsAppMessage(orderData, orderId);
    window.open(`https://wa.me/${MY_WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }

    setLoading(true);

    try {
      // 1. Préparer les données de la commande (format attendu par backend modifié)
      const orderData = {
        items: cart.map(item => ({
          productId: item.product._id,
          productName: item.product.nom,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.product.prix,
          totalPrice: item.product.prix * item.quantity
        })),
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.address,
            city: formData.city,
            country: formData.country
          },
          deliveryInstructions: formData.deliveryInstructions
        },
        paymentMethod: 'Paiement à la livraison',
        total: getCartTotal()
      };

      // 2. Envoyer la commande au backend AVEC les cookies
      const response = await fetch(`${API_URL}/commandes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 👈 TRÈS IMPORTANT : envoie et reçoit les cookies
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création de la commande');
      }

      const result = await response.json();
      
      // 3. Rediriger vers WhatsApp
      const orderId = result.commandeId;
      redirectToWhatsApp(orderData, orderId);
      
      // 4. Attendre un peu que WhatsApp s'ouvre
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // 5. Envoyer l'email de confirmation
      try {
        await fetch(`${API_URL}/notifications/send-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId: result.commandeId || result._id,
            orderData,
            customerEmail: formData.email
          })
        });
        console.log('✅ Email envoyé');
      } catch (emailError) {
        console.error('Erreur envoi email:', emailError);
      }
      
      // 6. Vider le panier
      clearCart();
      
      // 7. Rediriger vers la confirmation
      setTimeout(() => {
        navigate(`/order-confirmation/${orderId}`);
      }, 2000);
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au panier
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Finaliser la commande</h1>
          
          {/* 👈 BANNER SI CLIENT RECONNU */}
          {isRemembered && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-700 text-sm">
                ✅ Bon retour {formData.firstName} ! Vos informations ont été pré-remplies.
              </p>
            </div>
          )}
          
          {/* Indicateur d'étape */}
          <div className="flex items-center justify-center mt-8">
            <div className={`flex items-center ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                ${step >= 1 ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300'}`}>
                1
              </div>
              <span className="ml-2">Livraison</span>
            </div>
            <div className="w-12 h-0.5 mx-4 bg-gray-300"></div>
            <div className={`flex items-center ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                ${step >= 2 ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300'}`}>
                2
              </div>
              <span className="ml-2">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
          {step === 1 ? (
            // Étape 1 : Informations de livraison
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-5 h-5 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">Informations de livraison</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+221 XX XXX XX XX"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse complète *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Numéro, rue, quartier"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ville *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pays *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions de livraison (optionnel)
                </label>
                <textarea
                  name="deliveryInstructions"
                  value={formData.deliveryInstructions}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Point de repère, code d'accès, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
            </div>
          ) : (
            // Étape 2 : Confirmation de la commande
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">Confirmation de commande</h2>
              </div>

              {/* Message important sur la redirection WhatsApp */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 rounded-full p-2">
                    <MessageCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800 text-lg mb-1">
                      Dernière étape : Confirmation WhatsApp
                    </h3>
                    <p className="text-blue-700">
                      Après avoir cliqué sur "Confirmer la commande", vous serez automatiquement redirigé vers 
                      WhatsApp avec un message pré-rempli contenant tous les détails.
                      <strong className="block mt-2">Il vous suffit d'appuyer sur "Envoyer" pour finaliser votre commande.</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Message de paiement à la livraison */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 rounded-full p-2">
                    <Truck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800 text-lg mb-1">
                      Paiement à la livraison
                    </h3>
                    <p className="text-green-700">
                      Vous paierez <span className="font-bold">{getCartTotal()} FCFA</span> à la réception de votre commande.
                      Notre livreur acceptera les espèces et Mobile Money.
                    </p>
                  </div>
                </div>
              </div>

              {/* Résumé de la commande */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Récapitulatif de la commande</h3>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.customId} className="flex justify-between text-sm">
                      <div>
                        <span className="font-medium text-gray-900">{item.product.nom}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                        {item.size && <span className="text-gray-500 ml-2">- Taille {item.size}</span>}
                        {item.color && <span className="text-gray-500 ml-2">- {item.color}</span>}
                      </div>
                      <span className="font-medium text-gray-900">
                        {(item.product.prix * item.quantity)} FCFA
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total à payer</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {getCartTotal()} FCFA
                    </span>
                  </div>
                </div>
              </div>

              {/* Informations de livraison */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Adresse de livraison</h3>
                <p className="text-gray-600">
                  {formData.firstName} {formData.lastName}<br />
                  {formData.address}<br />
                  {formData.city}, {formData.country}<br />
                </p>
                <p className="text-gray-600 mt-2">
                  <span className="font-medium">Téléphone:</span> {formData.phone}<br />
                  <span className="font-medium">Email:</span> {formData.email}
                </p>
                {formData.deliveryInstructions && (
                  <p className="text-gray-600 mt-2">
                    <span className="font-medium">Instructions:</span> {formData.deliveryInstructions}
                  </p>
                )}
              </div>

              {/* Mentions légales */}
              <p className="text-xs text-gray-500 text-center">
                En confirmant votre commande, vous acceptez nos conditions générales de vente et notre politique de confidentialité.
              </p>
            </div>
          )}

          {/* Boutons */}
          <div className="mt-8 flex justify-between">
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Retour
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`ml-auto px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center font-medium`}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {step === 1 ? 'Continuer' : 'Confirmer la commande'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}