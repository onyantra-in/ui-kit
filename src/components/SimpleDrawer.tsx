import { type ReactNode } from "react";
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
  repositionInputs?: boolean;
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
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm flex flex-col flex-1 min-h-0 " style={{ maxHeight }}>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            {description && <DrawerDescription>{description}</DrawerDescription>}
          </DrawerHeader>
          {children && (
            <div className="flex-1 overflow-y-auto p-4">
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
