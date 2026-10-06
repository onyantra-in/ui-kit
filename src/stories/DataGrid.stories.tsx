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

const HOURLY_RATE = 100;

function RichCellVariantsExample() {
  const [data, setData] = React.useState<RichTask[]>(() =>
    initialTaskData.map((task) => ({ ...task, priority: [task.priority] }) as RichTask),
  );

  // "cost" is derived from "estimate" on every render to simulate a
  // dependent/calculated field — it must recompute on Tab/Enter commit
  // AND on click-away commit.
  const dataWithCost = React.useMemo(
    () =>
      data.map((row) => ({
        ...row,
        cost: (Number(row.estimate) || 0) * HOURLY_RATE,
      })),
    [data],
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
        id: "cost",
        accessorKey: "cost",
        header: "Cost ($)",
        cell: undefined,
        meta: {
          cell: {
            variant: "number",
          },
          readOnly: true,
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
    data: dataWithCost,
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

// ─── Separator + Auto Distribute ──────────────────────────────────────────────

interface AllocationRow {
  id: string;
  kind: "separator" | "item";
  /** Source row: qty to distribute. Target row: its allocated qty. */
  qty: number;
  name: string;
  /** Used by weighted distribution. */
  weight: number;
}

/** Splits `total` across `targets`; returns one qty per target. */
type DistributeFn = (total: number, targets: AllocationRow[]) => number[];

const distributeEvenly: DistributeFn = (total, targets) => {
  if (targets.length === 0) return [];
  const base = Math.floor(total / targets.length);
  const remainder = total - base * targets.length;
  // Leftover units go to the first rows so the sum always equals `total`.
  return targets.map((_, i) => base + (i < remainder ? 1 : 0));
};

const distributeByWeight: DistributeFn = (total, targets) => {
  const totalWeight = targets.reduce((sum, t) => sum + t.weight, 0);
  if (totalWeight <= 0) return distributeEvenly(total, targets);
  const shares = targets.map((t) => Math.floor((total * t.weight) / totalWeight));
  let leftover = total - shares.reduce((a, b) => a + b, 0);
  for (let i = 0; leftover > 0; i = (i + 1) % shares.length, leftover--) {
    shares[i]! += 1;
  }
  return shares;
};

const initialAllocationData: AllocationRow[] = [
  { id: "src", kind: "item", name: "Source stock", qty: 100, weight: 0 },
  { id: "sep", kind: "separator", name: "Distributed to", qty: 0, weight: 0 },
  { id: "a1", kind: "item", name: "Warehouse North", qty: 34, weight: 1 },
  { id: "a2", kind: "item", name: "Warehouse South", qty: 33, weight: 2 },
  { id: "a3", kind: "item", name: "Warehouse East", qty: 33, weight: 3 },
];

const isAllocationSeparator = (row: AllocationRow) => row.kind === "separator";

/**
 * For every separator whose preceding (source) row changed qty, redistributes
 * that qty over the rows after the separator, up to the next separator.
 */
function redistribute(
  prev: AllocationRow[],
  next: AllocationRow[],
  fn: DistributeFn,
): AllocationRow[] {
  let result = next;
  next.forEach((row, i) => {
    if (row.kind !== "separator" || i === 0) return;
    const source = next[i - 1]!;
    if (source.kind === "separator" || source.qty === prev[i - 1]?.qty) return;
    let end = i + 1;
    while (end < next.length && next[end]!.kind !== "separator") end++;
    const shares = fn(source.qty, next.slice(i + 1, end));
    result = result.map((r, j) =>
      j > i && j < end ? { ...r, qty: shares[j - i - 1] ?? 0 } : r,
    );
  });
  return result;
}

function AutoDistributeExample() {
  const [data, setData] = React.useState(initialAllocationData);
  const [mode, setMode] = React.useState<"even" | "weight">("even");
  const distribute = mode === "even" ? distributeEvenly : distributeByWeight;

  const onDataChange = React.useCallback(
    (next: AllocationRow[]) => {
      setData((prev) => redistribute(prev, next, distribute));
    },
    [distribute],
  );

  const columns = React.useMemo<ColumnDef<AllocationRow>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Location",
        size: 220,
        meta: { cell: { variant: "short-text" } },
      },
      {
        id: "weight",
        accessorKey: "weight",
        header: "Weight",
        size: 100,
        meta: { cell: { variant: "int", min: 0 } },
      },
      {
        id: "qty",
        accessorKey: "qty",
        header: "Qty",
        size: 120,
        meta: { cell: { variant: "int", min: 0 } },
      },
    ],
    [],
  );

  const { table, ...dataGridProps } = useDataGrid({
    data,
    columns,
    onDataChange,
    getRowId: (row) => row.id,
    enableRowClickSelection: false,
    isSeparatorRow: isAllocationSeparator,
  });

  return (
    <div style={{ padding: "20px" }}>
      <div className="mb-3 flex items-center gap-2 text-sm">
        <span>Distribution:</span>
        <Button
          size="sm"
          variant={mode === "even" ? "default" : "outline"}
          onClick={() => setMode("even")}
        >
          Even
        </Button>
        <Button
          size="sm"
          variant={mode === "weight" ? "default" : "outline"}
          onClick={() => setMode("weight")}
        >
          By weight
        </Button>
      </div>
      <div style={{ height: "400px" }}>
        <DataGrid
          table={table}
          {...dataGridProps}
          stretchColumns
          getSeparatorTitle={(row) => row.name}
        />
      </div>
    </div>
  );
}

function TitledSeparatorExample() {
  const [data, setData] = React.useState(initialAllocationData);
  const columns = React.useMemo<ColumnDef<AllocationRow>[]>(
    () => [
      { id: "name", accessorKey: "name", header: "Location", size: 220, meta: { cell: { variant: "short-text" } } },
      { id: "qty", accessorKey: "qty", header: "Qty", size: 120, meta: { cell: { variant: "int", min: 0 } } },
    ],
    [],
  );
  const { table, ...dataGridProps } = useDataGrid({
    data,
    columns,
    onDataChange: setData,
    getRowId: (row) => row.id,
    enableRowClickSelection: false,
    isSeparatorRow: isAllocationSeparator,
  });
  return (
    <div style={{ padding: "20px" }}>
      <div style={{ height: "400px" }}>
        <DataGrid
          table={table}
          {...dataGridProps}
          stretchColumns
          // Return nothing for a plain line separator.
          getSeparatorTitle={(row) => (row.id === "s2" ? undefined : row.name)}
        />
      </div>
    </div>
  );
}

export const SeparatorWithTitle: Story = {
  render: () => <TitledSeparatorExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Rows matched by `isSeparatorRow` (passed to both `useDataGrid` and `DataGrid`) render full-width instead of as cells and are skipped by arrow/Tab navigation. `getSeparatorTitle` supplies an optional title; returning `undefined` renders a thin plain line.",
      },
    },
  },
};

export const SeparatorAutoDistribute: Story = {
  render: () => <AutoDistributeExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Section 1 is a single source row; the separator splits it from section 2, the target rows. Editing the source qty runs a pluggable `DistributeFn(total, targets) => number[]` over the rows after the separator. Swap between even and weight-proportional split; both keep the sum equal to the source qty. Targets stay editable.",
      },
    },
  },
};
