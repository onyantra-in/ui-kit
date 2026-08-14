import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { DataGrid } from "@/components/data-grid/data-grid";
import { useDataGrid } from "../hooks/use-data-grid";
import type { ColumnDef, Table } from "@tanstack/react-table";
import { CheckCircle, XCircle, AlertCircle, Pencil, Plus, X, Trash2 } from "lucide-react";
import { Button, Input } from "@/components/base";
import { SimpleDialog } from "@/components/SimpleDialog";
import type { FileCellData } from "@/types/data-grid";

const meta: Meta<typeof DataGrid> = {
  title: "Components/DataGrid",
  component: DataGrid,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof DataGrid>;

// ─── Sample Data ──────────────────────────────────────────────────────────────

interface Task {
  id: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  assignee: string;
  dueDate: string;
  completed: boolean;
  url: string;
  estimate: number;
  files?: FileCellData[];
}

const initialTaskData: Task[] = [
  {
    id: "1",
    name: "Implement user authentication",
    description: "Add login and registration functionality with JWT tokens",
    status: "in-progress",
    priority: "high",
    assignee: "Alice Johnson",
    dueDate: "2026-04-15",
    completed: false,
    url: "https://github.com/project/issues/1",
    estimate: 8,
    files: [],
  },
  {
    id: "2",
    name: "Design landing page",
    description: "Create mockups and wireframes for the new landing page",
    status: "completed",
    priority: "medium",
    assignee: "Bob Smith",
    dueDate: "2026-04-10",
    completed: true,
    url: "https://figma.com/file/abc123",
    estimate: 5,
    files: [],
  },
  {
    id: "3",
    name: "Fix mobile responsiveness",
    description: "Ensure all pages work correctly on mobile devices",
    status: "todo",
    priority: "high",
    assignee: "Carol White",
    dueDate: "2026-04-20",
    completed: false,
    url: "https://github.com/project/issues/3",
    estimate: 13,
    files: [],
  },
  {
    id: "4",
    name: "Write API documentation",
    description: "Document all REST API endpoints with examples",
    status: "in-progress",
    priority: "low",
    assignee: "David Brown",
    dueDate: "2026-04-25",
    completed: false,
    url: "https://docs.example.com",
    estimate: 3,
    files: [],
  },
  {
    id: "5",
    name: "Optimize database queries",
    description: "Improve performance of slow queries in production",
    status: "todo",
    priority: "high",
    assignee: "Eve Davis",
    dueDate: "2026-04-18",
    completed: false,
    url: "https://github.com/project/issues/5",
    estimate: 8,
    files: [],
  },
];

// ─── Basic Example ────────────────────────────────────────────────────────────

function BasicDataGridExample() {
  const [data, setData] = React.useState(initialTaskData);

  const columns = React.useMemo<ColumnDef<Task>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Task",
        size: 2000,
        meta: {
          cell: {
            variant: "short-text",
          },
        },
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        meta: {
          cell: {
            variant: "select",
            options: [
              { label: "To Do", value: "todo" },
              { label: "In Progress", value: "in-progress" },
              { label: "Completed", value: "completed" },
            ],
          },
        },
      },
      {
        id: "priority",
        accessorKey: "priority",
        header: "Priority",
        meta: {
          cell: {
            variant: "select",
            options: [
              { label: "Low", value: "low" },
              { label: "Medium", value: "medium" },
              { label: "High", value: "high" },
            ],
          },
        },
      },
      {
        id: "assignee",
        accessorKey: "assignee",
        header: "Assignee",
        meta: {
          cell: {
            variant: "short-text",
          },
        },
      },
      {
        id: "dueDate",
        accessorKey: "dueDate",
        header: "Due Date",
        meta: {
          cell: {
            variant: "date",
          },
        },
      },
      {
        id: 'actions',
        header: () => 'Actions',
        size: 100,
        cell: ({ row }) => (
          <Button size="icon" variant="ghost">
            <Pencil className="h-4 w-4" />
          </Button>
        ),
      },
    ],
    [],
  );

  const { table, ...dataGridProps } = useDataGrid({
    data,
    columns,
    onDataChange: setData,
    getRowId: (row) => row.id,
    readOnly: true,
    enableRowSelection: true,
    initialState: {
      columnPinning: {
        right: ["actions"],
      },
    },
  });

  return (
    <div style={{ height: "600px", padding: "20px" }}>
      <DataGrid table={table} {...dataGridProps} />
    </div>
  );
}

