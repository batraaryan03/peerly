export const hero = {
  section:
    "relative min-h-[100dvh] flex items-center justify-start overflow-hidden",

  carouselRef: "absolute inset-0 will-change-transform",

  glass:
    "absolute inset-0 z-[3] bg-gradient-to-b from-[#08090d]/50 via-[#08090d]/20 to-[#08090d]/50",
  glassBorder:
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_-1px_0_rgba(255,255,255,0.03)]",

  glow:
    "pointer-events-none absolute w-[500px] h-[500px] rounded-full bg-[#CB6CE6]/15 blur-[100px] transition-opacity duration-700 -translate-x-1/2 -translate-y-1/2 opacity-0 z-[4] will-change-transform",

  content:
    "relative z-10 mx-auto w-full max-w-[1400px] px-6 md:px-12 pt-32 pb-20 md:pt-40 md:pb-28",

  glassCard:
    "relative max-w-2xl rounded-2xl border border-white/[0.06] bg-[#08090d]/40 backdrop-blur-xl p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]",

  badge:
    "inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.04] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white/50",

  title:
    "mt-6 text-4xl font-medium leading-[0.95] tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl",
  accent: 'text-[#D992F7]',

  description:
    "mt-5 max-w-[44ch] text-sm leading-relaxed text-white/50 sm:text-base",

  actions: "mt-8 flex flex-wrap items-center gap-3",

  primaryAction:
    "relative inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white bg-[#CB6CE6] shadow-[0_2px_12px_rgba(203,108,230,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] transition-all active:scale-[0.97]",

  secondaryAction:
    "relative inline-flex items-center gap-2 px-7 py-3.5 text-sm font-medium text-white/70 border border-white/10 transition-all hover:border-white/25 hover:text-white active:scale-[0.97]",

  bottomLine:
    "absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-10",

  shape:
    "pointer-events-none absolute rounded-full border border-white/[0.06] bg-gradient-to-r to-transparent shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_50%,rgba(203,108,230,0.15),transparent_70%)]",

  decorativeText:
    "pointer-events-none select-none absolute right-0 top-1/2 -translate-y-1/2 text-[clamp(8rem,20vw,20rem)] font-bold leading-none tracking-tighter text-white/[0.015] z-[1]",
};
