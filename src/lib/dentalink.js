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

/**
 * Creates an appointment (cita) in the Dentalink software.
 * @param {Object} appointment - { date, time, motivo_atencion_id?, paciente_id? }
 * @returns {Promise<Object>} The created appointment data from Dentalink
 */
export async function createAppointmentInDentalink({ date, time, motivo_atencion_id, paciente_id }) {
  const token = process.env.DENTALINK_TOKEN;
  const sucursalId = process.env.DENTALINK_SUCURSAL_ID;
  const dentistaId = process.env.DENTALINK_DENTISTA_ID || '1';
  const duracion = process.env.DENTALINK_DURACION || '30';

  if (!token || !sucursalId) {
    throw new Error('Dentalink API not configured');
  }

  const url = `${DENTALINK_URL}/citas`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id_sucursal: parseInt(sucursalId, 10),
      id_dentista: parseInt(dentistaId, 10),
      id_paciente: paciente_id || 1,
      fecha: date,
      hora_inicio: time,
      duracion: parseInt(duracion, 10),
      id_motivo_atencion: motivo_atencion_id || null,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Dentalink API error ${response.status}: ${body}`);
  }

  const data = await response.json();
  return data.data || data;
}

/**
 * Gets available motivos de atencion (attention reasons) for a dentist.
 * @returns {Promise<Array>} Array of motivos with id, name, duration, color
 */
export async function getMotivosDeAtencion() {
  const token = process.env.DENTALINK_TOKEN;
  const dentistaId = process.env.DENTALINK_DENTISTA_ID || '1';

  if (!token) {
    throw new Error('Dentalink API not configured');
  }

  const url = `${DENTALINK_URL}/dentistas/${dentistaId}/motivosAtencion`;

  const response = await fetch(url, {
    headers: { Authorization: `Token ${token}` },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Dentalink API error ${response.status}: ${body}`);
  }

  const data = await response.json();
  return data.data || [];
}

/**
 * Normalizes a phone number to try different formats for search.
 * Strips country codes like +57, 57, +1, 1 and tries variations.
 */
function getPhoneVariations(phone) {
  if (!phone) return [];

  const variations = new Set();

  // Clean the phone - remove spaces, dashes, parentheses
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // If starts with +, remove it
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }

  // Add original with + prefix
  variations.add('+' + cleaned);

  // If starts with 57 (Colombia code), try without
  if (cleaned.startsWith('57')) {
    const without57 = cleaned.substring(2);
    variations.add(without57);
    variations.add('+57' + without57);
    variations.add('57' + without57);
  }

  // If it's a mobile number starting with 3 (Colombia), try adding +57
  if (/^3\d{9}$/.test(cleaned)) {
    variations.add('+57' + cleaned);
    variations.add('57' + cleaned);
  }

  // If starts with 1 (US/Colombia), try adding +57 or 57
  if (cleaned.startsWith('1') && cleaned.length === 10) {
    variations.add('+57' + cleaned.substring(1));
    variations.add('57' + cleaned.substring(1));
  }

  // If it's a short number (10 digits without country code), try all Colombian formats
  if (/^\d{10}$/.test(cleaned)) {
    variations.add('+57' + cleaned);
    variations.add('57' + cleaned);
  }

  // Try just the digits without any country code
  const digitsOnly = cleaned.replace(/\D/g, '');
  variations.add(digitsOnly);

  // If 10 digits starting with 3, likely Colombian mobile
  if (/^3\d{9}$/.test(digitsOnly)) {
    variations.add('+57' + digitsOnly);
    variations.add('57' + digitsOnly);
  }

  return [...variations];
}

/**
 * Searches for a patient by phone, id (cedula), or email. If not found, creates a new patient.
 * @param {Object} params - { phone, name, id?, email? }
 * @returns {Promise<Object>} The patient data from Dentalink with id
 */
export async function getOrCreatePatient({ phone, name, id, email }) {
  const token = process.env.DENTALINK_TOKEN;

  if (!token) {
    throw new Error('Dentalink API not configured');
  }

  // Try to find by phone first (required), then id, then email
  const searchPhone = async () => {
    if (!phone) return null;

    const phoneVariations = getPhoneVariations(phone);

    for (const phoneVariant of phoneVariations) {
      const url = `${DENTALINK_URL}/pacientes?q=${encodeURIComponent(JSON.stringify({ celular: { eq: phoneVariant } }))}`;
      const response = await fetch(url, { headers: { Authorization: `Token ${token}` } });
      if (!response.ok) continue;
      const data = await response.json();
      if (data.data?.length > 0) {
        return data.data[0];
      }
    }
    return null;
  };

  const searchId = async () => {
    if (!id) return null;
    const url = `${DENTALINK_URL}/pacientes?q=${encodeURIComponent(JSON.stringify({ id: { eq: id } }))}`;
    const response = await fetch(url, { headers: { Authorization: `Token ${token}` } });
    if (!response.ok) return null;
    const data = await response.json();
    return data.data?.length > 0 ? data.data[0] : null;
  };

  const searchEmail = async () => {
    if (!email) return null;
    const url = `${DENTALINK_URL}/pacientes?q=${encodeURIComponent(JSON.stringify({ email: { eq: email } }))}`;
    const response = await fetch(url, { headers: { Authorization: `Token ${token}` } });
    if (!response.ok) return null;
    const data = await response.json();
    return data.data?.length > 0 ? data.data[0] : null;
  };

  const createPatient = async () => {
    const url = `${DENTALINK_URL}/pacientes`;
    const nameParts = name.trim().split(' ');
    const response = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Token ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nameParts[0],
        apellidos: nameParts.slice(1).join(' '),
        id: id || '',
        email: email || '',
        celular: phone,
        habilitado: 1,
      }),
    });
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Failed to create patient: ${response.status} ${body}`);
    }
    const data = await response.json();
    return data.data;
  };

  let patient = await searchPhone();
  if (!patient) {
    patient = await searchId();
  }
  if (!patient) {
    patient = await searchEmail();
  }
  if (!patient) {
    patient = await createPatient();
  }

  return patient;
}
