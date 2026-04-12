// components/ProductGrid.tsx
import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// Interface adaptée à votre modèle Mongoose
export interface Product {
  _id: string;
  nom: string;
  prix: number;
  image: string;
  imageUrl?: string;       
  imagePublicId?: string;
  images: string[];
  description: string;
  categorie: string;
  tailles: string[];
  couleurs: string[];
  stock: number;
  tags: string[];
  dateCreation: string;
}

interface ProductGridProps {
  viewMode?: 'grid' | 'list';
  limit?: number;
  category?: string;
  sortBy?: string;
}

export default function ProductGrid({ 
  viewMode = 'grid', 
  limit,
  category,
  sortBy = 'nouveautes'
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        // Construction de l'URL avec les paramètres
        let url = 'http://localhost:5000/api/produits';
        const params = new URLSearchParams();
        
        if (category) params.append('categorie', category);
        if (limit) params.append('limit', limit.toString());
        if (sortBy) params.append('sort', sortBy);
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        
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
  }, [category, limit, sortBy]);

  // Animations variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
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
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">Aucun produit disponible pour le moment.</p>
      </div>
    );
  }

  // Classes CSS selon le mode d'affichage
  const gridClasses = viewMode === 'grid' 
    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
    : 'flex flex-col space-y-4';

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={gridClasses}
    >
      <AnimatePresence>
        {products.map((product) => (
          <motion.div
            key={product._id}
            variants={itemVariants}
            layout
            className={viewMode === 'list' ? 'w-full' : ''}
          >
            <ProductCard product={product} viewMode={viewMode} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}