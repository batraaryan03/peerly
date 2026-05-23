'use client';

import { useRef } from 'react';

export function useHeroParallax() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  return { sectionRef, imageRef, contentRef };
}
