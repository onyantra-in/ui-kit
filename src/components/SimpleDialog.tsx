import type { ReactNode } from "react";
import { Button } from "./base/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./base/dialog";

export interface SimpleDialogProps {
  trigger: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
  /** Custom footer content. Defaults to a Close button. */
  footer?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showCloseButton?: boolean;
}

export function SimpleDialog({
  trigger,
  title,
  description,
  children,
  footer,
  open,
  onOpenChange,
  showCloseButton = true,
}: SimpleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent showCloseButton={showCloseButton}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
        <DialogFooter>
          {footer ?? (
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
