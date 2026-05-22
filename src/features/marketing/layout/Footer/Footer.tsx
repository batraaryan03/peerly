import Link from 'next/link';
import { footer } from './Footer.styles';

export function Footer() {
  return (
    <footer className={footer.wrapper}>
      <div className={footer.container}>
        <div className={footer.top}>
          <h2 className={footer.tagline}>
            Intelligently
            <br />
            <span className={footer.taglineAccent}>finding your</span>
            <br />
            focus partner.
          </h2>
        </div>
        <div className={footer.bottom}>
          <div className={footer.links}>
            <Link href="/about" className={footer.link}>About</Link>
            <Link href="/pricing" className={footer.link}>Pricing</Link>
            <Link href="/contact" className={footer.link}>Contact</Link>
            <Link href="/terms" className={footer.link}>Terms</Link>
            <Link href="/privacy" className={footer.link}>Privacy</Link>
            <Link href="/" className={footer.link}>Blog</Link>
            <Link href="/" className={footer.link}>Careers</Link>
            <Link href="/" className={footer.link}>Support</Link>
          </div>
          <div className="flex items-end justify-between gap-6 md:flex-col md:items-end">
            <div className={footer.social}>
              <Link href="/" className={footer.socialLink}>Twitter</Link>
              <Link href="/" className={footer.socialLink}>GitHub</Link>
              <Link href="/" className={footer.socialLink}>Discord</Link>
              <Link href="/" className={footer.socialLink}>LinkedIn</Link>
            </div>
            <p className={footer.copyright}>
              &copy; {new Date().getFullYear()} Peerly.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
