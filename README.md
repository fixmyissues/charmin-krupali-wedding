# Charmin & Krupali — Wedding Invitation Website

A responsive, static-friendly Next.js wedding invitation site with a royal maroon and gold theme.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Personalise before publishing

Open `app/page.tsx`:
- Set `WHATSAPP_NUMBER` to your RSVP number in international format (India: `91` + mobile number, no `+` or spaces).
- Set `MAPS_URL` to the Google Maps share link for the confirmed wedding venue.
- Replace the sample Unsplash image URLs in `gallery` with your own photos.
- Replace the hero background image in `app/globals.css` if desired.

Add your licensed wedding music file at `public/music/wedding.mp3`. The music button will play/pause it. Browsers require a user click before audio can start.

## Deploy

Push this folder to GitHub and import the repository into Vercel. The site can be deployed as a Next.js project. For a fully static export, add `output: "export"` to `next.config.ts` and use `npm run build`; deploy the generated `out` folder to any static host.

## Event details currently included

- 04 Dec 2026, 1:00 PM — Wedding auspicious ceremony (Lagna Vadhavanu Muhurat)
- 05 Dec 2026, 8:00 AM — Ganesh Sthapana & Grah Shanti
- 05 Dec 2026, 11:00 AM — Wedding feast at Umiyaji Wadi, Ramapura (Kansa)
- 05 Dec 2026, 3:00 PM — Haldi ceremony
- 06 Dec 2026, 5:30 AM — Wedding procession departure from Ramapura towards Kolvada
- 06 Dec 2026, 10:00 AM — Hasta Melap
- Main venue: Kolvada High School Ground, Kolvada, Taluka Vijapur, Gujarat

The precise Google Maps pin and WhatsApp contact were not present as a confirmed website-ready link/number, so these are intentionally left configurable.
