export default function FeaturedSection() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="relative h-[500px] lg:h-[600px] overflow-hidden group">
            <img
              src="https://images.pexels.com/photos/1311590/pexels-photo-1311590.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Urban Style"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          <div className="space-y-8 px-4 lg:px-12">
            <div>
              <span className="text-sm font-semibold tracking-wider text-gray-500">
                PHILOSOPHY
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-6 leading-tight">
                Be Relentless,<br />Be AVEON
              </h2>
            </div>

            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                AVEON is more than just clothing. It's a mindset. A movement. A declaration of independence in a world that tries to define you.
              </p>
              <p>
                We create premium streetwear for individuals who refuse to blend in. Every stitch, every fabric choice, every design element is intentional—crafted for those who live life on their own terms.
              </p>
              <p>
                From the streets to the studio, our pieces adapt to your lifestyle while maintaining that edge that sets you apart. Quality meets rebellion. Style meets substance.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-sm text-gray-600">Premium Cotton</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">2024</div>
                <div className="text-sm text-gray-600">Latest Drop</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">∞</div>
                <div className="text-sm text-gray-600">Style Possibilities</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
