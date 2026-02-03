import { translations } from './src/i18n/translations';

// Explicitly check properties exists
const en = translations.en;
const ar = translations.ar;

const enAddons = en.addons; // Should imply error if missing
const arAddons = ar.addons; // Should imply error if missing

// Check common type
const t = translations['en'];
const tAddons = t.addons;
