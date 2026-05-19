import { type ReactNode, useEffect, useRef } from "react";
import { Button } from "@onyantra-in/ui-kit/base";
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
  trigger: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  maxHeight?: string;
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
}: SimpleDrawerProps) {
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const contentElement = contentRef.current;
    if (!contentElement) return;

    contentElement.scrollTop = 0;
  }, [open]);

  return (
    // repositionInputs: vaul scrolls the focused input into view using the
    // Visual Viewport API, which works even on iOS where dvh doesn't shrink.
    <Drawer open={open} onOpenChange={onOpenChange} repositionInputs={true}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        {/* dvh shrinks with the keyboard on Android + iOS 16+. On older iOS,
            vaul's repositionInputs ensures the focused field stays visible. */}
        <div className="mx-auto w-full max-w-sm flex flex-col flex-1 min-h-0 " style={{ maxHeight }}>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
          {children && (
            <div ref={contentRef} className="flex-1 overflow-y-auto p-4">
              {children}
            </div>
          )}
          <DrawerFooter className="sticky bottom-0 bg-popover">
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
