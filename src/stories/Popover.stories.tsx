import type { Meta, StoryObj } from '@storybook/react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/base/popover';
import { Button } from '../components/base/button';
import { Input } from '../components/base/input';
import { Label } from '../components/base/label';

const meta: Meta<typeof Popover> = {
  title: 'Components/Popover',
  component: Popover,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p className="text-sm">This is a popover. You can put any content here.</p>
      </PopoverContent>
    </Popover>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Edit dimensions</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-3">
          <p className="text-sm font-medium">Dimensions</p>
          <div className="space-y-1.5">
            <Label htmlFor="width">Width</Label>
            <Input id="width" defaultValue="100%" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="height">Height</Label>
            <Input id="height" defaultValue="25px" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const Alignment: Story = {
  render: () => (
    <div className="flex gap-4">
      {(['start', 'center', 'end'] as const).map((align) => (
        <Popover key={align}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">{align}</Button>
          </PopoverTrigger>
          <PopoverContent align={align}>
            <p className="text-sm">Aligned to {align}.</p>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  ),
};
