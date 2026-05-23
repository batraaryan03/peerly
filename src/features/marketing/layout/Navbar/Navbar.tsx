'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { navbar } from './Navbar.styles';

gsap.registerPlugin(ScrollTrigger);

export function Navbar() {
  const { isSignedIn } = useUser();
  const notchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const notch = notchRef.current;
    if (!notch) return;

    const ctx = gsap.context(() => {
      gsap.to(notch, {
        backgroundColor: 'rgba(8, 9, 13, 0.6)',
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top -80px',
          end: 'top -200px',
          scrub: 0.5,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <header className={navbar.header}>
      <div ref={notchRef} className={`${navbar.notch} ${navbar.notchGlass}`}>
        <nav className={navbar.nav}>
          <Link href="/" className={navbar.logo}>
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
