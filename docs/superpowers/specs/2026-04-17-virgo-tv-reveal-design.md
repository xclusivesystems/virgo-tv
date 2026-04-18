# Virgo TV — Futuristic Reveal Animation (Design)

**Date:** 2026-04-17
**Replaces:** `src/components/CurtainReveal.tsx` (the 1970s-style red velvet curtain reveal)
**Goal:** Replace the curtain reveal with two futuristic concepts the user can A/B preview live, then keep the winner.

## Problem

The current opener (`CurtainReveal.tsx`) uses red velvet theatre curtains with gold trim — the wrong aesthetic for a Netflix+Twitch hybrid streaming brand. We need a reveal that feels modern, premium, and on-brand for a streaming app launching across Apple TV / Roku / Vision Pro / etc.

## Solution Overview

Build **two reveal concepts** as separate components, toggleable via `NEXT_PUBLIC_REVEAL` env var:

- **Concept A — "Warp to Virgo"** — cosmic warp-tunnel ending in the Virgo constellation collapsing into the logo
- **Concept B — "Holo Boot"** — Meta-glasses / Vision-Pro style holographic UI panels assemble around the logo and dissolve

User previews both on `localhost:3200` and on Vercel previews, picks the winner, deletes the loser. Both concepts share the same shell (skip-on-revisit, reduced-motion, completion callback) and run for the same duration so `REVEAL_OFFSET` doesn't change between toggles.

ComfyUI generates static painterly assets (nebula plates, holo panel textures, glyph strips). Code (Canvas, Framer Motion, CSS, SVG) drives all motion. ComfyUI is good at stills; code is good at motion. Combining them gets photoreal polish without paying the video-weight tax on a coming-soon page.

## Architecture

```
src/components/reveal/
├── RevealShell.tsx          # routing + sessionStorage skip + reduced-motion + completion callback
├── CosmicWarp.tsx           # Concept A
├── HoloBoot.tsx             # Concept B
└── shared/
    ├── usePreloadAssets.ts  # preloads ComfyUI WebPs before reveal starts
    └── revealTokens.ts      # shared timings, easings, brand colors
```

`ComingSoon.tsx` renders `<RevealShell onComplete={...} />` instead of `<CurtainReveal />`. `RevealShell` reads `process.env.NEXT_PUBLIC_REVEAL` (`cosmic` | `holo`, default `cosmic`), and renders the chosen concept. The old `CurtainReveal.tsx` stays in the repo until the winner is picked, then is deleted.

Both concepts fire `onComplete()` at exactly **t=2.90s**, then their reveal layer fades out over the remaining 300ms while page content fades in beneath. `REVEAL_OFFSET` in `ComingSoon.tsx` stays at **2.9** (no change from current curtain value) — content appears at the same moment regardless of which concept is active.

## Asset Pipeline (ComfyUI → repo)

All assets generated locally in ComfyUI, exported as WebP, committed to `public/reveal/<concept>/`.

### Cosmic concept (~215 KB total)

| File | Size | Description |
|------|------|------|
| `public/reveal/cosmic/nebula-plate.webp` | 2560×1440, ~150 KB | Painterly magenta/blue nebula backdrop |
| `public/reveal/cosmic/virgo-constellation.webp` | 1200×1200, ~40 KB | 9 star points, transparent background, faint connector hints |
| `public/reveal/cosmic/lens-bloom.webp` | 800×800, ~25 KB | Soft circular bloom for the logo handoff, transparent background |

### Holo concept (~150 KB total)

| File | Size | Description |
|------|------|------|
| `public/reveal/holo/holo-panel.webp` | 800×500, ~50 KB | Translucent frosted-glass UI frame, neon edge, transparent background, reused 5× via CSS scale |
| `public/reveal/holo/holo-grid.webp` | 2560×800, ~70 KB | Vision-Pro-style perspective grid horizon |
| `public/reveal/holo/glyph-strip.webp` | 1024×128, ~30 KB | Tileable futuristic glyphs / data text |

### ComfyUI prompts (drafts — iterate as needed)

