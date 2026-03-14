// components/FeaturedSection.tsx
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export default function FeaturedSection() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-[500px] lg:h-[600px] overflow-hidden group"
          >
            <img
              src="https://images.pexels.com/photos/1959036/pexels-photo-1959036.jpeg"
              alt="Urban Style"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8 px-4 lg:px-12"
          >
            <div>
              <span className="text-sm font-semibold tracking-wider text-gray-500">
                PHILOSOPHY
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6 leading-tight">
                Be Relentless,<br />Be AVEON
              </h2>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                AVEON est plus qu'un vêtement. C'est un état d'esprit. Un mouvement. Une déclaration d'indépendance dans un monde qui essaie de te définir.
              </p>
              <p>
                Nous créons du streetwear premium pour ceux qui refusent de se fondre dans la masse. Chaque couture, chaque choix de tissu, chaque élément de design est intentionnel — conçu pour ceux qui vivent leur vie selon leurs propres règles.
              </p>
              <p>
                Conçu à Dakar avec des matériaux d'exception, notre collection incarne l'élégance urbaine et l'authenticité.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              {/* Premium Cotton */}
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-sm text-gray-600">Premium Cotton</div>
              </div>

              {/* Made in Senegal avec drapeau */}
              <div className="text-center">
                <div className="h-[36px] flex items-center justify-center mb-2">
                  <MapPin className="w-7 h-7 text-gray-700" />
                </div>
                <div className="text-sm text-gray-600">Made in Senegal</div>
              </div>

              {/* Style Possibilities */}
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">∞</div>
                <div className="text-sm text-gray-600">Style Possibilities</div>
              </div>
            </div>

            {/* Signature subtile */}
            <div className="pt-4 text-center">
              <p className="text-xs text-gray-400 italic">
                "Designed in Senegal, made for the world"
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}