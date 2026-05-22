import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-500 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-emerald-600 active:bg-emerald-700",
        outline:
          "bg-white/[0.04] text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-white/[0.08] aria-expanded:bg-white/[0.08]",
        ghost:
          "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground aria-expanded:bg-white/[0.04] aria-expanded:text-foreground",
        destructive:
          "bg-destructive/20 text-destructive hover:bg-destructive/30",
        link: "text-emerald-500 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 gap-1.5 px-3",
        xs: "h-6 gap-1 px-2 text-xs",
        sm: "h-7 gap-1 px-2.5 text-xs",
        lg: "h-9 gap-1.5 px-4",
        icon: "size-8",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
