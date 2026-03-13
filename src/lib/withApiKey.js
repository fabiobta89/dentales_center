export function withApiKey(handler) {
  return (req, res) => {
    const auth = req.headers['authorization'];
    if (!auth || auth !== `Bearer ${process.env.BOOKING_API_KEY}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return handler(req, res);
  };
}
