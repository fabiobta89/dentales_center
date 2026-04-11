const COLOMBIA_DIAL_CODE = '57';

/**
 * Strips formatting characters from a raw phone string.
 * Preserves a leading + as a signal that a country code is already present.
 */
function cleanRaw(raw) {
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');
  return hasPlus ? '+' + digits : digits;
}

/**
 * Converts a raw phone string to E.164 format (e.g. "+573246044584").
 * Defaults to Colombia (+57) when no country code can be determined.
 *
 * Detection order:
 *  1. Already E.164 (starts with +, 8–15 digits total)  → return as-is
 *  2. Starts with "00" (international access code)       → replace 00 with +
 *  3. 12 digits starting with "57"                       → Colombian with code, prepend +
 *  4. 10 digits starting with 3 (mobile) or 6 (landline) → Colombian, prepend +57
 *  5. Fallback                                           → prepend +57 and validate length
 *
 * @param {string} raw - Raw user input
 * @returns {string} E.164 phone string
 * @throws {Error} if the normalised result fails E.164 length validation (+7–15 digits)
 */
export function normalizeToE164(raw) {
  if (!raw || !raw.trim()) throw new Error('Phone number is required');

  const cleaned = cleanRaw(raw);

  // Rule 1: already E.164
  if (/^\+[1-9]\d{6,14}$/.test(cleaned)) {
    return cleaned;
  }

  // Rule 2: international access code 00 → +
  if (cleaned.startsWith('00')) {
    const e164 = '+' + cleaned.slice(2);
    if (!/^\+[1-9]\d{6,14}$/.test(e164)) {
      throw new Error(`Invalid phone number: "${raw}"`);
    }
    return e164;
  }

  const digits = cleaned.replace(/\D/g, '');

  // Rule 3: 12 digits starting with 57 → +57XXXXXXXXXX
  if (/^57\d{10}$/.test(digits)) {
    return '+' + digits;
  }

  // Rule 4: 10-digit Colombian number (mobile 3XX or landline 6XX)
  if (/^[36]\d{9}$/.test(digits)) {
    return '+' + COLOMBIA_DIAL_CODE + digits;
  }

  // Rule 5: fallback — assume Colombia, require at least 7 raw digits
  if (digits.length < 7) {
    throw new Error(`Invalid phone number: "${raw}"`);
  }
  const fallback = '+' + COLOMBIA_DIAL_CODE + digits;
  if (!/^\+[1-9]\d{6,14}$/.test(fallback)) {
    throw new Error(`Invalid phone number: "${raw}"`);
  }
  return fallback;
}

/**
 * Returns true if the raw string can be normalised to a valid E.164 number.
 * Accepts any input that survives normalizeToE164 without throwing.
 *
 * @param {string} raw
 * @returns {boolean}
 */
export function isValidPhone(raw) {
  if (!raw || raw.trim().length < 7) return false;
  try {
    normalizeToE164(raw);
    return true;
  } catch {
    return false;
  }
}

/**
 * Formats a phone number for human display.
 * Accepts E.164 or raw input; normalises internally before formatting.
 *
 * "+573246044584" → "+57 (324) 604 4584"
 * Falls back to the raw string for unrecognised formats.
 *
 * @param {string} phone
 * @returns {string}
 */
export function formatDisplay(phone) {
  if (!phone) return '';

  let e164 = phone;
  try {
    e164 = normalizeToE164(phone);
  } catch {
    return phone;
  }

  // Colombian: +57 followed by exactly 10 digits
  const colombian = e164.match(/^\+57(\d{10})$/);
  if (colombian) {
    const n = colombian[1];
    return `+57 (${n.slice(0, 3)}) ${n.slice(3, 6)} ${n.slice(6)}`;
  }

  // Non-Colombian E.164: return as-is (country code boundaries vary by region)
  return e164;
}
