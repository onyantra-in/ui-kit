import { Mic, MicOff, Square } from 'lucide-react';
import { useVoiceInput } from '@/hooks/useVoiceInput';

export interface VoiceMicButtonProps {
  /** Called when a transcript is successfully received */
  onTranscript: (text: string) => void;
  /** BCP-47 language code, e.g. 'hi-IN' or 'en-IN'. Defaults to 'en-IN'. */
  lang?: string;
  className?: string;
  /** Accessible label shown while idle (default: "Tap to speak") */
  tapToSpeakLabel?: string;
  /** Accessible label shown while listening (default: "Stop listening") */
  stopListeningLabel?: string;
  /** Tooltip when the browser doesn't support the Speech API (default: "Voice input not supported") */
  notSupportedLabel?: string;
}

/**
 * Tap to start / stop voice recording.
 *
 * - Idle      → grey mic icon
 * - Listening → pulsing red mic + stop square
 * - Error     → grey mic-off icon
 */
export function VoiceMicButton({
  onTranscript,
  lang = 'en-IN',
  className = '',
  tapToSpeakLabel = 'Tap to speak',
  stopListeningLabel = 'Stop listening',
  notSupportedLabel = 'Voice input not supported',
}: VoiceMicButtonProps) {
  const { state, errorMessage, isSupported, toggle } = useVoiceInput({
    lang,
    onTranscript,
  });

  if (!isSupported) {
    return (
      <button
        type="button"
        disabled
        title={notSupportedLabel}
        className={`flex items-center justify-center w-7 h-7 rounded-full text-gray-300 cursor-not-allowed ${className}`}
        aria-label={notSupportedLabel}
      >
        <MicOff size={14} />
      </button>
    );
  }

  const isListening = state === 'listening';
  const isError = state === 'error';

  return (
    <button
      type="button"
      onClick={toggle}
      title={
        isListening
          ? stopListeningLabel
          : isError
          ? (errorMessage ?? tapToSpeakLabel)
          : tapToSpeakLabel
      }
      aria-label={isListening ? stopListeningLabel : tapToSpeakLabel}
      className={[
        'flex items-center justify-center w-7 h-7 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary',
        isListening
          ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-200'
          : isError
          ? 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          : 'bg-gray-100 text-gray-500 hover:bg-primary/10 hover:text-primary',
        className,
      ].join(' ')}
    >
      {isListening ? <Square size={12} /> : isError ? <MicOff size={14} /> : <Mic size={14} />}
    </button>
  );
}
