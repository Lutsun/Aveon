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

  useEffect(() => {
  setMobileMenuOpen(false);
  document.body.style.overflow = 'unset';
}, [location.pathname]);

  const isHeaderLight = !scrolled && isHomePage;

  const navItems = [
    { name: 'New Arrivals', path: '/#new-arrivals', isAnchor: true },
    { name: 'Collection', path: '/collection', isAnchor: false },
    { name: 'About', path: '/#about', isAnchor: true },
  ];

  // Fonction de scroll avec vérification du DOM
  const scrollToSection = useCallback((sectionId: string) => {
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

    if (checkSection()) return;

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

  useEffect(() => {
    if (isHomePage && location.state?.scrollTo && !scrollAttempted.current) {
      const sectionId = location.state.scrollTo;
      scrollAttempted.current = true;
      
      setTimeout(() => {
        scrollToSection(sectionId);
        
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
  <>
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isHomePage && !scrolled
      ? 'bg-gradient-to-b from-black/60 via-black/30 to-transparent py-2'
      : 'bg-white/95 backdrop-blur-md shadow-lg py-0'
  }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-50">
        <div className="flex justify-between items-center h-20">

          {/* LOGO */}
          <button 
            onClick={handleLogoClick}
            className="text-3xl font-black focus:outline-none"
          >
            <span className={`transition-colors duration-300 ${
              isHeaderLight && !scrolled 
                ? 'text-white drop-shadow-lg' 
                : 'text-gray-900'
            }`}>
              AVEON
            </span>
          </button>

          {/* NAV DESKTOP */}
          <div className="hidden md:flex items-center gap-24 mr-auto ml-72">
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

          {/* ACTIONS */}
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
              className={`md:hidden hover:scale-110 transition-transform duration-200 ${
                isHeaderLight && !scrolled 
                  ? 'text-white' 
                  : 'text-gray-700'
              }`}
              onClick={() => setMobileMenuOpen(prev => !prev)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </nav>
    </header>

    {/* MENU MOBILE FULL SCREEN  */}
    <div
      className={`md:hidden fixed inset-0 z-[9999] transition-all duration-500 ${
        mobileMenuOpen
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* BACKGROUND FULL BLACK */}
      <div className="absolute inset-0 bg-black" />

      {/* CONTENT */}
      <div className="relative flex flex-col justify-between h-full px-6 py-8 text-white">

        {/* TOP */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold tracking-wide">AVEON</span>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* NAV */}
        <div className="flex flex-col items-center gap-8 text-3xl font-semibold">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              onClick={(e) => handleNavigation(e, item)}
              className="relative group"
            >
              <span className="transition-opacity group-hover:opacity-60">
                {item.name}
              </span>

              <span className="absolute left-0 -bottom-2 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* FOOTER */}
        <div className="text-center text-sm text-white/40">
          <p>Streetwear redefined</p>
          <p className="mt-1">© 2026 AVEON</p>
        </div>

      </div>
    </div>
  </>
);
}
