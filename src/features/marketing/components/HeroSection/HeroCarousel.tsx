'use client';

import { useEffect, useState } from 'react';

const IMAGES = [
  'https://images.unsplash.com/photo-1553028826-f4804a6dba3b?q=85&w=2400',
  'https://images.unsplash.com/photo-1533757879476-8f4a3cb1ae4b?q=85&w=2400',
  'https://images.unsplash.com/photo-1505275350441-83dcda8eeef5?q=85&w=2400',
];

const DURATION = 5000;

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % IMAGES.length);
    }, DURATION);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#08090d]">
      {IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover bg-center will-change-auto"
          style={{
            backgroundImage: `url(${src})`,
            opacity: i === current ? 1 : 0,
            transition: i === current ? 'opacity 1500ms ease-in-out' : 'none',
            zIndex: i === current ? 1 : 0,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08090d]/70 via-[#08090d]/30 to-[#08090d]/70 z-[2]" />
    </div>
  );
}
