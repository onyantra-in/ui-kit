import { useEffect, useRef, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '../lib/utils';

export interface NetworkStatusBarProps {
  /** How long the "back online" bar stays visible after reconnecting. Defaults to 2000ms. */
  onlineVisibleMs?: number;
  offlineMessage?: string;
  onlineMessage?: string;
  className?: string;
}

type Status = 'online' | 'offline' | 'restored';

/**
 * Top bar showing connectivity. Shown persistently while offline; once the
 * connection returns it shows the online message briefly, then hides.
 */
export function NetworkStatusBar({
  onlineVisibleMs = 2000,
  offlineMessage = "You're offline. Changes can't be saved until you reconnect.",
  onlineMessage = 'Back online',
  className,
}: NetworkStatusBarProps) {
  const [status, setStatus] = useState<Status>(() =>
    typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'online',
  );
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    function handleOffline() {
      clearTimeout(timer.current);
      setStatus('offline');
    }
    function handleOnline() {
      clearTimeout(timer.current);
      setStatus('restored');
      timer.current = setTimeout(() => setStatus('online'), onlineVisibleMs);
    }
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      clearTimeout(timer.current);
    };
  }, [onlineVisibleMs]);

  if (status === 'online') return null;

  const offline = status === 'offline';
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-center justify-center gap-2 px-4 py-1.5 text-sm font-medium shrink-0',
        offline ? 'bg-destructive text-destructive-foreground' : 'bg-green-600 text-white',
        className,
      )}
    >
      {offline ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
      {offline ? offlineMessage : onlineMessage}
    </div>
  );
}
