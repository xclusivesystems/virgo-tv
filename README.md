# Virgo TV — Coming Soon Landing Page

Cinematic animated landing for Virgo TV (Netflix + Twitch hybrid with live chat). Single-page scroll: hero → features → content carousel → waitlist signup → footer.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4
- Framer Motion (animation)
- shadcn/ui (form + toast)
- better-sqlite3 (waitlist storage)
- Vitest (tests)

## Local development

```bash
npm install
npm run dev
```

Opens on **http://localhost:3200**.

## Tests

```bash
npm test
```

19 tests cover: SQLite waitlist DB, in-memory rate limiter, email validator, and the `/api/waitlist` route.

## Build

```bash
npm run build
npm start          # serves on :3200
```

## Waitlist storage

Signups land in **SQLite** (`data/waitlist.db` by default). Override the path with the `WAITLIST_DB_PATH` env var.

Query signups:

```bash
sqlite3 data/waitlist.db "SELECT email, created_at FROM waitlist ORDER BY created_at DESC;"
```

The route is rate-limited to **5 requests per IP per hour** and dedupes case-insensitively.

## Deployment notes

- Works on **any Node host** (Railway, Render, Fly, your own VPS, etc.).
- On **serverless** platforms (e.g. Vercel, Netlify Functions) the local filesystem is ephemeral — set `WAITLIST_DB_PATH=/tmp/waitlist.db` and accept that signups reset on cold starts. **For real waitlist persistence, swap `src/lib/db.ts` for Postgres / Turso / D1** — the `WaitlistDb` interface is small (3 methods) so the swap is straightforward.
- On a **traditional VPS** (recommended for v1), point a persistent volume at `data/` and the SQLite approach works fine.

## Email integration (TODO)

The API route at `src/app/api/waitlist/route.ts` has two clearly marked hooks:

```ts
// TODO: send welcome email via Resend
// TODO: sync contact to Resend Audiences
```

Plug in whichever provider you prefer (Resend, ConvertKit, Mailchimp, Brevo, ...).

## Customization

- **Logo:** `public/logo.png` — replace with the production asset.
- **Brand palette:** `src/app/globals.css` — `--brand-deep`, `--brand-purple`, `--brand-magenta`, `--brand-blue`, `--brand-white`, `--brand-live`.
- **Carousel placeholders:** `src/components/carousel/ContentCarousel.tsx` — swap gradient blocks for real poster art / show metadata.
- **Tagline / sub-line:** `src/components/hero/Hero.tsx`.
- **Footer socials:** `src/components/Footer.tsx` — replace `href="#"` with real URLs.

## Accessibility

`prefers-reduced-motion` is honored — starfield parallax, logo entrance, drifting bubbles, and scroll reveals all degrade gracefully.

## File map

```
src/
├── app/
│   ├── layout.tsx            # root layout, font, Toaster
│   ├── page.tsx              # composes the 5 sections
│   ├── globals.css           # brand palette + reduced-motion
│   └── api/waitlist/         # POST handler
├── components/
│   ├── hero/                 # Starfield, OrbitalRing, LogoReveal, ChatBubbles, Hero
│   ├── carousel/             # PlaceholderTile, CarouselRow, ContentCarousel
│   ├── Features.tsx
│   ├── Waitlist.tsx
│   ├── Footer.tsx
│   └── ui/                   # shadcn (button, input, sonner)
└── lib/
    ├── db.ts                 # SQLite waitlist
    ├── email.ts              # validator
    └── rate-limit.ts         # per-IP bucket
```
