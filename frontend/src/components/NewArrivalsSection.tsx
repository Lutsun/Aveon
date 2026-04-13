// components/NewArrivalsSection.tsx
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { Product } from './ProductGrid';
import { useState, useEffect } from 'react';
import { API_URL } from '../config/api'; // 👈 AJOUTEZ CETTE LIGNE

export default function NewArrivalsSection() {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // 👈 AJOUTEZ POUR GÉRER LES ERREURS

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        // 👉 MODIFIEZ CETTE LIGNE - Utilisez API_URL au lieu de '/api'
        const response = await fetch(`${API_URL}/products`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Produits chargés:', data.length); // Pour debug
        
        const sorted = data.sort((a: Product, b: Product) => 
          new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
        );
        setNewProducts(sorted.slice(0, 4));
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        setError('Impossible de charger les produits. Vérifiez que le backend est accessible.');
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-pulse">Chargement...</div>
        </div>
      </section>
    );
  }

  // 👈 AJOUTEZ CETTE SECTION POUR LES ERREURS
  if (error) {
    return (
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-900 text-white rounded-full"
          >
            Réessayer
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="new-arrivals" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium tracking-wider text-gray-600">NEW DROP 2026</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
            New Arrivals
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            La nouvelle collection est arrivée. Des pièces uniques, en édition limitée.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ${
            newProducts.length === 3 ? 'lg:grid-cols-3 lg:ml-32 lg:w-screen ' : 'lg:grid-cols-4'
          }`}
        >
          {newProducts.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link 
            to="/collection"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Découvrir toute la collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
}