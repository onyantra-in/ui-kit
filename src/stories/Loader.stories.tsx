import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import { Loader } from "../components/base/loader";
import { Button } from "../components/base/button";

const meta: Meta<typeof Loader> = {
  title: "Components/Loader",
  component: Loader,
  tags: ["autodocs"],
  argTypes: {
    loading: { control: "boolean" },
    text: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof Loader>;

export const Default: Story = {
  args: {
    loading: true,
    children: (
      <div className="h-40 rounded-lg border bg-card p-4">
        <p className="text-sm text-muted-foreground">Content underneath the overlay</p>
      </div>
    ),
  },
};

export const WithText: Story = {
  args: {
    text: "Saving changes...",
    children: (
      <div className="h-40 rounded-lg border bg-card p-4">
        <p className="text-sm text-muted-foreground">Content underneath the overlay</p>
      </div>
    ),
  },
};

export const NotLoading: Story = {
  args: {
    loading: false,
    children: (
      <div className="h-40 rounded-lg border bg-card p-4">
        <p className="text-sm text-muted-foreground">No overlay — content is visible normally</p>
      </div>
    ),
  },
};

function ToggleExample() {
  const [loading, setLoading] = React.useState(false);
  const [text, setText] = React.useState("");

  const simulate = (message: string) => {
    setText(message);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setText("");
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button onClick={() => simulate("Loading...")}>Loading only</Button>
        <Button variant="outline" onClick={() => simulate("Saving changes...")}>
          With text
        </Button>
      </div>
      <Loader loading={loading} text={text}>
        <div className="h-48 rounded-lg border bg-card p-6">
          <p className="font-medium">Card content</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Click a button above to trigger the overlay for 2 seconds.
          </p>
        </div>
      </Loader>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <ToggleExample />,
};