- **nebula-plate:** `cosmic nebula, deep magenta and electric blue, painterly, ultra wide, soft star clusters, no text, cinematic lighting, hyperdetailed`
- **virgo-constellation:** `9 bright star points arranged as Virgo constellation, transparent background, faint white connecting lines, soft glow, isolated, no other elements`
- **lens-bloom:** `soft radial light bloom, white core fading to magenta then transparent, lens flare, isolated, transparent background`
- **holo-panel:** `translucent frosted glass UI frame, thin cyan neon edge, holographic, transparent background, isolated, slight chromatic aberration on edges, futuristic HUD element`
- **holo-grid:** `perspective grid horizon, cyan thin lines on dark background, vanishing point, Vision Pro aesthetic, ultra wide, futuristic`
- **glyph-strip:** `horizontal strip of futuristic glyphs and data text, cyan on dark, tileable, sci-fi HUD typography`

Preload strategy: `RevealShell` injects `<link rel="preload" as="image">` for the active concept's assets only. Inactive concept's assets are not loaded.

## Motion Spec — Cosmic Warp (Concept A)

Total duration: 3.2s.

```
t=0.00  Black screen, white pinpoint at center (4px), opacity 0→1 in 200ms
t=0.20  Pinpoint heartbeat pulse: scale 1 → 1.4 → 1, 200ms
t=0.40  WARP IN: 200 canvas particles emit from center
        - radial velocity ramps 0 → 1800 px/s over 1.4s (ease-in cubic)
        - each particle: 1–3px wide, length scales with velocity (motion-streak)
        - color: white core → cyan tail → magenta fade
        - pinpoint scales up to fill screen (camera acceleration sensation)
t=1.80  EXIT WARP: particle velocity decelerates over 600ms
        - nebula-plate.webp fades in behind (opacity 0→0.85, 600ms)
        - subtle parallax: nebula scales 1.05 → 1.0
t=2.40  CONSTELLATION FORMS:
        - virgo-constellation.webp fades in (300ms)
        - SVG overlay: 8 line segments connect star points via stroke-dasharray draw
          (500ms total, 60ms stagger between segments)
t=2.90  COLLAPSE TO LOGO:
        - constellation + nebula scale down to logo position (300ms ease-out)
        - lens-bloom.webp fades in at logo position (200ms)
        - onComplete() fires → ComingSoon content fades in
t=3.20  Reveal layer fully faded to 0 (300ms fade)
```

**Tech:** Canvas 2D for particles (60fps target), Framer Motion for image fade/scale, SVG `stroke-dasharray` for constellation lines.

## Motion Spec — Holo Boot (Concept B)

Total duration: 3.2s.

```
t=0.00  Translucent dark background (#05060e), faint ambient blue glow
t=0.10  GRID SWEEP IN:
        - holo-grid.webp slides up from bottom 100% → 0%, 400ms ease-out
        - perspective tilt: rotateX 15deg
t=0.50  PANELS MATERIALIZE:
        - 5 holo-panel.webp instances spawn in 3D space around center
        - positions: TL, TR, BL, BR, CENTER (slightly offset z-depth)
        - each: opacity 0→1, scale 0.6→1, translateZ from -200px→0, 600ms
        - 80ms stagger between panels
        - thin neon edge glow (CSS box-shadow inset cyan)
        - subtle chromatic aberration on edges (CSS filter)
t=1.50  DATA STREAM:
        - scan-line sweeps top→bottom across each panel (400ms, staggered)
        - glyph-strip.webp scrolls horizontally inside each panel (low opacity)
        - micro-glitch: 60ms clip-path jitter on center panel at t=1.7
t=2.00  PANELS RUSH FORWARD:
        - 4 outer panels: translateZ 0→800px, opacity 1→0, 500ms ease-in
        - center panel scales to logo size, holo-edge shimmer (gradient sweep)
t=2.50  RESOLVE:
        - center panel morphs into logo plate position
        - panel border dissolves into ~60 pixel particles (canvas)
        - particles drift outward + fade, 400ms
t=2.90  onComplete() fires → ComingSoon content fades in
t=3.20  Reveal layer fully faded to 0 (300ms fade)
```

**Tech:** Framer Motion 3D transforms (perspective parent), CSS for scan-lines / glitch / shimmer, canvas for the final pixel-dissolve.

## Shared Tokens (`revealTokens.ts`)

```ts
export const REVEAL = {
  totalDuration: 3.2,         // seconds
  fadeOut: 0.4,
  brand: {
    magenta: '#d946ef',
    blue: '#3b82f6',
    cyan: '#22d3ee',
    bgDeep: '#05060e',
  },
  ease: {
    warpAccel: [0.4, 0, 0.6, 1],   // ease-in-cubic
    decel: [0, 0, 0.2, 1],         // ease-out
    bounce: [0.65, 0, 0.35, 1],
  },
} as const;
```

