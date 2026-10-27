import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { List, ListItem } from '../components/List';
import { Badge } from '../components/base/badge';
import { Button } from '../components/base/button';

const meta: Meta = {
  title: 'Components/List',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

interface Person {
  id: number;
  name: string;
  role: string;
  email: string;
  active: boolean;
}

const roles = ['designer', 'engineer', 'manager', 'analyst', 'support'];

const makePeople = (count: number): Person[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Person ${i + 1}`,
    role: roles[i % roles.length],
    email: `person${i + 1}@example.com`,
    active: i % 3 !== 0,
  }));

const people = makePeople(40);

function Avatar({ name }: { name: string }) {
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
      {name.split(' ').map((part) => part[0]).join('')}
    </div>
  );
}

export const Default: Story = {
  render: () => (
    <List
      className="h-96 rounded-lg border"
      items={people}
      getKey={(person) => person.id}
      renderItem={(person) => (
        <ListItem
          className="px-3"
          leading={<Avatar name={person.name} />}
          title={person.name}
          subtitle={person.role}
          description={person.email}
        />
      )}
    />
  ),
};

export const WithTrailingAndActions: Story = {
  render: () => (
    <List
      className="h-96 rounded-lg border"
      items={people}
      getKey={(person) => person.id}
      renderItem={(person) => (
        <ListItem
          className="px-3"
          leading={<Avatar name={person.name} />}
          title={person.name}
          subtitle={person.role}
          trailing={
            <Badge variant={person.active ? 'default' : 'secondary'}>
              {person.active ? 'Active' : 'Inactive'}
            </Badge>
          }
          actions={
            <>
              <Button size="sm" variant="outline">Edit</Button>
              <Button size="sm" variant="ghost">Remove</Button>
            </>
          }
        />
      )}
    />
  ),
};

export const WithLinks: Story = {
  name: 'With links (href)',
  render: () => (
    <List
      className="h-96 rounded-lg border"
      items={people}
      getKey={(person) => person.id}
      renderItem={(person) => (
        <ListItem
          className="px-3"
          href={`#person-${person.id}`}
          leading={<Avatar name={person.name} />}
          title={person.name}
          subtitle={person.role}
        />
      )}
    />
  ),
};

export const WithRenderLink: Story = {
  name: 'With router link (renderLink)',
  render: () => (
    <List
      className="h-96 rounded-lg border"
      items={people}
      getKey={(person) => person.id}
      renderItem={(person) => (
        <ListItem
          className="px-3"
          renderLink={({ className, children }) => (
            // Stand-in for a router <Link to=... className={className}>.
            <a
              href={`#route-${person.id}`}
              className={className}
              onClick={(event) => event.preventDefault()}
            >
              {children}
            </a>
          )}
          leading={<Avatar name={person.name} />}
          title={person.name}
          subtitle={person.role}
        />
      )}
    />
  ),
};

export const Virtualized: Story = {
  name: 'Virtualized (10,000 items)',
  render: () => {
    const many = React.useMemo(() => makePeople(10_000), []);
    return (
      <List
        className="h-96 rounded-lg border"
        items={many}
        getKey={(person) => person.id}
        estimateSize={72}
        renderItem={(person) => (
          <ListItem
            className="px-3"
            leading={<Avatar name={person.name} />}
            title={person.name}
            subtitle={person.role}
            description={person.email}
          />
        )}
      />
    );
  },
};

export const ExternalScrollElement: Story = {
  name: 'External scroll element',
  render: () => {
    const [scroller, setScroller] = React.useState<HTMLElement | null>(null);
    return (
      <div ref={setScroller} className="h-96 overflow-auto rounded-lg border">
        <div className="p-4 text-sm text-muted-foreground">
          Content above the list. The list virtualizes against this scroll container.
        </div>
        {scroller && (
          <List
            scrollElement={scroller}
            items={people}
            getKey={(person) => person.id}
            renderItem={(person) => (
              <ListItem
                className="px-3"
                leading={<Avatar name={person.name} />}
                title={person.name}
                subtitle={person.role}
              />
            )}
          />
        )}
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => (
    <List
      className="h-40 rounded-lg border"
      items={[] as Person[]}
      getKey={(person) => person.id}
      renderItem={() => null}
    />
  ),
};
