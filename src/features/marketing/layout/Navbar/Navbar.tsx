'use client';

import Link from 'next/link';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { navbar } from './Navbar.styles';
import { PeerlyLogo } from './PeerlyLogo';

export function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <header className={navbar.header}>
      <div className={`${navbar.notch} ${navbar.notchGlass}`}>
        <nav className={navbar.nav}>
          <Link href="/" className={navbar.logo}>
            <PeerlyLogo className={navbar.logoIcon} />
            Peerly
          </Link>
          <div className={navbar.links}>
            <Link href="/pricing" className={navbar.link}>
              Pricing
            </Link>
            <Link href="/about" className={navbar.link}>
              About
            </Link>
          </div>
          <div className="flex items-center gap-1">
            {isSignedIn ? (
              <div className="flex items-center gap-1">
                <Link href="/calendar" className={navbar.dashboard}>
                  Dashboard
                </Link>
                <UserButton />
              </div>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className={navbar.signIn}>Sign in</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className={navbar.signUp}>
                    Sign up
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
