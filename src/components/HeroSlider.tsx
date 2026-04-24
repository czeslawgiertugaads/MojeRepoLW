'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const images = [
  '/images/hero-main.webp',
  '/images/hero-main-2.webp',
  '/images/hero-main-3.webp'
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={loading ? 'skeleton-shimmer' : ''} style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
      {images.map((src, idx) => (
        <div
          key={src}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: current === idx ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
            transform: current === idx ? 'scale(1.05)' : 'scale(1)',
            transitionProperty: 'opacity, transform',
            transitionDuration: '1.5s, 10s', 
            zIndex: current === idx ? 1 : 0,
          }}
        >
          <Image
            src={src}
            alt="Pomoc Drogowa Laweciarz.pro"
            fill
            priority
            draggable={false}
            onLoad={() => idx === 0 && setLoading(false)}
            style={{ 
              objectFit: 'cover',
              userSelect: 'none',
              WebkitTouchCallout: 'none'
            }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Transparent shield to prevent right-click/opening image */}
          <div 
            style={{ position: 'absolute', inset: 0, zIndex: 2, cursor: 'default' }} 
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      ))}
    </div>
  );
}
