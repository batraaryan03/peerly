'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

const SPRING_CONFIG = { damping: 50, stiffness: 200 };

interface MagneticButtonProps {
  children: React.ReactNode;
  distance?: number;
  className?: string;
  as?: 'div' | 'span';
}

export function MagneticButton({
  children,
  distance = 0.1,
  className,
  as = 'div',
}: MagneticButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, SPRING_CONFIG);
  const springY = useSpring(y, SPRING_CONFIG);

  useEffect(() => {
    const calculateDistance = (e: MouseEvent) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        if (isHovered) {
          x.set(distanceX * distance / 2);
          y.set(distanceY * distance / 2);
        } else {
          x.set(0);
          y.set(0);
        }
      }
    };

    document.addEventListener('mousemove', calculateDistance);

    return () => {
      document.removeEventListener('mousemove', calculateDistance);
    };
  }, [ref, isHovered, x, y, distance]);

  const Component = as === 'span' ? motion.span : motion.div;

  return (
    <Component
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ x: springX, y: springY }}
      className={cn('inline-block', className)}
    >
      {children}
    </Component>
  );
}
