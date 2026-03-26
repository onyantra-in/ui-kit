import type { ReactNode } from "react";
import { Badge } from "@/components/base/badge";
import type { badgeVariants } from "@/components/base/badge";
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
