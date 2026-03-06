// src/components/WelcomeScreen.tsx
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface WelcomeScreenProps {
  onEnter: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline();

    // Overlay qui disparaît
    tl.fromTo(
      overlayRef.current,
      { opacity: 1 },
      { opacity: 0, duration: 0.8, ease: 'power2.inOut' }
    );

    // Création des lettres AVEON
    if (titleRef.current) {
      titleRef.current.innerHTML = '';
      const text = 'AØN';
      const letters: HTMLSpanElement[] = [];

      for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i];
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(40px)';
        span.style.fontSize = 'clamp(5rem, 18vw, 10rem)';
        span.style.fontWeight = '800';
        span.style.letterSpacing = '0.03em';
        span.style.color = '#000000ce';
        // Ajout pour éviter les problèmes de clic sur mobile
        span.style.pointerEvents = 'none';

        titleRef.current.appendChild(span);
        letters.push(span);
      }

      tl.to(letters, {
        duration: 1,
        opacity: 1,
        y: 0,
        stagger: 0.38,
        ease: 'power3.out',
        delay: 0.3,
      });
    }

    tl.fromTo(
      cityRef.current,
      { opacity: 0, y: 20 },
      { opacity: 0.8, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.3'
    );

    tl.fromTo(
      lineRef.current,
      { width: 0, opacity: 0 },
      { width: '3rem', opacity: 0.5, duration: 0.5, ease: 'power2.out' },
      '-=0.2'
    );

    tl.fromTo(
      buttonRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(1.4)' },
      '-=0.1'
    );

    gsap.to(buttonRef.current, {
      scale: 1.05,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 1.2,
    });

    return () => {
      tl.kill();
    };
  }, []);

  const handleEnter = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Important pour mobile
    e.stopPropagation(); // Empêche la propagation
    
    if (isExiting) return; // Évite les doubles clics
    
    setIsExiting(true);

    // mark welcome as seen for this session
    sessionStorage.setItem('aveon_welcome_seen', 'true');

    const tl = gsap.timeline({
      onComplete: () => {
        onEnter();
      },
    });

    tl.to(titleRef.current?.children || [], {
      duration: 0.4,
      opacity: 0,
      y: -30,
      stagger: 0.05,
      ease: 'power2.in',
    });

    tl.to(
      cityRef.current,
      { opacity: 0, y: -20, duration: 0.3 },
      '-=0.3'
    );

    tl.to(
      lineRef.current,
      { width: 0, opacity: 0, duration: 0.2 },
      '-=0.2'
    );

    tl.to(
      buttonRef.current,
      { opacity: 0, scale: 0.8, duration: 0.25 },
      '-=0.25'
    );

    tl.to(
      containerRef.current,
      {
        scale: 1.1,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.4,
        ease: 'power2.inOut',
      },
      '-=0.1'
    );
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
        touchAction: 'pan-y', // Permet le défilement vertical si nécessaire
      }}
    >
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.03) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 text-center px-4 w-full">
        {/* Titre AVEON */}
        <div
          ref={titleRef}
          className="mb-2 leading-none"
          style={{
            fontFamily: "'League Spartan', 'Helvetica Neue', sans-serif",
            fontWeight: 900,
            letterSpacing: '0.03em',
            pointerEvents: 'none', // Empêche les lettres d'intercepter les clics
          }}
        />

        {/* DAKAR */}
        <p
          ref={cityRef}
          className="text-gray-400 text-xs sm:text-sm tracking-[0.5em] uppercase mt-2 opacity-0"
          style={{
            fontFamily: "'League Spartan', sans-serif",
            fontWeight: 400,
            letterSpacing: '0.5em',
            textIndent: '0.5em',
            pointerEvents: 'none', // Empêche le texte d'intercepter les clics
          }}
        >
          DAKAR
        </p>

        {/* Ligne décorative */}
        <div
          ref={lineRef}
          className="h-px bg-gray-300 mx-auto mt-8 opacity-0"
          style={{ width: 0, pointerEvents: 'none' }}
        ></div>

        {/* Bouton ENTER - Version améliorée pour mobile */}
        <div className="mt-8 px-4" style={{ touchAction: 'manipulation' }}>
          <button
            ref={buttonRef}
            onClick={handleEnter}
            onTouchStart={(e) => {
              e.preventDefault(); // Important pour mobile
              handleEnter(e);
            }}
            disabled={isExiting}
            className="px-10 py-3 bg-black text-white text-xs font-medium tracking-[0.25em] rounded-full
                     hover:bg-gray-900 transition-all duration-300 opacity-0
                     focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed uppercase
                     active:bg-gray-800 active:scale-95" // Ajout d'un effet tactile
            style={{
              fontFamily: "'League Spartan', sans-serif",
              letterSpacing: '0.25em',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              WebkitTapHighlightColor: 'transparent', 
              touchAction: 'manipulation', 
              minHeight: '44px', 
              minWidth: '44px',
            }}
          >
            ENTER
          </button>
        </div>

        {/* Éléments décoratifs flous */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gray-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-slow-pulse pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gray-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-slow-pulse pointer-events-none" />
      </div>

      {/* Footer Est. 2026 */}
      <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
        <p
          className="text-[10px] text-gray-300 tracking-[0.3em] uppercase"
          style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 400 }}
        >
          Est. 2026
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=League+Spartan:wght@300;400;600;700;900&display=swap');

        @keyframes slowPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }

        .animate-slow-pulse {
          animation: slowPulse 8s ease-in-out infinite;
        }

        /* Styles spécifiques pour mobile */
        @media (hover: none) and (pointer: coarse) {
          button {
            cursor: default;
          }
        }
      `}</style>
    </div>
  );
};

export default WelcomeScreen;