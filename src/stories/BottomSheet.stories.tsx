import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BottomSheet } from '../components/BottomSheet';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Label } from '../components/Label';

const meta: Meta<typeof BottomSheet> = {
  title: 'Components/BottomSheet',
  component: BottomSheet,
  tags: ['autodocs'],
  parameters: {
    // Disable the default canvas padding so the overlay covers the full preview
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof BottomSheet>;

function BottomSheetDemo({ title, children }: { title?: string; children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-center h-64">
      <Button onClick={() => setOpen(true)}>Open sheet</Button>
      <BottomSheet open={open} onClose={() => setOpen(false)} title={title}>
        {children ?? (
          <p className="text-muted-foreground text-sm">Sheet content goes here.</p>
        )}
      </BottomSheet>
    </div>
  );
}

export const Default: Story = {
  render: () => <BottomSheetDemo title="Example Sheet" />,
};

export const NoTitle: Story = {
  render: () => <BottomSheetDemo />,
};

export const WithForm: Story = {
  render: () => (
    <BottomSheetDemo title="Add Person">
      <div className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="first">First name</Label>
          <Input id="first" placeholder="First name" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="last">Last name</Label>
          <Input id="last" placeholder="Last name" />
        </div>
        <Button className="w-full">Save</Button>
      </div>
    </BottomSheetDemo>
  ),
};
