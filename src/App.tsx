// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Product } from './components/ProductGrid';
import Header from './components/Header';
import Hero from './components/Hero';
import CollectionSection from './components/CollectionSection';
import FeaturedSection from './components/FeaturedSection';
import Footer from './components/Footer';
import ProductDetail from './pages/ProductDetails';

function App() {
  const [cart, setCart] = useState<Array<{
    product: Product;
    quantity: number;
    size?: string;
    color?: string;
  }>>([]);

  const addToCart = (product: Product, quantity: number, size?: string, color?: string) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.product._id === product._id && 
                item.size === size && 
                item.color === color
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        return [...prevCart, { product, quantity, size, color }];
      }
    });
  };

  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <CollectionSection />
                <FeaturedSection />
              </>
            } />
            <Route path="/produit/:id" element={
              <ProductDetail addToCart={addToCart} />
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;