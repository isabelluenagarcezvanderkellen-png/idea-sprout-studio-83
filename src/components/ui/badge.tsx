import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[0.66rem] font-bold uppercase tracking-wider transition-colors [&_svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        high: "border-sev-high/50 bg-sev-high/15 text-sev-high",
        medium: "border-sev-medium/50 bg-sev-medium/15 text-sev-medium",
        low: "border-sev-low/50 bg-sev-low/15 text-sev-low",
        ai: "border-teal/50 bg-teal/10 text-teal",
        pending: "border-signal/40 bg-transparent text-signal",
        progress: "border-primary/50 bg-primary/10 text-primary",
        resolved: "border-teal/50 bg-teal/15 text-teal",
        flag: "border-transparent bg-sev-high text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
