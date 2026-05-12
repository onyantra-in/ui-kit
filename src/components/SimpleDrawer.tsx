import type { ReactNode } from "react";
import { Button } from "./base/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./base/drawer";

export interface SimpleDrawerProps {
  trigger: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
  /** Custom footer content. Defaults to a Close button. */
  footer?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SimpleDrawer({
  trigger,
  title,
  description,
  children,
  footer,
  open,
  onOpenChange,
}: SimpleDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm flex flex-col h-[min(80vh,600px)]">
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
