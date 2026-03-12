import { createClient } from '@supabase/supabase-js';

const VALID_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'];

export default async function handler(req, res) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const { status } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Status update error:', error);
    return res.status(500).json({ error: 'Error updating status' });
  }

  res.status(200).json({ appointment: data });
}
