export default function ContactPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-md px-6">
        <h1 className="text-2xl font-medium tracking-tight">Contact</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Have a question or feedback?
        </p>
        <form className="mt-8 space-y-5">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg bg-white/[0.04] px-3 py-2.5 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] outline-none placeholder:text-muted-foreground/40 focus-visible:shadow-[inset_0_0_0_1px_#10b981]"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Message
            </label>
            <textarea
              rows={4}
              placeholder="What&apos;s on your mind?"
              className="mt-1 w-full resize-none rounded-lg bg-white/[0.04] px-3 py-2.5 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] outline-none placeholder:text-muted-foreground/40 focus-visible:shadow-[inset_0_0_0_1px_#10b981]"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-emerald-600 active:scale-[0.98]"
          >
            Send message
          </button>
        </form>
      </div>
    </div>
  );
}
