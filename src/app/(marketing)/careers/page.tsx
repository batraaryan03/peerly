import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const roles = [
  { title: 'Full-Stack Engineer', type: 'Remote', tag: 'Open' },
  { title: 'Product Designer', type: 'Remote', tag: 'Open' },
  { title: 'Community Lead', type: 'Remote', tag: 'Coming soon' },
];

export default function CareersPage() {
  return (
    <div className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <p className="text-xs font-medium uppercase tracking-widest text-[#CB6CE6]">Careers</p>
        <h1 className="mt-3 text-3xl font-medium leading-tight tracking-tighter text-white sm:text-4xl md:text-5xl">
          Build the future of focus.
        </h1>
        <p className="mt-4 max-w-[48ch] text-sm leading-relaxed text-zinc-400">
          We&apos;re a small team rethinking how people work together. If that
          sounds interesting, we&apos;d love to hear from you.
        </p>

        <div className="mt-12 grid gap-px bg-white/[0.06] max-w-2xl">
          {roles.map((role) => (
            <div
              key={role.title}
              className="flex items-center justify-between bg-[#08090d] p-5 transition-colors hover:bg-white/[0.02]"
            >
              <div>
                <h2 className="text-sm font-medium text-white">{role.title}</h2>
                <p className="mt-0.5 text-xs text-zinc-500">{role.type}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wider ${
                  role.tag === 'Open'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-zinc-500/10 text-zinc-500'
                }`}
              >
                {role.tag}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#CB6CE6] transition-colors hover:text-[#D992F7]"
          >
            Contact us about a role
            <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
