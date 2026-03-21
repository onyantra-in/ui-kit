import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Combine Tailwind class names, resolving conflicts correctly */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Deterministic HSL color string from any string (e.g. a surname) */
export function stringToHsl(str: string, saturation = 70, lightness = 55): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Returns a consistent { bg, border, text } HSL color triplet for a string.
 * Useful for deterministic per-entity color coding.
 */
export function stringToHslPair(str: string): { bg: string; border: string; text: string } {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return {
    bg: `hsl(${hue}, 65%, 95%)`,
    border: `hsl(${hue}, 65%, 75%)`,
    text: `hsl(${hue}, 65%, 35%)`,
  };
}

/** Format a date string as a human-readable locale date (en-IN) */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Calculate age in whole years from a birth date string (YYYY-MM-DD) */
export function getAge(dateStr: string): number {
  const birth = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}
