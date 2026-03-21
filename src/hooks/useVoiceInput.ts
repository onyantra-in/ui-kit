import { useCallback, useEffect, useRef, useState } from 'react';

type VoiceState = 'idle' | 'listening' | 'processing' | 'error';

export interface UseVoiceInputOptions {
  lang?: string;
  onTranscript: (text: string) => void;
  onError?: (message: string) => void;
}

export interface UseVoiceInputReturn {
  state: VoiceState;
  errorMessage: string | null;
  isSupported: boolean;
  toggle: () => void;
  stop: () => void;
}

// Safely resolve SpeechRecognition across browsers (Chrome, Safari)
function getSpeechRecognitionCtor(): (new () => SpeechRecognition) | null {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

export function useVoiceInput({
  lang = 'en-IN',
  onTranscript,
  onError,
}: UseVoiceInputOptions): UseVoiceInputReturn {
  const [state, setState] = useState<VoiceState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isSupported = Boolean(getSpeechRecognitionCtor());

  // Clean up on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setState('idle');
  }, []);

  const start = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      const msg = 'Voice input is not supported on this browser';
      setErrorMessage(msg);
      onError?.(msg);
      setState('error');
      return;
    }

    // Abort any active session
    recognitionRef.current?.abort();

    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      setState('listening');
      setErrorMessage(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript ?? '';
      setState('idle');
      if (transcript.trim()) {
        onTranscript(transcript.trim());
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      let msg: string;
      switch (event.error) {
        case 'not-allowed':
        case 'permission-denied':
          msg = 'Microphone access was denied. Please allow mic permission and try again.';
          break;
        case 'no-speech':
          // Reset silently on no-speech
          setState('idle');
          recognitionRef.current = null;
          return;
        case 'network':
          msg = 'Network error. Please check your connection.';
          break;
        default:
          msg = `Voice error: ${event.error}`;
      }
      setErrorMessage(msg);
      onError?.(msg);
      setState('error');
    };

    recognition.onend = () => {
      setState((prev) => (prev === 'listening' ? 'idle' : prev));
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      const msg = 'Could not start voice input';
      setErrorMessage(msg);
      onError?.(msg);
      setState('error');
    }
  }, [lang, onTranscript, onError]);

  const toggle = useCallback(() => {
    if (state === 'listening') {
      stop();
    } else {
      setErrorMessage(null);
      start();
    }
  }, [state, start, stop]);

  return { state, errorMessage, isSupported, toggle, stop };
}
