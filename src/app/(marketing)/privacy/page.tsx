import { APP_NAME } from '@/lib/constants';

export default function PrivacyPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-2xl px-6">
        <h1 className="text-4xl font-medium tracking-tight">Privacy Policy</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            Your privacy matters. This policy explains what data {APP_NAME}{' '}
            collects and how it&apos;s used.
          </p>
          <h2 className="text-base font-medium text-foreground">
            What We Collect
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Name and email (when provided)</li>
            <li>Calendar time slots you create</li>
            <li>Session participation data</li>
            <li>Ratings and feedback</li>
          </ul>
          <h2 className="text-base font-medium text-foreground">
            How We Use It
          </h2>
          <p>
            Your data is used solely to operate the platform: show availability,
            match peers, and maintain community quality through ratings.
          </p>
          <h2 className="text-base font-medium text-foreground">
            Video Calls
          </h2>
          <p>
            Video calls are powered by Jitsi Meet. {APP_NAME} does not record or
            store video streams. Jitsi&apos;s privacy policy applies to the
            call data.
          </p>
          <h2 className="text-base font-medium text-foreground">
            Data Storage
          </h2>
          <p>
            Data is stored locally in your browser during the prototype phase.
            Server-side storage will be added in future versions.
          </p>
          <p className="pt-4 text-xs">
            Last updated: May 2026
          </p>
        </div>
      </div>
    </div>
  );
}
