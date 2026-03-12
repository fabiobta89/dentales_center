const DENTALINK_URL = process.env.DENTALINK_URL || 'https://api.dentalink.healthatom.com/api/v1';
const MAX_RANGE_DAYS = 14;

async function fetchRange(startDate, endDate, sucursalId, dentistaId, token) {
  const params = JSON.stringify({
    fecha_inicio: { eq: startDate },
    fecha_fin: { eq: endDate },
    mostrar_detalles: { eq: "1" },
  });

  const url = `${DENTALINK_URL}/sucursales/${sucursalId}/dentistas/${dentistaId}/agendas?q=${encodeURIComponent(params)}`;
  console.log(`[availability] Fetching range ${startDate} → ${endDate}`);

  const response = await fetch(url, {
    headers: { Authorization: `Token ${token}` },
  });

  console.log(`[availability] Range ${startDate}→${endDate} status:`, response.status);

  if (!response.ok) {
    const errorData = await response.text();
    console.error(`[availability] Range error:`, errorData);
    return {};
  }

  const data = await response.json();
  console.log(`[availability] Range ${startDate}→${endDate} raw:`, JSON.stringify(data, null, 2));
  return data.data?.fechas || {};
}

export default async function handler(req, res) {
  const { month } = req.query;
  console.log('[availability] Request received, month:', month);

  if (!month) {
    return res.status(400).json({ error: 'month parameter is required (YYYY-MM)' });
  }

  const token = process.env.DENTALINK_TOKEN;
  const sucursalId = process.env.DENTALINK_SUCURSAL_ID;
  const dentistaId = process.env.DENTALINK_DENTISTA_ID || '1';

  console.log('[availability] Config — sucursalId:', sucursalId, 'dentistaId:', dentistaId, 'token present:', !!token);

  if (!token || !sucursalId) {
    console.error('[availability] Missing DENTALINK_TOKEN or DENTALINK_SUCURSAL_ID');
    return res.status(500).json({ error: 'Dentalink API not configured' });
  }

  const [year, m] = month.split('-').map(Number);
  const daysInMonth = new Date(year, m, 0).getDate();

  const today = new Date();
  let startDay;
  if (year === today.getFullYear() && m === today.getMonth() + 1) {
    startDay = today.getDate();
  } else {
    startDay = 1;
  }

  // Split into chunks of MAX_RANGE_DAYS
  const chunks = [];
  let currentDay = startDay;
  while (currentDay <= daysInMonth) {
    const chunkEnd = Math.min(currentDay + MAX_RANGE_DAYS - 1, daysInMonth);
    const start = `${month}-${String(currentDay).padStart(2, '0')}`;
    const end = `${month}-${String(chunkEnd).padStart(2, '0')}`;
    chunks.push({ start, end });
    currentDay = chunkEnd + 1;
  }

  console.log('[availability] Chunks:', chunks);

  try {
    // Fetch all chunks in parallel
    const results = await Promise.all(
      chunks.map(({ start, end }) => fetchRange(start, end, sucursalId, dentistaId, token))
    );

    // Merge all fechas
    const allFechas = {};
    results.forEach(fechas => {
      Object.assign(allFechas, fechas);
    });

    console.log('[availability] All dates found:', Object.keys(allFechas));

    const availability = Object.keys(allFechas)
      .sort()
      .map(date => {
        const horas = allFechas[date]?.horas || {};
        console.log(`[availability] Date ${date} — raw horas:`, JSON.stringify(horas));

        const slots = Object.keys(horas).filter(hora => {
          const sillones = horas[hora]?.sillones || {};
          // Slot is available if ALL chairs (sillones) are free (value === true)
          const values = Object.values(sillones);
          return values.length > 0 && values.every(val => val === true);
        }).sort();

        console.log(`[availability] Date ${date} — available slots:`, slots);
        return { date, slots };
      })
      .filter(d => d.slots.length > 0);

    console.log('[availability] Final availability:', JSON.stringify(availability));
    res.status(200).json({ availability });
  } catch (err) {
    console.error('[availability] Fetch error:', err.message);
    res.status(500).json({ error: 'Error al consultar disponibilidad' });
  }
}
