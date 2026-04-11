import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { getAvailabilityForRange, createAppointmentInDentalink, getMotivosDeAtencion, getOrCreatePatient } from '@/lib/dentalink';
import { normalizeToE164 } from '@/lib/phone';

const ALTERNATIVES_DAYS = 13;
const MAX_ALTERNATIVE_DAYS = 3;

function addDays(dateStr, n) {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function buildAlternatives(availability, requestedDate, sameDaySlots) {
  const alternatives = [];
  if (sameDaySlots.length > 0) {
    alternatives.push({ date: requestedDate, slots: sameDaySlots });
  }
  const futureDates = Object.keys(availability).filter(d => d > requestedDate).sort();
  for (const d of futureDates) {
    if (alternatives.length >= MAX_ALTERNATIVE_DAYS) break;
    alternatives.push({ date: d, slots: availability[d] });
  }
  return alternatives;
}

function createMcpServer() {
  const server = new McpServer({ name: 'dentales-center', version: '1.0.0' });

  server.tool(
    'get_current_datetime',
    {},
    { description: 'Returns the current date and time in Colombia (America/Bogota, UTC-5). Call this whenever you need to know today\'s date before checking availability or interpreting relative dates like "tomorrow" or "next week".' },
    async () => {
      const now = new Date();
      const bogota = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Bogota',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false,
      }).formatToParts(now);

      const get = (type) => bogota.find(p => p.type === type).value;
      const date = `${get('year')}-${get('month')}-${get('day')}`;
      const time = `${get('hour')}:${get('minute')}:${get('second')}`;
      const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const dayName = dayNames[new Date(`${date}T${time}`).getDay()];

      return {
        content: [{ type: 'text', text: JSON.stringify({ date, time, timezone: 'America/Bogota', day_of_week: dayName }) }],
      };
    }
  );

  server.tool(
    'check_availability',
    {
      date: z.string().describe('Date to check in YYYY-MM-DD format (must not be in the past)'),
      time: z.string().optional().describe('Specific time slot to verify in HH:MM 24-hour format'),
    },
    {
      description:
        'Check available appointment slots at the dental clinic. ' +
        'Pass only a date to get all available time slots for that day. ' +
        'Pass both date and time to check if a specific slot is available; ' +
        'when the slot is unavailable, up to 3 alternative days with open slots are returned.',
    },
    async ({ date, time }) => {
      const today = new Date().toISOString().slice(0, 10);
      if (date < today) {
        return { content: [{ type: 'text', text: JSON.stringify({ error: 'date cannot be in the past' }) }], isError: true };
      }

      const rangeEnd = addDays(date, ALTERNATIVES_DAYS);
      const availability = await getAvailabilityForRange(date, rangeEnd);
      const requestedSlots = availability[date] || [];

      if (time) {
        if (requestedSlots.includes(time)) {
          return { content: [{ type: 'text', text: JSON.stringify({ available: true, date, time }) }] };
        }
        const alternatives = buildAlternatives(availability, date, requestedSlots);
        return { content: [{ type: 'text', text: JSON.stringify({ available: false, requested: { date, time }, alternatives }) }] };
      }

      if (requestedSlots.length > 0) {
        return { content: [{ type: 'text', text: JSON.stringify({ available: true, date, slots: requestedSlots }) }] };
      }

      const alternatives = buildAlternatives(availability, date, []);
      return { content: [{ type: 'text', text: JSON.stringify({ available: false, requested: { date }, alternatives }) }] };
    }
  );

  server.tool(
    'get_motivos_de_atencion',
    {},
    {
      description: 'Returns the list of available attention reasons (motivos de atencion) for appointments, including their IDs, names, and duration.',
    },
    async () => {
      try {
        const motivos = await getMotivosDeAtencion();
        return {
          content: [{ type: 'text', text: JSON.stringify({ motivos }) }],
        };
      } catch (err) {
        return { content: [{ type: 'text', text: JSON.stringify({ error: err.message }) }], isError: true };
      }
    }
  );

  server.tool(
    'get_or_create_patient',
    {
      phone: z.string().describe("Patient's phone number"),
      name: z.string().describe("Patient's full name"),
      id: z.string().optional().describe("Patient's Colombian national ID (cedula de ciudadania)"),
      email: z.string().optional().describe("Patient's email address"),
    },
    {
      description: 'Searches for a patient by phone, id (cedula), or email. If not found, creates a new patient. Returns the patient ID and details.',
    },
    async ({ phone, name, id, email }) => {
      try {
        const normalizedPhone = normalizeToE164(phone);
        const patient = await getOrCreatePatient({ phone: normalizedPhone, name, id, email });
        return {
          content: [{ type: 'text', text: JSON.stringify({ patient }) }],
        };
      } catch (err) {
        return { content: [{ type: 'text', text: JSON.stringify({ error: err.message }) }], isError: true };
      }
    }
  );

  server.tool(
    'book_appointment',
    {
      phone: z.string().describe("Patient's phone number"),
      name: z.string().describe("Patient's full name"),
      id: z.string().optional().describe("Patient's Colombian national ID (cedula de ciudadania)"),
      email: z.string().optional().describe("Patient's email address"),
      date: z.string().describe('Appointment date in YYYY-MM-DD format'),
      time: z.string().describe('Appointment time in HH:MM 24-hour format'),
      motivo_atencion_id: z.number().optional().describe('Attention reason ID from get_motivos_de_atencion (e.g. 1 for Valoracion general, 3 for Resina)'),
      message: z.string().optional().describe('Optional notes or reason for the visit'),
    },
    {
      description:
        'Book an appointment at the dental clinic. ' +
        'The slot availability is verified in real-time before the record is created. ' +
        'Returns appointment confirmation data including name, date, time, and status. ' +
        'You MUST show this confirmation data to the patient in a confirmation block.',
    },
    async ({ phone, name, id, email, date, time, motivo_atencion_id, message }) => {
      let normalizedPhone = phone;
      try {
        normalizedPhone = normalizeToE164(phone);
      } catch {
        return { content: [{ type: 'text', text: JSON.stringify({ error: 'Invalid phone number' }) }], isError: true };
      }

      const today = new Date().toISOString().slice(0, 10);
      if (date < today) {
        return { content: [{ type: 'text', text: JSON.stringify({ error: 'date cannot be in the past' }) }], isError: true };
      }

      const availability = await getAvailabilityForRange(date, date);
      const slots = availability[date] || [];

      if (!slots.includes(time)) {
        const alternatives = Object.keys(availability).filter(d => d >= date).sort().slice(0, 3)
          .map(d => ({ date: d, slots: availability[d] }));
        return {
          content: [{ type: 'text', text: JSON.stringify({ error: 'Slot no longer available', alternatives }) }],
          isError: true,
        };
      }

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      const { data, error } = await supabase
        .from('appointments')
        .insert({ name, email, phone: normalizedPhone, message: message || null, date, time, status: 'pending', dentalink_id: null })
        .select()
        .single();

      if (error) {
        return { content: [{ type: 'text', text: JSON.stringify({ error: 'Error saving appointment' }) }], isError: true };
      }

      // Get or create patient in Dentalink
      let patientId;
      try {
        const patient = await getOrCreatePatient({ phone: normalizedPhone, name, id, email });
        patientId = patient.id;
      } catch (err) {
        console.error('[mcp] getOrCreatePatient error:', err.message);
      }

      // Create appointment in Dentalink software
      try {
        const dentalinkData = await createAppointmentInDentalink({ date, time, motivo_atencion_id, paciente_id: patientId });
        // Update status to synced and save dentalink_id
        await supabase
          .from('appointments')
          .update({ status: 'synced', dentalink_id: dentalinkData.id })
          .eq('id', data.id);
        data.status = 'synced';
        data.dentalink_id = dentalinkData.id;
      } catch (err) {
        console.error('[mcp] Dentalink error:', err.message);
        // Don't fail - appointment is saved in Supabase as pending
      }

      return { content: [{ type: 'text', text: JSON.stringify({ appointment: data }) }] };
    }
  );

  return server;
}

export default async function handler(req, res) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.BOOKING_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  const server = createMcpServer();
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
}
