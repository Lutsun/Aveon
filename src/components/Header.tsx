import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getCartCount, setIsCartOpen } = useCart();
  const cartCount = getCartCount();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-12">
            <Link to="/" className="text-2xl font-bold tracking-wider hover:opacity-70 transition-opacity">
              AVEON
            </Link>

            <div className="hidden md:flex space-x-8">
              <a href="#new" className="relative text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors 
               after:content-[''] after:absolute after:left-0 after:bottom-0 
               after:w-0 after:h-[2px] after:bg-gray-600 after:transition-all after:duration-300
               hover:after:w-full">
                New Arrivals
              </a>
              <a href="#collection" className="relative text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors 
               after:content-[''] after:absolute after:left-0 after:bottom-0 
               after:w-0 after:h-[2px] after:bg-gray-600 after:transition-all after:duration-300
               hover:after:w-full">
                Collection
              </a>
              <a href="#about" className="relative text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors 
               after:content-[''] after:absolute after:left-0 after:bottom-0 
               after:w-0 after:h-[2px] after:bg-gray-600 after:transition-all after:duration-300
               hover:after:w-full">
                About
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="hover:opacity-70 transition-opacity relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden hover:opacity-70 transition-opacity"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-6 space-y-4 border-t border-gray-200">
            <a href="#new" className="block text-sm font-medium hover:text-gray-600 transition-colors">
              New Arrivals
            </a>
            <a href="#collection" className="block text-sm font-medium hover:text-gray-600 transition-colors">
              Collection
            </a>
            <a href="#about" className="block text-sm font-medium hover:text-gray-600 transition-colors">
              About
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}