// components/NewArrivalsSection.tsx
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { Product } from './ProductGrid';

export default function NewArrivalsSection() {
  const newProducts: Product[] = [
    // Tes produits avec un flag "new"
    { _id: '1', nom: 'Nouveau T-shirt', prix: 25000, image: '...', images: [], categorie: 'T-shirts', couleurs: ['Black'], tags: ['new'], dateCreation: new Date().toISOString(), stock: 5, description: '...', tailles: ['S', 'M', 'L'] },
    { _id: '2', nom: 'Hoodie Edition', prix: 45000, image: '...', images: [], categorie: 'Hoodies', couleurs: ['Grey'], tags: ['new'], dateCreation: new Date().toISOString(), stock: 3, description: '...', tailles: ['M', 'L', 'XL'] },
    { _id: '3', nom: 'Pants Cargo', prix: 35000, image: '...', images: [], categorie: 'Pants', couleurs: ['Khaki'], tags: ['new'], dateCreation: new Date().toISOString(), stock: 7, description: '...', tailles: ['S', 'M', 'L'] },
    { _id: '4', nom: 'Jacket Limited', prix: 65000, image: '...', images: [], categorie: 'Jackets', couleurs: ['Black'], tags: ['new'], dateCreation: new Date().toISOString(), stock: 2, description: '...', tailles: ['M', 'L'] },
  ];

  return (
    <section id="new-arrivals" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium tracking-wider text-gray-600">NEW DROP</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
              New Arrivals
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl">
              Les dernières pièces de la collection, disponibles en édition limitée.
            </p>
          </div>
          
          <Link 
            to="/collection"
            className="group flex items-center gap-2 mt-4 md:mt-0 text-gray-900 hover:text-gray-600 transition-colors"
          >
            <span className="font-medium">Voir toute la collection</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
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

        {/* Badge édition limitée */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Éditions limitées - Plus que quelques pièces
          </div>
        </div>
      </div>
    </section>
  );
}