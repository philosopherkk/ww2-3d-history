# WWII Atlas (Project Ww 2)

Interactive 3D globe for teaching WWII history: time scrubber (1937 prelude → 1945), metric layers, critical incidents, and student detail levels.

## Run locally

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

```bash
npm run build
npm run preview
```

## Stack

Vite · React · TypeScript · Three.js · React Three Fiber · Zustand

## Data

- Compact anchors: `src/data/countryRoster.ts` (**65** participants)
- Densifier: `src/data/buildSeries.ts` → monthly (8 majors) / quarterly (others)
- Catalog: `src/data/ww2Dataset.ts` (~8.5k metric points) with `unsure` / `approximate` and provenance flags

See in-app **Sources** and the project plan.

## Deploy (Vercel)

Framework: **Vite**. Output directory: **dist**. Config: `vercel.json`.

1. Push this repo to GitHub.
2. Import the repo in [Vercel](https://vercel.com/new) (or `vercel --prod` with CLI logged in).
3. Leave build command `npm run build` and output `dist`.

Production URL will be recorded in the Project plan once deployed.
