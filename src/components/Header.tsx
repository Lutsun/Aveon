// Header.tsx - Version finale
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { getCartCount, setIsCartOpen } = useCart();
  const cartCount = getCartCount();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Empêcher le scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const isHeaderLight = !scrolled && isHomePage;

  const navItems = [
    { name: 'New Arrivals', path: '/#new-arrivals' },
    { name: 'Shop', path: '/collection' },
    { name: 'About', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path.includes('#')) return false;
    return location.pathname === path;
  };

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-0' 
          : 'bg-transparent py-2'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo avec rechargement */}
          <button 
            onClick={handleLogoClick}
            className="text-3xl font-black focus:outline-none relative z-50"
          >
            <span className={`transition-colors duration-300 ${
              isHeaderLight && !scrolled 
                ? 'text-white drop-shadow-lg' 
                : 'text-gray-900'
            }`}>
              AVEON
            </span>
          </button>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="relative px-2 py-1 group"
              >
                <span className={`text-sm font-medium transition-colors duration-300 ${
                  isActive(item.path)
                    ? isHeaderLight && !scrolled
                      ? 'text-white font-bold'
                      : 'text-gray-900 font-bold'
                    : isHeaderLight && !scrolled
                      ? 'text-white/90 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                }`}>
                  {item.name}
                </span>
                <span className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                  isActive(item.path) ? 'w-full' : 'w-0 group-hover:w-full'
                } ${
                  isHeaderLight && !scrolled ? 'bg-white' : 'bg-gray-900'
                }`} />
              </Link>
            ))}
          </div>

          {/* Actions - Uniquement le panier */}
          <div className="flex items-center space-x-5">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="hover:scale-110 transition-transform duration-200 relative group"
            >
              <ShoppingBag className={`w-5 h-5 ${
                isHeaderLight && !scrolled 
                  ? 'text-white' 
                  : 'text-gray-700 group-hover:text-gray-900'
              }`} />
              {cartCount > 0 && (
                <span className={`absolute -top-2 -right-2 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg ${
                  isHeaderLight && !scrolled
                    ? 'bg-white text-gray-900'
                    : 'bg-gray-900 text-white'
                }`}>
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className={`md:hidden hover:scale-110 transition-transform duration-200 relative z-50 ${
                isHeaderLight && !scrolled 
                  ? 'text-white' 
                  : 'text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile - Plein écran sans espace en haut */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-0 left-0 w-full h-screen bg-black/95 backdrop-blur-lg z-40">
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-3xl font-medium text-white hover:text-gray-300 transition-colors duration-300 transform hover:scale-110"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="absolute bottom-12 left-0 right-0 text-center text-white/50 text-sm">
                <p>Streetwear redefined</p>
                <p className="mt-2">© 2024 AVEON</p>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay pour le header transparent - seulement sur desktop */}
      {isHeaderLight && !scrolled && !mobileMenuOpen && (
        <div className="hidden md:block absolute inset-0 -z-10 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
      )}
    </header>
  );
}