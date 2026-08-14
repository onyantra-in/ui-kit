"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import * as React from "react";
import { Button } from "../base/button";
import { Checkbox } from "../base/checkbox";
import { Input } from "../base/input";
import { DataGrid } from "../data-grid/data-grid";
import { useDebouncedCallback } from "../../hooks/use-debounced-callback";
import { useDataGrid, type UseDataGridProps } from "../../hooks/use-data-grid";
import { fuzzyFilter, getRowHeightValue } from "../../lib/data-grid";
import { cn } from "../../lib/utils";

// Mirrors DataGrid's own row-selection look (`ring-inset ring-1
// ring-primary/60 bg-primary/5`, see data-grid-row.tsx). The bg-* class is
// kept for consistency, but each cell also paints its own opaque background
// (see getColumnPinningStyle) that covers a plain row-level background —
// so the same tint is additionally applied as an inline style per cell.
const HIGHLIGHT_CLASSES = ["ring-inset", "ring-1", "ring-primary/60", "bg-primary/5"];
const HIGHLIGHT_CELL_BG = "color-mix(in oklab, var(--primary) 5%, var(--background))";

interface ComboGridProps<TData> extends UseDataGridProps<TData> {
  className?: string;
  loading?: boolean;
  maxHeight?: string | null;
  stretchColumns?: boolean;
  searchPlaceholder?: string;
}

/**
 * DataGrid wrapped with a combobox-style search bar: arrow keys move a
 * highlighted row cursor (without moving real cell focus) and Enter toggles
 * that row's checkbox selection. Built entirely on DataGrid's public
 * useDataGrid/DataGrid surface (fuzzy global filter, rowMapRef for the
 * highlight, tableMeta.onRowSelect for the toggle) — DataGrid itself is
 * untouched.
 */
export function ComboGrid<TData>({
  columns,
  enableRowSelection,
  enableRowClickSelection,
  globalFilterFn,
  loading,
  maxHeight,
  stretchColumns,
  className,
  searchPlaceholder = "Search...",
  ...rest
}: ComboGridProps<TData>) {
  const selectColumn = React.useMemo<ColumnDef<TData>>(
    () => ({
      id: "select",
      header: ({ table }) => (
        <div className="flex size-full items-center justify-center px-3">
          <Checkbox
            aria-label="Select all rows"
            checked={
              table.getIsAllRowsSelected()
                ? true
                : table.getIsSomeRowsSelected()
                  ? "indeterminate"
                  : false
            }
            onCheckedChange={(checked) =>
              table.toggleAllRowsSelected(checked === true)
            }
          />
        </div>
      ),
      cell: ({ row, table }) => (
        <div className="flex size-full items-center justify-center">
          <Checkbox
            aria-label={`Select row ${row.index + 1}`}
            checked={row.getIsSelected()}
            onCheckedChange={(checked) =>
              table.options.meta?.onRowSelect?.(
                row.id,
                checked === true,
                false,
              )
            }
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ),
      size: 40,
      enableResizing: false,
    }),
    [],
  );

  const gridColumns = React.useMemo(
    () => [selectColumn, ...columns],
    [selectColumn, columns],
  );

  const dataGridProps = useDataGrid({
    ...rest,
    columns: gridColumns,
    enableRowSelection: enableRowSelection ?? true,
    // Checkbox-driven multi-select, not click-to-select — leave normal cell
    // click/focus/edit intact (enableRowClickSelection swaps in single-select
    // row-click semantics and disables per-cell click handling otherwise).
    enableRowClickSelection: enableRowClickSelection ?? false,
    globalFilterFn: globalFilterFn ?? fuzzyFilter,
  });

  const { table, dataGridRef, rowMapRef, tableMeta, rowHeight, dir } =
    dataGridProps;

  const [query, setQuery] = React.useState("");
  const [highlightIndex, setHighlightIndex] = React.useState<number | null>(
    null,
  );
  const highlightedRowRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const scrollHighlightIntoView = React.useCallback(
    (index: number) => {
      const rowEl = rowMapRef.current.get(index);
      if (rowEl) {
        rowEl.scrollIntoView({ block: "nearest" });
        return;
      }
      const container = dataGridRef.current;
      if (container) {
        container.scrollTop = index * getRowHeightValue(rowHeight);
      }
    },
    [rowMapRef, dataGridRef, rowHeight],
  );

  // Reflect highlightIndex onto the actual row DOM node via rowMapRef — a
  // combobox-style "active option" cursor that never moves real DOM focus.
  // Runs every render (no deps) so a re-mounted (virtualized) row picks the
  // class back up.
  React.useEffect(() => {
    const targetEl =
      highlightIndex === null ? null : (rowMapRef.current.get(highlightIndex) ?? null);

    if (targetEl === highlightedRowRef.current) return;

    if (highlightedRowRef.current) {
      highlightedRowRef.current.classList.remove(...HIGHLIGHT_CLASSES);
      for (const cell of highlightedRowRef.current.querySelectorAll<HTMLElement>(
        '[data-slot="grid-cell"]',
      )) {
        cell.style.background = "";
      }
    }

    if (targetEl) {
      targetEl.classList.add(...HIGHLIGHT_CLASSES);
      for (const cell of targetEl.querySelectorAll<HTMLElement>(
        '[data-slot="grid-cell"]',
      )) {
        cell.style.background = HIGHLIGHT_CELL_BG;
      }
    }

    highlightedRowRef.current = targetEl;
  });

  const debouncedSetGlobalFilter = useDebouncedCallback((value: string) => {
    table.setGlobalFilter(value);
    setHighlightIndex(null);
  }, 150);

  function onQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setQuery(value);
    debouncedSetGlobalFilter(value);
  }

  function onClear() {
    setQuery("");
    table.setGlobalFilter("");
    setHighlightIndex(null);
    inputRef.current?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const rows = table.getRowModel().rows;
      if (rows.length === 0) return;

      const delta = event.key === "ArrowDown" ? 1 : -1;
      const next =
        highlightIndex === null
          ? delta > 0
            ? 0
            : rows.length - 1
          : Math.min(rows.length - 1, Math.max(0, highlightIndex + delta));

      setHighlightIndex(next);
      scrollHighlightIntoView(next);
      return;
    }

    if (event.key === "Enter") {
      if (highlightIndex === null) return;
      event.preventDefault();
      const row = table.getRowModel().rows[highlightIndex];
      if (row) tableMeta.onRowSelect?.(row.id, !row.getIsSelected(), false);
      return;
    }

    if (event.key === "Escape" && highlightIndex !== null) {
      event.preventDefault();
      setHighlightIndex(null);
    }
  }

  return (
    <div dir={dir} className={cn("flex flex-col gap-2", className)}>
      <div
        role="search"
        className="flex items-center gap-2 rounded-md border bg-background px-3 py-1.5"
      >
        <Search className="size-3.5 shrink-0 text-muted-foreground" />
        <Input
          ref={inputRef}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          placeholder={searchPlaceholder}
          className="h-7 flex-1 border-none bg-transparent px-0 shadow-none focus-visible:ring-0"
          value={query}
          onChange={onQueryChange}
          onKeyDown={onKeyDown}
        />
        {query.length > 0 && (
          <Button
            aria-label="Clear search"
            variant="ghost"
            size="icon"
            className="size-6 shrink-0"
            onClick={onClear}
          >
            <X />
          </Button>
        )}
      </div>
      <DataGrid
        {...dataGridProps}
        loading={loading}
        maxHeight={maxHeight}
        stretchColumns={stretchColumns}
      />
    </div>
  );
}
