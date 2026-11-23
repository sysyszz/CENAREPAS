const BOGOTA_TIME_ZONE = 'America/Bogota';
const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DATE_PREFIX_PATTERN = /^(\d{4})-(\d{2})-(\d{2})/;
const LOCAL_DATE_TIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/;
const BOGOTA_DATE_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  timeZone: BOGOTA_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

function isValidDateParts(year, month, day) {
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

function getBogotaDateParts(value) {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;

    const dateOnlyMatch = DATE_ONLY_PATTERN.exec(trimmed);
    if (dateOnlyMatch) {
      const [, year, month, day] = dateOnlyMatch.map(Number);
      return isValidDateParts(year, month, day) ? { year, month, day } : null;
    }

    const datePrefixMatch = DATE_PREFIX_PATTERN.exec(trimmed);
    if (datePrefixMatch) {
      const [, year, month, day] = datePrefixMatch.map(Number);
      if (!isValidDateParts(year, month, day)) return null;
    }

    const dateValue = LOCAL_DATE_TIME_PATTERN.test(trimmed) ? `${trimmed}-05:00` : trimmed;
    value = dateValue;
  }

  if (!(value instanceof Date) && typeof value !== 'string' && typeof value !== 'number') {
    return null;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const parts = BOGOTA_DATE_FORMATTER.formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value: partValue }) => [type, partValue]));
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
  };
}

export function formatDate(value, { forInput = false } = {}) {
  const parts = getBogotaDateParts(value);
  if (!parts) return forInput ? '' : '—';

  const year = String(parts.year).padStart(4, '0');
  const month = String(parts.month).padStart(2, '0');
  const day = String(parts.day).padStart(2, '0');

  return forInput ? `${year}-${month}-${day}` : `${day}/${month}/${year}`;
}
