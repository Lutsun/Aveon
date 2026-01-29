// src/components/ProductCard.tsx
import { Product } from './ProductGrid'; 

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <img 
        src={product.image || 'https://via.placeholder.com/300'} 
        alt={product.nom}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{product.nom}</h3>
        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">${product.prix}</span>
          <span className={`px-2 py-1 text-xs rounded ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {product.stock > 0 ? 'En stock' : 'Rupture'}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {product.tags?.map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}