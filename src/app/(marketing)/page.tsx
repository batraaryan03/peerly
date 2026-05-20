'use client';

import { ArrowRight, Calendar, Video, Star, Users, Shield } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2400&auto=format)',
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm">
            <div className="h-1.5 w-1.5 rounded-full bg-purple-400" />
            Peer-to-peer focus sessions
          </div>
          <h1 className="mt-6 text-5xl font-medium leading-tight tracking-tight text-white sm:text-6xl md:text-7xl">
            Find your focus partner.
          </h1>
          <p className="mt-6 text-lg text-white/60 sm:text-xl">
            A shared calendar for focused minds. Block time, discover peers, and
            ship together — one session at a time.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/calendar"
              className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
            >
              Start a session
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-md border border-white/20 px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:border-white/40 hover:text-white"
            >
              See pricing
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
          <div className="h-8 w-0.5 rounded-full bg-white/30" />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-black py-16 text-white">
        <div className="mx-auto grid max-w-4xl grid-cols-3 gap-8 px-6 text-center">
          {[
            { value: '100+', label: 'Active peers' },
            { value: '500+', label: 'Sessions completed' },
            { value: '4.8', label: 'Avg. rating' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-semibold tracking-tight">{stat.value}</p>
              <p className="mt-1 text-sm text-white/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-24 text-black">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
              How it works
            </h2>
            <p className="mt-3 text-black/50">
              Three steps to your next focused session.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Calendar,
                title: 'Block time',
                image:
                  'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1200&auto=format',
                description:
                  'Drag on the calendar to mark when you\'re available. Be intentional with your time.',
              },
              {
                icon: Star,
                title: 'Find a peer',
                image:
                  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format',
                description:
                  'Browse who\'s free. Request to join their slot or wait for requests on yours.',
              },
              {
                icon: Video,
                title: 'Ship together',
                image:
                  'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format',
                description:
                  'Join the video call at session time. Work side by side, then rate the experience.',
              },
            ].map((step) => (
              <div key={step.title} className="group">
                <div className="aspect-[4/3] overflow-hidden rounded-md bg-black/5">
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${step.image})` }}
                  />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <step.icon className="h-4 w-4 text-black/40" />
                  <h3 className="text-sm font-medium">{step.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-black/50">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-black py-24 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
              Built for engineers
            </h2>
            <p className="mt-3 text-white/50">
              No fluff. No distractions. Just a calendar and your peers.
            </p>
          </div>
          <div className="mt-16 grid gap-px bg-white/10 md:grid-cols-2">
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
                desc: 'Black, white, and purple. No borders, no noise. Just what matters.',
              },
              {
                icon: Users,
                title: 'Open video calls',
                desc: 'Join with one click. Jitsi-powered, no account needed.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-black p-8 transition-colors hover:bg-white/5"
              >
                <feature.icon className="h-5 w-5 text-purple-400" />
                <h3 className="mt-4 font-medium">{feature.title}</h3>
                <p className="mt-2 text-sm text-white/50">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-white py-24 text-black">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <div className="text-5xl font-medium leading-none text-black/10">
            &ldquo;
          </div>
          <blockquote className="mt-4 text-xl leading-relaxed text-black/70">
            Peerly changed how I work. Having a calendar-based commitment to
            show up makes procrastination impossible.
          </blockquote>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-medium text-white">
              RK
            </div>
            <div className="text-left text-sm">
              <p className="font-medium">Ravi Kumar</p>
              <p className="text-black/50">Software Engineer</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-black py-24 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2400&auto=format)',
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
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
