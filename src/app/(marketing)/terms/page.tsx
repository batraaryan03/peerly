import { APP_NAME } from '@/lib/constants';

export default function TermsPage() {
  return (
    <div className="py-24">
      <div className="mx-auto max-w-2xl px-6">
        <h1 className="text-4xl font-medium tracking-tight">Terms of Service</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            These terms govern your use of {APP_NAME}. By using {APP_NAME}, you
            agree to these terms.
          </p>
          <h2 className="text-base font-medium text-foreground">
            1. Your Account
          </h2>
          <p>
            You are responsible for your conduct while using {APP_NAME}. You
            agree not to misuse the platform or disrupt other users&apos;
            sessions.
          </p>
          <h2 className="text-base font-medium text-foreground">
            2. Sessions
          </h2>
          <p>
            {APP_NAME} facilitates peer-to-peer sessions. We are not responsible
            for the conduct of participants during sessions. Be respectful, show
            up on time, and contribute positively.
          </p>
          <h2 className="text-base font-medium text-foreground">3. Ratings</h2>
          <p>
            Ratings reflect individual experiences. Abusing the rating system
            may result in account restrictions.
          </p>
          <h2 className="text-base font-medium text-foreground">4. Changes</h2>
          <p>
            We may update these terms at any time. Continued use after changes
            constitutes acceptance.
          </p>
          <p className="pt-4 text-xs">
            Last updated: May 2026
          </p>
        </div>
      </div>
    </div>
  );
}
