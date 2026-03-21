import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../components/Input';
import { Label } from '../components/Label';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    type: { control: 'select', options: ['text', 'email', 'password', 'number', 'search'] },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = { args: { placeholder: 'Enter text…' } };
export const WithValue: Story = { args: { defaultValue: 'Hello world', placeholder: 'Enter text…' } };
export const Disabled: Story = { args: { placeholder: 'Disabled', disabled: true } };
export const Password: Story = { args: { type: 'password', placeholder: 'Password' } };

export const WithLabel: Story = {
  render: () => (
    <div className="w-72 space-y-1">
      <Label htmlFor="demo-input">Full name</Label>
      <Input id="demo-input" placeholder="e.g. Aditya Toshniwal" />
    </div>
  ),
};
