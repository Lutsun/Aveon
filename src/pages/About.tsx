// pages/About.tsx
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export default function About() {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero section - simple et épurée */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          {/* Badge Made in Senegal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <MapPin className="w-4 h-4 text-gray-900" />
              <span className="text-sm font-medium text-gray-900">Made in Senegal</span>
            </div>
          </motion.div>

          {/* Titre */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl sm:text-6xl font-black mb-6 tracking-tight"
          >
            AVEON
          </motion.h1>

          {/* Ligne décorative */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "80px" }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="h-0.5 bg-gray-300 mx-auto mb-8"
          />

          {/* Sous-titre */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Streetwear premium, conçu au Sénégal avec passion et authenticité.
          </motion.p>
        </motion.div>

        {/* Histoire */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mb-20 text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Notre histoire</h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
            Née en 2024 à Dakar, AVEON incarne une nouvelle vision du streetwear. 
            Chaque pièce est pensée pour ceux qui voient la mode comme une 
            forme d'expression personnelle, alliant confort urbain et élégance intemporelle.
          </p>
        </motion.div>

        {/* Notre approche - simplifié */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-6">Notre approche</h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-3xl mx-auto">
            Nous croyons en une mode responsable et authentique. 
            Des matériaux soigneusement sélectionnés, un savoir-faire local, 
            et une attention particulière portée à chaque détail.
          </p>

          {/* Petite signature */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 pt-8 border-t border-gray-100"
          >
            <p className="text-gray-400 italic text-sm">
              "Be Relentless, Be AVEON"
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}