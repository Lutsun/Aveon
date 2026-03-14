import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { getCartCount, setIsCartOpen } = useCart();
  const cartCount = getCartCount();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  const scrollAttempted = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { name: 'New Arrivals', path: '/#new-arrivals', isAnchor: true },
    { name: 'Collection', path: '/collection', isAnchor: false },
    { name: 'About', path: '/#about', isAnchor: true },
  ];

  // Fonction de scroll avec vérification du DOM
  const scrollToSection = useCallback((sectionId: string) => {
    // Vérifier si la section existe
    const checkSection = () => {
      const section = document.getElementById(sectionId);
      
      if (section) {
        const headerOffset = 80;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        return true;
      }
      return false;
    };

    // Première tentative immédiate
    if (checkSection()) return;

    // Si pas trouvé, on attend que le DOM soit prêt
    let attempts = 0;
    const maxAttempts = 20;
    
    const interval = setInterval(() => {
      attempts++;
      
      if (checkSection() || attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 100);
  }, []);

  const handleNavigation = (e: React.MouseEvent, item: typeof navItems[0]) => {
    e.preventDefault();
    
    if (item.isAnchor) {
      const sectionId = item.path.split('#')[1];
      
      if (isHomePage) {
        scrollToSection(sectionId);
      } else {
        navigate('/', { state: { scrollTo: sectionId } });
      }
    } else {
      navigate(item.path);
    }
    
    setMobileMenuOpen(false);
  };

  // Effet pour gérer le scroll quand on arrive sur l'accueil
  useEffect(() => {
    if (isHomePage && location.state?.scrollTo && !scrollAttempted.current) {
      const sectionId = location.state.scrollTo;
      scrollAttempted.current = true;
      
      // Attendre que le composant soit monté
      setTimeout(() => {
        scrollToSection(sectionId);
        
        // Réinitialiser après un délai
        setTimeout(() => {
          scrollAttempted.current = false;
        }, 1000);
      }, 200);
      
      navigate('/', { replace: true, state: {} });
    }
  }, [isHomePage, location.state, navigate, scrollToSection]);

  const handleLogoClick = () => {
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const isActive = (path: string) => {
    if (path.includes('#')) return false;
    return location.pathname === path;
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
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => handleNavigation(e, item)}
                className="relative px-2 py-1 group cursor-pointer"
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
              </a>
            ))}
          </div>

          {/* Actions */}
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

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-0 left-0 w-full h-screen bg-black/95 backdrop-blur-lg z-40">
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {navItems.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => handleNavigation(e, item)}
                  className="text-3xl font-medium text-white hover:text-gray-300 transition-colors duration-300 transform hover:scale-110"
                >
                  {item.name}
                </a>
              ))}
              <div className="absolute bottom-12 left-0 right-0 text-center text-white/50 text-sm">
                <p>Streetwear redefined</p>
                <p className="mt-2">© 2026 AVEON</p>
              </div>
            </div>
          </div>
        )}
      </nav>

      {isHeaderLight && !scrolled && !mobileMenuOpen && (
        <div className="hidden md:block absolute inset-0 -z-10 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />
      )}
    </header>
  );
}