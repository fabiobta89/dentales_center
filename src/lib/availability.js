// TODO: Replace this with your real availability API endpoint and response mapping
const AVAILABILITY_API_URL = '/api/availability';

/**
 * Fetches available dates and time slots for a given month.
 * @param {string} yearMonth - Format "YYYY-MM"
 * @returns {Promise<{ date: string, slots: string[] }[]>}
 *   Example: [{ date: "2026-03-15", slots: ["08:00", "09:00", "10:00"] }]
 */
export async function fetchAvailability(yearMonth) {
  const res = await fetch(`${AVAILABILITY_API_URL}?month=${yearMonth}`);
  if (!res.ok) throw new Error('Error al consultar disponibilidad');
  const data = await res.json();

  // Map API response to the format the form expects.
  // Adjust this mapping once you know the real API shape.
  return data.availability;
}
