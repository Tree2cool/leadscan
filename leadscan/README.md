# LeadScan v2 — Deploy Guide

## Deploy in 3 minutes (free)

### Step 1 — Get your Google API key 
1. Go to https://console.cloud.google.com
2. Create a project → APIs & Services → Library → enable:
   - Places API
   - Geocoding API
   - PageSpeed Insights API
3. APIs & Services → Credentials → Create API Key → copy it

### Step 2 — Push to GitHub
1. Go to https://github.com/new and create a free repo called "leadscan"
2. Upload this entire folder to it (drag and drop on GitHub works)

### Step 3 — Deploy on Vercel
1. Go to https://vercel.com → sign up free → Add New → Project
2. Import your leadscan GitHub repo
3. Go to Settings → Environment Variables → add:
   - Name:  GOOGLE_MAPS_KEY
   - Value: your key from Step 1
4. Redeploy — done. You get a live URL.

### Step 4 — Use it
- Open your Vercel URL
- Maps Finder: enter any address + radius → finds businesses → batch audit
- Single Audit: paste any URL for instant website score + pitch email
- Export CSV anytime from the sidebar

## File structure
  api/geocode.js   ← address to lat/lng (server-side proxy)
  api/places.js    ← Google Maps nearby search (server-side proxy)
  public/index.html ← the full app
  vercel.json      ← routing

## Cost
Vercel: free. Google APIs: free tier covers thousands of searches/month.
