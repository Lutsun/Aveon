// src/pages/ProductDetails.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../components/ProductGrid';
import { Loader2, ShoppingCart, ArrowLeft, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Toast from '../components/Toast';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`http://localhost:5000/api/produits/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProduct(data);
        setSelectedImage(data.image || data.images?.[0] || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
        console.error('Erreur de chargement:', err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      // Vérification des options requises
      const needsSize = product.tailles && product.tailles.length > 0;
      const needsColor = product.couleurs && product.couleurs.length > 0;
      
      if (needsSize && !selectedSize) {
        setToast({
          message: 'Veuillez sélectionner une taille',
          type: 'error'
        });
        return;
      }
      
      if (needsColor && !selectedColor) {
        setToast({
          message: 'Veuillez sélectionner une couleur',
          type: 'error'
        });
        return;
      }

      setIsAdding(true);
      addToCart(product, quantity, selectedSize, selectedColor);
      
      setToast({
        message: `${quantity} ${product.nom} ajouté au panier !`,
        type: 'success'
      });
      
      setTimeout(() => {
        setIsAdding(false);
      }, 1000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20 pt-32">
        <p className="text-red-600">{error || 'Produit non trouvé'}</p>
        <Link 
          to="/"
          className="mt-4 inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      {/* Toast notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Bouton de retour */}
      <div className="mb-6">
        <Link 
          to="/#collection"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la collection
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images du produit */}
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <img 
              src={selectedImage || product.image || 'https://via.placeholder.com/600'} 
              alt={product.nom}
              className="w-full h-96 object-contain p-4"
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedImage(product.image || product.images[0])}
                className={`flex-shrink-0 border-2 rounded overflow-hidden transition-all ${
                  selectedImage === (product.image || product.images[0]) 
                    ? 'border-gray-900 opacity-100' 
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img 
                  src={product.image || product.images[0]} 
                  alt={product.nom}
                  className="w-16 h-16 object-cover"
                />
              </button>
              {product.images.slice(1).map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 border-2 rounded overflow-hidden transition-all ${
                    selectedImage === img 
                      ? 'border-gray-900 opacity-100' 
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`${product.nom} ${index + 2}`}
                    className="w-16 h-16 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Détails du produit */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.nom}</h1>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-gray-900">{product.prix} FCFA</span>
              <span className={`px-3 py-1 text-xs rounded-full ${
                product.stock > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.stock > 0 ? 'En stock' : 'Rupture de stock'}
              </span>
            </div>
          </div>

          <div className="border-t border-b border-gray-200 py-6">
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {product.tailles && product.tailles.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-900">
                Taille <span className="text-red-500">*</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.tailles.map((taille: string) => (
                  <button
                    key={taille}
                    onClick={() => setSelectedSize(taille)}
                    className={`min-w-[60px] px-4 py-2 text-sm border rounded-md transition-all ${
                      selectedSize === taille 
                        ? 'bg-gray-900 text-white border-gray-900' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {taille}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.couleurs && product.couleurs.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-900">Couleur</p>
              <div className="flex flex-wrap gap-2">
                {product.couleurs.map((couleur: string) => (
                  <button
                    key={couleur}
                    onClick={() => setSelectedColor(couleur)}
                    className={`px-4 py-2 text-sm border rounded-md transition-all ${
                      selectedColor === couleur 
                        ? 'bg-gray-900 text-white border-gray-900' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {couleur}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-900">Quantité</p>
            <div className="flex items-center">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 1 && value <= product.stock) {
                      setQuantity(value);
                    }
                  }}
                  className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={
              product.stock === 0 || 
              isAdding
            }
            className={`w-full py-4 px-6 rounded-md flex items-center justify-center gap-2 text-base font-medium transition-all ${
              product.stock === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : isAdding
                  ? 'bg-green-600 text-white scale-105'
                  : 'bg-gray-900 text-white hover:bg-gray-800 hover:scale-[1.02]'
            }`}
          >
            {isAdding ? (
              <>
                <Check className="w-5 h-5" />
                Ajouté au panier !
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                {product.stock === 0 
                  ? 'Rupture de stock' 
                  : `Ajouter au panier - ${(product.prix * quantity)} FCFA`
                }
              </>
            )}
          </button>

          {/* Informations supplémentaires */}
          <div className="mt-8 space-y-4 text-sm text-gray-600 border-t border-gray-200 pt-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>Livraison gratuite pour les commandes de plus de 15000 Fcfa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <span>Paiement à la livraison en espèce ou par Mobile Money</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}