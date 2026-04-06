import { Instagram } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo et description */}
          <div className="text-center md:text-left">
            <h3 className="text-3xl font-bold tracking-wide">AVEON</h3>
            <p className="text-gray-400 text-base mt-3 max-w-sm mx-auto md:mx-0">
              Vision on, pression none. Premium streetwear pour ceux qui osent être différents.
            </p>
          </div>

          {/* Navigation */}
          <div className="text-center">
            <h4 className="text-gray-400 font-medium mb-4">Navigation</h4>
            <ul className="space-y-3">
              {['Nouveautés', 'T-Shirts', 'Collections', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white transition text-base"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div className="text-center md:text-right">
            <h4 className="text-gray-400 font-medium mb-4">Suivez-nous</h4>
            <div className="flex justify-center md:justify-end gap-6">
              <a
                href="https://www.instagram.com/aveondakar/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="https://www.tiktok.com/@aveon"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition"
              >
                <FontAwesomeIcon icon={faTiktok} className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} AVEON. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}