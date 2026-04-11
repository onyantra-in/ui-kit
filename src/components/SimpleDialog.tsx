import type { ReactNode, RefObject } from "react";
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
  /** Called when the dialog is about to close. Return false to prevent closing. */
  onClose?: () => boolean | void;
  /** Element to restore focus to when the dialog closes. */
  restoreFocusRef?: RefObject<HTMLElement | null>;
  showCloseButton?: boolean;
  contentClassName?: string;
}

export function SimpleDialog({
  trigger,
  title,
  description,
  children,
  footer,
  open,
  onOpenChange,
  onClose,
  restoreFocusRef,
  showCloseButton = true,
  contentClassName,
}: SimpleDialogProps) {
  const handleClose = (e: Event) => {
    if (onClose?.() === false) e.preventDefault();
  };

  const handleCloseAutoFocus = (e: Event) => {
    if (restoreFocusRef?.current) {
      e.preventDefault();
      const el = restoreFocusRef.current;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.focus();
        });
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        showCloseButton={showCloseButton}
        className={contentClassName}
        onEscapeKeyDown={handleClose}
        onInteractOutside={handleClose}
        onCloseAutoFocus={handleCloseAutoFocus}
      >
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
