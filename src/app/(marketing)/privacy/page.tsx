import { APP_NAME } from '@/lib/constants';

export default function PrivacyPage() {
  return (
    <div className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-widest text-[#CB6CE6]">Legal</p>
          <h1 className="mt-3 text-3xl font-medium leading-tight tracking-tighter text-white sm:text-4xl md:text-5xl">
            Privacy Policy
          </h1>
          <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-400">
            <p>
              Your privacy matters. This policy explains what data {APP_NAME}{' '}
              collects and how it&apos;s used.
            </p>

            <div>
              <h2 className="mb-3 text-base font-medium text-white">What We Collect</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Name and email (when provided)</li>
                <li>Calendar time slots you create</li>
                <li>Session participation data</li>
                <li>Ratings and feedback</li>
              </ul>
            </div>

            <div>
              <h2 className="mb-3 text-base font-medium text-white">How We Use It</h2>
              <p>
                Your data is used solely to operate the platform: show availability,
                match peers, and maintain community quality through ratings.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-base font-medium text-white">Video Calls</h2>
              <p>
                Video calls are powered by Jitsi Meet. {APP_NAME} does not record or
                store video streams. Jitsi&apos;s privacy policy applies to the
                call data.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-base font-medium text-white">Data Storage</h2>
              <p>
                Data is stored locally in your browser during the prototype phase.
                Server-side storage will be added in future versions.
              </p>
            </div>

            <hr className="border-white/[0.06]" />

            <p className="text-xs text-zinc-500">
              Last updated: May 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
