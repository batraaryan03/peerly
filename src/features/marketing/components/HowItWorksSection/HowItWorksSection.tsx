'use client';

import { motion } from 'motion/react';
import { how } from './HowItWorksSection.styles';

const steps = [
  {
    number: '01',
    title: 'Block your time',
    description:
      'Open your calendar and mark when you plan to work. Choose a duration — 25 minutes or 2 hours.',
    image: 'https://images.unsplash.com/photo-1435527173128-983b87201f4d?ixid=M3w5NDY1MzZ8MHwxfHNlYXJjaHwxfHxjYWxlbmRhciUyMHBsYW5uaW5nJTIwc2NoZWR1bGUlMjBkZXNrfGVufDB8MHx8fDE3Nzk0NTk2NTZ8MA&ixlib=rb-4.1.0&q=85&w=1600',
  },
  {
    number: '02',
    title: 'Find your match',
    description:
      'Browse peers with overlapping availability. Request to join a slot or accept an incoming request.',
    image: 'https://images.unsplash.com/photo-1713946598534-c5523c97ba60?ixid=M3w5NDY1MzZ8MHwxfHNlYXJjaHwyfHx0d28lMjBwZW9wbGUlMjB2aWRlbyUyMGNhbGwlMjBjb2xsYWJvcmF0aW9uJTIwb25saW5lfGVufDB8MHx8fDE3Nzk0NTk2NTh8MA&ixlib=rb-4.1.0&q=85&w=1600',
  },
  {
    number: '03',
    title: 'Work together',
    description:
      'Join a video call at session time. No small talk. No distractions. Just focus.',
    image: 'https://images.unsplash.com/photo-1759668358583-09cdcae2ba36?ixid=M3w5NDY1MzZ8MHwxfHNlYXJjaHwxfHxmb2N1cyUyMHdvcmslMjBkZXNrJTIwbGFwdG9wJTIwY29mZmVlfGVufDB8MHx8fDE3Nzk0NTk2NTd8MA&ixlib=rb-4.1.0&q=85&w=1600',
  },
];

export function HowItWorksSection() {
  return (
    <section className={how.section}>
      <div className={how.container}>
        <div className={how.header}>
          <p className={how.label}>How it works</p>
          <h2 className={how.heading}>
            Three steps to
            <br />
            deeper focus.
          </h2>
        </div>
        <div className={how.list}>
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
              className={i % 2 === 1 ? how.stepRowReverse : how.stepRow}
            >
              <div className="flex-1">
                <p className={how.number}>{step.number}</p>
                <h3 className={how.title}>{step.title}</h3>
                <p className={how.description}>{step.description}</p>
              </div>
              <div className="flex-1">
                <div className={how.imageWrapper}>
                  <img
                    src={step.image}
                    alt={step.title}
                    className={how.image}
                    loading="lazy"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
