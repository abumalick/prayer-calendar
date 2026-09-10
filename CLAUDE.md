# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Command          | Action                                         |
| :--------------- | :--------------------------------------------- |
| `bun install`    | Install dependencies                           |
| `bun run dev`    | Start dev server at localhost:4321              |
| `bun run build`  | Type-check (`astro check`) then build to `dist/` |
| `bun run preview`| Preview production build locally               |
| `bun run deploy` | Build and deploy to Cloudflare Workers         |
| `bun run deploy:www` | Deploy the www redirect Worker (rarely changes) |

No test suite is configured.

## Architecture

Astro 7 app with React interactive islands, deployed to **Cloudflare Workers** via the `@astrojs/cloudflare` adapter. Static by default, with opt-in SSR per route.

### Deployment

`wrangler.jsonc` holds the Worker config, but the adapter regenerates it into `dist/server/wrangler.json` at build time and **drops the `routes` key**. The production route therefore lives in the `deploy` script rather than the config file — editing `routes` in `wrangler.jsonc` has no effect.

The adapter dropped Cloudflare Pages support in v13, so this project cannot be deployed to Pages. There is no Git-connected auto-deploy; `bun run deploy` is the only path to production.

`workers/www-redirect/` is a separate one-file Worker that 301s `www.prayer-calendar.com` to the apex. It exists because the zone's `www` record is a proxied placeholder with no origin, which returns 522 unless something answers at the edge. Cloudflare's own answer to this is a dashboard Redirect Rule; a Worker on the hostname does the same job while keeping the rule in version control. It is deployed separately from the site and only needs redeploying if the redirect itself changes.

### Request flow

1. User fills out the React form (`PrayerTimeForm.tsx`, rendered with `client:only="react"`) — picks coordinates, calculation method, and optional sunnah time checkboxes.
2. Form builds a URL pointing to `/ical` with query params (`latitude`, `longitude`, `method`, etc.).
3. User pastes that URL into Google Calendar's "From URL" feature.
4. `src/pages/ical.ts` — SSR API endpoint (`prerender = false`) — validates params, calls `createPrayerTimesICal`, returns `text/calendar`.
5. `src/utils/ical-generator.ts` — generates ~13 months of prayer events using the **adhan** library, outputs iCal via the `Calendar` class.
6. `src/utils/Calendar.ts` — minimal RFC 5545 iCal builder with line folding.

### Key libraries

- **adhan** — Islamic prayer time calculations (`PrayerTimes`, `SunnahTimes`, `CalculationMethod`)
- **date-fns** — date formatting
- **picnic** — lightweight CSS framework (imported globally in Layout)
- **Plausible** — analytics via `window.plausible` (custom event domain)

### Conventions

- Path alias `~/` maps to `src/` (configured in tsconfig `paths`).
- Form state is persisted to `localStorage` via `useStoredState` hook.
- Prettier with `prettier-plugin-astro` for formatting.
- TypeScript with Astro's `strictest` config.
