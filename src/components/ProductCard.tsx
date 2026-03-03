import { Product } from './ProductGrid';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault(); // Empêcher la navigation vers la page produit
    e.stopPropagation();
    
    setIsAdding(true);
    addToCart(product, 1);
    
    // Animation de confirmation
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  return (
    <div className="group relative">
      <Link 
        to={`/produit/${product._id}`} 
        className="block"
        onClick={() => window.scrollTo(0, 0)}
      >
        <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white">
          <div className="relative overflow-hidden">
            <img 
              src={product.image || 'https://via.placeholder.com/300'} 
              alt={product.nom}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Badge stock */}
            {product.stock <= 0 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                Rupture
              </div>
            )}
            
            {product.stock > 0 && product.stock < 5 && (
              <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                Plus que {product.stock}
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="font-bold text-lg mb-1 group-hover:text-gray-600 transition-colors">
              {product.nom}
            </h3>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">${product.prix}</span>
              
              {product.tailles && product.tailles.length > 0 ? (
                <span className="text-xs text-gray-500">
                  {product.tailles.length} tailles
                </span>
              ) : (
                <span className={`text-xs px-2 py-1 rounded ${
                  product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock > 0 ? 'En stock' : 'Rupture'}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Bouton Ajouter au panier (overlay au survol) */}
      {product.stock > 0 && (
        <button
          onClick={handleQuickAdd}
          disabled={isAdding}
          className={`absolute bottom-20 left-1/2 transform -translate-x-1/2 
                     bg-gray-900 text-white px-4 py-2 rounded-full text-sm 
                     flex items-center gap-2 shadow-lg
                     transition-all duration-300 opacity-0 group-hover:opacity-100
                     hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed
                     ${isAdding ? 'scale-110 bg-green-600' : ''}`}
        >
          <ShoppingCart className={`w-4 h-4 transition-transform duration-300 
            ${isAdding ? 'rotate-12' : ''}`} 
          />
          <span>{isAdding ? 'Ajouté !' : 'Ajouter au panier'}</span>
        </button>
      )}
    </div>
  );
}