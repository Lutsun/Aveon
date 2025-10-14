import { Product } from '../lib/supabase';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative overflow-hidden bg-white">
      <div className="aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

        <button className="absolute bottom-4 right-4 bg-white text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-gray-900 hover:text-white">
          <ShoppingBag className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-lg mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{product.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>

          {product.colors.length > 0 && (
            <div className="flex space-x-1">
              {product.colors.slice(0, 4).map((color, idx) => (
                <div
                  key={idx}
                  className="w-5 h-5 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          )}
        </div>

        {product.sizes.length > 0 && (
          <div className="flex space-x-2 mt-3">
            {product.sizes.map((size) => (
              <span key={size} className="text-xs text-gray-500 border border-gray-300 px-2 py-1">
                {size}
              </span>
            ))}
          </div>
        )}
      </div>

      {product.featured && (
        <div className="absolute top-4 left-4 bg-black text-white text-xs font-medium px-3 py-1">
          FEATURED
        </div>
      )}

      {!product.in_stock && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <span className="text-gray-900 font-medium text-lg">OUT OF STOCK</span>
        </div>
      )}
    </div>
  );
}
