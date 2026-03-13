import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { z } from 'zod';

const BASE_URL = process.env.DENTALES_BASE_URL || 'http://localhost:3000';
const API_KEY = process.env.BOOKING_API_KEY;
const PORT = process.env.PORT || 3001;

if (!API_KEY) {
  process.stderr.write('Error: BOOKING_API_KEY environment variable is required\n');
  process.exit(1);
}

async function callApi(path, body) {
  const url = `${BASE_URL}/api/booking/${path}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return { status: response.status, data };
}

function createMcpServer() {
  const server = new McpServer({
    name: 'dentales-center',
    version: '1.0.0',
  });

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
      const { status, data } = await callApi('check-availability', { date, time });
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
        isError: status >= 400,
      };
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
      const { status, data } = await callApi('appointment', { name, email, phone, date, time, message });
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
        isError: status >= 400,
      };
    }
  );

  return server;
}

const app = express();
app.use(express.json());

// Map of sessionId -> SSEServerTransport, one per active client connection
const transports = {};

// Client connects here to establish the SSE stream
app.get('/sse', async (_req, res) => {
  const transport = new SSEServerTransport('/message', res);
  transports[transport.sessionId] = transport;

  res.on('close', () => {
    delete transports[transport.sessionId];
  });

  const server = createMcpServer();
  await server.connect(transport);
});

// Client posts JSON-RPC messages here
app.post('/message', async (req, res) => {
  const sessionId = req.query.sessionId;
  const transport = transports[sessionId];

  if (!transport) {
    return res.status(400).json({ error: 'Session not found' });
  }

  await transport.handlePostMessage(req, res);
});

app.listen(PORT, () => {
  console.log(`MCP server running on port ${PORT}`);
  console.log(`SSE endpoint: http://localhost:${PORT}/sse`);
});
