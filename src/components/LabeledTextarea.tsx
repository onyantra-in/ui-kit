import type { ComponentProps } from "react";
import { Label } from "@/components/base/label";
import { Textarea } from "@/components/base/textarea";

export interface LabeledTextareaProps extends ComponentProps<"textarea"> {
  label?: string;
  error?: string;
  hint?: string;
}

export function LabeledTextarea({ label, error, hint, id, ...props }: LabeledTextareaProps) {
  return (
    <div className="grid w-full gap-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Textarea id={id} aria-invalid={!!error} {...props} />
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
      {!error && hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
