import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Input } from '../components/base/input';
import { Label } from '../components/base/label';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    type: { control: 'select', options: ['text', 'email', 'password', 'number', 'int', 'search'] },
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

export const ControlledNumber: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    return (
      <div className="w-72 space-y-2">
        <Label htmlFor="controlled-number">Decimal number (controlled)</Label>
        <Input
          id="controlled-number"
          type="number"
          placeholder="0.00"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">Current value: <code>{value || '—'}</code></p>
      </div>
    );
  },
};

export const ControlledInteger: Story = {
  render: () => {
    const [value, setValue] = useState<string>('');
    return (
      <div className="w-72 space-y-2">
        <Label htmlFor="controlled-int">Integer (controlled)</Label>
        <Input
          id="controlled-int"
          type="int"
          placeholder="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">Current value: <code>{value || '—'}</code></p>
      </div>
    );
  },
};
