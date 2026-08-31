import { type ReactNode, useEffect, useRef } from "react";
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
  const contentRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  // On mobile, vaul keeps the bottom sheet anchored near the bottom of the
  // screen even as the keyboard opens, so the keyboard can end up covering
  // the sheet entirely. When that happens, pin the sheet to the top of the
  // *visible* viewport (above the keyboard) instead, so there's still room
  // to see and use the fields. Reset once the keyboard closes.
  //
  // Setting disablePreventScroll={false} below also turns off vaul's own
  // focus/scroll-into-view handling (it lives in the same guarded code
  // path), so a half-covered focused field is scrolled fully into view here.
  useEffect(() => {
    const viewport = typeof window !== "undefined" ? window.visualViewport : undefined;
    if (!viewport) return;

    const KEYBOARD_THRESHOLD = 150;
    const SCROLL_BUFFER = 16;

    const isFormField = (el: Element): el is HTMLElement =>
      el instanceof HTMLInputElement ||
      el instanceof HTMLTextAreaElement ||
      (el instanceof HTMLElement && el.isContentEditable);

    const scrollFocusedFieldIntoView = () => {
      const body = bodyRef.current;
      const active = document.activeElement;
      if (!body || !active || !isFormField(active) || !body.contains(active)) return;
      const rect = active.getBoundingClientRect();
      if (rect.bottom > viewport.height - SCROLL_BUFFER) {
        body.scrollTop += rect.bottom - (viewport.height - SCROLL_BUFFER);
      } else if (rect.top < SCROLL_BUFFER) {
        body.scrollTop -= SCROLL_BUFFER - rect.top;
      }
    };

    const applyKeyboardOffset = () => {
      const el = contentRef.current;
      if (!el) return;
      const keyboardOpen = window.innerHeight - viewport.height > KEYBOARD_THRESHOLD;
      if (keyboardOpen) {
        el.style.top = "0px";
        el.style.bottom = "auto";
        el.style.height = `${viewport.height}px`;
        el.style.maxHeight = `${viewport.height}px`;
        requestAnimationFrame(scrollFocusedFieldIntoView);
      } else {
        el.style.top = "";
        el.style.bottom = "";
        el.style.height = "";
        el.style.maxHeight = "";
      }
    };

    // Tabbing/next-field to another input doesn't resize the viewport (the
    // keyboard is already open), so re-check on every focus change too.
    const onFocusIn = () => requestAnimationFrame(scrollFocusedFieldIntoView);

    viewport.addEventListener("resize", applyKeyboardOffset);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      viewport.removeEventListener("resize", applyKeyboardOffset);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, []);

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
      <DrawerContent ref={contentRef}>
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
            <div ref={bodyRef} className="flex-1 overflow-y-auto p-4">
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
