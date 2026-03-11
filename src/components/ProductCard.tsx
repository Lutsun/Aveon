// src/components/ProductCard.tsx
import { Product } from './ProductGrid';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Formatage du prix avec séparateur de milliers
  const formattedPrice = new Intl.NumberFormat('fr-FR').format(product.prix);

  return (
    <Link 
      to={`/produit/${product._id}`} 
      className="block group outline-none"
      onClick={() => window.scrollTo(0, 0)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
        
        {/* Container image avec ratio ajusté - plus petit qu'avant */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          {/* Placeholder de chargement */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}
          
          {/* Image du produit */}
          <img 
            src={product.image || 'https://via.placeholder.com/600x800'} 
            alt={product.nom}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Overlay gradient au survol */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
          
          {/* Badge de stock - positionné en haut à droite */}
          {product.stock > 0 ? (
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-medium px-3 py-1.5 rounded-full shadow-lg">
              En stock
            </div>
          ) : (
            <div className="absolute top-3 right-3 bg-red-500/90 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg">
              Rupture
            </div>
          )}
        </div>

        {/* Informations produit */}
        <div className="p-4">
          {/* Titre et prix */}
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-gray-700 transition-colors">
              {product.nom}
            </h3>
            <span className="font-bold text-base text-gray-900 ml-2">
              {formattedPrice} FCFA
            </span>
          </div>
          
          {/* Description courte */}
          <p className="text-gray-500 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          
          {/* Pied de carte avec tailles et icône */}
          <div className="flex items-center justify-between">
            {product.tailles && product.tailles.length > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 uppercase tracking-wider">
                  Tailles:
                </span>
                <div className="flex gap-1">
                  {product.tailles.slice(0, 3).map((taille, idx) => (
                    <span 
                      key={idx}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md"
                    >
                      {taille}
                    </span>
                  ))}
                  {product.tailles.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{product.tailles.length - 3}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-400">
                Taille unique
              </div>
            )}
            
            {/* Icône ou indicateur de clic */}
            <div className={`flex items-center text-gray-400 transition-all duration-300 ${
              isHovered ? 'translate-x-1 text-gray-900' : ''
            }`}>
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}