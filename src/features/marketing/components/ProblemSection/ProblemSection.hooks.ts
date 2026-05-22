'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useProblemReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const page = pageRef.current;
    if (!el || !page) return;

    const ctx = gsap.context(() => {
      gsap.set(page, { scale: 0.95, borderRadius: '16px' });

      gsap.to(page, {
        scale: 1,
        borderRadius: '0px',
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'top 15%',
          scrub: 1.2,
        },
      });

      const targets = el.querySelectorAll('[data-reveal]');
      gsap.fromTo(
        targets,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 70%',
            end: 'top 30%',
            scrub: 1,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return { ref, pageRef };
}
