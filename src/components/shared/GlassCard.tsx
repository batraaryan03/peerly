"use client"

import { forwardRef } from "react"
import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassCardProps extends HTMLMotionProps<"div"> {
  intensity?: "subtle" | "default" | "strong"
  interactive?: boolean
}

const intensityStyles: Record<string, string> = {
  subtle:
    "bg-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
  default:
    "bg-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
  strong:
    "bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]",
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, intensity = "default", interactive = false, children, ...props }, ref) => {
    if (interactive) {
      return (
        <motion.div
          ref={ref}
          whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.05)" }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={cn(
            "rounded-xl backdrop-blur-xl transition-shadow",
            intensityStyles[intensity],
            className,
          )}
          {...props}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-xl backdrop-blur-xl",
          intensityStyles[intensity],
          className,
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  },
)
GlassCard.displayName = "GlassCard"

export { GlassCard, intensityStyles }
