// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import NewArrivalsSection from './components/NewArrivalsSection';
import FeaturedSection from './components/FeaturedSection';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import WelcomeScreen from './components/WelcomeScreen';
import Collection from './pages/Collection';

function App() {
  const [showWelcome, setShowWelcome] = useState(
    !sessionStorage.getItem('aveon_welcome_seen')
  );

  const handleEnter = () => {
    sessionStorage.setItem('aveon_welcome_seen', 'true');
    setShowWelcome(false);
  };

  return (
    <Router>
      <CartProvider>
        {showWelcome && <WelcomeScreen onEnter={handleEnter} />}
        
        <div className="min-h-screen bg-gray-50">
          <Header />
          <CartSidebar />
          <main>
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <NewArrivalsSection />
                  <FeaturedSection />
                </>
              } />
              <Route path="/collection" element={<Collection />} /> 
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;