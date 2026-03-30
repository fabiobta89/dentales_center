import { createClient } from '@supabase/supabase-js';
import { getAvailabilityForRange, createAppointmentInDentalink } from '@/lib/dentalink';
import { withApiKey } from '@/lib/withApiKey';

/**
 * POST /api/booking/appointment
 *
 * Body:
 *   { name, email, phone, date: "YYYY-MM-DD", time: "HH:MM", message? }
 *
 * Validates the slot is still available before inserting.
 *
 * Responses:
 *   201: { appointment: { id, name, email, phone, date, time, status, created_at } }
 *   400: { error: string }
 *   409: { error: "Slot no longer available", alternatives: [{ date, slots }] }
 */
export default withApiKey(async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, date, time, message } = req.body || {};

  if (!name || !email || !phone || !date || !time) {
    return res.status(400).json({ error: 'name, email, phone, date, and time are required' });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: 'date must be YYYY-MM-DD' });
  }

  if (!/^\d{2}:\d{2}$/.test(time)) {
    return res.status(400).json({ error: 'time must be HH:MM' });
  }

  const today = new Date().toISOString().slice(0, 10);
  if (date < today) {
    return res.status(400).json({ error: 'date cannot be in the past' });
  }

  try {
    // Confirm the slot is still available before booking
    const availability = await getAvailabilityForRange(date, date);
    const slots = availability[date] || [];

    if (!slots.includes(time)) {
      const futureDates = Object.keys(availability).filter(d => d >= date).sort();
      const alternatives = futureDates.slice(0, 3).map(d => ({ date: d, slots: availability[d] }));
      return res.status(409).json({ error: 'Slot no longer available', alternatives });
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
        dentalink_id: null,
      })
      .select()
      .single();

    if (error) {
      console.error('[booking/appointment] Supabase error:', error);
      return res.status(500).json({ error: 'Error saving appointment' });
    }

    // Create appointment in Dentalink software
    let dentalinkData = null;
    try {
      dentalinkData = await createAppointmentInDentalink({ date, time });
      // Update status to synced and save dentalink_id
      await supabase
        .from('appointments')
        .update({ status: 'synced', dentalink_id: dentalinkData.id })
        .eq('id', data.id);
      data.status = 'synced';
      data.dentalink_id = dentalinkData.id;
    } catch (err) {
      console.error('[booking/appointment] Dentalink error:', err.message);
      // Don't fail - appointment is saved in Supabase as pending
    }

    return res.status(201).json({ appointment: data });
  } catch (err) {
    console.error('[booking/appointment]', err.message);
    return res.status(500).json({ error: 'Error creating appointment' });
  }
});
