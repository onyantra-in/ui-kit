export const MIN_YEAR = 2000;
export const MAX_YEAR = 2100;

export type DateParseResult =
  | { ok: true; iso: string }
  | { ok: false; reason: 'empty' | 'incomplete' | 'invalid' }
  | { ok: false; reason: 'ambiguous'; options: string[] };

const pad = (n: number) => String(n).padStart(2, '0');

/** Keep digits and the separators / - . only, max 10 chars. No slashes are inserted: "15126" must stay "15126". */
export function sanitizeDateText(raw: string): string {
  return raw.replace(/[^\d/.\-]/g, '').slice(0, 10);
}

/** Real calendar date with year 2000-2100 -> ISO, else null. A 2-digit `yearText` means 20yy; "0026" is rejected. */
function buildIso(day: number, month: number, yearText: string): string | null {
  const y = yearText.length === 2 ? 2000 + Number(yearText) : Number(yearText);
  if (y < MIN_YEAR || y > MAX_YEAR) return null;
  const d = new Date(y, month - 1, day);
  if (d.getFullYear() !== y || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
  return `${y}-${pad(month)}-${pad(day)}`;
}

// Digit-only entry: every way to cut the digits into [day, month, year] widths.
const DIGIT_SPLITS: Record<number, number[][]> = {
  5: [[2, 1, 2], [1, 2, 2]],
  6: [[2, 2, 2], [1, 1, 4]],
  7: [[2, 1, 4], [1, 2, 4]],
  8: [[2, 2, 4]],
};

/**
 * Parse user text into ISO yyyy-MM-dd.
 * Accepts dd/mm/yyyy, d/m/yy (separators / - .), pasted yyyy-MM-dd, and digits only (5-8 digits, e.g. 15126 ->
 * 15/01/2026, 250826, 25082026). A digit string is accepted only when exactly one split gives a real date;
 * otherwise it is reported ambiguous rather than guessed.
 */
export function parseDateText(text: string): DateParseResult {
  const t = text.trim();
  if (!t) return { ok: false, reason: 'empty' };

  const isoM = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  if (isoM) {
    const iso = buildIso(Number(isoM[3]), Number(isoM[2]), isoM[1]);
    return iso ? { ok: true, iso } : { ok: false, reason: 'invalid' };
  }

  const sep = /^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2}|\d{4})$/.exec(t);
  if (sep) {
    const iso = buildIso(Number(sep[1]), Number(sep[2]), sep[3]);
    return iso ? { ok: true, iso } : { ok: false, reason: 'invalid' };
  }

  if (/^\d+$/.test(t)) {
    const splits = DIGIT_SPLITS[t.length];
    if (!splits) return { ok: false, reason: t.length > 8 ? 'invalid' : 'incomplete' };
    const found = new Set<string>();
    for (const [dw, mw, yw] of splits) {
      const iso = buildIso(Number(t.slice(0, dw)), Number(t.slice(dw, dw + mw)), t.slice(dw + mw, dw + mw + yw));
      if (iso) found.add(iso);
    }
    if (found.size === 1) return { ok: true, iso: [...found][0] };
    if (found.size > 1) return { ok: false, reason: 'ambiguous', options: [...found] };
    return { ok: false, reason: 'invalid' };
  }

  return { ok: false, reason: 'incomplete' };
}

/** ISO yyyy-MM-dd (or ISO datetime) -> "dd/mm/yyyy"; anything else -> "". */
export function isoToDisplay(iso: string | null | undefined): string {
  if (!iso) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : '';
}

export function displayDate(iso: string): string {
  return isoToDisplay(iso);
}

export interface DateBounds {
  min?: string;
  max?: string;
}

/** Returns an error message if iso is outside bounds, else null. ISO strings compare lexicographically. */
export function checkDateBounds(iso: string, { min, max }: DateBounds, boundsLabel?: string): string | null {
  const where = boundsLabel ?? `${isoToDisplay(min)} to ${isoToDisplay(max)}`;
  if ((min && iso < min) || (max && iso > max)) return `Date must be within ${where}`;
  return null;
}
