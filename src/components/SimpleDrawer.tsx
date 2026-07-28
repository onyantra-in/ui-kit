import { type ReactNode } from "react";
import { Button } from "@onyantra-in/ui-kit/base";
import { cn } from "../lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@onyantra-in/ui-kit/base";

export interface SimpleDrawerProps {
  /** Optional — omit when the drawer's open state is fully controlled externally. */
  trigger?: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  maxHeight?: string;
  repositionInputs?: boolean;
  /** Extra classes for the drawer content panel, e.g. to override the default max-w-sm. */
  contentClassName?: string;
  /** Extra classes for the footer, e.g. to change layout/alignment of footer actions. */
  footerClassName?: string;
  /** Shows a × close button in the header. Defaults to true. */
  showCloseButton?: boolean;
}

export function SimpleDrawer({
  trigger,
  title,
  description,
  children,
  footer,
  open,
  onOpenChange,
  maxHeight = "",
  repositionInputs,
  contentClassName,
  footerClassName,
  showCloseButton = true,
}: SimpleDrawerProps) {
  return (
    // disablePreventScroll={false} despite the name: vaul's iOS scroll-lock
    // guard is active whenever disablePreventScroll is true (the default),
    // and it calls window.scrollTo(0, 0) on open — jumping the page to top
    // the instant the drawer opens on iOS. false turns that guard off.
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      repositionInputs={repositionInputs}
      disablePreventScroll={false}
    >
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent>
        <div
          className={cn("mx-auto w-full max-w-4xl flex flex-col flex-1 min-h-0", contentClassName)}
          style={{ maxHeight }}
        >
          <DrawerHeader className="flex-row items-center justify-between">
            <div>
              <DrawerTitle>{title}</DrawerTitle>
              {description && <DrawerDescription>{description}</DrawerDescription>}
            </div>
            {showCloseButton && (
              <DrawerClose className="shrink-0 w-8 h-8 text-xl font-bold text-gray-500 hover:text-gray-700">
                ×
              </DrawerClose>
            )}
          </DrawerHeader>
          {children && (
            <div className="flex-1 overflow-y-auto p-4">
              {children}
            </div>
          )}
          <DrawerFooter className={cn("sticky bottom-0 bg-popover", footerClassName)}>
            {footer ?? (
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
