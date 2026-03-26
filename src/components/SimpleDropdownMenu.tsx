import type { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./base/dropdown-menu";

export type MenuItemDef =
  | { type: "item"; label: ReactNode; icon?: ReactNode; shortcut?: string; variant?: "default" | "destructive"; onClick?: () => void; disabled?: boolean }
  | { type: "separator" }
  | { type: "label"; label: ReactNode }
  | { type: "sub"; label: ReactNode; icon?: ReactNode; items: MenuItemDef[] };

export interface MenuGroup {
  label?: string;
  items: MenuItemDef[];
}

export interface SimpleDropdownMenuProps {
  trigger: ReactNode;
  groups: MenuGroup[];
  align?: "start" | "center" | "end";
  className?: string;
}

function renderItem(item: MenuItemDef, index: number): ReactNode {
  if (item.type === "separator") return <DropdownMenuSeparator key={index} />;
  if (item.type === "label") return <DropdownMenuLabel key={index}>{item.label}</DropdownMenuLabel>;
  if (item.type === "sub") {
    return (
      <DropdownMenuSub key={index}>
        <DropdownMenuSubTrigger>
          {item.icon}
          {item.label}
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            {item.items.map((sub, i) => renderItem(sub, i))}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    );
  }
  return (
    <DropdownMenuItem
      key={index}
      variant={item.variant}
      disabled={item.disabled}
      onClick={item.onClick}
    >
      {item.icon}
      {item.label}
      {item.shortcut && <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>}
    </DropdownMenuItem>
  );
}

export function SimpleDropdownMenu({
  trigger,
  groups,
  align = "start",
  className,
}: SimpleDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={className}>
        {groups.map((group, gi) => (
          <DropdownMenuGroup key={gi}>
            {group.label && <DropdownMenuLabel>{group.label}</DropdownMenuLabel>}
            {group.items.map((item, i) => renderItem(item, i))}
          </DropdownMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