export const Basic: Story = {
  render: () => <BasicDataGridExample />,
};

// ─── Rich Cell Variants ───────────────────────────────────────────────────────

type RichTask = Omit<Task, "priority"> & { priority: string[] } & Record<string, unknown>;

interface DynamicColumn {
  id: string;
  label: string;
}

function RichCellVariantsExample() {
  const [data, setData] = React.useState<RichTask[]>(() =>
    initialTaskData.map((task) => ({ ...task, priority: [task.priority] }) as RichTask),
  );
  const [extraColumns, setExtraColumns] = React.useState<DynamicColumn[]>([]);
  const nextIndexRef = React.useRef(1);
  const tableRef = React.useRef<Table<RichTask> | null>(null);

  const addColumn = React.useCallback(() => {
    // Stable, unique id per column — never derived from array length/index,
    // which shifts on every add/remove and breaks column identity + layout.
    const id = `custom_${crypto.randomUUID()}`;
    const label = `Custom ${nextIndexRef.current++}`;
    setExtraColumns((prev) => [...prev, { id, label }]);
    setData((prev) => prev.map((row) => ({ ...row, [id]: [] })));
  }, []);

  const removeColumn = React.useCallback((id: string) => {
    setExtraColumns((prev) => prev.filter((col) => col.id !== id));
    setData((prev) =>
      prev.map((row) => {
        const { [id]: _removed, ...rest } = row;
        return rest as RichTask;
      }),
    );
  }, []);

  const columns = React.useMemo<ColumnDef<RichTask>[]>(
    () => [
      {
        id: "id",
        accessorKey: "id",
        header: "ID",
        cell: undefined,
        meta: {
          cell: {
            variant: "short-text",
          },
          readOnly: true,
        },
        size: 60,
      },
      {
        id: "completed",
        accessorKey: "completed",
        header: "Done",
        cell: undefined,
        meta: {
          cell: {
            variant: "checkbox",
          },
        },
        size: 80,
        enableHiding: false,
        enableSorting: false,
        enablePinning: false,
      },
      {
        id: "name",
        accessorKey: "name",
        header: "Task Name",
        cell: undefined,
        meta: {
          cell: {
            variant: "short-text",
          },
        },
      },
      {
        id: "description",
        accessorKey: "description",
        header: "Description",
        cell: undefined,
        meta: {
          cell: {
            variant: "long-text",
          },
        },
        size: 300,
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: undefined,
        meta: {
          cell: {
            variant: "select",
            options: [
              { label: "To Do", value: "todo", icon: AlertCircle },
              { label: "In Progress", value: "in-progress", icon: CheckCircle },
              { label: "Completed", value: "completed", icon: XCircle },
            ],
          },
        },
      },
      {
        id: "priority",
        accessorKey: "priority",
        header: "Priority",
        cell: undefined,
        meta: {
          cell: {
            variant: "multi-select",
            options: [
              { label: "Low", value: "low" },
              { label: "Medium", value: "medium" },
              { label: "High", value: "high" },
            ],
          },
        },
      },
      {
        id: "estimate",
        accessorKey: "estimate",
        header: "Hours",
        cell: undefined,
        meta: {
          cell: {
            variant: "number",
            min: 0,
            max: 100,
            step: 0.5,
          },
        },
        size: 100,
      },
      {
        id: "assignee",
        accessorKey: "assignee",
        header: "Assignee",
        cell: undefined,
        meta: {
          cell: {
            variant: "combobox",
            options: [
              { label: "Alice Johnson", value: "Alice Johnson" },
              { label: "Bob Smith", value: "Bob Smith" },
              { label: "Carol White", value: "Carol White" },
              { label: "David Brown", value: "David Brown" },
              { label: "Eve Davis", value: "Eve Davis" },
            ],
          },
        },
      },
      {
        id: "dueDate",
        accessorKey: "dueDate",
        header: "Due Date",
        cell: undefined,
        meta: {
          cell: {
            variant: "date",
          },
        },
      },
      {
        id: "url",
        accessorKey: "url",
        header: "Link",
        cell: undefined,
        meta: {
          cell: {
            variant: "url",
          },
        },
      },
      {
        id: "files",
        accessorKey: "files",
        header: "Attachments",
        cell: undefined,
        meta: {
          cell: {
            variant: "file",
            maxFiles: 5,
            maxFileSize: 5 * 1024 * 1024,
          },
        },
        size: 220,
      },
      {
        id: "delete",
        header: "",
        cell: undefined,
        meta: {
          cell: {
            variant: "action",
            icon: Trash2,
            label: "Delete row",
            onAction: (_row, rowIndex) => {
              tableRef.current?.options.meta?.onRowsDelete?.([rowIndex]);
            },
          },
        },
        size: 48,
        enableSorting: false,
        enableHiding: false,
        enablePinning: false,
      },
      ...extraColumns.map(
        (col): ColumnDef<RichTask> => ({
          id: col.id,
          accessorKey: col.id,
          size: 160,
          header: () => (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <span>{col.label}</span>
              <button
                type="button"
                onClick={() => removeColumn(col.id)}
                aria-label={`Remove ${col.label}`}
                style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0, lineHeight: 1, display: "flex" }}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ),
          cell: undefined,
          meta: { cell: { variant: 'multi-select', options: (row, rowIndex) => [] } },
        }),
      ),
    ],
    [extraColumns, removeColumn],
  );

  const { table, ...dataGridProps } = useDataGrid({
    data,
    columns,
    onDataChange: setData,
    getRowId: (row) => row.id,
    enableRowClickSelection: false,
    onRowAdd: () => {
      const newRow: RichTask = {
        id: String(Date.now()),
        name: "",
        description: "",
        status: "todo",
        priority: [],
        assignee: "",
        dueDate: "",
        completed: false,
        url: "",
        estimate: 0,
        files: [],
        ...Object.fromEntries(extraColumns.map((col) => [col.id, ""])),
      };
      setData((prev) => [...prev, newRow]);
      return { rowIndex: data.length, columnId: "name" };
    },
    onRowsDelete: (rows) => {
      const idsToDelete = new Set(rows.map((row) => row.id));
      setData((prev) => prev.filter((row) => !idsToDelete.has(row.id)));
    },
  });
  tableRef.current = table;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "12px" }}>
        <Button size="sm" onClick={addColumn}>
          <Plus className="h-4 w-4" />
          Add Column
        </Button>
      </div>
      <div style={{ marginBottom: "12px", maxWidth: "300px" }}>
        <Input placeholder="Input above grid (tab into grid from here)" />
      </div>
      <div style={{ height: "560px" }}>
        <DataGrid table={table} stretchColumns  {...dataGridProps} />
      </div>
      <div style={{ marginTop: "12px", maxWidth: "300px" }}>
        <Input placeholder="Input below grid (tab out of grid to here)" />
      </div>
    </div>
  );
}

