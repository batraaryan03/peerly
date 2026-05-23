'use client';

import Link from 'next/link';
import { useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { hero } from './HeroSection.styles';
import { useHeroParallax } from './HeroSection.hooks';
import { HeroCarousel } from './HeroCarousel';
import { MagneticButton } from '@/components/ui/magnetic-button';
import { ArrowRight, Play } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease },
  },
};

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1.5,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 0.8 },
      }}
      className={hero.shape + ' ' + className}
    >
      <div
        className="relative animate-float"
        style={{ width, height }}
      />
    </motion.div>
  );
}

export function HeroSection() {
  const { sectionRef, imageRef, contentRef } = useHeroParallax();
  const glowRef = useRef<HTMLDivElement>(null);
  const glowFrame = useRef(0);
  const glowRect = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (glowFrame.current) cancelAnimationFrame(glowFrame.current);
    glowFrame.current = requestAnimationFrame(() => {
      const glow = glowRef.current;
      if (!glow) return;
      glow.style.left = `${e.clientX - glowRect.current.x}px`;
      glow.style.top = `${e.clientY - glowRect.current.y}px`;
      glow.style.opacity = '1';
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    const glow = glowRef.current;
    if (!glow) return;
    const rect = glow.parentElement!.getBoundingClientRect();
    glowRect.current = { x: rect.left, y: rect.top };
  }, []);

  const handleMouseLeave = useCallback(() => {
    const glow = glowRef.current;
    if (!glow) return;
    glow.style.opacity = '0';
  }, []);

  return (
    <section
      ref={sectionRef}
      className={hero.section}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={imageRef} className={hero.carouselRef} data-speed="0.92">
        <HeroCarousel />
      </div>

      <div className={`${hero.glass} ${hero.glassBorder}`} />

      <div ref={glowRef} className={hero.glow} />

      <div className={hero.decorativeText}>F</div>

      <ElegantShape
        width={520}
        height={120}
        delay={0.3}
        className="left-[-8%] top-[18%] from-[#CB6CE6]/[0.08]"
      />
      <ElegantShape
        width={400}
        height={100}
        delay={0.5}
        className="right-[-4%] top-[72%] from-[#CB6CE6]/[0.06]"
      />
      <ElegantShape
        width={260}
        height={70}
        delay={0.4}
        className="left-[5%] bottom-[8%] from-white/[0.06]"
      />
      <ElegantShape
        width={180}
        height={50}
        delay={0.6}
        className="right-[12%] top-[12%] from-white/[0.05]"
      />
      <ElegantShape
        width={130}
        height={35}
        delay={0.7}
        className="left-[22%] top-[6%] from-[#CB6CE6]/[0.05]"
      />

      <motion.div
        ref={contentRef as React.RefObject<HTMLDivElement>}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={hero.content}
      >
        <div className={hero.glassCard}>
          <motion.div variants={itemVariants} className={hero.badge}>
            <span className="h-1.5 w-1.5 rounded-full bg-[#CB6CE6]" />
            Find your focus partner
          </motion.div>

          <motion.h1 variants={itemVariants} className={hero.title}>
            Focus with a{' '}
            <span className={hero.accent}>Partner.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className={hero.description}>
            Join a live focus room. Work alongside others who share your goals.
            No pressure, just quiet productivity.
          </motion.p>

          <motion.div variants={itemVariants} className={hero.actions}>
            <MagneticButton distance={0.12}>
              <Link href="/sign-up" className={hero.primaryAction}>
                Start a session
                <ArrowRight size={14} className="text-white/70" />
              </Link>
            </MagneticButton>
            <MagneticButton distance={0.08}>
              <Link href="/how-it-works" className={hero.secondaryAction}>
                <Play size={12} className="fill-current" />
                How it works
              </Link>
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>

      <div className={hero.bottomLine} />
    </section>
  );
}
