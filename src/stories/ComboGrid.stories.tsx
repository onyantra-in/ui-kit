import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ComboGrid } from "@/components/combo-grid/combo-grid";

const meta: Meta<typeof ComboGrid> = {
  title: "Components/ComboGrid",
  component: ComboGrid,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ComboGrid>;

interface Task {
  id: string;
  name: string;
  status: string;
  priority: string;
  assignee: string;
  dueDate: string;
}

const initialTaskData: Task[] = [
  {
    id: "1",
    name: "Implement user authentication",
    status: "in-progress",
    priority: "high",
    assignee: "Alice Johnson",
    dueDate: "2026-04-15",
  },
  {
    id: "2",
    name: "Design landing page",
    status: "completed",
    priority: "medium",
    assignee: "Bob Smith",
    dueDate: "2026-04-10",
  },
  {
    id: "3",
    name: "Fix mobile responsiveness",
    status: "todo",
    priority: "high",
    assignee: "Carol White",
    dueDate: "2026-04-20",
  },
  {
    id: "4",
    name: "Write API documentation",
    status: "in-progress",
    priority: "low",
    assignee: "David Brown",
    dueDate: "2026-04-25",
  },
  {
    id: "5",
    name: "Optimize database queries",
    status: "todo",
    priority: "high",
    assignee: "Eve Davis",
    dueDate: "2026-04-18",
  },
];

function BasicComboGridExample() {
  const [data, setData] = React.useState(initialTaskData);

  const columns = React.useMemo<ColumnDef<Task>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Task",
        size: 2000,
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
        id: "dueDate",
        accessorKey: "dueDate",
        header: "Due Date",
        meta: { cell: { variant: "date" } },
      },
    ],
    [],
  );

  return (
    <div style={{ height: "600px", padding: "20px" }}>
      <ComboGrid
        data={data}
        columns={columns}
        onDataChange={setData}
        getRowId={(row) => row.id}
      />
    </div>
  );
}

export const Basic: Story = {
  render: () => <BasicComboGridExample />,
};
