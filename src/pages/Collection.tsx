// pages/Collection.tsx
import { useState, useEffect } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import { motion, AnimatePresence } from 'framer-motion';

export default function Collection() {
  const [sortBy, setSortBy] = useState('nouveautes');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    'T-shirts',
    'Hoodies',
    'Pants',
    'Jackets',
    'Accessories'
  ];

  return (
    <div className="pt-28 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre simple */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold">Shop</h1>
          <p className="text-gray-600 mt-2">Découvrez toute la collection AVEON</p>
        </motion.div>
        
        {/* Barre d'outils */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-gray-400 transition-all duration-300 group"
            >
              <Filter className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              <span>Filtres</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${
                filtersOpen ? 'rotate-180' : ''
              }`} />
            </button>
            
            <p className="text-sm text-gray-600">
              <span className="font-semibold">24</span> produits
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Tri */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors cursor-pointer"
            >
              <option value="nouveautes">Nouveautés</option>
              <option value="prix-croissant">Prix: croissant</option>
              <option value="prix-decroissant">Prix: décroissant</option>
              <option value="popularite">Popularité</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filtres */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 256, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="w-64 space-y-6">
                  {/* Catégories */}
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="font-semibold mb-4">Catégories</h3>
                    <div className="space-y-3">
                      {categories.map((cat) => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCategories([...selectedCategories, cat]);
                              } else {
                                setSelectedCategories(selectedCategories.filter(c => c !== cat));
                              }
                            }}
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                            {cat}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Prix */}
                  <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="font-semibold mb-4">Prix</h3>
                    <div className="space-y-4">
                      <input
                        type="range"
                        min="0"
                        max="500000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full accent-gray-900"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>0 FCFA</span>
                        <span>{priceRange[1].toLocaleString()} FCFA</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grille produits */}
          <div className={`flex-1 transition-all duration-500 ${
            filtersOpen ? 'md:w-[calc(100%-16rem)]' : 'w-full'
          }`}>
            <ProductGrid sortBy={sortBy} />
          </div>
        </div>
      </div>
    </div>
  );
}