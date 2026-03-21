import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { VoiceMicButton } from '../components/VoiceMicButton';

const meta: Meta<typeof VoiceMicButton> = {
  title: 'Components/VoiceMicButton',
  component: VoiceMicButton,
  tags: ['autodocs'],
  argTypes: {
    lang: { control: 'select', options: ['en-IN', 'hi-IN', 'en-US'] },
  },
};

export default meta;
type Story = StoryObj<typeof VoiceMicButton>;

export const Default: Story = {
  render: (args) => {
    const [transcript, setTranscript] = useState('');
    return (
      <div className="flex items-center gap-3">
        <VoiceMicButton {...args} onTranscript={setTranscript} />
        {transcript && (
          <span className="text-sm text-foreground bg-muted px-3 py-1.5 rounded-lg">
            "{transcript}"
          </span>
        )}
        {!transcript && (
          <span className="text-sm text-muted-foreground">Click mic to speak</span>
        )}
      </div>
    );
  },
  args: { lang: 'en-IN' },
};
