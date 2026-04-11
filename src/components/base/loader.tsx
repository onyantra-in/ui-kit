import { LoaderIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoaderProps {
  /** Loading state. Defaults to Boolean(text) if not provided. */
  loading?: boolean;
  /** Optional text shown below the spinner */
  text?: string;
  className?: string;
  children?: React.ReactNode;
}

export function Loader({ loading, text, className, children }: LoaderProps) {
  const isLoading = loading !== undefined ? loading : Boolean(text);

  if (!isLoading) return <>{children}</>;

  return (
    <div className={cn("relative", className)}>
      {children}
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-2 rounded-[inherit] bg-background/60 backdrop-blur-[1px]">
        <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
    </div>
  );
}
