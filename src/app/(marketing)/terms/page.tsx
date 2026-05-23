import { APP_NAME } from '@/lib/constants';

export default function TermsPage() {
  return (
    <div className="py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-widest text-[#CB6CE6]">Legal</p>
          <h1 className="mt-3 text-3xl font-medium leading-tight tracking-tighter text-white sm:text-4xl md:text-5xl">
            Terms of Service
          </h1>
          <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-400">
            <p>
              These terms govern your use of {APP_NAME}. By using {APP_NAME}, you
              agree to these terms.
            </p>

            <div>
              <h2 className="mb-3 text-base font-medium text-white">1. Your Account</h2>
              <p>
                You are responsible for your conduct while using {APP_NAME}. You
                agree not to misuse the platform or disrupt other users&apos;
                sessions.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-base font-medium text-white">2. Sessions</h2>
              <p>
                {APP_NAME} facilitates peer-to-peer sessions. We are not responsible
                for the conduct of participants during sessions. Be respectful, show
                up on time, and contribute positively.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-base font-medium text-white">3. Ratings</h2>
              <p>
                Ratings reflect individual experiences. Abusing the rating system
                may result in account restrictions.
              </p>
            </div>

            <div>
              <h2 className="mb-3 text-base font-medium text-white">4. Changes</h2>
              <p>
                We may update these terms at any time. Continued use after changes
                constitutes acceptance.
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
