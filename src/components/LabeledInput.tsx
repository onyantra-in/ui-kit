import type { ComponentProps } from "react";
import { Input } from "@/components/base/input";
import { Label } from "@/components/base/label";

export interface LabeledInputProps extends ComponentProps<"input"> {
  label?: string;
  error?: string;
  hint?: string;
}

export function LabeledInput({ label, error, hint, id, className, ...props }: LabeledInputProps) {
  return (
    <div className="grid w-full items-center gap-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Input
        id={id}
        aria-invalid={!!error}
        className={className}
        {...props}
      />
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
      {!error && hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
