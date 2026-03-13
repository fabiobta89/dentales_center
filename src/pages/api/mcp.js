import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { getAvailabilityForRange } from '@/lib/dentalink';

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
    'book_appointment',
    {
      name: z.string().describe("Patient's full name"),
      email: z.string().describe("Patient's email address"),
      phone: z.string().describe("Patient's phone number"),
      date: z.string().describe('Appointment date in YYYY-MM-DD format'),
      time: z.string().describe('Appointment time in HH:MM 24-hour format'),
      message: z.string().optional().describe('Optional notes or reason for the visit'),
    },
    {
      description:
        'Book an appointment at the dental clinic. ' +
        'The slot availability is verified in real-time before the record is created. ' +
        'If the slot was just taken, alternative available days are returned instead.',
    },
    async ({ name, email, phone, date, time, message }) => {
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
        .insert({ name, email, phone, message: message || null, date, time, status: 'pending' })
        .select()
        .single();

      if (error) {
        return { content: [{ type: 'text', text: JSON.stringify({ error: 'Error saving appointment' }) }], isError: true };
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
