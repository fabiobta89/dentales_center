import { getAvailabilityForRange } from '@/lib/dentalink';
import { withApiKey } from '@/lib/withApiKey';

const ALTERNATIVES_DAYS = 13; // look-ahead window: date + 13 = 14-day range (Dentalink API max)
const MAX_ALTERNATIVE_DAYS = 3; // max alternative days returned when slot is unavailable

function addDays(dateStr, n) {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

/**
 * POST /api/booking/check-availability
 *
 * Body:
 *   { date: "YYYY-MM-DD", time?: "HH:MM" }
 *
 * Responses:
 *   Slot available:
 *     { available: true, date: "YYYY-MM-DD", time: "HH:MM" }
 *
 *   Slot unavailable (or time not provided):
 *     { available: false, requested: { date, time }, alternatives: [{ date, slots }] }
 *
 *   Date with no time — returns slots for that day (or alternatives):
 *     { available: true, date, slots: ["HH:MM", ...] }
 *     { available: false, requested: { date }, alternatives: [{ date, slots }] }
 */
export default withApiKey(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { date, time } = req.body || {};

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'date is required (YYYY-MM-DD)' });
  }

  if (time && !/^\d{2}:\d{2}$/.test(time)) {
    return res.status(400).json({ error: 'time must be HH:MM' });
  }

  const today = new Date().toISOString().slice(0, 10);
  if (date < today) {
    return res.status(400).json({ error: 'date cannot be in the past' });
  }

  try {
    const rangeEnd = addDays(date, ALTERNATIVES_DAYS);
    const availability = await getAvailabilityForRange(date, rangeEnd);

    const requestedSlots = availability[date] || [];

    // Case: specific slot requested
    if (time) {
      if (requestedSlots.includes(time)) {
        return res.status(200).json({ available: true, date, time });
      }

      // Slot unavailable — build alternatives
      const alternatives = buildAlternatives(availability, date, requestedSlots);
      return res.status(200).json({
        available: false,
        requested: { date, time },
        alternatives,
      });
    }

    // Case: only date requested — return available slots for that day
    if (requestedSlots.length > 0) {
      return res.status(200).json({ available: true, date, slots: requestedSlots });
    }

    const alternatives = buildAlternatives(availability, date, []);
    return res.status(200).json({
      available: false,
      requested: { date },
      alternatives,
    });
  } catch (err) {
    console.error('[booking/check-availability]', err.message);
    return res.status(500).json({ error: 'Error checking availability' });
  }
});

/**
 * Returns same-day remaining slots (if any) + next available days, up to MAX_ALTERNATIVE_DAYS total.
 */
function buildAlternatives(availability, requestedDate, sameDaySlots) {
  const alternatives = [];

  if (sameDaySlots.length > 0) {
    alternatives.push({ date: requestedDate, slots: sameDaySlots });
  }

  const futureDates = Object.keys(availability)
    .filter(d => d > requestedDate)
    .sort();

  for (const d of futureDates) {
    if (alternatives.length >= MAX_ALTERNATIVE_DAYS) break;
    alternatives.push({ date: d, slots: availability[d] });
  }

  return alternatives;
}
