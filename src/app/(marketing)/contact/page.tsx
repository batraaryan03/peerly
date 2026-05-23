'use client';

import { Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mx-auto max-w-lg">
          <p className="text-xs font-medium uppercase tracking-widest text-[#CB6CE6]">Contact</p>
          <h1 className="mt-3 text-3xl font-medium leading-tight tracking-tighter text-white sm:text-4xl">
            Have a question?
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            We&apos;d love to hear from you. Drop us a message and we&apos;ll get back to you.
          </p>

          <form className="mt-10 space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="text-xs font-medium text-zinc-400">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition-all placeholder:text-zinc-600 focus:border-[#CB6CE6]/40 focus:shadow-[inset_0_0_0_1px_rgba(203,108,230,0.2)]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Message</label>
              <textarea
                rows={5}
                placeholder="What&apos;s on your mind?"
                className="mt-1.5 w-full resize-none rounded-lg border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition-all placeholder:text-zinc-600 focus:border-[#CB6CE6]/40 focus:shadow-[inset_0_0_0_1px_rgba(203,108,230,0.2)]"
              />
            </div>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#CB6CE6] px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#9C4FC2] active:scale-[0.98]"
            >
              Send message
              <Send size={13} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
