'use client';

import { motion } from 'motion/react';
import { features } from './FeaturesSection.styles';
import { CalendarDays, Star, Zap, Video, Target } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

const calendarDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const activeDays = ['Mon', 'Wed', 'Fri'];

export function FeaturesSection() {
  return (
    <section className={features.section}>
      <div className={features.container}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease }}
          className={features.header}
        >
          <p className={features.label}>Built for focus</p>
          <h2 className={features.heading}>
            A calendar.
            <br />
            Your peers. Nothing else.
          </h2>
        </motion.div>

        <div className={features.bento}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease, delay: 0.05 }}
            className={features.heroCard}
          >
            <div className={features.heroCardContent}>
              <span className={features.heroLabel}>Core concept</span>
              <h3 className={features.heroTitle}>
                A <span className={features.heroAccent}>calendar</span> is all
                you need to start
              </h3>
              <p className={features.heroDesc}>
                Every session is tied to a real time slot. No floating tasks. No
                vague commitments. Just show up and focus.
              </p>
              <div className={features.heroCalendar}>
                {calendarDays.map((day) => (
                  <div
                    key={day}
                    className={`${features.calDay} ${activeDays.includes(day) ? features.calDayActive : ''}`}
                  >
                    {day.slice(0, 2)}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <FeatureCard
            icon={<Star size={18} />}
            title="Peer ratings"
            description="Know who you are matching with. Ratings from past sessions build trust across the network."
            delay={0.1}
          />
          <FeatureCard
            icon={<Zap size={18} />}
            title="Zero overhead"
            description="No onboarding forms. No profile setup. Your calendar is your identity."
            delay={0.15}
          />
          <FeatureCard
            icon={<Video size={18} />}
            title="Built-in video"
            description="One click starts a peer-to-peer video call. No external tools. No accounts required."
            delay={0.2}
          />
          <FeatureCard
            icon={<Target size={18} />}
            title="Accountability, automated"
            description="When someone is counting on you, showing up is easier. Peerly handles the rest."
            delay={0.25}
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease, delay }}
      className={features.card}
    >
      <div
        className={features.cardGlow}
        style={{
          background:
            'radial-gradient(400px circle at 50% 0%, rgba(203,108,230,0.06), transparent)',
        }}
      />
      <div className={features.cardIcon}>{icon}</div>
      <h3 className={features.cardTitle}>{title}</h3>
      <p className={features.cardDesc}>{description}</p>
    </motion.div>
  );
}
