import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from '@clerk/ui/themes';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Peerly — Find your focus partner",
  description:
    "A calendar-based peer matching platform for focused work sessions. Block time, find peers, and ship together.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ClerkProvider
          appearance={{
            theme: shadcn,
            variables: {
              colorPrimary: '#CB6CE6',
              colorPrimaryForeground: '#ffffff',
              colorBackground: '#08090d',
              colorForeground: '#f9fafb',
              colorInput: 'rgba(203,108,230,0.1)',
              colorInputForeground: '#f9fafb',
              colorMuted: 'rgba(203,108,230,0.04)',
              colorMutedForeground: 'rgba(249,250,251,0.5)',
              colorRing: '#CB6CE6',
              fontFamily: 'var(--font-geist-sans)',
            },
            elements: {
              socialButtonsIconButton: 'border: solid 1px rgba(203,108,230,0.12); border-radius: 0; background: rgba(203,108,230,0.06); transition: background 0.2s;',
              socialButtonsIconButtonHover: 'border-color: rgba(203,108,230,0.3); background: rgba(203,108,230,0.12);',
              formButtonPrimary:
                'background: #CB6CE6; border: 1px solid #CB6CE6; border-radius: 0; box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 3px rgba(203,108,230,0.3); transition: background 0.2s, transform 0.1s; font-family: var(--font-geist-sans);',
              formButtonPrimaryHover:
                'background: #9C4FC2; border-color: #9C4FC2;',
              formButtonPrimaryActive: 'transform: scale(0.97);',
              formButtonSecondary:
                'background: rgba(203,108,230,0.08); border: 1px solid rgba(203,108,230,0.15); border-radius: 0; color: #f9fafb; box-shadow: inset 0 1px 0 rgba(255,255,255,0.06); font-family: var(--font-geist-sans);',
              formButtonSecondaryHover: 'background: rgba(203,108,230,0.14);',
              input: 'border: 1px solid rgba(203,108,230,0.15); border-radius: 0; background: rgba(203,108,230,0.04); color: #f9fafb; transition: border-color 0.2s;',
              inputFocus: 'border-color: #CB6CE6; box-shadow: 0 0 0 2px rgba(203,108,230,0.2), inset 0 1px 0 rgba(255,255,255,0.06);',
              inputLabel: 'color: rgba(249,250,251,0.7);',
              inputPlaceholder: 'color: rgba(249,250,251,0.35);',
              footer: 'display: none !important;',
              footerActionLink: 'display: none !important;',
              formFieldAction: 'color: #CB6CE6; font-family: var(--font-geist-sans);',
              formFieldActionHover: 'color: #D992F7;',
            },
            options: {
              unsafe_disableDevelopmentModeWarnings: true,
            },
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
