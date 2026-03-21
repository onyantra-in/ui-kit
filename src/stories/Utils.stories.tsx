import type { Meta, StoryObj } from '@storybook/react';
import { stringToHslPair, formatDate, getAge } from '../lib/utils';

const meta = {
  title: 'Utilities/Color & Date',
} satisfies Meta;

export default meta;
type Story = StoryObj;

const names = ['Toshniwal', 'Sharma', 'Gupta', 'Mehta', 'Patel', 'Verma', 'Singh', 'Yadav'];

export const StringToHslPair: Story = {
  name: 'stringToHslPair',
  render: () => (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground mb-4">
        Deterministic HSL color triplet from a string — consistent across renders.
      </p>
      <div className="flex flex-wrap gap-2">
        {names.map((name) => {
          const { bg, border, text } = stringToHslPair(name);
          return (
            <span
              key={name}
              className="px-3 py-1 rounded-full text-sm font-medium border"
              style={{ background: bg, borderColor: border, color: text }}
            >
              {name}
            </span>
          );
        })}
      </div>
    </div>
  ),
};

export const FormatDate: Story = {
  name: 'formatDate / getAge',
  render: () => {
    const dates = ['1990-03-21', '2000-12-01', '1975-07-04'];
    return (
      <table className="text-sm border-collapse w-full max-w-md">
        <thead>
          <tr className="text-left text-muted-foreground border-b border-border">
            <th className="pb-2 pr-4">Raw</th>
            <th className="pb-2 pr-4">Formatted</th>
            <th className="pb-2">Age</th>
          </tr>
        </thead>
        <tbody>
          {dates.map((d) => (
            <tr key={d} className="border-b border-border">
              <td className="py-2 pr-4 text-muted-foreground">{d}</td>
              <td className="py-2 pr-4">{formatDate(d)}</td>
              <td className="py-2">{getAge(d)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  },
};
