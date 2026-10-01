import type { Meta, StoryObj } from '@storybook/react';
import { SimpleAlert } from '../components/SimpleAlert';
import { Button } from '../components/base/button';

const meta: Meta<typeof SimpleAlert> = {
  title: 'Components/SimpleAlert',
  component: SimpleAlert,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['info', 'error', 'warning'] },
  },
  args: {
    title: 'Heads up!',
    description: 'You can add components to your app using the cli.',
  },
};

export default meta;
type Story = StoryObj<typeof SimpleAlert>;

export const Info: Story = { args: { type: 'info' } };

export const Error: Story = {
  args: {
    type: 'error',
    title: 'Error',
    description: 'Your session has expired. Please log in again.',
  },
};

export const Warning: Story = {
  args: {
    type: 'warning',
    title: 'Warning',
    description: 'Your trial ends in 3 days.',
  },
};

export const WithAction: Story = {
  args: {
    type: 'info',
    title: 'Update available',
    description: 'A new version of the application is available.',
    action: <Button size="sm">Update</Button>,
  },
};
