import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';
import {TooltipProvider} from "@/components/base/tooltip";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: 'hsl(0, 0%, 98%)' },
        { name: 'dark', value: 'hsl(222, 47%, 7%)' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals.backgrounds?.value === 'hsl(222, 47%, 7%)';
      return (
        <div className={isDark ? 'dark' : ''} style={{ padding: '2rem' }}>
          <TooltipProvider>
            <Story />
          </TooltipProvider>
        </div>
      );
    },
  ],
};

export default preview;
