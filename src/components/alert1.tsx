import type { ReactNode } from "react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/base/alert";

export interface SimpleAlertProps {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function SimpleAlert({
  title,
  description,
  variant = "default",
  icon,
  action,
  className,
}: SimpleAlertProps) {
  return (
    <Alert variant={variant} className={className}>
      {icon}
      <AlertTitle>{title}</AlertTitle>
      {description && <AlertDescription>{description}</AlertDescription>}
      {action && <AlertAction>{action}</AlertAction>}
    </Alert>
  );
}
