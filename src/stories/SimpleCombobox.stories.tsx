import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SimpleCombobox } from '../components/SimpleCombobox';

const meta: Meta<typeof SimpleCombobox> = {
  title: 'Components/SimpleCombobox',
  component: SimpleCombobox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SimpleCombobox>;

const frameworks = [
  { value: 'next', label: 'Next.js' },
  { value: 'sveltekit', label: 'SvelteKit' },
  { value: 'nuxt', label: 'Nuxt.js' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
  { value: 'solidstart', label: 'SolidStart' },
  { value: 'qwik', label: 'Qwik' },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="w-64">
        <SimpleCombobox
          options={frameworks}
          value={value}
          onValueChange={setValue}
          placeholder="Select framework…"
        />
      </div>
    );
  },
};

export const WithLabel: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="w-64">
        <SimpleCombobox
          options={frameworks}
          value={value}
          onValueChange={setValue}
          label="Framework"
          id="framework"
          placeholder="Select framework…"
        />
      </div>
    );
  },
};

export const Preselected: Story = {
  render: () => {
    const [value, setValue] = useState('next');
    return (
      <div className="w-64">
        <SimpleCombobox
          options={frameworks}
          value={value}
          onValueChange={setValue}
          label="Framework"
          placeholder="Select framework…"
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="w-64">
      <SimpleCombobox
        options={frameworks}
        value="next"
        label="Framework"
        placeholder="Select framework…"
        disabled
      />
    </div>
  ),
};

export const EmptyState: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="w-64">
        <SimpleCombobox
          options={[]}
          value={value}
          onValueChange={setValue}
          label="Framework"
          placeholder="Select framework…"
          emptyMessage="No frameworks available."
        />
      </div>
    );
  },
};

export const Multiple: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>([]);
    return (
      <div className="w-64">
        <SimpleCombobox
          multiple
          options={frameworks}
          value={values}
          onValueChange={setValues}
          label="Frameworks"
          placeholder="Select frameworks…"
        />
      </div>
    );
  },
};

export const MultiplePreselected: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>(['next', 'remix']);
    return (
      <div className="w-64">
        <SimpleCombobox
          multiple
          options={frameworks}
          value={values}
          onValueChange={setValues}
          label="Frameworks"
          placeholder="Select frameworks…"
        />
      </div>
    );
  },
};
