import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#08090d]">
      <SignUp
        appearance={{
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
            footer: 'display: none !important',
            footerAction: 'display: none !important',
            card: 'bg-[rgba(8,9,13,0.94)] border border-[rgba(203,108,230,0.12)] shadow-[0_20px_60px_rgba(0,0,0,0.6)]',
            headerTitle: 'text-white text-base font-semibold tracking-tight',
            headerSubtitle: 'text-zinc-600 text-[13px] font-normal',
            formFieldLabel: 'text-zinc-500 text-xs font-medium',
            formFieldInput:
              'bg-[rgba(203,108,230,0.04)] border border-[rgba(203,108,230,0.12)] text-zinc-100 text-sm hover:border-[rgba(203,108,230,0.2)] focus:border-[#CB6CE6]',
            formButtonPrimary:
              'bg-[#CB6CE6] hover:bg-[#9C4FC2] text-white text-sm font-semibold normal-case shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_8px_rgba(203,108,230,0.3)]',
            socialButtonsBlockButton:
              'border border-[rgba(203,108,230,0.12)] bg-[rgba(203,108,230,0.06)] text-zinc-300 hover:bg-[rgba(203,108,230,0.14)] hover:border-[rgba(203,108,230,0.2)] text-sm normal-case',
            socialButtonsBlockButtonText: 'text-zinc-300 text-sm',
            dividerLine: 'bg-[rgba(203,108,230,0.1)]',
            dividerText: 'text-zinc-700 text-xs',
            identityPreviewEditButton: 'text-[#CB6CE6]',
            formFieldAction: 'text-[#CB6CE6] hover:text-[#D992F7]',
            footerActionLink: 'text-[#CB6CE6]',
            navbar: 'display: none !important',
            navbarDividerLine: 'display: none',
            identityPreview: 'bg-[rgba(203,108,230,0.04)] border border-[rgba(203,108,230,0.1)]',
          },
          options: {
            unsafe_disableDevelopmentModeWarnings: true,
          },
        }}
      />
    </div>
  );
}
