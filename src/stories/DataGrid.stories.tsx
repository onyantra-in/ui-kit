import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { DataGrid } from "@/components/data-grid/data-grid";
import { useDataGrid } from "../hooks/use-data-grid";
import type { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, XCircle, AlertCircle, Pencil } from "lucide-react";
import { Button } from "@/components/base";
import { SimpleDialog } from "@/components/SimpleDialog";

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

function RichCellVariantsExample() {
  const [data, setData] = React.useState(initialTaskData);

  const columns = React.useMemo<ColumnDef<Task>[]>(
    () => [
      {
        id: "completed",
        accessorKey: "completed",
        header: "Done",
        meta: {
          cell: {
            variant: "checkbox",
          },
        },
        size: 80,
      },
      {
        id: "name",
        accessorKey: "name",
        header: "Task Name",
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
        id: "url",
        accessorKey: "url",
        header: "Link",
        meta: {
          cell: {
            variant: "url",
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
    <div style={{ height: "600px", padding: "20px" }}>
      <DataGrid table={table} {...dataGridProps} />
    </div>
  );
}

export const RichCellVariants: Story = {
  render: () => <RichCellVariantsExample />,
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
