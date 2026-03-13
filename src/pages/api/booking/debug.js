export default function handler(req, res) {
  const auth = req.headers['authorization'] || '(not sent)';
  const keySet = !!process.env.BOOKING_API_KEY;
  const keyLength = process.env.BOOKING_API_KEY?.length ?? 0;
  const match = auth === `Bearer ${process.env.BOOKING_API_KEY}`;

  res.status(200).json({ auth, keySet, keyLength, match });
}
