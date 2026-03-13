export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  const key = process.env.GOOGLE_MAPS_KEY;
  if (!key) return res.status(500).json({ error: 'GOOGLE_MAPS_KEY not set.' });
  const { address } = req.query;
  if (!address) return res.status(400).json({ error: 'address required.' });
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${key}`;
    const resp = await fetch(url);
    const data = await resp.json();
    if (data.status !== 'OK' || !data.results.length) {
      return res.status(404).json({ error: `Could not geocode "${address}". Try being more specific.` });
    }
    const loc = data.results[0].geometry.location;
    res.status(200).json({ lat: loc.lat, lng: loc.lng, formatted: data.results[0].formatted_address });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
