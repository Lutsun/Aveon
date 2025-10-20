import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-12">
            <a href="/" className="text-2xl font-bold tracking-wider hover:opacity-70 transition-opacity">
              AVEON
            </a>

            <div className="hidden md:flex space-x-8">
              <a href="#new" className="text-sm font-medium hover:text-gray-600 transition-colors after:underline after:underline-offset-4 after:decoration-2 after:decoration-gray-400">
                New Arrivals
              </a>
              <a href="#collection" className="text-sm font-medium hover:text-gray-600 transition-colors">
                Collection
              </a>
              <a href="#about" className="text-sm font-medium hover:text-gray-600 transition-colors">
                About
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button className="hover:opacity-70 transition-opacity">
              <ShoppingBag className="w-5 h-5" />
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
