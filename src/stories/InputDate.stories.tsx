import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { InputDate, InputDateBoundsProvider } from '../components/InputDate';
import { Label } from '../components/base/label';

const meta: Meta<typeof InputDate> = {
  title: 'Components/InputDate',
  component: InputDate,
  tags: ['autodocs'],
  argTypes: {
    bounds: { control: 'select', options: ['fy', 'none'] },
    disabled: { control: 'boolean' },
    min: { control: 'text' },
    max: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof InputDate>;

const Controlled = (props: React.ComponentProps<typeof InputDate>) => {
  const [value, setValue] = useState(props.value ?? '');
  return (
    <div className="w-72 space-y-2">
      <Label htmlFor={props.id}>Date</Label>
      <InputDate {...props} value={value} onChange={(e) => setValue(e.target.value)} />
      <p className="text-xs text-muted-foreground">ISO value: {value || '(empty)'}</p>
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Controlled {...args} id="date-default" bounds="none" />,
};

export const WithValue: Story = {
  render: (args) => <Controlled {...args} id="date-value" bounds="none" value="2026-01-15" />,
};

export const Disabled: Story = {
  render: (args) => <Controlled {...args} id="date-disabled" bounds="none" value="2026-01-15" disabled />,
};

export const MinMax: Story = {
  render: (args) => (
    <Controlled {...args} id="date-minmax" bounds="none" value="2026-06-10" min="2026-06-01" max="2026-06-30" />
  ),
};

export const FinancialYearBounds: Story = {
  render: (args) => (
    <InputDateBoundsProvider
      value={{ min: '2025-04-01', max: '2026-03-31', label: 'FY 2025-26 (01/04/2025 to 31/03/2026)' }}
    >
      <Controlled {...args} id="date-fy" bounds="fy" value="2025-08-25" />
    </InputDateBoundsProvider>
  ),
};

export const FinancialYearOptOut: Story = {
  render: (args) => (
    <InputDateBoundsProvider value={{ min: '2025-04-01', max: '2026-03-31', label: 'FY 2025-26' }}>
      <Controlled {...args} id="date-fy-none" bounds="none" value="2024-01-01" />
    </InputDateBoundsProvider>
  ),
};
