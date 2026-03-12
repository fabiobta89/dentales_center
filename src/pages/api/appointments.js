import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, message, date, time } = req.body;

  if (!name || !email || !phone || !date || !time) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase
    .from('appointments')
    .insert({
      name,
      email,
      phone,
      message: message || null,
      date,
      time,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: 'Error al guardar la cita' });
  }

  res.status(201).json({ appointment: data });
}
