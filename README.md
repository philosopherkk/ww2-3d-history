# WWII Atlas / 二戰互動地圖

Classroom atlas of the Second World War. The default view is a flat map. An optional globe loads only when the browser can run WebGL. A keyboard list is the alternative to the map.

Time runs from July 1937 to September 1945. Pins, a timeline, and five lesson stops open the same selection. Figures carry evidence labels. The interface is English and Traditional Chinese.

Live site: https://philosopherkk.github.io/ww2-3d-history/

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (with `base` set, use `http://localhost:5173/ww2-3d-history/`).

```bash
npm test
npm run build
npm run preview
npm run i18n:check
```

`i18n:check` prints missing and unreviewed zh-Hant counts and always exits 0. CI records it as a warning.

## Deploy (GitHub Pages)

`vite.config.ts` sets `base` from `VITE_BASE` (default `/ww2-3d-history/`) for the project site. `.github/workflows/deploy-pages.yml` runs `npm test` before `npm run build` and publishes `dist` on pushes to `main`.

## Evidence levels

Badges use an icon and a short bilingual label, not color alone.

| Level | Badge |
| --- | --- |
| sourced | ● 有出處 / Sourced |
| estimated | ◐ 推估（內插） / Estimated (interpolated) |
| disputed | ◇ 數據有爭議 / Disputed |
| order_of_magnitude | ≈ 教學用數量級 / Educational order of magnitude |
| unverified | ○ 待查證 / Unverified |
| unsure | the stored word unsure |

`approximate` displays as estimated. Interpolated and held points display as estimated, with a method string that names the bounding anchors. Stored `unsure` is not renamed. A gap with no source uses unverified. The footer states that figures are educational estimates, not certified statistics.

## Translation status

Chrome strings exist in English and Traditional Chinese (`src/shared/i18n/locales/`). Historical paragraphs in the country, incident, and people files stay English until a reviewed zh-Hant string is added. Missing zh-Hant shows the English text plus 「英文原文」. Five glossary titles are reviewed in `src/data/glossary.zh-Hant.ts`: 七七事變/盧溝橋事變, 珍珠港事件, 史達林格勒戰役, 諾曼第登陸, 中途島海戰. The five lesson prompts are reviewed bilingual text in `src/data/lessons.ts`.

`npm run i18n:check` reports how many LocalizedText values still lack zh-Hant.

## Privacy

No tracking. The atlas does not load analytics or a font CDN. Fonts are the system stack. Language choice is stored in `localStorage` under `ww2-atlas-lang` and in the page URL.

## Data

- Compact anchors: `src/data/countryRoster.ts` (84 participants / entities)
- Incidents: `src/data/incidents.ts` (108 critical incidents, Jul 1937 → Sep 1945)
- Densifier: `src/data/buildSeries.ts` → weekly (8 majors) / monthly (10 secondaries) / quarterly (others)
- Catalog: `src/data/ww2Dataset.ts` (~25k metric points). Weekly and monthly dense points are interpolated teaching series, not archival statistics.

## Stack

Vite · React · TypeScript · Three.js · React Three Fiber · Zustand

## Licenses

- [`LICENSE`](LICENSE) — MIT for code only. Does not cover geography, the raster, or citations.
- [`DATA_LICENSE.md`](DATA_LICENSE.md) — Natural Earth public domain; NASA raster as attributed; CC BY 4.0 for original teaching text; citations stay citations.
- [`public/geo/ATTRIBUTION.md`](public/geo/ATTRIBUTION.md) — basemap lines.
