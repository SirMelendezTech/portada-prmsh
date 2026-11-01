# PRMSH — portada

Landing page for [prmsh.com](https://prmsh.com/): the entry point to the Meshtastic and MeshCore communities in Puerto Rico. Astro (static) + TypeScript, with Svelte only for the two pieces that need the browser (mobile menu, map annotation reveal).

## Commands

| Command                      | What it does                                                                             |
| ---------------------------- | ---------------------------------------------------------------------------------------- |
| `npm run dev`                | Dev server                                                                               |
| `npm run build`              | Production build to `dist/` (includes sitemap)                                           |
| `npm run check`              | `astro check` (TypeScript + Astro diagnostics)                                           |
| `npm run format`             | Prettier (Astro + Svelte plugins)                                                        |
| `npm run terrain`            | Regenerate `public/terrain/puerto-rico.svg` + `src/data/*.json` from DEM tiles (network) |
| `node tools/build-icons.mjs` | Rasterise `public/favicon.svg` → `favicon.ico`, `apple-touch-icon.png`                   |

Astro 7 requires Node ≥ 22.23.4.

## Where things live

- `src/config/links.ts` — every external URL (typed). Edit links here only.
- `src/i18n/es.ts` — all copy. Add `en.ts` with the same `Dictionary` shape to localise.
- `src/data/illustrative-network.ts` — the hero's example nodes/route. Illustrative only, labelled as such on the page.
- `tools/build-terrain.mjs` — downloads AWS Terrain Tiles (SRTM / USGS 3DEP), removes spikes, contours with d3-contour, writes the SVG and the projection frame used by the overlay (`src/lib/map.ts`).
- `tools/og.html` — source for `public/og.png` (render at 1200×630 with any headless browser).
- `src/components/svelte-bits/DecryptedText.svelte` — adapted from [Svelte Bits](https://github.com/DavidHDev/svelte-bits) (MIT + Commons Clause).
