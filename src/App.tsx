import Header from './components/Header';
import Hero from './components/Hero';
import CollectionSection from './components/CollectionSection';
import FeaturedSection from './components/FeaturedSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <CollectionSection />
        <FeaturedSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
