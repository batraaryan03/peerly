import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const posts = [
  {
    title: 'Why calendar-first focus works',
    desc: 'Most productivity tools are built around tasks. We built ours around time.',
    date: 'May 15, 2026',
  },
  {
    title: 'The problem with focus apps',
    desc: 'Timers, pomodoros, and todo lists all miss one thing: another person.',
    date: 'May 8, 2026',
  },
  {
    title: 'Rating systems that build trust',
    desc: 'How peer ratings create a self-policing community of focused workers.',
    date: 'Apr 28, 2026',
  },
];

export default function BlogPage() {
  return (
    <div className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <p className="text-xs font-medium uppercase tracking-widest text-[#CB6CE6]">Blog</p>
        <h1 className="mt-3 text-3xl font-medium leading-tight tracking-tighter text-white sm:text-4xl md:text-5xl">
          Thoughts on focus.
        </h1>
        <div className="mt-12 grid gap-px bg-white/[0.06] md:grid-cols-3">
          {posts.map((post) => (
            <article key={post.title} className="group bg-[#08090d] p-8">
              <time className="text-xs text-zinc-500">{post.date}</time>
              <h2 className="mt-3 text-base font-medium text-white transition-colors group-hover:text-[#CB6CE6]">
                {post.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{post.desc}</p>
              <Link
                href="/"
                className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-zinc-500 transition-colors group-hover:text-[#CB6CE6]"
              >
                Read more
                <ArrowUpRight size={11} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
