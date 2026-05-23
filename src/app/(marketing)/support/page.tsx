import Link from 'next/link';
import { ArrowUpRight, MessageCircle, BookOpen, Mail } from 'lucide-react';

const topics = [
  { icon: MessageCircle, title: 'Getting started', desc: 'New to Peerly? Start here.' },
  { icon: BookOpen, title: 'Sessions & matching', desc: 'How sessions, ratings, and matching work.' },
  { icon: MessageCircle, title: 'Account & billing', desc: 'Manage your account and subscription.' },
  { icon: Mail, title: 'Report an issue', desc: 'Something not working? Let us know.' },
];

export default function SupportPage() {
  return (
    <div className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <p className="text-xs font-medium uppercase tracking-widest text-[#CB6CE6]">Support</p>
        <h1 className="mt-3 text-3xl font-medium leading-tight tracking-tighter text-white sm:text-4xl md:text-5xl">
          How can we help?
        </h1>
        <div className="mt-12 grid gap-px bg-white/[0.06] sm:grid-cols-2">
          {topics.map((topic) => (
            <Link
              key={topic.title}
              href="/"
              className="group flex items-start gap-4 bg-[#08090d] p-6 transition-colors hover:bg-white/[0.02]"
            >
              <topic.icon size={16} className="mt-0.5 shrink-0 text-zinc-500 transition-colors group-hover:text-[#CB6CE6]" />
              <div>
                <h2 className="text-sm font-medium text-white transition-colors group-hover:text-[#CB6CE6]">
                  {topic.title}
                </h2>
                <p className="mt-0.5 text-xs text-zinc-500">{topic.desc}</p>
              </div>
              <ArrowUpRight size={12} className="ml-auto mt-0.5 shrink-0 text-zinc-600 transition-colors group-hover:text-[#CB6CE6]" />
            </Link>
          ))}
        </div>
        <p className="mt-10 text-sm text-zinc-500">
          Still need help?{' '}
          <Link href="/contact" className="text-[#CB6CE6] transition-colors hover:text-[#D992F7]">
            Contact us
          </Link>
        </p>
      </div>
    </div>
  );
}
