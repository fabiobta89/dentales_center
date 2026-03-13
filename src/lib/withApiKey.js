export function withApiKey(handler) {
  return (req, res) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.BOOKING_API_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return handler(req, res);
  };
}