export const RichCellVariants: Story = {
  render: () => <RichCellVariantsExample />,
  parameters: {
    docs: {
      description: {
        story:
          "All cell variants, plus columns added/removed at runtime via the 'Add Column' button and the X in a dynamic column's header. Each dynamic column gets a stable `crypto.randomUUID()`-based id — not an index or `columns.length` — so column identity (sizing, focus, cell keys) survives add/remove without remounting the grid.",
      },
    },
  },
};

// ─── With Row Selection ───────────────────────────────────────────────────────

function RowSelectionExample() {
  const [data, setData] = React.useState(initialTaskData);
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);

  const columns = React.useMemo<ColumnDef<Task>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Task",
        meta: {
          cell: {
            variant: "short-text",
          },
        },
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        meta: {
          cell: {
            variant: "select",
            options: [
              { label: "To Do", value: "todo" },
              { label: "In Progress", value: "in-progress" },
              { label: "Completed", value: "completed" },
            ],
          },
        },
      },
      {
        id: "assignee",
        accessorKey: "assignee",
        header: "Assignee",
        meta: {
          cell: {
            variant: "short-text",
          },
        },
      },
    ],
    [],
  );

  const { table, ...dataGridProps } = useDataGrid({
    data,
    columns,
    onDataChange: setData,
    getRowId: (row) => row.id,
    enableRowSelection: true,
  });

  React.useEffect(() => {
    const selection = table.getState().rowSelection;
    const selected = Object.keys(selection).filter((key) => selection[key]);
    setSelectedRows(selected);
  }, [table.getState().rowSelection]);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ marginBottom: "10px", fontSize: "14px", color: "#666" }}>
        Selected rows: {selectedRows.length > 0 ? selectedRows.join(", ") : "None"}
      </div>
      <div style={{ height: "600px" }}>
        <DataGrid table={table} {...dataGridProps} />
      </div>
    </div>
  );
}

