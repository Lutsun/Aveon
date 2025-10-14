import ProductGrid from './ProductGrid';

export default function CollectionSection() {
  return (
    <section id="collection" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
            The Collection
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Premium streetwear crafted for those who dare to stand out. Each piece tells a story of urban culture and timeless style.
          </p>
        </div>

        <ProductGrid />
      </div>
    </section>
  );
}
