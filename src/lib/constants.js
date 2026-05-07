export const STORAGE_KEYS = {
  entries: 'diary_entries_v2',
  legacyEntries: 'diary_entries_v1',
  lock: 'diary_lock_v1',
  title: 'diary_title_v1',
  theme: 'diary_theme_v1',
  background: 'diary_background_v1',
  lockedSession: 'diary_locked',
};

export const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const shortMonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

export const backdrops = [
  { id: 'plaid', label: 'PLAID' },
  { id: 'greenroom', label: 'GREEN' },
  { id: 'rose', label: 'ROSE' },
  { id: 'midnight', label: 'NIGHT' },
];

export const moods = [
  { emoji: '☀', text: 'feeling good', bg: '#fde8d0', color: '#8b4a1a' },
  { emoji: '🌧', text: 'kind of sad', bg: '#d0e8fd', color: '#1a4a8b' },
  { emoji: '💌', text: 'grateful', bg: '#fdd0e8', color: '#8b1a5a' },
  { emoji: '🌿', text: 'calm', bg: '#d0fde0', color: '#1a6b3a' },
  { emoji: '✨', text: 'inspired', bg: '#f0d0fd', color: '#5a1a8b' },
  { emoji: '😮‍💨', text: 'just okay', bg: '#fdfbd0', color: '#6b6b1a' },
  { emoji: '🔥', text: 'chaotic', bg: '#ffd0d0', color: '#8b1a1a' },
  { emoji: '🌙', text: 'tired', bg: '#d0d0fd', color: '#1a1a8b' },
];

export const tracks = [
  { name: 'lofi morning haze', key: 261.63, mode: 'minor' },
  { name: 'cafe piano · slow', key: 293.66, mode: 'major' },
  { name: 'midnight amber', key: 220, mode: 'minor' },
  { name: 'tape hiss & keys', key: 246.94, mode: 'major' },
  { name: 'rain window jazz', key: 196, mode: 'minor' },
];