export const WithRowSelection: Story = {
  render: () => <RowSelectionExample />,
};

// ─── Compact Mode ─────────────────────────────────────────────────────────────

function CompactModeExample() {
  const [data, setData] = React.useState(initialTaskData);

  const columns = React.useMemo<ColumnDef<Task>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Task",
        meta: {
          cell: {
            variant: "short-text",
          },
        },
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        meta: {
          cell: {
            variant: "select",
            options: [
              { label: "To Do", value: "todo" },
              { label: "In Progress", value: "in-progress" },
              { label: "Completed", value: "completed" },
            ],
          },
        },
      },
      {
        id: "assignee",
        accessorKey: "assignee",
        header: "Assignee",
        meta: {
          cell: {
            variant: "short-text",
          },
        },
      },
      {
        id: "dueDate",
        accessorKey: "dueDate",
        header: "Due Date",
        meta: {
          cell: {
            variant: "date",
          },
        },
      },
    ],
    [],
  );

  const { table, ...dataGridProps } = useDataGrid({
    data,
    columns,
    onDataChange: setData,
    getRowId: (row) => row.id,
    rowHeight: "short",
  });

  return (
    <div style={{ height: "400px", padding: "20px" }}>
      <DataGrid table={table} {...dataGridProps} />
    </div>
  );
}

export const Compact: Story = {
  render: () => <CompactModeExample />,
};

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyStateExample() {
  const [data, setData] = React.useState<Task[]>([]);

  const columns = React.useMemo<ColumnDef<Task>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Task",
        meta: {
          cell: {
            variant: "short-text",
          },
        },
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        meta: {
          cell: {
            variant: "select",
            options: [
              { label: "To Do", value: "todo" },
              { label: "In Progress", value: "in-progress" },
              { label: "Completed", value: "completed" },
            ],
          },
        },
      },
    ],
    [],
  );

  const { table, ...dataGridProps } = useDataGrid({
    data,
    columns,
    onDataChange: setData,
    getRowId: (row) => row.id,
  });

  return (
    <div style={{ height: "400px", padding: "20px" }}>
      <DataGrid table={table} {...dataGridProps} />
    </div>
  );
}

export const EmptyState: Story = {
  render: () => <EmptyStateExample />,
};

// ─── Row Click Selection ─────────────────────────────────────────────────────

function RowClickSelectionExample() {
  const [data, setData] = React.useState(initialTaskData);
  const [selectedRows, setSelectedRows] = React.useState<string[]>([]);

  const columns = React.useMemo<ColumnDef<Task>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Task",
        size: 300,
        meta: { cell: { variant: "short-text" } },
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        meta: {
          cell: {
            variant: "select",
            options: [
              { label: "To Do", value: "todo" },
              { label: "In Progress", value: "in-progress" },
              { label: "Completed", value: "completed" },
            ],
          },
        },
      },
      {
        id: "priority",
        accessorKey: "priority",
        header: "Priority",
        meta: {
          cell: {
            variant: "select",
            options: [
              { label: "Low", value: "low" },
              { label: "Medium", value: "medium" },
              { label: "High", value: "high" },
            ],
          },
        },
      },
      {
        id: "assignee",
        accessorKey: "assignee",
        header: "Assignee",
        meta: { cell: { variant: "short-text" } },
      },
      {
        id: "estimate",
        accessorKey: "estimate",
        header: "Hours",
        size: 90,
        meta: { cell: { variant: "number", min: 0, max: 100 } },
      },
    ],
    [],
  );

  const [lastAction, setLastAction] = React.useState<string>("");

  const { table, ...dataGridProps } = useDataGrid({
    data,
    columns,
    onDataChange: setData,
    getRowId: (row) => row.id,
    enableRowSelection: true,
    enableRowClickSelection: true,
    onRowKeyDown: (e, rowData) => {
      const task = rowData as Task;
      if (e.key === "Enter") {
        e.preventDefault();
        setLastAction(`Enter on "${task.name}"`);
      } else if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        setLastAction(`Delete on "${task.name}"`);
      }
    },
  });

  React.useEffect(() => {
    const selection = table.getState().rowSelection;
    setSelectedRows(Object.keys(selection).filter((k) => selection[k]));
  }, [table.getState().rowSelection]);

  return (
    <div style={{ padding: "20px" }}>
      <p style={{ marginBottom: "8px", fontSize: "13px", color: "#666" }}>
        <strong>Click</strong> a row to select · <strong>↑↓</strong> to navigate ·{" "}
        <strong>Enter</strong> / <strong>Delete</strong> for custom actions · <strong>Esc</strong> to clear
      </p>
      <p style={{ marginBottom: "4px", fontSize: "13px" }}>
        Selected: {selectedRows.length > 0 ? selectedRows.join(", ") : "—"}
      </p>
      <p style={{ marginBottom: "12px", fontSize: "13px", color: "#888" }}>
        Last action: {lastAction || "—"}
      </p>
      <div style={{ height: "500px" }}>
        <DataGrid table={table} {...dataGridProps} />
      </div>
    </div>
  );
}

