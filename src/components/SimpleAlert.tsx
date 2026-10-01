import type { ReactNode } from "react";
import { CircleAlertIcon, InfoIcon, TriangleAlertIcon } from "lucide-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "./base/alert";

export type SimpleAlertType = "info" | "error" | "warning";

export interface SimpleAlertProps {
  title?: string;
  description?: string;
  type?: SimpleAlertType;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

const TYPE_CONFIG = {
  info: { variant: "info", Icon: InfoIcon },
  error: { variant: "destructive", Icon: CircleAlertIcon },
  warning: { variant: "warning", Icon: TriangleAlertIcon },
} as const;

export function SimpleAlert({
  title,
  description,
  type = "info",
  icon,
  action,
  className,
}: SimpleAlertProps) {
  const { variant, Icon } = TYPE_CONFIG[type];
  return (
    <Alert variant={variant} className={className}>
      {icon ?? <Icon />}
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
      {action && <AlertAction>{action}</AlertAction>}
    </Alert>
  );
}
