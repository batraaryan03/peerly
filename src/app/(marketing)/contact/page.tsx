export default function ContactPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-md px-6">
        <h1 className="text-4xl font-medium tracking-tight">Contact</h1>
        <p className="mt-3 text-muted-foreground">
          Have a question or feedback? We&apos;d love to hear from you.
        </p>
        <form className="mt-8 space-y-6">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full border-0 border-b border-transparent bg-transparent pb-1 text-sm outline-none ring-0 placeholder:text-muted-foreground/40 focus:border-b focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Message
            </label>
            <textarea
              rows={4}
              placeholder="What&apos;s on your mind?"
              className="mt-1 w-full resize-none border-0 border-b border-transparent bg-transparent pb-1 text-sm outline-none ring-0 placeholder:text-muted-foreground/40 focus:border-b focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Send message
          </button>
        </form>
      </div>
    </div>
  );
}
