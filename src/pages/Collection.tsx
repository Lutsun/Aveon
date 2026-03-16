import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductGrid from '../components/ProductGrid';

export default function Collection() {
  const [sortBy, setSortBy] = useState('nouveautes');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-28 pb-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero section minimaliste */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            Collection
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Découvrez l'univers AVEON, où chaque pièce raconte une histoire d'indépendance et d'authenticité.
          </p>
          
          {/* Ligne décorative */}
          <div className="w-24 h-0.5 bg-gray-200 mx-auto mt-8"></div>
        </motion.div>

        {/* Barre de tri simplifiée */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-end mb-12"
        >
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none px-5 py-2.5 bg-white border border-gray-200 rounded-lg 
                       focus:outline-none focus:border-gray-400 transition-colors cursor-pointer
                       text-sm pr-10 hover:border-gray-400"
            >
              <option value="nouveautes">✨ Nouveautés</option>
              <option value="prix-croissant">💰 Prix: croissant</option>
              <option value="prix-decroissant">💰 Prix: décroissant</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Grille produits avec animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ProductGrid sortBy={sortBy} />
        </motion.div>

        {/* Section inspiration (optionnelle) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <p className="text-sm text-gray-400 italic">
            "Vision on, pression none."
          </p>
        </motion.div>
      </div>
    </div>
  );
}