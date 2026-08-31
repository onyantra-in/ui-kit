export const ScrollableContent: Story = {
  render: () => (
    <SimpleDrawer
      trigger={<Button>Open scrollable drawer</Button>}
      title="Scrollable Drawer"
      description="This drawer demonstrates scrollable content with a sticky footer."
    >
      <div className="space-y-3">
        {Array.from({ length: 30 }).map((_, i) => (
          <LabeledInput key={i} label={`Field ${i + 1}`} placeholder={`Value ${i + 1}`} />
        ))}
      </div>
    </SimpleDrawer>
  ),
};
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/base/button';
import { LabeledInput } from '../components/LabeledInput';
import { SimpleDrawer } from '../components/SimpleDrawer';

const meta: Meta<typeof SimpleDrawer> = {
  title: 'Components/SimpleDrawer',
  component: SimpleDrawer,
  tags: ['autodocs'],
  argTypes: {
    trigger: { control: false },
    footer: { control: false },
    children: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof SimpleDrawer>;

export const Default: Story = {
  args: {
    title: 'Drawer title',
    description: 'This is the drawer description.',
    trigger: <Button variant="outline">Open drawer</Button>,
  },
};

export const WithContent: Story = {
  render: () => (
    <SimpleDrawer
      trigger={<Button>Edit profile</Button>}
      title="Edit profile"
      description="Make changes to your profile here."
    >
      <div className="space-y-3">
        <LabeledInput label="Name" placeholder="Your name" />
        <LabeledInput label="Email" type="email" placeholder="you@example.com" />
      </div>
    </SimpleDrawer>
  ),
};

export const CustomFooter: Story = {
  render: () => (
    <SimpleDrawer
      trigger={<Button variant="destructive">Delete account</Button>}
      title="Delete account"
      description="This action cannot be undone. Your account will be permanently deleted."
      footer={
        <div className="flex w-full gap-2">
          <Button variant="destructive" className="flex-1">
            Delete
          </Button>
          <Button variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>
      }
    />
  ),
};

export const NoDescription: Story = {
  args: {
    title: 'Quick actions',
    trigger: <Button variant="outline">Open</Button>,
    children: <p className="text-sm text-muted-foreground">No description variant.</p>,
  },
};

export const MobileKeyboard: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'Open on a phone/simulator and focus a lower field. The sheet should shift to the top of the visible viewport instead of staying anchored under the keyboard.',
      },
    },
  },
  render: () => (
    <SimpleDrawer
      trigger={<Button>Open form</Button>}
      title="Contact details"
      description="Focus a field near the bottom to trigger the keyboard."
    >
      <div className="space-y-3">
        <LabeledInput label="Name" placeholder="Your name" />
        <LabeledInput label="Email" type="email" placeholder="you@example.com" />
        <LabeledInput label="Phone" placeholder="Phone number" />
        <LabeledInput label="Address" placeholder="Street address" />
        <LabeledInput label="City" placeholder="City" />
        <LabeledInput label="Notes" placeholder="Anything else?" />
      </div>
    </SimpleDrawer>
  ),
};
