import type { ComponentProps } from "react";
import { Switch } from "@/components/base/switch";
import { Label } from "@/components/base/label";

export interface LabeledSwitchProps extends ComponentProps<typeof Switch> {
  label?: string;
  description?: string;
  id?: string;
}

export function LabeledSwitch({ label, description, id, ...props }: LabeledSwitchProps) {
  if (!label) return <Switch id={id} {...props} />;
  return (
    <div className="flex items-center gap-2">
      <Switch id={id} {...props} />
      <div className="grid gap-0.5">
        <Label htmlFor={id}>{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}
