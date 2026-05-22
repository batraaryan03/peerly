'use client';

import { motion } from 'motion/react';
import { features } from './FeaturesSection.styles';

const featureList = [
  {
    title: 'Calendar as your anchor',
    description:
      'Every session is tied to a real time slot. No floating tasks. No vague commitments.',
  },
  {
    title: 'Peer ratings',
    description:
      'Know who you are matching with. Ratings from past sessions build trust across the network.',
  },
  {
    title: 'Zero overhead',
    description:
      'No onboarding forms. No profile setup. Your calendar is your identity.',
  },
  {
    title: 'Built-in video',
    description:
      'One click starts a peer-to-peer video call. No external tools. No accounts required.',
  },
  {
    title: 'Accountability, automated',
    description:
      'When someone is counting on you, showing up is easier. Peerly handles the rest.',
  },
];

export function FeaturesSection() {
  return (
    <section className={features.section}>
      <div className={features.container}>
        <div className={features.header}>
          <p className={features.label}>Built for focus</p>
          <h2 className={features.heading}>
            A calendar.
            <br />
            Your peers. Nothing else.
          </h2>
        </div>
        <div className={features.grid}>
          {featureList.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
              className={features.cell}
            >
              <div className={features.line} />
              <h3 className={features.title}>{feature.title}</h3>
              <p className={features.desc}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
