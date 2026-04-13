import { Instagram } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok } from '@fortawesome/free-brands-svg-icons';
import { useNavigate, useLocation } from "react-router-dom";
import { useCallback } from "react";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const scrollToSection = useCallback((sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerOffset = 80;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, []);

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, item: { name?: string; path: any; isAnchor: any; }) => {
    e.preventDefault();

    if (item.isAnchor) {
      const sectionId = item.path.split("#")[1];

      if (isHomePage) {
        scrollToSection(sectionId);
      } else {
        navigate("/", { state: { scrollTo: sectionId } });
      }
    } else {
      navigate(item.path);
    }
  };

  const navItems = [
    { name: 'New Arrivals', path: '/#new-arrivals', isAnchor: true },
    { name: 'Collection', path: '/collection', isAnchor: false },
    { name: 'About', path: '/#about', isAnchor: true },
  ];

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
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.path}
                    onClick={(e) => handleNavigation(e, item)}
                    className="text-gray-300 hover:text-white transition text-base"
                  >
                    {item.name}
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
                href="https://www.tiktok.com/@aveondakar"
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