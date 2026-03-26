import type { ReactNode } from "react";
import { Badge } from "./base/badge";
import type { badgeVariants } from "./base/badge";
import type { VariantProps } from "class-variance-authority";

export interface SimpleBadgeProps
  extends VariantProps<typeof badgeVariants> {
  children: ReactNode;
  className?: string;
}

export function SimpleBadge({ children, variant, className }: SimpleBadgeProps) {
  return (
    <Badge variant={variant} className={className}>
      {children}
    </Badge>
  );
}
