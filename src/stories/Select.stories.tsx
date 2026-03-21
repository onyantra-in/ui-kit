import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '../components/Select';
import { Label } from '../components/Label';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: (args) => (
    <Select {...args} className="w-48">
      <option value="">Pick one…</option>
      <option value="a">Option A</option>
      <option value="b">Option B</option>
      <option value="c">Option C</option>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled className="w-48">
      <option>Disabled</option>
    </Select>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-64 space-y-1">
      <Label htmlFor="demo-select">Gender</Label>
      <Select id="demo-select" className="w-full">
        <option value="">Select…</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </Select>
    </div>
  ),
};
