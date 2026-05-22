import Link from 'next/link';
import { cta } from './CTASection.styles';

export function CTASection() {
  return (
    <section className={cta.section}>
      <div className={cta.container}>
        <div className={cta.wrapper}>
          <h2 className={cta.heading}>Ready to focus?</h2>
          <p className={cta.description}>
            Free. No profile required. Your calendar is all you need.
          </p>
          <Link href="/sign-up" className={cta.action}>
            Create your account
          </Link>
        </div>
      </div>
    </section>
  );
}
