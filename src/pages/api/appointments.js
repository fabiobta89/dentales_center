import { createClient } from '@supabase/supabase-js';
import { getOrCreatePatient, createAppointmentInDentalink } from '@/lib/dentalink';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, message, date, time } = req.body;

  if (!name || !phone || !date || !time) {
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
      email: email || null,
      phone,
      message: message || null,
      date,
      time,
      status: 'pending',
      dentalink_id: null,
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: 'Error al guardar la cita' });
  }

  // Sync with Dentalink
  let patientId;
  try {
    const patient = await getOrCreatePatient({ phone, name, email });
    patientId = patient.id;
  } catch (err) {
    console.error('[appointments] getOrCreatePatient error:', err.message);
  }

  try {
    const dentalinkData = await createAppointmentInDentalink({ date, time, paciente_id: patientId });
    await supabase
      .from('appointments')
      .update({ status: 'synced', dentalink_id: dentalinkData.id })
      .eq('id', data.id);
    data.status = 'synced';
    data.dentalink_id = dentalinkData.id;
  } catch (err) {
    console.error('[appointments] Dentalink error:', err.message);
  }

  res.status(201).json({ appointment: data });
}
