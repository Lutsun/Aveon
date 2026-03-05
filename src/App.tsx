import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import CollectionSection from './components/CollectionSection';
import FeaturedSection from './components/FeaturedSection';
import Footer from './components/Footer';
import ProductDetail from './pages/ProductDetails';
import CartSidebar from './components/CartSidebar';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen">
          <Header />
          <CartSidebar />
          <main>
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <CollectionSection />
                  <FeaturedSection />
                </>
              } />
              <Route path="/produit/:id" element={<ProductDetail />} />
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