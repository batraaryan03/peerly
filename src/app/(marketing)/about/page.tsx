import { APP_NAME, APP_TAGLINE } from '@/lib/constants';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const team = [
  { name: 'Aria Chen', role: 'Founder & Product' },
  { name: 'Marcus Velez', role: 'Engineering' },
  { name: 'Priya Kapoor', role: 'Design' },
  { name: 'Liam O\'Brien', role: 'Community' },
];

export default function AboutPage() {
  return (
    <div className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-widest text-[#CB6CE6]">About</p>
          <h1 className="mt-3 text-3xl font-medium leading-tight tracking-tighter text-white sm:text-4xl md:text-5xl">
            Focus happens{' '}
            <span className="text-[#CB6CE6]">together.</span>
          </h1>
          <p className="mt-5 max-w-[50ch] text-base leading-relaxed text-zinc-400">
            {APP_NAME} is a calendar-based peer matching platform. Block a time
            slot, find a peer who&apos;s also available, and work side by side.
            No endless scheduling. No DMs. Just a calendar and a join button.
          </p>
          <p className="mt-4 max-w-[50ch] text-base leading-relaxed text-zinc-400">
            Built for engineers who want accountability without overhead.
          </p>
        </div>

        <hr className="my-16 border-white/[0.06]" />

        <div className="grid gap-12 md:grid-cols-3">
          <div className="md:col-span-1">
            <h2 className="text-xs font-medium uppercase tracking-widest text-[#CB6CE6]">Philosophy</h2>
          </div>
          <div className="md:col-span-2 grid gap-10 sm:grid-cols-2">
            <div>
              <h3 className="text-base font-medium text-white">Minimalism</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Every pixel has a purpose. If it doesn&apos;t help you focus,
                it doesn&apos;t belong.
              </p>
            </div>
            <div>
              <h3 className="text-base font-medium text-white">Essentialism</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                The calendar is the source of truth. Everything else is noise.
              </p>
            </div>
            <div>
              <h3 className="text-base font-medium text-white">Intentionalism</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Every session has a purpose. Book with intention, show up with
                focus.
              </p>
            </div>
            <div>
              <h3 className="text-base font-medium text-white">Trust</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                Ratings build reputation. Show up on time, earn trust, grow
                together.
              </p>
            </div>
          </div>
        </div>

        <hr className="my-16 border-white/[0.06]" />

        <div className="grid gap-12 md:grid-cols-3">
          <div className="md:col-span-1">
            <h2 className="text-xs font-medium uppercase tracking-widest text-[#CB6CE6]">Team</h2>
          </div>
          <div className="md:col-span-2 grid gap-px bg-white/[0.06] sm:grid-cols-2">
            {team.map((member) => (
              <div key={member.name} className="bg-[#08090d] p-6">
                <div className="mb-3 h-20 w-20 rounded-full bg-[#CB6CE6]/10 flex items-center justify-center text-xl font-medium text-[#CB6CE6]">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-sm font-medium text-white">{member.name}</h3>
                <p className="mt-0.5 text-xs text-zinc-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        <hr className="my-16 border-white/[0.06]" />

        <div className="flex items-center justify-between gap-6">
          <p className="text-sm text-zinc-500">
            {APP_NAME} &mdash; {APP_TAGLINE}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#CB6CE6] transition-colors hover:text-[#D992F7]"
          >
            Get in touch
            <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
