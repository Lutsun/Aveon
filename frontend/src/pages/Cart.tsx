import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function Cart() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    clearCart,
    getItemsWithMissingOptions 
  } = useCart();
  
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const missingItems = getItemsWithMissingOptions();
  const hasMissingOptions = missingItems.length > 0;

  const handleQuantityChange = (customId: string, newQuantity: number) => {
    updateQuantity(customId, newQuantity);
  };

  const handleCheckout = () => {
    if (hasMissingOptions) {
      alert('Veuillez sélectionner la taille et/ou la couleur pour tous les articles avant de continuer');
      return;
    }
    
    setIsCheckingOut(true);
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h2>
            <p className="text-gray-600 mb-8">Découvrez notre collection et trouvez votre style</p>
            <Link
              to="/collection"
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Votre Panier</h1>
          <p className="text-gray-600 mt-2">{cart.length} article(s) dans votre panier</p>
        </div>

        {/* Alerte si options manquantes */}
        {hasMissingOptions && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Options manquantes</p>
              <p className="text-sm text-yellow-700">
                Certains articles nécessitent une sélection de taille ou de couleur.
                Veuillez les sélectionner depuis la page produit avant de continuer.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des articles */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const needsSize = item.product.tailles && item.product.tailles.length > 0;
              const needsColor = item.product.couleurs && item.product.couleurs.length > 0;
              const missingOptions = (needsSize && !item.size) || (needsColor && !item.color);

              return (
                <div 
                  key={item.customId} 
                  className={`bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row gap-4 ${
                    missingOptions ? 'border-2 border-yellow-300' : ''
                  }`}
                >
                  {/* Image du produit */}
                  <Link to={`/produit/${item.product._id}`} className="sm:w-32 h-32 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.image || 'https://via.placeholder.com/128'}
                      alt={item.product.nom}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  {/* Détails du produit */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between">
                      <div>
                        <Link to={`/produit/${item.product._id}`} className="hover:text-gray-600">
                          <h3 className="font-semibold text-gray-900">{item.product.nom}</h3>
                        </Link>
                        
                        {/* Affichage des options sélectionnées ou manquantes */}
                        {needsSize && (
                          <p className={`text-sm mt-1 ${item.size ? 'text-gray-600' : 'text-red-500 font-medium'}`}>
                            Taille: {item.size || 'Non sélectionnée ⚠️'}
                          </p>
                        )}
                        {needsColor && (
                          <p className={`text-sm ${item.color ? 'text-gray-600' : 'text-red-500 font-medium'}`}>
                            Couleur: {item.color || 'Non sélectionnée ⚠️'}
                          </p>
                        )}
                        
                        {missingOptions && (
                          <Link 
                            to={`/produit/${item.product._id}`}
                            className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                          >
                            Cliquez ici pour sélectionner
                          </Link>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.customId)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-300 rounded">
                        <button
                          onClick={() => handleQuantityChange(item.customId, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-gray-50 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.customId, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-gray-50 disabled:opacity-50"
                          disabled={item.quantity >= item.product.stock}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {(item.product.prix * item.quantity)} FCFA
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Bouton pour vider le panier */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Vider le panier
              </button>
            </div>
          </div>

          {/* Résumé de la commande */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Résumé de la commande</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{getCartTotal()} FCFA</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span>Variable selon la zone</span>
                </div>
                {hasMissingOptions && (
                  <div className="flex justify-between text-yellow-600 text-sm">
                    <span>⚠️ Options manquantes</span>
                    <span>{missingItems.length} article(s)</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{getCartTotal()} FCFA</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || hasMissingOptions}
                className={`w-full py-3 rounded transition-colors ${
                  hasMissingOptions
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {hasMissingOptions 
                  ? 'Sélectionnez les options manquantes' 
                  : isCheckingOut 
                    ? 'Traitement...' 
                    : 'Procéder au paiement'
                }
              </button>

              {hasMissingOptions && (
                <p className="text-xs text-center mt-3 text-yellow-600">
                  Veuillez sélectionner taille/couleur pour tous les articles
                </p>
              )}

              <Link
                to="/collection"
                className="block text-center mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Continuer vos achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}