export const hero = {
  section: "relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-zinc-950",
  overlay: "absolute inset-0 bg-zinc-950/70 backdrop-blur-[2px]",
  content: "relative z-10 mx-auto max-w-4xl px-6 text-center",
  title:
    "text-5xl font-medium leading-tight tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl",
  accent: "text-[#8B5CF6]",
  description:
    "mt-5 mx-auto max-w-[45ch] text-base text-zinc-500 sm:text-lg leading-relaxed",
  actions: "mt-10 flex items-center justify-center gap-4",
  primaryAction:
    "bg-[#8B5CF6] px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-[#7C3AED] active:scale-[0.98] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]",
  secondaryAction:
    "bg-white/[0.04] px-7 py-3.5 text-sm font-medium text-zinc-400 transition-all hover:text-zinc-200 hover:bg-white/[0.08] active:scale-[0.98] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
  bottomLine: "absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/20 to-transparent",
};