## RevealShell Behavior

```ts
type Concept = 'cosmic' | 'holo';

function getConcept(): Concept {
  const v = process.env.NEXT_PUBLIC_REVEAL;
  return v === 'holo' ? 'holo' : 'cosmic';   // invalid → cosmic
}
```

- Reads env var, picks concept (default `cosmic`)
- Checks `sessionStorage.getItem('virgo-reveal-seen') === 'true'` → skip, fire `onComplete()` immediately
- Checks `prefers-reduced-motion: reduce` → skip, fire `onComplete()` immediately, content fades in over 200ms
- Renders `<CosmicWarp onComplete={handleComplete} />` or `<HoloBoot onComplete={handleComplete} />`
- `handleComplete()` sets `sessionStorage.setItem('virgo-reveal-seen', 'true')` and calls `props.onComplete()`
- Reveal layer is `position: fixed; inset: 0; z-index: 50; aria-hidden: true`

## Edge Cases & Fallbacks

- **`prefers-reduced-motion: reduce`** — `RevealShell` skips entire animation, fires `onComplete()` immediately, content shows with simple 200ms fade.
- **Asset preload fails** (offline / 404) — concept renders code-only fallback. Cosmic falls back to particle-only warp (no nebula/constellation). Holo falls back to panel outlines (no glyph strip / grid). Reveal still completes at t=3.2.
- **Returning visitor in same tab** — `sessionStorage.getItem('virgo-reveal-seen') === 'true'` → skip reveal, show content immediately. Flag set after first `onComplete()`. Cleared automatically when tab closes.
- **Slow device** — Canvas particle count drops from 200→80 if `navigator.hardwareConcurrency < 4`. Frame budget watchdog: if first 200ms drops below 30fps, swap to reduced-motion path.
- **Mobile** — same animation, but particles capped at 100, panel count drops 5→3 (TL, TR, CENTER) on `window.innerWidth < 640`.
- **Concept switch via env** — `NEXT_PUBLIC_REVEAL=cosmic` (default) or `holo`. Set in Vercel project env or `.env.local`. Invalid value → cosmic. Old `CurtainReveal.tsx` deleted once winner is picked.

## Testing

- **Vitest** — `RevealShell` unit tests:
  - routing logic (`cosmic` env → `<CosmicWarp />`)
  - routing logic (`holo` env → `<HoloBoot />`)
  - invalid env → cosmic fallback
  - sessionStorage skip on second mount
  - reduced-motion skip
  - `onComplete` callback fires once per mount
- **Manual visual QA** — `localhost:3200` with both env values, then on Vercel preview with both. Test: Chrome desktop, Safari iOS, Firefox, slow 3G throttle, reduced-motion enabled, returning visit.
- **Frame budget check** — Chrome DevTools Performance tab: confirm both concepts hit 60fps on a mid-tier laptop.
- **Accessibility** — reveal layer has `aria-hidden="true"`. Content beneath the reveal is screen-reader visible from t=0.

## Out of Scope

- Pre-rendered video reveals (we're doing stills + code, per the brainstorm).
- A/B traffic splitting / analytics on which concept wins. The pick is the user's call, not data-driven.
- Runtime animation editor / tweaking UI.
- Sound effects. Silent reveal — autoplay audio is hostile on a coming-soon page.
- Astronomically accurate Virgo constellation. We use a stylized 9-star arrangement.

## File Changes Summary

**New files:**
- `src/components/reveal/RevealShell.tsx`
- `src/components/reveal/CosmicWarp.tsx`
- `src/components/reveal/HoloBoot.tsx`
- `src/components/reveal/shared/usePreloadAssets.ts`
- `src/components/reveal/shared/revealTokens.ts`
- `src/components/reveal/__tests__/RevealShell.test.tsx`
- `public/reveal/cosmic/{nebula-plate,virgo-constellation,lens-bloom}.webp`
- `public/reveal/holo/{holo-panel,holo-grid,glyph-strip}.webp`

**Modified files:**
- `src/components/ComingSoon.tsx` — replace `<CurtainReveal />` with `<RevealShell />`. `REVEAL_OFFSET` stays at `2.9`.

**Deleted (after winner picked, separate follow-up commit):**
- `src/components/CurtainReveal.tsx`
- The losing concept's component + assets directory
