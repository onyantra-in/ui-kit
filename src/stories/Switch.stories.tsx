import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '../components/base/switch';
import { Label } from '../components/base/label';

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['default', 'sm'] },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const Disabled: Story = { args: { disabled: true } };

export const DisabledChecked: Story = { args: { disabled: true, defaultChecked: true } };

export const Small: Story = { args: { size: 'sm' } };

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="notifications" />
      <Label htmlFor="notifications">Enable notifications</Label>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Switch size="default" defaultChecked />
        <Label>Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch size="sm" defaultChecked />
        <Label>Small</Label>
      </div>
    </div>
  ),
};
