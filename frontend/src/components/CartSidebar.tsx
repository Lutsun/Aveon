import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, AlertTriangle } from 'lucide-react';

export default function CartSidebar() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal,
    getCartCount,
    getItemsWithMissingOptions 
  } = useCart();
  const navigate = useNavigate();

  const missingItems = getItemsWithMissingOptions();
  const hasMissingOptions = missingItems.length > 0;

  const handleCheckout = () => {
    if (hasMissingOptions) {
      alert('Veuillez sélectionner la taille et/ou la couleur pour tous les articles avant de continuer');
      return;
    }
    
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleViewCart = () => {
    setIsCartOpen(false);
    navigate('/cart');
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Votre Panier ({getCartCount()})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Alerte options manquantes */}
          {hasMissingOptions && (
            <div className="mx-4 mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-700">
                Certains articles nécessitent une sélection de taille/couleur.
              </p>
            </div>
          )}

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 mb-4">Votre panier est vide</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="text-gray-900 underline hover:no-underline"
                >
                  Continuer vos achats
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => {
                  const needsSize = item.product.tailles && item.product.tailles.length > 0;
                  const needsColor = item.product.couleurs && item.product.couleurs.length > 0;
                  const missingOptions = (needsSize && !item.size) || (needsColor && !item.color);

                  return (
                    <div key={item.customId} className="flex gap-3 pb-4 border-b border-gray-100">
                      {/* Product Image */}
                      <Link 
                        to={`/produit/${item.product._id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0"
                      >
                        <img
                          src={item.product.image || 'https://via.placeholder.com/80'}
                          alt={item.product.nom}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <Link 
                            to={`/produit/${item.product._id}`}
                            onClick={() => setIsCartOpen(false)}
                            className="font-medium text-gray-900 hover:text-gray-600 text-sm"
                          >
                            {item.product.nom}
                          </Link>
                          <button
                            onClick={() => removeFromCart(item.customId)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {needsSize && (
                          <p className={`text-xs mt-1 ${item.size ? 'text-gray-500' : 'text-red-500 font-medium'}`}>
                            Taille: {item.size || 'Non sélectionnée'}
                          </p>
                        )}
                        {needsColor && (
                          <p className={`text-xs ${item.color ? 'text-gray-500' : 'text-red-500 font-medium'}`}>
                            Couleur: {item.color || 'Non sélectionnée'}
                          </p>
                        )}

                        {missingOptions && (
                          <Link 
                            to={`/produit/${item.product._id}`}
                            onClick={() => setIsCartOpen(false)}
                            className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                          >
                            Sélectionner
                          </Link>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-gray-200 rounded">
                            <button
                              onClick={() => updateQuantity(item.customId, item.quantity - 1)}
                              className="px-1.5 py-0.5 hover:bg-gray-50 disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.customId, item.quantity + 1)}
                              className="px-1.5 py-0.5 hover:bg-gray-50 disabled:opacity-50"
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="font-medium text-sm">
                            {(item.product.prix * item.quantity)} FCFA
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Sous-total</span>
                <span className="font-bold">{getCartTotal()} FCFA</span>
              </div>
              
              <button
                onClick={handleCheckout}
                disabled={hasMissingOptions}
                className={`w-full py-3 rounded transition-colors mb-2 ${
                  hasMissingOptions
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {hasMissingOptions ? 'Options manquantes' : 'Procéder au paiement'}
              </button>
              
              <button
                onClick={handleViewCart}
                className="w-full border border-gray-300 py-3 rounded hover:bg-gray-50 transition-colors"
              >
                Voir le panier
              </button>

              {hasMissingOptions && (
                <p className="text-xs text-center mt-2 text-yellow-600">
                  Sélectionnez taille/couleur dans le panier
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}