export const RowClickSelection: Story = {
  render: () => <RowClickSelectionExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Single row selection without checkboxes. Click a row to select it, use ↑↓ to navigate. Custom keyboard shortcuts via `onRowKeyDown`.",
      },
    },
  },
};

// ─── Row Selection with Dialog ───────────────────────────────────────────────

function RowSelectionWithDialogExample() {
  const [data, setData] = React.useState(initialTaskData);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState<Task | null>(null);

  const columns = React.useMemo<ColumnDef<Task>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Task",
        size: 300,
        meta: { cell: { variant: "short-text" } },
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        meta: {
          cell: {
            variant: "select",
            options: [
              { label: "To Do", value: "todo" },
              { label: "In Progress", value: "in-progress" },
              { label: "Completed", value: "completed" },
            ],
          },
        },
      },
      {
        id: "priority",
        accessorKey: "priority",
        header: "Priority",
        meta: {
          cell: {
            variant: "select",
            options: [
              { label: "Low", value: "low" },
              { label: "Medium", value: "medium" },
              { label: "High", value: "high" },
            ],
          },
        },
      },
      {
        id: "assignee",
        accessorKey: "assignee",
        header: "Assignee",
        meta: { cell: { variant: "short-text" } },
      },
    ],
    [],
  );

  const { table, dataGridRef, ...dataGridProps } = useDataGrid({
    data,
    columns,
    onDataChange: setData,
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowKeyDown: (e, rowData) => {
      if (e.key === "Enter") {
        e.preventDefault();
        setSelectedTask(rowData as Task);
        setDialogOpen(true);
      }
    },
  });

  return (
    <div style={{ padding: "20px" }}>
      <p style={{ marginBottom: "12px", fontSize: "13px", color: "#666" }}>
        <strong>Click</strong> a row to select · <strong>Enter</strong> to open details · <strong>Esc</strong> to close dialog and return focus
      </p>
      <div style={{ height: "500px" }}>
        <DataGrid table={table} dataGridRef={dataGridRef} {...dataGridProps} />
      </div>
      <SimpleDialog
        trigger={<span />}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={selectedTask?.name ?? ""}
        restoreFocusRef={dataGridRef}
        footer={
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Close
          </Button>
        }
      >
        {selectedTask && (
          <div style={{ fontSize: "13px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div><strong>Status:</strong> {selectedTask.status}</div>
            <div><strong>Priority:</strong> {selectedTask.priority}</div>
            <div><strong>Assignee:</strong> {selectedTask.assignee}</div>
            <div><strong>Due:</strong> {selectedTask.dueDate}</div>
            <div><strong>Estimate:</strong> {selectedTask.estimate}h</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label htmlFor="task-notes" style={{ fontWeight: 600 }}>Notes</label>
              <input
                id="task-notes"
                type="text"
                placeholder="Add a note..."
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  padding: "6px 10px",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            </div>
          </div>
        )}
      </SimpleDialog>
    </div>
  );
}

export const RowSelectionWithDialog: Story = {
  render: () => <RowSelectionWithDialogExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Press Enter on a selected row to open a detail dialog. Focus returns to the DataGrid when the dialog closes.",
      },
    },
  },
};

// ─── One-to-Many (no rowspan) ────────────────────────────────────────────────
//
// The grid has no rowspan/expand support (virtualized rows can't merge across
// recycled heights). To show a 1-to-many relationship, flatten the child rows
// and repeat the parent columns — but only render the parent value on the
// first row of each group. Data must already be sorted/grouped by the parent
// id. The blanked value is precomputed onto the row data (`withGroupDisplay`)
// rather than derived via a custom `cell` fn (bypasses `DataGridCellWrapper`,
// breaks nav) or an `accessorFn` closing over `data` (makes `columns` change
// identity on every edit, which broke click handling grid-wide).

