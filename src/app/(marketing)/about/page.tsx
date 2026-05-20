import { APP_NAME, APP_TAGLINE } from '@/lib/constants';

export default function AboutPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-2xl px-6">
        <h1 className="text-4xl font-medium tracking-tight">About</h1>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          {APP_NAME} is a calendar-based peer matching platform. We believe that
          focused work happens better together.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          The idea is simple: block a time slot, find a peer who&apos;s also
          available, and work side by side. No endless scheduling. No DMs. Just
          a calendar and a join button.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Built for engineers who want accountability without overhead.
        </p>
        <hr className="my-12 border-t border-transparent" />
        <h2 className="text-2xl font-medium tracking-tight">The philosophy</h2>
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="font-medium">Minimalism</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Every pixel has a purpose. If it doesn&apos;t help you focus,
              it doesn&apos;t belong.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Essentialism</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              The calendar is the source of truth. Everything else is noise.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Intentionalism</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Every session has a purpose. Book with intention, show up with
              focus.
            </p>
          </div>
        </div>
        <hr className="my-12 border-t border-transparent" />
        <p className="text-sm text-muted-foreground">
          {APP_NAME} &mdash; {APP_TAGLINE}
        </p>
      </div>
    </div>
  );
}
