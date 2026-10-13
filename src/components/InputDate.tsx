import { createContext, forwardRef, useContext, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, InputHTMLAttributes } from 'react';
import { CalendarIcon } from 'lucide-react';
import { parseISO } from 'date-fns';
import { Button } from './base/button';
import { Calendar } from './base/calendar';
import { Input } from './base/input';
import { Popover, PopoverContent, PopoverTrigger } from './base/popover';
import { cn } from '../lib/utils';
import {
  MAX_YEAR,
  MIN_YEAR,
  checkDateBounds,
  isoToDisplay,
  parseDateText,
  sanitizeDateText,
} from '../lib/date-input';

export interface InputDateProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange' | 'min' | 'max'> {
  /** ISO yyyy-MM-dd (or ISO datetime); '' when empty. */
  value?: string | null;
  /**
   * Drop-in for <input type="date"> handlers: `e.target.value` is ISO yyyy-MM-dd, or '' while the text is
   * empty / incomplete / invalid / out of bounds. Never a broken date.
   */
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  /**
   * 'fy' (default) limits to the range supplied by <InputDateBoundsProvider> (the active financial year; use for
   * transaction dates). 'none' only enforces 2000-2100.
   */
  bounds?: 'fy' | 'none';
  /** Extra ISO limits, intersected with `bounds`. */
  min?: string;
  max?: string;
  /** Overrides the out-of-range wording. Defaults to the provider's label, else "min to max". */
  boundsLabel?: string;
}

export interface InputDateBounds {
  /** ISO yyyy-MM-dd. */
  min?: string;
  max?: string;
  /** Wording for the out-of-range error, e.g. "FY 2025-26 (01/04/2025 to 31/03/2026)". */
  label?: string;
}

const InputDateBoundsContext = createContext<InputDateBounds | null>(null);

/** Supplies the range that `bounds="fy"` resolves to for every InputDate below it. */
export const InputDateBoundsProvider = InputDateBoundsContext.Provider;

