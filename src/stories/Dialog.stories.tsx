import type { Meta, StoryObj } from '@storybook/react';
import { SimpleDialog } from '../components/SimpleDialog';
import { Button } from '../components/base/button';
import { Input } from '../components/base/input';
import { Label } from '../components/base/label';

const meta: Meta<typeof SimpleDialog> = {
  title: 'Components/Dialog',
  component: SimpleDialog,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SimpleDialog>;

export const Default: Story = {
  render: () => (
    <SimpleDialog
      trigger={<Button variant="outline">Open dialog</Button>}
      title="Dialog title"
      description="This is a dialog description. It provides more context about what the dialog is for."
      footer={<Button>Confirm</Button>}
    >
      <p className="text-sm text-muted-foreground">Dialog body content goes here.</p>
    </SimpleDialog>
  ),
};

export const WithForm: Story = {
  render: () => (
    <SimpleDialog
      trigger={<Button>Edit profile</Button>}
      title="Edit profile"
      description="Make changes to your profile here. Click save when you're done."
      footer={<Button>Save changes</Button>}
    >
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name</Label>
          <Input id="name" defaultValue="Aditya Toshniwal" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue="aditya@example.com" />
        </div>
      </div>
    </SimpleDialog>
  ),
};

export const OverflowingContent: Story = {
  render: () => (
    <SimpleDialog
      trigger={<Button variant="outline">Open overflowing dialog</Button>}
      title="Long content dialog"
      description="This dialog contains enough content to exceed the viewport height. The header and footer stay fixed while only the body scrolls."
      footer={<Button>Save all</Button>}
    >
      <div className="space-y-3">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="space-y-1.5">
            <Label htmlFor={`field-${i}`}>Field {i + 1}</Label>
            <Input id={`field-${i}`} placeholder={`Enter value for field ${i + 1}`} />
          </div>
        ))}
      </div>
    </SimpleDialog>
  ),
};

export const NoCloseButton: Story = {
  render: () => (
    <SimpleDialog
      trigger={<Button variant="outline">Open (no close button)</Button>}
      title="No close button"
      description="This dialog has no X button in the corner."
      showCloseButton={false}
    />
  ),
};
