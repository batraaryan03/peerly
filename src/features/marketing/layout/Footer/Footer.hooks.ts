'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useFooterParallax() {
  useEffect(() => {
    const footer = document.querySelector('[data-footer-parallax]');
    if (!footer) return;

    const container = footer.querySelector('[data-footer-content]');
    if (!container) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        container,
        { y: 80, opacity: 0.7 },
        {
          y: -100,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: footer,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        },
      );
    }, footer as HTMLElement);

    return () => ctx.revert();
  }, []);
}
