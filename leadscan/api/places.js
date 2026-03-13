export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const key = process.env.GOOGLE_MAPS_KEY;
  if (!key) {
    return res.status(500).json({ error: 'GOOGLE_MAPS_KEY not set in Vercel environment variables.' });
  }

  const { lat, lng, radius, type, keyword } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: 'lat and lng required.' });

  try {
    let searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`
      + `?location=${lat},${lng}&radius=${radius || 5000}&key=${key}`;
    if (type && type !== 'any') searchUrl += `&type=${encodeURIComponent(type)}`;
    if (keyword) searchUrl += `&keyword=${encodeURIComponent(keyword)}`;

    const resp = await fetch(searchUrl);
    const data = await resp.json();

    if (data.status === 'REQUEST_DENIED') {
      return res.status(403).json({ error: data.error_message || 'API key rejected. Enable Places API in Google Cloud Console.' });
    }

    const places = (data.results || []).slice(0, 20);

    const detailed = await Promise.all(places.map(async (place) => {
      try {
        const dUrl = `https://maps.googleapis.com/maps/api/place/details/json`
          + `?place_id=${place.place_id}`
          + `&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,types`
          + `&key=${key}`;
        const dr = await fetch(dUrl);
        const dd = await dr.json();
        const d = dd.result || {};
        return {
          name: d.name || place.name,
          address: d.formatted_address || place.vicinity,
          phone: d.formatted_phone_number || '',
          website: d.website || null,
          rating: d.rating || place.rating || null,
          reviews: d.user_ratings_total || place.user_ratings_total || 0,
          place_id: place.place_id
        };
      } catch {
        return { name: place.name, address: place.vicinity, phone: '', website: null, rating: place.rating || null, reviews: 0, place_id: place.place_id };
      }
    }));

    res.status(200).json({ results: detailed });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