const localISODate = (date: Date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const clampRange = (lo?: string, hi?: string) => ({
  min: lo && lo > `${MIN_YEAR}-01-01` ? lo : `${MIN_YEAR}-01-01`,
  max: hi && hi < `${MAX_YEAR}-12-31` ? hi : `${MAX_YEAR}-12-31`,
});

export const InputDate = forwardRef<HTMLInputElement, InputDateProps>(function InputDate(
  { value, onChange, bounds = 'fy', min, max, boundsLabel, className, disabled, name, onBlur, placeholder, ...rest },
  ref,
) {
  const fy = useContext(InputDateBoundsContext);
  const fyMin = bounds === 'fy' ? fy?.min : undefined;
  const fyMax = bounds === 'fy' ? fy?.max : undefined;
  const limits = clampRange(
    [fyMin, min].filter(Boolean).sort().pop(),
    [fyMax, max].filter(Boolean).sort()[0],
  );
  const label = boundsLabel ?? (bounds === 'fy' && fy?.min && fy.max ? fy.label : undefined);
  const [text, setText] = useState(() => isoToDisplay(value));
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  // Last ISO value the parent holds, so blur can skip a redundant emit (a re-render while focus moves can lose focus).
  const lastIso = useRef((value ?? '').slice(0, 10));

  // Follow outside changes (form reset, edit load, calendar pick) without clobbering what the user is typing.
  useEffect(() => {
    const parsed = parseDateText(text);
    const current = parsed.ok ? parsed.iso : '';
    const incoming = (value ?? '').slice(0, 10);
    lastIso.current = incoming;
    if (incoming !== current) {
      setText(isoToDisplay(incoming));
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const emit = (iso: string) => {
    lastIso.current = iso;
    onChange?.({ target: { value: iso, name }, currentTarget: { value: iso, name }, type: 'change' } as unknown as ChangeEvent<HTMLInputElement>);
  };

  const validate = (t: string): { iso: string; err: string | null } => {
    const r = parseDateText(t);
    if (r.ok) {
      const boundsErr = checkDateBounds(r.iso, limits, label);
      return boundsErr ? { iso: '', err: boundsErr } : { iso: r.iso, err: null };
    }
    switch (r.reason) {
      case 'empty': return { iso: '', err: null };
      case 'ambiguous':
        return { iso: '', err: `Could be ${r.options.map(isoToDisplay).join(' or ')}. Type it as dd/mm/yyyy` };
      case 'invalid': return { iso: '', err: 'Not a valid date. Use dd/mm/yyyy' };
      default: return { iso: '', err: 'Incomplete date. Use dd/mm/yyyy' };
    }
  };

  const handleText = (e: ChangeEvent<HTMLInputElement>) => {
    let next = sanitizeDateText(e.target.value);
    // Eight bare digits can only be ddmmyyyy: show it formatted straight away.
    if (/^\d{8}$/.test(next)) {
      const r = parseDateText(next);
      if (r.ok) next = isoToDisplay(r.iso);
    }
    setText(next);
    // Keep the form value current on every keystroke (so Ctrl+S without leaving the box saves it), but only show
    // an error once the entry looks finished; mid-typing "25/08/20" must not flash an out-of-range error.
    const { iso, err } = validate(next);
    const finished = next.length === 0 || next.length === 10;
    setError(finished ? err : null);
    emit(iso);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Expand short forms ("25/08/26", "15126") to dd/mm/yyyy once the user leaves the box.
    const r = parseDateText(text);
    const next = r.ok ? isoToDisplay(r.iso) : text;
    const { iso, err } = validate(next);
    if (iso !== lastIso.current) emit(iso);
    onBlur?.(e);
    // Apply the visible changes after focus has landed. Mid-blur, document.activeElement is <body>; removing a DOM node
    // right then (the "= dd/mm/yyyy" hint) makes a dialog's focus trap pull focus back to the dialog start.
    setTimeout(() => {
      setText((cur) => (cur === text ? next : cur));
      setError(err);
    }, 0);
  };

  // Live reading of a short entry, so the user sees what "15126" will become before leaving the box.
  const live = parseDateText(text);
  const hint =
    live.ok && isoToDisplay(live.iso) !== text && !checkDateBounds(live.iso, limits, label)
      ? `= ${isoToDisplay(live.iso)}`
      : null;

  // A value that arrives already out of bounds (e.g. default "today" while an older FY is active) is flagged too.
  const incoming = parseDateText(isoToDisplay(value));
  const incomingErr = incoming.ok ? checkDateBounds(incoming.iso, limits, label) : null;
  const shownError = error ?? incomingErr;

  const selected = (() => {
    const r = parseDateText(text);
    return r.ok ? parseISO(r.iso) : undefined;
  })();

  return (
    <div className="space-y-1">
      <div className="relative">
        <Input
          {...rest}
          ref={ref}
          name={name}
          inputMode="numeric"
          autoComplete="off"
          placeholder={placeholder ?? 'dd/mm/yyyy'}
          maxLength={10}
          disabled={disabled}
          value={text}
          onChange={handleText}
          onBlur={handleBlur}
          aria-invalid={!!shownError}
          className={cn('pr-9', shownError && 'border-destructive focus-visible:ring-destructive', className)}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              tabIndex={-1}
              disabled={disabled}
              aria-label="Open calendar"
              className="absolute right-0 top-0 h-full w-9 text-muted-foreground"
            >
              <CalendarIcon className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selected}
              defaultMonth={selected ?? (limits.min > localISODate() || limits.max < localISODate() ? parseISO(limits.min) : undefined)}
              disabled={{ before: parseISO(limits.min), after: parseISO(limits.max) }}
              onSelect={(d) => {
                if (!d) return;
                const iso = localISODate(d);
                setText(isoToDisplay(iso));
                setError(null);
                emit(iso);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      {shownError ? (
        <p className="text-xs text-destructive">{shownError}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
});
