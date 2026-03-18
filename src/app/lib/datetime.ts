import { format, parseISO, isValid } from 'date-fns';

function parseDateLike(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return isValid(value) ? value : null;

  if (typeof value === 'number') {
    const d = new Date(value);
    return isValid(d) ? d : null;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    try {
      const d = parseISO(trimmed);
      if (isValid(d)) return d;
    } catch {
      // fall through
    }
    const d = new Date(trimmed);
    return isValid(d) ? d : null;
  }

  return null;
}

function formatTimeValue(value: unknown): string | null {
  const d = parseDateLike(value);
  if (d) return format(d, 'h:mm a');

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;

    // Time-only values: "HH:mm" or "HH:mm:ss"
    const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
    if (match) {
      const hours = Number(match[1]);
      const minutes = Number(match[2]);
      if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
      const base = new Date();
      base.setHours(hours, minutes, 0, 0);
      return format(base, 'h:mm a');
    }
  }

  return null;
}

export function formatHumanDate(value: unknown): string {
  const d = parseDateLike(value);
  if (!d) return String(value ?? '');
  return format(d, 'EEE, MMM d, yyyy');
}

export function formatHumanTime(value: unknown): string {
  return formatTimeValue(value) ?? String(value ?? '');
}

export function formatHumanTimeRange(value: unknown): string {
  if (value == null) return '';

  if (typeof value === 'string') {
    const trimmed = value.trim();
    const parts = trimmed.split('-').map((p) => p.trim()).filter(Boolean);
    if (parts.length === 2) {
      const start = formatTimeValue(parts[0]) ?? parts[0];
      const end = formatTimeValue(parts[1]) ?? parts[1];
      return `${start} \u2013 ${end}`;
    }
  }

  return formatHumanTime(value);
}

export function formatHumanDateTime(value: unknown): string {
  const d = parseDateLike(value);
  if (!d) return String(value ?? '');
  return `${format(d, 'EEE, MMM d, yyyy')} \u2022 ${format(d, 'h:mm a')}`;
}

export function formatHumanDateSmart(value: unknown): string {
  if (value instanceof Date) {
    if (!isValid(value)) return String(value ?? '');
    const hasTime =
      value.getHours() !== 0 ||
      value.getMinutes() !== 0 ||
      value.getSeconds() !== 0 ||
      value.getMilliseconds() !== 0;
    return hasTime ? formatHumanDateTime(value) : formatHumanDate(value);
  }

  if (typeof value === 'number') {
    const d = new Date(value);
    if (!isValid(d)) return String(value ?? '');
    const hasTime =
      d.getHours() !== 0 ||
      d.getMinutes() !== 0 ||
      d.getSeconds() !== 0 ||
      d.getMilliseconds() !== 0;
    return hasTime ? formatHumanDateTime(d) : formatHumanDate(d);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return '';

    // Detect ISO-like datetime strings, e.g. "2025-08-10T08:00:00.000"
    const looksLikeDateTime = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(trimmed);
    return looksLikeDateTime ? formatHumanDateTime(trimmed) : formatHumanDate(trimmed);
  }

  return formatHumanDate(value);
}
