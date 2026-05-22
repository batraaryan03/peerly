'use client';

import { ArrowRight, Calendar, Video, Star, Users, Shield } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cubicBezier = [0.16, 1, 0.3, 1] as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: cubicBezier } },
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://picsum.photos/seed/peerly-hero/2400/1600)',
          }}
        />
        <div className="absolute inset-0 bg-zinc-950/65 backdrop-brightness-75" />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 mx-auto max-w-3xl text-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Peer-to-peer focus sessions
          </motion.div>
          <motion.h1 variants={itemVariants} className="mt-6 text-5xl font-medium leading-tight tracking-tighter text-white sm:text-6xl md:text-7xl">
            Find your focus partner.
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-6 text-lg text-white/60 sm:text-xl max-w-[65ch] mx-auto">
            A shared calendar for focused minds. Block time, discover peers, and
            ship together — one session at a time.
          </motion.p>
          <motion.div variants={itemVariants} className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/calendar"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition-all hover:bg-zinc-100 active:scale-[0.98]"
            >
              Start a session
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:border-white/40 hover:text-white"
            >
              See pricing
            </Link>
          </motion.div>
        </motion.div>
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
          <div className="h-10 w-0.5 rounded-full bg-white/20" />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-zinc-950 py-16 text-white">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-8 px-6 text-center">
          {[
            { value: '12,400+', label: 'Active peers' },
            { value: '53,280+', label: 'Sessions completed' },
            { value: '4.87', label: 'Avg. rating' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
              <p className="mt-1 text-sm text-white/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-24 text-zinc-900">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="mt-3 text-zinc-500">
              Three steps to your next focused session.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Calendar,
                title: 'Block time',
                image: 'https://picsum.photos/seed/peerly-block/800/600',
                description:
                  'Drag on the calendar to mark when you\'re available. Be intentional with your time.',
              },
              {
                icon: Star,
                title: 'Find a peer',
                image: 'https://picsum.photos/seed/peerly-find/800/600',
                description:
                  'Browse who\'s free. Request to join their slot or wait for requests on yours.',
              },
              {
                icon: Video,
                title: 'Ship together',
                image: 'https://picsum.photos/seed/peerly-ship/800/600',
                description:
                  'Join the video call at session time. Work side by side, then rate the experience.',
              },
            ].map((step) => (
              <div key={step.title} className="group">
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100">
                  <div
                    className="h-full w-full bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundImage: `url(${step.image})` }}
                  />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <step.icon className="h-4 w-4 text-emerald-500" />
                  <h3 className="text-sm font-medium text-zinc-800">{step.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500 max-w-[45ch]">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-zinc-950 py-24 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
              Built for engineers
            </h2>
            <p className="mt-3 text-white/50">
              No fluff. No distractions. Just a calendar and your peers.
            </p>
          </div>
          <div className="mt-16 grid gap-px bg-white/10 md:grid-cols-2 rounded-2xl overflow-hidden">
            {[
              {
                icon: Calendar,
                title: 'Calendar as source of truth',
                desc: 'Every session starts with a time slot. No scheduling back-and-forth.',
              },
              {
                icon: Star,
                title: 'Peer ratings',
                desc: 'Know who you\'re matching with. Ratings keep the community accountable.',
              },
              {
                icon: Shield,
                title: 'Minimal interface',
                desc: 'Neutral tones, emerald accents. No borders, no noise.',
              },
              {
                icon: Users,
                title: 'Open video calls',
                desc: 'Join with one click. Jitsi-powered, no account needed.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-zinc-950 p-8 transition-colors hover:bg-white/5"
              >
                <feature.icon className="h-5 w-5 text-emerald-400" />
                <h3 className="mt-4 font-medium text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-white/50 max-w-[50ch]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-white py-24 text-zinc-900">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <div className="text-6xl font-medium leading-none text-zinc-200">
            &ldquo;
          </div>
          <blockquote className="mt-4 text-xl leading-relaxed text-zinc-600">
            Peerly changed how I work. Having a calendar-based commitment to
            show up makes procrastination impossible.
          </blockquote>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
              RK
            </div>
            <div className="text-left text-sm">
              <p className="font-medium text-zinc-800">Ravi Kumar</p>
              <p className="text-zinc-400">Software Engineer</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-zinc-950 py-24 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage:
              'url(https://picsum.photos/seed/peerly-cta/2400/1600)',
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
            Ready to find your focus partner?
          </h2>
          <p className="mt-3 text-white/50">
            It&apos;s free. No sign-up required to start.
          </p>
          <Link
            href="/calendar"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition-all hover:bg-zinc-100 active:scale-[0.98]"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
