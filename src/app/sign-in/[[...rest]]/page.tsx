import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <SignIn
        appearance={{
          options: {
            unsafe_disableDevelopmentModeWarnings: true,
          },
          elements: {
            footer: 'hidden',
            footerAction: 'hidden',
            card: 'bg-zinc-900 rounded-none shadow-none',
            headerTitle: 'text-white text-lg font-medium',
            headerSubtitle: 'text-zinc-500',
            formFieldLabel: 'text-zinc-400 text-sm',
            formFieldInput:
              'bg-zinc-800 border-0 rounded-none text-white text-sm',
            formButtonPrimary:
              'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-none text-sm font-medium normal-case',
            socialButtonsBlockButton:
              'border border-zinc-700 rounded-none text-zinc-300 hover:bg-zinc-800 text-sm',
            socialButtonsBlockButtonText: 'text-zinc-300',
            dividerLine: 'bg-zinc-800',
            dividerText: 'text-zinc-600 text-xs',
            identityPreviewEditButton: 'text-[#8B5CF6]',
            formFieldAction: 'text-[#8B5CF6]',
            footerActionLink: 'text-[#8B5CF6]',
          },
        }}
      />
    </div>
  );
}
