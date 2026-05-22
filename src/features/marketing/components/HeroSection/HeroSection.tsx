'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { hero } from './HeroSection.styles';
import { useHeroParallax } from './HeroSection.hooks';

const IMAGE_URL =
  'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?ixid=M3w5NDY1MzZ8MHwxfHNlYXJjaHwxfHxmb2N1cyUyMGRlZXAlMjB3b3JrJTIwY29uY2VudHJhdGlvbiUyMG1pbmltYWxpc3QlMjBkZXNrfGVufDB8MHx8fDE3Nzk0MzYwMzl8MA&ixlib=rb-4.1.0&q=85&w=2400';

const ease = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease },
  },
};

export function HeroSection() {
  const { sectionRef, imageRef } = useHeroParallax();

  return (
    <section ref={sectionRef} className={hero.section}>
      <div
        ref={imageRef}
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${IMAGE_URL})` }}
      />
      <div className={hero.overlay} />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={hero.content}
      >
        <motion.h1 variants={itemVariants} className={hero.title}>
          Focus with a <span className={hero.accent}>partner.</span>
        </motion.h1>
        <motion.p variants={itemVariants} className={hero.description}>
          Block time on your calendar. Match with someone who shares your goals.
          Work side by side, silently.
        </motion.p>
        <motion.div variants={itemVariants} className={hero.actions}>
          <Link href="/sign-up" className={hero.primaryAction}>
            Start a session
          </Link>
          <Link href="/about" className={hero.secondaryAction}>
            How it works
          </Link>
        </motion.div>
      </motion.div>
      <div className={hero.bottomLine} />
    </section>
  );
}
