// src/components/ProductCard.tsx
import { Product } from './ProductGrid';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link 
      to={`/produit/${product._id}`} 
      className="block group"
      onClick={() => window.scrollTo(0, 0)}
    >
      <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white">
        <div className="relative overflow-hidden">
          <img 
            src={product.image || 'https://via.placeholder.com/300'} 
            alt={product.nom}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Badge stock simplifié */}
          {product.stock > 0 ? (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
              En stock
            </div>
          ) : (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Rupture
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
            <span className="font-bold text-lg">{product.prix} FCFA</span>
            
            {product.tailles && product.tailles.length > 0 && (
              <span className="text-xs text-gray-500">
                {product.tailles.length} tailles disponibles
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}