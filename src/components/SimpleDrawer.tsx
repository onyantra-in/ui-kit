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
}: SimpleDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} repositionInputs={repositionInputs}>
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
