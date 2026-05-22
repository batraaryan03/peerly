export const hero = {
  section: "relative min-h-[100dvh] flex items-center justify-center overflow-hidden",
  image: "absolute inset-0 bg-cover bg-center will-change-transform",
  overlay: "absolute inset-0 bg-[#08090d]/50",
  content: "relative z-10 mx-auto max-w-4xl px-6 text-center",
  title:
    "text-5xl font-medium leading-[0.95] tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]",
  accent: 'text-[#D992F7]',
  description:
    "mt-5 mx-auto max-w-[44ch] text-base text-white/55 sm:text-lg leading-relaxed",
  actions: "mt-10 flex items-center justify-center gap-4",
  primaryAction:
    "px-8 py-3.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_12px_rgba(203,108,230,0.35)] transition-all active:scale-[0.97] bg-[#CB6CE6]",
  secondaryAction:
    "px-8 py-3.5 text-sm font-medium text-white/70 border border-white/10 transition-all hover:border-white/25 hover:text-white active:scale-[0.97]",
  bottomLine: "absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent",
  glow: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#CB6CE6]/10 blur-[120px] pointer-events-none",
};
