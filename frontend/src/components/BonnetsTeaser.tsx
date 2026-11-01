// components/BonnetsTeaser.tsx
import { motion } from 'framer-motion';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const CLOUDINARY_VIDEO = 'https://res.cloudinary.com/dnscer4cy/video/upload';
const VIDEO_PATH = 'v1793560703/AVEON_bonnets_v5_vlanee';

export default function BonnetsTeaser() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  // La vidéo ne se charge et ne joue que lorsqu'elle est visible à l'écran
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="bonnets" className="py-20 px-4 sm:px-6 lg:px-8 bg-black text-white">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center md:text-left"
        >
          <span className="text-sm font-medium tracking-wider text-gray-400">NEW DROP 2026</span>
          <h2 className="text-4xl sm:text-5xl font-bold mt-4 mb-4 tracking-tight">
            Les bonnets AVEON
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Le teaser est là. Découvrez les nouveaux bonnets, disponibles dès 5 000 FCFA.
          </p>
          <Link
            to="/collection"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-full text-sm hover:bg-gray-200 transition-colors"
          >
            Voir la collection
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative w-full max-w-xs mx-auto aspect-[9/16] overflow-hidden rounded-2xl bg-gray-900"
        >
          <video
            ref={videoRef}
            src={`${CLOUDINARY_VIDEO}/w_720,q_auto/${VIDEO_PATH}.mp4`}
            poster={`${CLOUDINARY_VIDEO}/so_0,w_720/${VIDEO_PATH}.jpg`}
            muted={muted}
            loop
            playsInline
            preload="none"
            aria-label="Teaser des bonnets AVEON"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => setMuted((current) => !current)}
            aria-label={muted ? 'Activer le son' : 'Couper le son'}
            className="absolute bottom-3 right-3 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
          >
            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
