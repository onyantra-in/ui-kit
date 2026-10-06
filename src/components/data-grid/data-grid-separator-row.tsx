"use client";

import type { Row } from "@tanstack/react-table";
import type { VirtualItem } from "@tanstack/react-virtual";
import * as React from "react";
import { getRowHeightValue } from "../../lib/data-grid";
import { cn } from "../../lib/utils";
import type { RowHeightValue } from "../../types/data-grid";

interface DataGridSeparatorRowProps<TData> {
  row: Row<TData>;
  virtualItem: VirtualItem;
  measureElement: (node: Element | null) => void;
  rowMapRef: React.RefObject<Map<number, HTMLDivElement>>;
  rowHeight: RowHeightValue;
  adjustLayout: boolean;
  title?: React.ReactNode;
  content?: React.ReactNode;
  className?: string;
}

export function DataGridSeparatorRow<TData>({
  row,
  virtualItem,
  measureElement,
  rowMapRef,
  rowHeight,
  adjustLayout,
  title,
  content,
  className,
}: DataGridSeparatorRowProps<TData>) {
  const index = virtualItem.index;

  const ref = React.useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        measureElement(node);
        rowMapRef.current?.set(index, node);
      } else {
        rowMapRef.current?.delete(index);
      }
    },
    [index, measureElement, rowMapRef],
  );

  const hasBody = content != null || title != null;

  return (
    <div
      role="row"
      aria-rowindex={index + 2}
      data-index={index}
      data-slot="grid-separator"
      data-row-id={row.id}
      tabIndex={-1}
      ref={ref}
      className={cn(
        "absolute flex w-full items-center border-b bg-muted/60",
        !adjustLayout && "will-change-transform",
        !hasBody && "border-b-2",
        className,
      )}
      style={{
        height: hasBody ? `${getRowHeightValue(rowHeight)}px` : "6px",
        ...(adjustLayout
          ? { top: `${virtualItem.start}px` }
          : { transform: `translateY(${virtualItem.start}px)` }),
      }}
    >
      {hasBody && (
        <div
          role="gridcell"
          className="sticky start-0 flex items-center gap-2 px-3 text-sm font-medium text-muted-foreground"
        >
          {content ?? title}
        </div>
      )}
    </div>
  );
}