interface OrderRow {
  orderId: string;
  customerId: string;
  customerName: string;
  region: string;
  product: string;
  amount: number;
  status: string;
  // Precomputed once from customerName/region: blank on every row but the
  // first in each customerId group. Kept as plain fields (not an
  // accessorFn recomputed from `data`) so the `columns` array stays
  // referentially stable across edits, same as every other story here.
  customerNameDisplay: string;
  regionDisplay: string;
}

function withGroupDisplay(
  rows: Omit<OrderRow, "customerNameDisplay" | "regionDisplay">[],
): OrderRow[] {
  return rows.map((row, index) => {
    const isGroupStart =
      index === 0 || rows[index - 1].customerId !== row.customerId;
    return {
      ...row,
      customerNameDisplay: isGroupStart ? row.customerName : "",
      regionDisplay: isGroupStart ? row.region : "",
    };
  });
}

const initialOrderData: OrderRow[] = withGroupDisplay([
  { orderId: "O-1001", customerId: "C-1", customerName: "Acme Corp", region: "West", product: "Widget A", amount: 120, status: "shipped" },
  { orderId: "O-1002", customerId: "C-1", customerName: "Acme Corp", region: "West", product: "Widget B", amount: 45, status: "pending" },
  { orderId: "O-1003", customerId: "C-1", customerName: "Acme Corp", region: "West", product: "Widget C", amount: 300, status: "shipped" },
  { orderId: "O-1004", customerId: "C-2", customerName: "Globex LLC", region: "East", product: "Gadget X", amount: 80, status: "pending" },
  { orderId: "O-1005", customerId: "C-3", customerName: "Initech", region: "Central", product: "Gizmo Z", amount: 210, status: "shipped" },
  { orderId: "O-1006", customerId: "C-3", customerName: "Initech", region: "Central", product: "Gadget Y", amount: 60, status: "cancelled" },
]);

function OneToManyExample() {
  const [data, setData] = React.useState(initialOrderData);

  const columns = React.useMemo<ColumnDef<OrderRow>[]>(
    () => [
      {
        id: "customerName",
        accessorKey: "customerNameDisplay",
        header: "Customer",
        cell: undefined,
        size: 160,
        enableSorting: false,
        meta: { readOnly: true, cell: { variant: "short-text" } },
      },
      {
        id: "region",
        accessorKey: "regionDisplay",
        header: "Region",
        cell: undefined,
        size: 110,
        enableSorting: false,
        meta: { readOnly: true, cell: { variant: "short-text" } },
      },
      {
        id: "orderId",
        accessorKey: "orderId",
        header: "Order ID",
        cell: undefined,
        size: 110,
        meta: { readOnly: true, cell: { variant: "short-text" } },
      },
      {
        id: "product",
        accessorKey: "product",
        header: "Product",
        cell: undefined,
        size: 160,
        meta: { cell: { variant: "short-text" } },
      },
      {
        id: "amount",
        accessorKey: "amount",
        header: "Amount",
        cell: undefined,
        size: 100,
        meta: { cell: { variant: "number", min: 0 } },
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: undefined,
        size: 130,
        meta: {
          cell: {
            variant: "select",
            options: [
              { label: "Pending", value: "pending" },
              { label: "Shipped", value: "shipped" },
              { label: "Cancelled", value: "cancelled" },
            ],
          },
        },
      },
    ],
    [],
  );

  const { table, ...dataGridProps } = useDataGrid({
    data,
    columns,
    onDataChange: setData,
    getRowId: (row) => row.orderId,
    enableRowClickSelection: false,
  });

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ height: "400px" }}>
        <DataGrid table={table} {...dataGridProps} />
      </div>
    </div>
  );
}

export const OneToMany: Story = {
  render: () => <OneToManyExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Customer → Orders (1-to-many) without rowspan. Rows are flattened and pre-grouped by customerId; `withGroupDisplay` precomputes blanked customerName/region values (empty on every row but the first in each group) directly on the row data, so the columns stay plain stable `accessorKey` + stock `short-text` variant — normal focus/arrow-key/tab navigation included. A custom `cell` renderer would bypass `DataGridCellWrapper` and break nav; deriving the blank value via `accessorFn` keyed off `data` would make the `columns` array change identity on every edit, which broke click handling for the whole grid.",
      },
    },
  },
};
