import { days, months, shortMonths } from './constants.js';

export function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayKey() {
  return dateKey(new Date());
}

export function formatShort(iso) {
  const date = new Date(`${iso}T00:00:00`);
  return `${shortMonths[date.getMonth()]} ${date.getDate()}`;
}

export function formatLong(iso) {
  const date = new Date(`${iso}T00:00:00`);
  return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
}

export function formatToolbarDate(date = new Date()) {
  return `${days[date.getDay()].slice(0, 3)} · ${shortMonths[date.getMonth()]} ${date.getDate()} · ${date.getFullYear()}`;
}

export function monthLabel(iso) {
  const date = new Date(`${iso}T00:00:00`);
  return months[date.getMonth()].slice(0, 3).toUpperCase();
}
