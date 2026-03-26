import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '../components/base/textarea';
import { Label } from '../components/base/label';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = { args: { placeholder: 'Write something…' } };
export const Disabled: Story = { args: { placeholder: 'Disabled', disabled: true } };

export const WithLabel: Story = {
  render: () => (
    <div className="w-72 space-y-1">
      <Label htmlFor="demo-ta">Notes</Label>
      <Textarea id="demo-ta" placeholder="Add any notes about this person…" />
    </div>
  ),
};
