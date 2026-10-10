# Interchange

A parts cross-reference tool for mobile repair shops, focused on two things:

1. **Screen Guard Finder** — search a phone model to find every other device that takes the
   same screen guard / tempered glass.
   - *Original Drawing*: devices with the exact same screen model & cutout (same
     combo/display assembly).
   - *Full Temper*: devices with identical panel height, width, and radius, for a 100%
     guaranteed fit.
2. **Phone Cases & Base Models** — devices grouped by chassis, so you know at a glance which
   covers are interchangeable.

Built as an installable Progressive Web App (PWA): open it in a phone's browser and "Add to
Home Screen" for an app-like icon and offline access.

## Stack

- **React 19 + TypeScript** — UI and types
- **Vite** — dev server and build
- **Tailwind CSS v4** — styling, via `@tailwindcss/vite` (no separate config file needed)
- **React Router v7** — the three tabs (Search / Database / Add device) are routes
- **vite-plugin-pwa** — service worker + manifest, so the app installs and works offline
- **localStorage** — all data lives on-device; nothing is sent anywhere. No backend, no
  accounts, no network requirement after first load.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`). To test the installed/offline
PWA behavior specifically, use a production build instead of the dev server:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  types/device.ts        Device & MatchResult types
  data/devices.json       Starter dataset (1,175 devices) - see "About the data" below
  lib/storage.ts          localStorage load/save
  hooks/useDevices.ts      All matching logic lives here
  components/
    Header.tsx
    TabBar.tsx
    DeviceCard.tsx         Renders one device's Original Drawing / Full Temper / case matches
  pages/
    SearchPage.tsx         Default route "/" - search a device, see its matches
    GroupsPage.tsx          "/groups" - browse every real interchange group directly,
                            toggle between Screen Guard and Case groups, expand to see
                            full membership
    AddPage.tsx             "/add" - form to add a device
  App.tsx                  Layout + shares device state with all pages via router context
  main.tsx                 Router setup
```

## Mobile UX notes

This was built and verified against real rendering (headless Chromium screenshots at
375px/430px phone widths and 768px tablet), not just written and assumed correct. Fixes
worth knowing about if you keep developing this:

- All inputs are 16px+ font-size — anything smaller triggers iOS Safari's
  auto-zoom-on-focus, which is a jarring bug on a real phone even though it's invisible in
  a desktop browser.
- `viewport-fit=cover` + `env(safe-area-inset-*)` padding on the header and tab bar, so
  content doesn't collide with a notch or home indicator.
- The app is centered in a `max-width: 480px` column with a subtle border past that width,
  so it doesn't stretch full-bleed and look broken on a tablet or desktop browser.

## About the data

`src/data/devices.json` was compiled from scratch from public sources - real data, not a
copy of any single app's database:

- **1,161 devices, 228 groups** for **Original Drawing** (screen/cutout match) - sourced from
  public repair-industry screen/combo-assembly interchange lists covering Samsung, Vivo/iQOO,
  Redmi/Poco/Xiaomi, Oppo/Realme/OnePlus, Infinix/Tecno/Itel, and Motorola.
- **36 devices, 15 groups** for **Phone Cases & Base Models** - sourced from real case
  retailers (Kapaver, Casekaro, Flipkart listings, IndiaMART supplier pages) who sell a
  single case SKU explicitly listed as fitting multiple phone models (e.g. "Redmi 9
  Prime/Poco M2/M2 Reloaded", "Samsung M55/F55"). Intentionally small: only pairings a
  seller has explicitly and publicly confirmed, not guesses. This is close to the ceiling of
  what's publicly findable in bulk - further growth realistically comes from the shop
  confirming real fits via "Add device" as stock comes through.
- **0 devices** have **Full Temper** dimensions yet. No public source compiles exact panel
  height/width/radius in bulk - that data only exists as something a shop measures by hand.

The Groups tab lets you browse every one of these groups directly - useful for auditing what
the database actually knows, independent of searching one device at a time.

Before ordering parts in bulk against any match this app shows, it's still worth a quick
visual check against the physical device - group lists like this occasionally have a wrong
entry. Corrections and new devices both go through "Add device," which lets you link a new
phone's screen or case to an existing device by name rather than needing to know any group
codes.
