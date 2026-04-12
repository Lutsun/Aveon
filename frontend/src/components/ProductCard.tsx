import { Product } from './ProductGrid';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const formattedPrice = new Intl.NumberFormat('fr-FR').format(product.prix);

  // Image source (priorité à imageUrl ou image)
  const imageSrc = imgError 
    ? 'https://via.placeholder.com/600x800?text=AVEON'
    : (product.imageUrl || product.image || 'https://via.placeholder.com/600x800?text=AVEON');

  // Mode liste
  if (viewMode === 'list') {
    return (
      <Link 
        to={`/produit/${product._id}`} 
        className="block group outline-none bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
        onClick={() => window.scrollTo(0, 0)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="relative md:w-64 h-64 bg-white">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-50 animate-pulse" />
            )}
            <img 
              src={imageSrc}
              alt={product.nom}
              className={`w-full h-full object-contain p-4 transition-all duration-700 ${
                isHovered ? 'scale-105' : 'scale-100'
              } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImgError(true)}
            />
          </div>

          {/* Infos */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.nom}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
              
              {/* Tailles */}
              {product.tailles && product.tailles.length > 0 && (
                <div className="mb-4">
                  <span className="text-sm text-gray-500">Tailles disponibles: </span>
                  <div className="flex gap-2 mt-2">
                    {product.tailles.slice(0, 4).map((taille) => (
                      <span key={taille} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                        {taille}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Prix et action */}
            <div className="flex items-center justify-between mt-4">
              <div>
                <span className="text-2xl font-bold text-gray-900">{formattedPrice} FCFA</span>
                {product.stock > 0 && product.stock < 10 && (
                  <p className="text-xs text-orange-500 mt-1">Plus que {product.stock} en stock</p>
                )}
              </div>
              <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                <ShoppingBag className="w-5 h-5" />
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Mode grille
  return (
    <Link 
      to={`/produit/${product._id}`} 
      className="block group outline-none"
      onClick={() => window.scrollTo(0, 0)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
        
        {/* Conteneur image - fond blanc pur */}
        <div className="relative aspect-[3/4] overflow-hidden bg-white">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-50 animate-pulse" />
          )}
          
          <img 
            src={imageSrc}
            alt={product.nom}
            className={`w-full h-full object-contain p-6 transition-all duration-700 ${
              isHovered ? 'scale-125' : 'scale-125'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImgError(true)}
          />
          
          {/* Overlay gradient au hover */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
          
          {/* Badge stock */}
          {product.stock > 0 ? (
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-medium px-3 py-1.5 rounded-full shadow-md">
              En stock
            </div>
          ) : (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md">
              Rupture
            </div>
          )}

          {/* Quick add button - plus visible */}
          <button className={`absolute bottom-4 left-4 right-4 bg-black text-white py-3 rounded-full font-medium transition-all duration-300 transform ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}>
            Ajouter au panier
          </button>
        </div>

        {/* Infos produit */}
        <div className="p-4 bg-white">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 text-base line-clamp-1 group-hover:text-gray-700 transition-colors">
              {product.nom}
            </h3>
            <span className="font-bold text-base text-gray-900 whitespace-nowrap">
              {formattedPrice} FCFA
            </span>
          </div>
          
          <p className="text-gray-500 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            {product.tailles && product.tailles.length > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 uppercase tracking-wider">
                  Tailles:
                </span>
                <div className="flex gap-1">
                  {product.tailles.slice(0, 3).map((taille) => (
                    <span 
                      key={taille}
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
            
            {/* Flèche au hover */}
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