export default function handler(req, res) {
  const apiKey = req.headers['x-api-key'] || '(not sent)';
  const keySet = !!process.env.BOOKING_API_KEY;
  const keyLength = process.env.BOOKING_API_KEY?.length ?? 0;
  const match = apiKey === process.env.BOOKING_API_KEY;

  res.status(200).json({ apiKey, keySet, keyLength, match });
}
