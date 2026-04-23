# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Command          | Action                                         |
| :--------------- | :--------------------------------------------- |
| `bun install`    | Install dependencies                           |
| `bun run dev`    | Start dev server at localhost:4321              |
| `bun run build`  | Type-check (`astro check`) then build to `dist/` |
| `bun run preview`| Preview production build locally               |

No test suite is configured.

## Architecture

Astro 4 app with React interactive islands, deployed to **Cloudflare Pages** via `@astrojs/cloudflare` adapter. Output mode is `hybrid` (static by default, opt-in SSR per route).

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
