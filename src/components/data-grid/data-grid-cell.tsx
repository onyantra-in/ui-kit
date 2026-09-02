"use client";

import * as React from "react";

import {
  ActionCell,
  CheckboxCell,
  ComboboxCell,
  DateCell,
  FileCell,
  IntCell,
  LongTextCell,
  MultiSelectCell,
  NumberCell,
  SelectCell,
  ShortTextCell,
  UrlCell,
} from "../data-grid/data-grid-cell-variants";
import type { DataGridCellProps } from "../../types/data-grid";

export const DataGridCell = React.memo(DataGridCellImpl, (prev, next) => {
  // Fast path: check stable primitive props first
  if (prev.isFocused !== next.isFocused) return false;
  if (prev.isEditing !== next.isEditing) return false;
  if (prev.isSelected !== next.isSelected) return false;
  if (prev.isSearchMatch !== next.isSearchMatch) return false;
  if (prev.isActiveSearchMatch !== next.isActiveSearchMatch) return false;
  if (prev.readOnly !== next.readOnly) return false;
  if (prev.rowIndex !== next.rowIndex) return false;
  if (prev.columnId !== next.columnId) return false;
  if (prev.rowHeight !== next.rowHeight) return false;

  // Check cell value using row.original instead of getValue() for stability
  // getValue() is unstable and recreates on every render, breaking memoization.
  // Columns defined via accessorFn (no matching key on row.original — e.g. a
  // derived/lookup display column) must run that function to get a real
  // value; indexing row.original by columnId for them is always undefined on
  // both sides, so the cell would never invalidate until an unrelated prop
  // (like isFocused) happened to change it.
  const prevAccessorFn = (
    prev.cell.column.columnDef as {
      accessorFn?: (row: unknown, index: number) => unknown;
    }
  ).accessorFn;
  const nextAccessorFn = (
    next.cell.column.columnDef as {
      accessorFn?: (row: unknown, index: number) => unknown;
    }
  ).accessorFn;
  const prevValue = prevAccessorFn
    ? prevAccessorFn(prev.cell.row.original, prev.cell.row.index)
    : (prev.cell.row.original as Record<string, unknown>)[prev.columnId];
  const nextValue = nextAccessorFn
    ? nextAccessorFn(next.cell.row.original, next.cell.row.index)
    : (next.cell.row.original as Record<string, unknown>)[next.columnId];
  if (prevValue !== nextValue) {
    return false;
  }

  // Check cell/row identity
  if (prev.cell.row.id !== next.cell.row.id) return false;

  // Re-render if the column's cell config changed (e.g. async-loaded
  // dropdown/combobox `options` resolved) even though the stored value
  // itself (the raw id/uuid) is unchanged — otherwise select/combobox cells
  // keep showing the raw id until something else forces a re-render.
  if (
    prev.cell.column.columnDef.meta?.cell !==
    next.cell.column.columnDef.meta?.cell
  ) {
    return false;
  }

  return true;
}) as typeof DataGridCellImpl;

function DataGridCellImpl<TData>({
  cell,
  tableMeta,
  rowIndex,
  columnId,
  isFocused,
  isEditing,
  isSelected,
  isSearchMatch,
  isActiveSearchMatch,
  readOnly,
  rowHeight,
}: DataGridCellProps<TData>) {
  const cellOpts = cell.column.columnDef.meta?.cell;
  const variant = cellOpts?.variant ?? "text";

  let Comp: React.ComponentType<DataGridCellProps<TData>>;

  switch (variant) {
    case "short-text":
      Comp = ShortTextCell;
      break;
    case "long-text":
      Comp = LongTextCell;
      break;
    case "number":
      Comp = NumberCell;
      break;
    case "int":
      Comp = IntCell;
      break;
    case "url":
      Comp = UrlCell;
      break;
    case "checkbox":
      Comp = CheckboxCell;
      break;
    case "action":
      Comp = ActionCell;
      break;
    case "select":
      Comp = SelectCell;
      break;
    case "multi-select":
      Comp = MultiSelectCell;
      break;
    case "combobox":
      Comp = ComboboxCell;
      break;
    case "date":
      Comp = DateCell;
      break;
    case "file":
      Comp = FileCell;
      break;

    default:
      Comp = ShortTextCell;
      break;
  }

  return (
    <Comp
      cell={cell}
      tableMeta={tableMeta}
      rowIndex={rowIndex}
      columnId={columnId}
      rowHeight={rowHeight}
      isEditing={isEditing}
      isFocused={isFocused}
      isSelected={isSelected}
      isSearchMatch={isSearchMatch}
      isActiveSearchMatch={isActiveSearchMatch}
      readOnly={readOnly}
    />
  );
}
