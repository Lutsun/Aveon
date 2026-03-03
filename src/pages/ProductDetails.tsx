// src/components/ProductDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../components/ProductGrid';
import { Loader2, ShoppingCart, ArrowLeft } from 'lucide-react';

interface ProductDetailProps {
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
}

export default function ProductDetail({ addToCart }: ProductDetailProps) {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');

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
    // Scroll vers le haut quand la page se charge
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity, selectedSize, selectedColor);
      alert(`${quantity} ${product.nom} ajouté au panier!`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600">Error: {error}</p>
        <Link 
          to="/"
          className="mt-4 inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la collection
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">Produit non trouvé.</p>
        <Link 
          to="/"
          className="mt-4 inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8"> {/* Réduction du padding */}
      {/* Bouton de retour simplifié */}
      <div className="mb-4 pt-16">
        <Link 
          to="/#collection"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'acceuil
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images du produit */}
        <div className="space-y-4">
          {/* Image principale */}
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <img 
              src={selectedImage || product.image || 'https://via.placeholder.com/500'} 
              alt={product.nom}
              className="w-full h-80 object-contain p-4" /* Hauteur réduite */
            />
          </div>

          {/* Miniatures des images */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setSelectedImage(product.image || product.images[0])}
                className={`flex-shrink-0 border rounded overflow-hidden ${
                  selectedImage === (product.image || product.images[0]) 
                    ? 'border-gray-900' 
                    : 'border-gray-200'
                }`}
              >
                <img 
                  src={product.image || product.images[0]} 
                  alt={product.nom}
                  className="w-14 h-14 object-cover"
                />
              </button>
              {product.images.slice(1).map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`flex-shrink-0 border rounded overflow-hidden ${
                    selectedImage === img 
                      ? 'border-gray-900' 
                      : 'border-gray-200'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`${product.nom} ${index + 2}`}
                    className="w-14 h-14 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Détails du produit - Version simplifiée */}
        <div className="space-y-6">
          {/* Titre et prix */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.nom}</h1>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xl font-bold text-gray-900">${product.prix}</span>
              <span className={`px-2 py-1 text-xs rounded ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.stock > 0 ? 'En stock' : 'Rupture'}
              </span>
            </div>
          </div>

          {/* Description seulement */}
          <div>
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
          </div>

          {/* Sélection des tailles - Seulement si disponibles */}
          {product.tailles && product.tailles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">Taille</p>
              <div className="flex flex-wrap gap-2">
                {product.tailles.map((taille: string) => (
                  <button
                    key={taille}
                    onClick={() => setSelectedSize(taille)}
                    className={`px-3 py-2 text-sm border rounded ${
                      selectedSize === taille 
                        ? 'bg-gray-900 text-white border-gray-900' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
                    }`}
                  >
                    {taille}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sélection des couleurs - Seulement si disponibles */}
          {product.couleurs && product.couleurs.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">Couleur</p>
              <div className="flex flex-wrap gap-2">
                {product.couleurs.map((couleur: string) => (
                  <button
                    key={couleur}
                    onClick={() => setSelectedColor(couleur)}
                    className={`px-3 py-2 text-sm border rounded ${
                      selectedColor === couleur 
                        ? 'bg-gray-900 text-white border-gray-900' 
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
                    }`}
                  >
                    {couleur}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sélection de la quantité - Version simple */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">Quantité</p>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 border border-gray-300 rounded-l hover:bg-gray-50 disabled:opacity-50"
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
                className="w-12 text-center border-t border-b border-gray-300 py-1 text-sm"
              />
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-3 py-1 border border-gray-300 rounded-r hover:bg-gray-50 disabled:opacity-50"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
          </div>

          {/* Bouton Ajouter au panier */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || (product.tailles?.length > 0 && !selectedSize)}
            className={`w-full py-3 px-4 rounded flex items-center justify-center gap-2 text-sm font-medium ${
              product.stock === 0 || (product.tailles?.length > 0 && !selectedSize)
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.stock === 0 
              ? 'Rupture de stock' 
              : (product.tailles?.length > 0 && !selectedSize)
                ? 'Sélectionnez une taille'
                : `Ajouter au panier`
            }
          </button>
        </div>
      </div>
    </div>
  );
}