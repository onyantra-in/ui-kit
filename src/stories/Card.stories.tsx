import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/base/card';
import { Button } from '../components/base/button';
import { Badge } from '../components/base/badge';
import { Loader } from '../components/base/loader';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Card content lives here.</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Manage your notification preferences.</CardDescription>
        <CardAction>
          <Badge>New</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">You have 3 unread messages.</p>
      </CardContent>
    </Card>
  ),
};

export const Small: Story = {
  render: () => (
    <Card size="sm" className="w-72">
      <CardHeader>
        <CardTitle>Small card</CardTitle>
        <CardDescription>Compact card variant.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">Less padding, same structure.</p>
      </CardContent>
    </Card>
  ),
};

export const HeaderOnly: Story = {
  render: () => (
    <Card className="w-72">
      <CardHeader>
        <CardTitle>Header only</CardTitle>
        <CardDescription>Sometimes a card just needs a header.</CardDescription>
      </CardHeader>
    </Card>
  ),
};

function WithLoaderExample() {
  const [loading, setLoading] = React.useState(false);

  const simulate = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 w-80">
      <Button variant="outline" onClick={simulate}>Simulate loading</Button>
      <Loader loading={loading} text="Fetching data...">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">You have 3 unread messages.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Mark all read</Button>
          </CardFooter>
        </Card>
      </Loader>
    </div>
  );
}

export const WithLoader: Story = {
  render: () => <WithLoaderExample />,
};
