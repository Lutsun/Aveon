import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Loader2 } from 'lucide-react';

// Interface adaptée à votre modèle Mongoose
export interface Product {
  _id: string; // MongoDB utilise _id
  nom: string; 
  prix: number;
  image: string;
  images: string[];
  description: string;
  categorie: string;
  tailles: string[];
  couleurs: string[];
  stock: number;
  tags: string[];
  dateCreation: string;
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // API backend
        const response = await fetch('http://localhost:5000/api/produits');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setProducts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
        console.error('Erreur de chargement:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

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
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">No products available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}