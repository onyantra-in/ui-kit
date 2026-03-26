import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./base/tabs";

export interface TabItem {
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface SimpleTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: "default" | "line";
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function SimpleTabs({
  tabs,
  defaultValue,
  value,
  onValueChange,
  variant = "default",
  orientation = "horizontal",
  className,
}: SimpleTabsProps) {
  return (
    <Tabs
      defaultValue={defaultValue ?? tabs[0]?.value}
      value={value}
      onValueChange={onValueChange}
      orientation={orientation}
      className={className}
    >
      <TabsList variant={variant}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} disabled={tab.disabled}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
