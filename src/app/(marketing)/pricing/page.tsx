'use client';

import { Check } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Get started with core features.',
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
      description: 'For power users who want more control.',
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
      description: 'For teams that want to focus together.',
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
    <div className="py-24">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h1 className="text-4xl font-medium tracking-tight">Pricing</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Simple pricing. No hidden fees. No borders.
        </p>
      </div>
      <div className="mx-auto mt-16 grid max-w-5xl gap-6 px-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-md p-6 ${
              plan.featured
                ? 'bg-foreground text-background'
                : 'bg-muted text-foreground'
            }`}
          >
            <h2 className="text-lg font-medium">{plan.name}</h2>
            <p className="mt-1 text-muted-foreground text-sm">
              {plan.description}
            </p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-3xl font-semibold">{plan.price}</span>
              {plan.period && (
                <span className="text-sm text-muted-foreground">
                  {plan.period}
                </span>
              )}
            </div>
            <ul className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-purple-600" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={plan.href}
              className={`mt-8 flex items-center justify-center rounded-md px-4 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 ${
                plan.featured
                  ? 'bg-background text-foreground'
                  : 'bg-foreground text-background'
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
