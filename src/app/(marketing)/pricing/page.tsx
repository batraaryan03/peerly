'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Core features.',
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
      description: 'For power users.',
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
      description: 'For teams.',
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

  return (
    <div className="py-20">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h1 className="text-2xl font-medium tracking-tight">Pricing</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Simple pricing. No hidden fees.
        </p>
      </div>
      <div className="mx-auto mt-10 grid max-w-5xl gap-4 px-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl p-5 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ${
              plan.featured
                ? 'bg-emerald-500/10'
                : 'bg-white/[0.03]'
            }`}
          >
            <h2 className="text-sm font-medium text-foreground">{plan.name}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {plan.description}
            </p>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-foreground">{plan.price}</span>
              {plan.period && (
                <span className="text-xs text-muted-foreground">
                  {plan.period}
                </span>
              )}
            </div>
            <ul className="mt-5 space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={plan.href}
              className={`mt-6 flex items-center justify-center rounded-lg px-4 py-2 text-xs font-medium transition-all active:scale-[0.98] ${
                plan.featured
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-white/[0.06] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-white/[0.1]'
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
