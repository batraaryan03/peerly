'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { hero } from './HeroSection.styles';
import { useHeroParallax } from './HeroSection.hooks';

const IMAGE_URL =
  'https://images.unsplash.com/photo-1555143152-c04e6f5ba6ec?ixid=M3w5NDY1MzZ8MHwxfHNlYXJjaHw0fHxsYXRlJTIwbmlnaHQlMjB3b3JrJTIwZm9jdXMlMjBhbWJpZW5jZXxlbnwwfDB8fHwxNzc5NDU5NTg3fDA&ixlib=rb-4.1.0&q=85&w=2400';

const ease = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease },
  },
};

export function HeroSection() {
  const { sectionRef, imageRef, contentRef } = useHeroParallax();

  return (
    <section ref={sectionRef} className={hero.section}>
      <div
        ref={imageRef}
        className={hero.image}
        style={{ backgroundImage: `url(${IMAGE_URL})` }}
      />
      <div className={hero.overlay} />
      <div className={hero.glow} />
      <motion.div
        ref={contentRef as React.RefObject<HTMLDivElement>}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={hero.content}
      >
        <motion.h1 variants={itemVariants} className={hero.title}>
          Focus with a{' '}
          <span className={hero.accent}>Partner.</span>
        </motion.h1>
        <motion.p variants={itemVariants} className={hero.description}>
          Join a live focus room. Work alongside others who share your goals.
          No pressure, just quiet productivity.
        </motion.p>
        <motion.div variants={itemVariants} className={hero.actions}>
          <Link
            href="/sign-up"
            className={hero.primaryAction}
          >
            Start a session
          </Link>
          <Link href="/how-it-works" className={hero.secondaryAction}>
            How it works
          </Link>
        </motion.div>
      </motion.div>
      <div className={hero.bottomLine} />
    </section>
  );
}
