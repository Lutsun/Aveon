import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      <div
  className="absolute inset-0 opacity-100"
  style={{
    backgroundImage: 'url(/hero.JPG)',
    backgroundSize: 'cover',
    backgroundPosition: 'center 55%',
  }}
/>

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mt-6 translate-y-10 sm:translate-y-0">
        <div className="animate-fade-in-up delay-800 duration-3000">
          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-bold text-white mb-6 -mt-2 py-4 tracking-tight mt-0 lg:mt-20">
            AØN
          </h1>
          <p className="text-xl sm:text-2xl lg:text-3xl text-white font-medium mb-4  font-light tracking-wide">
            Vision on, pression none.
          </p>
          <p className="text-base sm:text-lg text-white mb-12  max-w-2xl mx-auto">
            Streetwear redefined. Premium quality meets urban culture.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
            to="/collection"
            className="group bg-white text-black px-8 py-4 rounded-none font-medium hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 w-full sm:w-auto justify-center"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
            <Link to="/#new-arrivals"
              onClick={(e) => {
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  document.getElementById('new-arrivals')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="group border-2 border-white text-white px-8 py-4 rounded-none font-medium hover:bg-white hover:text-black transition-all duration-300 w-full sm:w-auto text-center "
            >
              New Arrivals
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 lg:bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
}
