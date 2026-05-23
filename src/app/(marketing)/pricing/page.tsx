'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: null,
    description: 'Core features. No commitment.',
    features: [
      'Weekly calendar view',
      'Create time slots',
      'Join sessions',
      'Rate peers',
    ],
    cta: 'Start free',
    href: '/calendar',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    description: 'For power users who want more.',
    features: [
      'Everything in Free',
      'Unlimited monthly sessions',
      'Priority matching',
      'Session analytics',
      'Custom calendar views',
      'Community badges',
    ],
    cta: 'Coming soon',
    href: '#',
    featured: true,
  },
  {
    name: 'Team',
    price: '$29',
    period: '/month',
    description: 'For teams and organizations.',
    features: [
      'Everything in Pro',
      'Team workspaces',
      'Shared calendars',
      'Admin dashboard',
      'API access',
      'SSO',
    ],
    cta: 'Coming soon',
    href: '#',
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 text-center md:px-12">
        <p className="text-xs font-medium uppercase tracking-widest text-[#CB6CE6]">Pricing</p>
        <h1 className="mt-3 text-3xl font-medium leading-tight tracking-tighter text-white sm:text-4xl md:text-5xl">
          Simple pricing.
          <br />
          <span className="text-[#CB6CE6]">No hidden fees.</span>
        </h1>
      </div>

      <div className="mx-auto mt-12 grid max-w-[1100px] gap-4 px-6 md:grid-cols-3 md:px-12">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className={`relative rounded-2xl border p-6 text-left backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-500 ${
              plan.featured
                ? 'border-[#CB6CE6]/30 bg-[#CB6CE6]/[0.04]'
                : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
            }`}
          >
            {plan.featured && (
              <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-[#CB6CE6]/50 to-transparent" />
            )}
            <h2 className="text-sm font-medium text-white">{plan.name}</h2>
            <p className="mt-1 text-xs text-zinc-500">{plan.description}</p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-semibold text-white">{plan.price}</span>
              {plan.period && <span className="text-xs text-zinc-500">{plan.period}</span>}
            </div>
            <ul className="mt-6 space-y-2.5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-xs text-zinc-400">
                  <Check size={12} className="mt-0.5 shrink-0 text-[#CB6CE6]" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={plan.href}
              className={`mt-8 flex items-center justify-center rounded-lg px-4 py-2.5 text-xs font-medium transition-all active:scale-[0.98] ${
                plan.featured
                  ? 'bg-[#CB6CE6] text-white hover:bg-[#9C4FC2]'
                  : 'bg-white/[0.06] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-white/[0.1]'
              }`}
            >
              {plan.cta}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
