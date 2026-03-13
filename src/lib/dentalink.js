const DENTALINK_URL = process.env.DENTALINK_URL || 'https://api.dentalink.healthatom.com/api/v1';

/**
 * Fetches available slots for a date range from the Dentalink API.
 * @param {string} startDate - "YYYY-MM-DD"
 * @param {string} endDate   - "YYYY-MM-DD"
 * @returns {Promise<Record<string, string[]>>} Map of date → available time slots
 */
export async function getAvailabilityForRange(startDate, endDate) {
  const token = process.env.DENTALINK_TOKEN;
  const sucursalId = process.env.DENTALINK_SUCURSAL_ID;
  const dentistaId = process.env.DENTALINK_DENTISTA_ID || '1';

  if (!token || !sucursalId) {
    throw new Error('Dentalink API not configured');
  }

  const duracion = process.env.DENTALINK_DURACION || '30';

  const params = JSON.stringify({
    fecha_inicio: { eq: startDate },
    fecha_fin: { eq: endDate },
    mostrar_detalles: { eq: '1' },
    duracion: { eq: duracion },
  });

  const url = `${DENTALINK_URL}/sucursales/${sucursalId}/dentistas/${dentistaId}/agendas?q=${encodeURIComponent(params)}`;

  const response = await fetch(url, {
    headers: { Authorization: `Token ${token}` },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Dentalink API error ${response.status}: ${body}`);
  }

  const data = await response.json();
  const fechas = data.data?.fechas || {};

  const result = {};
  for (const [date, dayData] of Object.entries(fechas)) {
    const horas = dayData?.horas || {};
    const slots = Object.keys(horas)
      .filter(hora => {
        const sillones = horas[hora]?.sillones || {};
        const values = Object.values(sillones);
        return values.length > 0 && values.every(val => val === true);
      })
      .sort();
    if (slots.length > 0) {
      result[date] = slots;
    }
  }

  return result;
}
