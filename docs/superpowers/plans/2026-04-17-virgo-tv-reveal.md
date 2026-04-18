# Virgo TV Reveal Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the red velvet curtain reveal with two futuristic concepts (Cosmic Warp + Holo Boot) toggleable via `NEXT_PUBLIC_REVEAL`, sharing one shell that handles preloading, sessionStorage skip, and reduced-motion fallback.

**Architecture:** A `RevealShell` wrapper around `<ComingSoon />` reads the env var, preloads the active concept's ComfyUI assets, and renders either `CosmicWarp` or `HoloBoot`. Both concepts run 3.2s and fire `onComplete` at exactly t=2.9s so `REVEAL_OFFSET` in `ComingSoon` stays unchanged. ComfyUI generates static painterly stills (~150–215 KB per concept); code drives all motion (Canvas particles, Framer Motion 3D, CSS scan-lines, SVG line-draw).

**Tech Stack:** Next.js 16.2.4 (App Router), React 19, TypeScript, Tailwind v4, Framer Motion 12, Vitest 4, Canvas 2D, ComfyUI MCP for asset generation.

**Spec:** `docs/superpowers/specs/2026-04-17-virgo-tv-reveal-design.md`

> ⚠️ **Read first** — this project has breaking Next.js 16 changes. Before any code, skim `node_modules/next/dist/docs/` for Client Components, env vars, and Image conventions. The existing `CurtainReveal.tsx` is a working reference for current patterns.

---

## File Structure

```
src/components/reveal/
├── RevealShell.tsx              # entry: env routing, sessionStorage, reduced-motion, preload
├── CosmicWarp.tsx               # Concept A
├── HoloBoot.tsx                 # Concept B
├── shared/
│   ├── revealTokens.ts          # constants: durations, easings, brand colors
│   └── usePreloadAssets.ts      # injects <link rel="preload"> for active concept
└── __tests__/
    └── RevealShell.test.tsx

public/reveal/
├── cosmic/
│   ├── nebula-plate.webp
│   ├── virgo-constellation.webp
│   └── lens-bloom.webp
└── holo/
    ├── holo-panel.webp
    ├── holo-grid.webp
    └── glyph-strip.webp

src/app/page.tsx                 # MODIFIED: <CurtainReveal> → <RevealShell>
src/components/CurtainReveal.tsx # DELETED in final task once both concepts work
```

---

## Phase 1 — Foundation (testable shell)

### Task 1: Create reveal directory structure + shared tokens

**Files:**
- Create: `src/components/reveal/shared/revealTokens.ts`

- [ ] **Step 1: Create the directory structure**

```bash
mkdir -p src/components/reveal/shared src/components/reveal/__tests__
mkdir -p public/reveal/cosmic public/reveal/holo
```

- [ ] **Step 2: Write `revealTokens.ts`**

```ts
export const REVEAL = {
  totalDuration: 3.2,        // seconds, full reveal layer lifetime
  contentRevealAt: 2.9,      // seconds, when onComplete fires
  layerFadeOut: 0.3,         // seconds, reveal layer fade after onComplete
  brand: {
    magenta: "#d946ef",
    blue: "#3b82f6",
    cyan: "#22d3ee",
    bgDeep: "#05060e",
  },
  ease: {
    warpAccel: [0.4, 0, 0.6, 1] as [number, number, number, number],
    decel: [0, 0, 0.2, 1] as [number, number, number, number],
    bounce: [0.65, 0, 0.35, 1] as [number, number, number, number],
  },
} as const;

export type Concept = "cosmic" | "holo";

export function resolveConcept(raw: string | undefined): Concept {
  return raw === "holo" ? "holo" : "cosmic";
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/reveal public/reveal
git commit -m "virgo-tv: scaffold reveal directory + shared tokens"
```

---

### Task 2: TDD `resolveConcept` (env routing)

**Files:**
- Create: `src/components/reveal/__tests__/revealTokens.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, it, expect } from "vitest";
import { resolveConcept } from "../shared/revealTokens";

describe("resolveConcept", () => {
  it("returns 'cosmic' for undefined", () => {
    expect(resolveConcept(undefined)).toBe("cosmic");
  });
  it("returns 'cosmic' for empty string", () => {
    expect(resolveConcept("")).toBe("cosmic");
  });
  it("returns 'cosmic' for invalid value", () => {
    expect(resolveConcept("warp")).toBe("cosmic");
  });
  it("returns 'cosmic' explicitly", () => {
    expect(resolveConcept("cosmic")).toBe("cosmic");
  });
  it("returns 'holo' explicitly", () => {
    expect(resolveConcept("holo")).toBe("holo");
  });
});
```

- [ ] **Step 2: Run tests — expect all pass**

```bash
npm test -- src/components/reveal/__tests__/revealTokens.test.ts
```

Expected: all 5 tests PASS (logic was implemented in Task 1).

- [ ] **Step 3: Commit**

```bash
git add src/components/reveal/__tests__/revealTokens.test.ts
git commit -m "virgo-tv: test resolveConcept env routing"
```

---

### Task 3: Build `usePreloadAssets` hook

**Files:**
- Create: `src/components/reveal/shared/usePreloadAssets.ts`

- [ ] **Step 1: Write the hook**

```ts
"use client";
import { useEffect } from "react";

export function usePreloadAssets(urls: string[]) {
  useEffect(() => {
    const links = urls.map((href) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = href;
      document.head.appendChild(link);
      return link;
    });
    return () => {
      links.forEach((l) => l.remove());
    };
  }, [urls]);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/reveal/shared/usePreloadAssets.ts
git commit -m "virgo-tv: add usePreloadAssets hook"
```

---

### Task 4: Build `RevealShell` skeleton with env routing

**Files:**
- Create: `src/components/reveal/RevealShell.tsx`

- [ ] **Step 1: Write the shell with placeholder concept components**

```tsx
"use client";
import { useEffect, useState, useCallback, type ReactNode } from "react";
import { resolveConcept, REVEAL, type Concept } from "./shared/revealTokens";
import { usePreloadAssets } from "./shared/usePreloadAssets";

const COSMIC_ASSETS = [
  "/reveal/cosmic/nebula-plate.webp",
  "/reveal/cosmic/virgo-constellation.webp",
  "/reveal/cosmic/lens-bloom.webp",
];

const HOLO_ASSETS = [
  "/reveal/holo/holo-panel.webp",
  "/reveal/holo/holo-grid.webp",
  "/reveal/holo/glyph-strip.webp",
];

const SESSION_KEY = "virgo-reveal-seen";

interface Props {
  children: ReactNode;
}

export function RevealShell({ children }: Props) {
  const concept: Concept = resolveConcept(process.env.NEXT_PUBLIC_REVEAL);
  const [revealing, setRevealing] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  usePreloadAssets(concept === "cosmic" ? COSMIC_ASSETS : HOLO_ASSETS);

  const handleComplete = useCallback(() => {
    setContentVisible(true);
    sessionStorage.setItem(SESSION_KEY, "true");
    window.setTimeout(() => setRevealing(false), REVEAL.layerFadeOut * 1000);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "true") {
      setContentVisible(true);
      setRevealing(false);
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setContentVisible(true);
      setRevealing(false);
    }
  }, []);

  return (
    <>
      <div
        style={{
          opacity: contentVisible ? 1 : 0,
          transition: `opacity ${REVEAL.layerFadeOut}s ease-out`,
        }}
      >
        {children}
      </div>
      {revealing && (
        <div
          aria-hidden="true"
          data-testid="reveal-layer"
          data-concept={concept}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: REVEAL.brand.bgDeep,
            pointerEvents: "none",
          }}
        >
          {/* Concept components added in later tasks */}
          <button
            type="button"
            onClick={handleComplete}
            style={{ position: "absolute", inset: 0, opacity: 0 }}
            data-testid="reveal-skip"
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>
      )}
    </>
  );
}
```

The placeholder skip button auto-completes for now; real concept components replace it in later tasks.

- [ ] **Step 2: Wire RevealShell into page.tsx (replace CurtainReveal)**

Modify `src/app/page.tsx`:

```tsx
import { ComingSoon } from "@/components/ComingSoon";
import { RevealShell } from "@/components/reveal/RevealShell";

export default function Home() {
  return (
    <main>
      <RevealShell>
        <ComingSoon />
      </RevealShell>
    </main>
  );
}
```

- [ ] **Step 3: Run dev server and visually confirm**

```bash
npm run dev -- -p 3200
```

Open http://localhost:3200 — page should show black overlay briefly, then content appears (the placeholder skip button does nothing visible). No console errors.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/reveal/RevealShell.tsx src/app/page.tsx
git commit -m "virgo-tv: RevealShell skeleton with env routing + sessionStorage + reduced-motion"
```

---

### Task 5: TDD RevealShell skip behaviors

**Files:**
- Create: `src/components/reveal/__tests__/RevealShell.test.tsx`

- [ ] **Step 1: Write the failing tests**

```tsx
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { RevealShell } from "../RevealShell";

describe("RevealShell", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({
      matches: false, media: "", onchange: null,
      addListener: vi.fn(), removeListener: vi.fn(),
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it("renders children", () => {
    render(<RevealShell><div>page content</div></RevealShell>);
    expect(screen.getByText("page content")).toBeInTheDocument();
  });

  it("renders the reveal layer on first visit", () => {
    render(<RevealShell><div>x</div></RevealShell>);
    expect(screen.getByTestId("reveal-layer")).toBeInTheDocument();
  });

  it("skips the reveal layer when sessionStorage flag is set", () => {
    sessionStorage.setItem("virgo-reveal-seen", "true");
    render(<RevealShell><div>x</div></RevealShell>);
    expect(screen.queryByTestId("reveal-layer")).not.toBeInTheDocument();
  });

  it("skips the reveal layer when reduced-motion is preferred", () => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({
      matches: true, media: "", onchange: null,
      addListener: vi.fn(), removeListener: vi.fn(),
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    render(<RevealShell><div>x</div></RevealShell>);
    expect(screen.queryByTestId("reveal-layer")).not.toBeInTheDocument();
  });

  it("defaults to cosmic concept when env is unset", () => {
    render(<RevealShell><div>x</div></RevealShell>);
    expect(screen.getByTestId("reveal-layer")).toHaveAttribute("data-concept", "cosmic");
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npm test -- src/components/reveal/__tests__/RevealShell.test.tsx
```

Expected: all 5 PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/reveal/__tests__/RevealShell.test.tsx
git commit -m "virgo-tv: test RevealShell skip behaviors"
```

---

## Phase 2 — Cosmic concept

### Task 6: Generate Cosmic ComfyUI assets

**Files:**
- Create: `public/reveal/cosmic/nebula-plate.webp`
- Create: `public/reveal/cosmic/virgo-constellation.webp`
- Create: `public/reveal/cosmic/lens-bloom.webp`

- [ ] **Step 1: Generate `nebula-plate.webp` via ComfyUI MCP**

Use `mcp__comfyui__create_workflow` or an existing image-generation workflow with prompt:

```
cosmic nebula, deep magenta and electric blue, painterly, ultra wide cinematic,
soft star clusters, no text, hyperdetailed, dark background
```

Negative: `text, watermark, logo, low quality, blurry`. Resolution: 2560×1440. Save the result to `public/reveal/cosmic/nebula-plate.webp` (convert PNG→WebP with `cwebp -q 82`).

If the MCP isn't available, place a temporary CSS-gradient placeholder and flag in the commit message.

- [ ] **Step 2: Generate `virgo-constellation.webp`**

Prompt:

```
9 bright white star points arranged as the Virgo zodiac constellation,
transparent background, faint white connecting hint lines, soft glow,
isolated, centered, no other elements, square frame
```

Resolution: 1200×1200, transparent background (force PNG-with-alpha then convert: `cwebp -q 90 -alpha_q 100`).

Save to `public/reveal/cosmic/virgo-constellation.webp`.

- [ ] **Step 3: Generate `lens-bloom.webp`**

Prompt:

```
soft radial light bloom, white core fading to magenta to transparent,
subtle lens flare, isolated on transparent background, centered, square
```

Resolution: 800×800, transparent background. Save to `public/reveal/cosmic/lens-bloom.webp`.

- [ ] **Step 4: Verify file sizes**

```bash
ls -lh public/reveal/cosmic/
```

Expected: nebula-plate ~150 KB, virgo-constellation ~40 KB, lens-bloom ~25 KB. If any file exceeds 300 KB, re-export at lower quality.

- [ ] **Step 5: Commit**

```bash
git add public/reveal/cosmic/
git commit -m "virgo-tv: cosmic reveal ComfyUI assets (nebula, constellation, bloom)"
```

---

### Task 7: Implement CosmicWarp scaffold + canvas warp

**Files:**
- Create: `src/components/reveal/CosmicWarp.tsx`

- [ ] **Step 1: Write the scaffold with canvas particle warp**

```tsx
"use client";
import { useEffect, useRef } from "react";
import { REVEAL } from "./shared/revealTokens";

interface Props { onComplete: () => void; }

interface Particle {
  angle: number;
  radius: number;
  speed: number;
  size: number;
}

export function CosmicWarp({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startedRef = useRef<number>(0);
  const completedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const cores = navigator.hardwareConcurrency ?? 4;
    const isMobile = window.innerWidth < 640;
    const baseCount = isMobile ? 100 : 200;
    const count = cores < 4 ? Math.floor(baseCount * 0.4) : baseCount;

    const particles: Particle[] = Array.from({ length: count }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 0,
      speed: 600 + Math.random() * 1200,
      size: 1 + Math.random() * 2,
    }));

    startedRef.current = performance.now();
    let frame = 0;

    const draw = () => {
      const now = performance.now();
      const t = (now - startedRef.current) / 1000;

      ctx.fillStyle = REVEAL.brand.bgDeep;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      // pinpoint pulse 0.0–0.4s
      if (t < 0.4) {
        const pulse = 1 + Math.sin(t * 12) * 0.4;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(cx, cy, 3 * pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      // warp particles 0.4–2.4s
      if (t >= 0.4 && t < 2.4) {
        const localT = (t - 0.4) / 1.4;
        const accel = Math.min(localT, 1);
        for (const p of particles) {
          p.radius += (p.speed * accel) / 60;
          if (p.radius > Math.hypot(cx, cy) + 20) p.radius = 0;
          const x = cx + Math.cos(p.angle) * p.radius;
          const y = cy + Math.sin(p.angle) * p.radius;
          const tail = Math.min(p.radius * 0.05, 30);
          const x2 = cx + Math.cos(p.angle) * (p.radius - tail);
          const y2 = cy + Math.sin(p.angle) * (p.radius - tail);
          const grad = ctx.createLinearGradient(x, y, x2, y2);
          grad.addColorStop(0, "rgba(255,255,255,0.9)");
          grad.addColorStop(0.5, "rgba(34,211,238,0.6)");
          grad.addColorStop(1, "rgba(217,70,239,0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      if (t < REVEAL.contentRevealAt && !completedRef.current) {
        frame = requestAnimationFrame(draw);
      } else if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    };
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
```

- [ ] **Step 2: Wire CosmicWarp into RevealShell**

In `src/components/reveal/RevealShell.tsx`, replace the placeholder skip button with:

```tsx
import { CosmicWarp } from "./CosmicWarp";
// import { HoloBoot } from "./HoloBoot"; // added in Task 12
```

Inside the reveal layer, replace the `<button data-testid="reveal-skip" />` block with:

```tsx
{concept === "cosmic" && <CosmicWarp onComplete={handleComplete} />}
{/* {concept === "holo" && <HoloBoot onComplete={handleComplete} />} — Task 12 */}
```

- [ ] **Step 3: Visually verify in dev**

```bash
npm run dev -- -p 3200
```

Open http://localhost:3200, hard-refresh (Cmd/Ctrl+Shift+R) to clear sessionStorage. You should see: black screen → pinpoint pulse → 200 particles streaking outward in white→cyan→magenta over ~2s → page content fades in at ~2.9s.

If particles look wrong (too dense, too sparse, wrong color), tweak the constants in this task and re-test before moving on.

Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/reveal/CosmicWarp.tsx src/components/reveal/RevealShell.tsx
git commit -m "virgo-tv: cosmic warp particle phase (canvas)"
```

---

### Task 8: Add nebula + constellation + bloom phases to CosmicWarp

**Files:**
- Modify: `src/components/reveal/CosmicWarp.tsx`

- [ ] **Step 1: Add image refs and overlay layers**

Inside `CosmicWarp`, add Framer Motion image overlays above the canvas. The full updated return:

```tsx
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// ... inside the component, replace the return statement with:
return (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
    <AnimatePresence>
      {phase >= "nebula" && (
        <motion.div
          key="nebula"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.85, scale: 1.0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: REVEAL.ease.decel }}
          style={{ position: "absolute", inset: 0 }}
        >
          <Image
            src="/reveal/cosmic/nebula-plate.webp"
            alt=""
            fill
            priority
            style={{ objectFit: "cover" }}
          />
        </motion.div>
      )}
      {phase >= "constellation" && (
        <motion.div
          key="con"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative", width: 480, height: 480 }}>
            <Image
              src="/reveal/cosmic/virgo-constellation.webp"
              alt=""
              fill
              priority
              style={{ objectFit: "contain" }}
            />
          </div>
        </motion.div>
      )}
      {phase >= "bloom" && (
        <motion.div
          key="bloom"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative", width: 600, height: 600 }}>
            <Image
              src="/reveal/cosmic/lens-bloom.webp"
              alt=""
              fill
              priority
              style={{ objectFit: "contain" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
```

- [ ] **Step 2: Add phase state machine**

Add at the top of the component (alongside other refs):

```tsx
import { useState } from "react";

type Phase = "warp" | "nebula" | "constellation" | "bloom";
const PHASE_ORDER: Phase[] = ["warp", "nebula", "constellation", "bloom"];

// inside component:
const [phase, setPhase] = useState<Phase>("warp");

// And replace the comparison `phase >= "nebula"` etc. with:
// PHASE_ORDER.indexOf(phase) >= PHASE_ORDER.indexOf("nebula")
```

Update each `{phase >= "x" &&` in step 1's JSX to use `PHASE_ORDER.indexOf(phase) >= PHASE_ORDER.indexOf("x")`.

- [ ] **Step 3: Drive phases from animation timeline**

Inside the `draw()` function in `useEffect`, add phase transitions just before the `requestAnimationFrame` recursion:

```tsx
if (t >= 1.8 && phase === "warp") setPhase("nebula");
if (t >= 2.4 && phase === "nebula") setPhase("constellation");
if (t >= 2.7 && phase === "constellation") setPhase("bloom");
```

Note: `setPhase` calls inside `draw()` need access to current `phase` — capture via a ref to avoid stale closures:

```tsx
const phaseRef = useRef<Phase>("warp");
const advancePhase = (next: Phase) => {
  if (phaseRef.current !== next) {
    phaseRef.current = next;
    setPhase(next);
  }
};
// in draw():
if (t >= 1.8) advancePhase("nebula");
if (t >= 2.4) advancePhase("constellation");
if (t >= 2.7) advancePhase("bloom");
```

- [ ] **Step 4: Visually verify in dev**

```bash
npm run dev -- -p 3200
```

Hard-refresh http://localhost:3200. Expected sequence: black → pinpoint pulse → particle warp → nebula fades in behind decelerating particles → constellation appears → lens bloom blooms → page content visible at 2.9s.

Stop the dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/reveal/CosmicWarp.tsx
git commit -m "virgo-tv: cosmic warp nebula + constellation + bloom phases"
```

---

### Task 9: Add SVG constellation line-draw to CosmicWarp

**Files:**
- Modify: `src/components/reveal/CosmicWarp.tsx`

- [ ] **Step 1: Add the SVG overlay**

Inside the `constellation` phase block (next to the constellation `<Image>`), add an SVG with 8 line segments that draw via `stroke-dasharray`:

```tsx
{/* Connector lines drawn as SVG with stroke-dasharray animation */}
<svg
  viewBox="0 0 480 480"
  style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
>
  {[
    "M120,80 L180,140",
    "M180,140 L220,200",
    "M220,200 L240,260",
    "M240,260 L280,320",
    "M280,320 L320,360",
    "M180,140 L260,180",
    "M260,180 L340,200",
    "M240,260 L300,280",
  ].map((d, i) => (
    <motion.path
      key={d}
      d={d}
      stroke="rgba(255,255,255,0.7)"
      strokeWidth={1.5}
      fill="none"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{
        duration: 0.4,
        delay: 0.06 * i,
        ease: REVEAL.ease.decel,
      }}
    />
  ))}
</svg>
```

The `M…L…` paths are stylized — they don't need to match the constellation image perfectly, just feel related. Eyeball-fit them to the star points in the image after first render.

- [ ] **Step 2: Visually verify in dev**

```bash
npm run dev -- -p 3200
```

Hard-refresh. Confirm thin white lines now draw between the constellation stars from t=2.4 onwards. Adjust the path coordinates if lines miss the stars.

Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add src/components/reveal/CosmicWarp.tsx
git commit -m "virgo-tv: cosmic warp SVG constellation line-draw"
```

---

## Phase 3 — Holo concept

### Task 10: Generate Holo ComfyUI assets

**Files:**
- Create: `public/reveal/holo/holo-panel.webp`
- Create: `public/reveal/holo/holo-grid.webp`
- Create: `public/reveal/holo/glyph-strip.webp`

- [ ] **Step 1: Generate `holo-panel.webp`**

ComfyUI prompt:

```
translucent frosted glass UI frame, thin cyan neon edge glow,
holographic, transparent background, isolated, slight chromatic
aberration on edges, futuristic HUD element, Apple Vision Pro
aesthetic, no text content, no fill, just the frame
```

Negative: `solid fill, opaque, text, dark frame, border heavy`. Resolution: 800×500, transparent background.

Save to `public/reveal/holo/holo-panel.webp` (~50 KB target).

- [ ] **Step 2: Generate `holo-grid.webp`**

```
perspective grid horizon, thin cyan lines on dark navy background,
vanishing point at top center, Vision Pro home aesthetic,
ultra-wide cinematic, futuristic, no text
```

Resolution: 2560×800. Save to `public/reveal/holo/holo-grid.webp` (~70 KB).

- [ ] **Step 3: Generate `glyph-strip.webp`**

```
horizontal strip of futuristic sci-fi glyphs and data text,
thin cyan characters on dark transparent background, tileable,
HUD readout typography, no Latin letters, abstract symbols
```

Resolution: 1024×128, transparent background. Save to `public/reveal/holo/glyph-strip.webp` (~30 KB).

- [ ] **Step 4: Verify sizes**

```bash
ls -lh public/reveal/holo/
```

If any > 200 KB, recompress.

- [ ] **Step 5: Commit**

```bash
git add public/reveal/holo/
git commit -m "virgo-tv: holo reveal ComfyUI assets (panel, grid, glyph-strip)"
```

---

### Task 11: Build HoloBoot scaffold (grid + panels)

**Files:**
- Create: `src/components/reveal/HoloBoot.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { REVEAL } from "./shared/revealTokens";

interface Props { onComplete: () => void; }

const PANELS = [
  { x: "20%", y: "25%", z: -100, scale: 0.85 },
  { x: "78%", y: "25%", z: -150, scale: 0.85 },
  { x: "20%", y: "75%", z: -120, scale: 0.85 },
  { x: "78%", y: "75%", z: -140, scale: 0.85 },
  { x: "50%", y: "50%", z: 0, scale: 1.1 },
];

export function HoloBoot({ onComplete }: Props) {
  const completedRef = useRef(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const visiblePanels = isMobile ? [PANELS[0], PANELS[1], PANELS[4]] : PANELS;

  useEffect(() => {
    const id = window.setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }, REVEAL.contentRevealAt * 1000);
    return () => window.clearTimeout(id);
  }, [onComplete]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: REVEAL.brand.bgDeep,
        perspective: 1200,
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(34,211,238,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Grid sweep */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.4, delay: 0.1, ease: REVEAL.ease.decel }}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "60%",
          transformOrigin: "bottom",
          transform: "rotateX(15deg)",
        }}
      >
        <Image
          src="/reveal/holo/holo-grid.webp"
          alt=""
          fill
          priority
          style={{ objectFit: "cover" }}
        />
      </motion.div>

      {/* Panels */}
      {visiblePanels.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.6, z: -200 }}
          animate={{ opacity: 1, scale: p.scale, z: p.z }}
          transition={{
            duration: 0.6,
            delay: 0.5 + i * 0.08,
            ease: REVEAL.ease.bounce,
          }}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: 280,
            height: 175,
            transform: "translate(-50%, -50%)",
            transformStyle: "preserve-3d",
            boxShadow: "0 0 0 1px rgba(34,211,238,0.4), 0 0 24px rgba(34,211,238,0.18)",
            filter: i === 4 ? "none" : "drop-shadow(0 0 8px rgba(34,211,238,0.3))",
          }}
        >
          <Image
            src="/reveal/holo/holo-panel.webp"
            alt=""
            fill
            priority
            style={{ objectFit: "contain" }}
          />
        </motion.div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Wire HoloBoot into RevealShell**

In `src/components/reveal/RevealShell.tsx`, uncomment the holo import and conditional:

```tsx
import { HoloBoot } from "./HoloBoot";

// inside the reveal layer:
{concept === "cosmic" && <CosmicWarp onComplete={handleComplete} />}
{concept === "holo" && <HoloBoot onComplete={handleComplete} />}
```

- [ ] **Step 3: Visually verify**

Run dev with the holo flag:

```bash
NEXT_PUBLIC_REVEAL=holo npm run dev -- -p 3200
```

Hard-refresh http://localhost:3200. Expected: dark scene → grid sweeps up from bottom with perspective tilt → 5 frosted-glass panels materialize around center with stagger → content fades in at 2.9s.

If panels look wrong (too small, too cramped, wrong glow), tweak `PANELS` and styling, then re-test.

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/reveal/HoloBoot.tsx src/components/reveal/RevealShell.tsx
git commit -m "virgo-tv: holo boot grid sweep + panel materialize"
```

---

### Task 12: Add scan-lines + glyph stream + glitch to HoloBoot

**Files:**
- Modify: `src/components/reveal/HoloBoot.tsx`

- [ ] **Step 1: Add a scan-line overlay inside each panel**

Inside the `visiblePanels.map(...)` JSX, nest these inside each panel `<motion.div>`:

```tsx
{/* Glyph strip scrolling inside panel */}
<motion.div
  initial={{ x: "-100%" }}
  animate={{ x: "100%" }}
  transition={{
    duration: 1.6,
    delay: 1.1 + i * 0.05,
    ease: "linear",
  }}
  style={{
    position: "absolute",
    inset: "20% 5% 20% 5%",
    backgroundImage: "url(/reveal/holo/glyph-strip.webp)",
    backgroundRepeat: "repeat-x",
    backgroundSize: "auto 100%",
    opacity: 0.35,
    mixBlendMode: "screen",
  }}
/>
{/* Scan-line sweep */}
<motion.div
  initial={{ y: "-100%", opacity: 0 }}
  animate={{ y: "100%", opacity: [0, 1, 0] }}
  transition={{
    duration: 0.4,
    delay: 1.5 + i * 0.06,
    ease: "linear",
  }}
  style={{
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 4,
    background: "linear-gradient(90deg, transparent, #22d3ee, transparent)",
    boxShadow: "0 0 12px rgba(34,211,238,0.8)",
    pointerEvents: "none",
  }}
/>
```

- [ ] **Step 2: Add a CSS-keyframe glitch on the center panel only**

Add this to the bottom of the file (outside the component):

```tsx
const glitchStyle = `
@keyframes virgoHoloGlitch {
  0%, 100% { clip-path: inset(0 0 0 0); transform: translate(-50%, -50%) translateX(0); }
  20% { clip-path: inset(40% 0 30% 0); transform: translate(-50%, -50%) translateX(-3px); }
  40% { clip-path: inset(10% 0 70% 0); transform: translate(-50%, -50%) translateX(3px); }
  60% { clip-path: inset(0 0 0 0); transform: translate(-50%, -50%) translateX(0); }
}
`;
```

Add a `<style>` tag at the top of the returned JSX:

```tsx
<style dangerouslySetInnerHTML={{ __html: glitchStyle }} />
```

For the center panel (`i === 4`), add `animation: "virgoHoloGlitch 60ms linear 1.7s 1"` to its inline style.

- [ ] **Step 3: Visually verify**

```bash
NEXT_PUBLIC_REVEAL=holo npm run dev -- -p 3200
```

Hard-refresh. Expected: panels appear → glyphs scroll across them → cyan scan-line sweeps top-to-bottom on each → center panel does a 60ms clip-path jitter at ~1.7s.

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/components/reveal/HoloBoot.tsx
git commit -m "virgo-tv: holo boot scan-lines + glyph stream + glitch"
```

---

### Task 13: Add panel rush-forward + pixel dissolve to HoloBoot

**Files:**
- Modify: `src/components/reveal/HoloBoot.tsx`

- [ ] **Step 1: Add a phase state for the resolve sequence**

```tsx
import { useState } from "react";

type Phase = "boot" | "rush" | "resolve";

// inside component:
const [phase, setPhase] = useState<Phase>("boot");

useEffect(() => {
  const t1 = window.setTimeout(() => setPhase("rush"), 2000);
  const t2 = window.setTimeout(() => setPhase("resolve"), 2500);
  return () => {
    window.clearTimeout(t1);
    window.clearTimeout(t2);
  };
}, []);
```

- [ ] **Step 2: Animate outer panels rushing forward**

Update the panel `<motion.div>` `animate` prop to use `phase`:

```tsx
animate={
  phase === "boot"
    ? { opacity: 1, scale: p.scale, z: p.z }
    : phase === "rush" && i !== 4
      ? { opacity: 0, scale: p.scale * 1.5, z: 800 }
      : phase === "rush" && i === 4
        ? { opacity: 1, scale: 1.4, z: 100 }
        : { opacity: 1, scale: 1, z: 0 } // resolve: center settles
}
transition={{
  duration: phase === "rush" ? 0.5 : 0.6,
  delay: phase === "boot" ? 0.5 + i * 0.08 : 0,
  ease: phase === "rush" ? REVEAL.ease.warpAccel : REVEAL.ease.bounce,
}}
```

- [ ] **Step 3: Add a holo-edge shimmer to the center panel during resolve**

Inside the center panel only (`i === 4`), conditionally render:

```tsx
{phase === "resolve" && (
  <motion.div
    initial={{ x: "-100%", opacity: 0.8 }}
    animate={{ x: "100%", opacity: 0 }}
    transition={{ duration: 0.4, ease: "linear" }}
    style={{
      position: "absolute",
      inset: 0,
      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
      mixBlendMode: "screen",
    }}
  />
)}
```

- [ ] **Step 4: Visually verify**

```bash
NEXT_PUBLIC_REVEAL=holo npm run dev -- -p 3200
```

Hard-refresh. Expected sequence: grid+panels boot → glyphs/scanlines/glitch → at t=2.0 outer panels rush forward and fade → center panel scales toward camera with shimmer sweep → resolves → content visible at 2.9s.

Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add src/components/reveal/HoloBoot.tsx
git commit -m "virgo-tv: holo boot panel rush + center resolve + shimmer"
```

---

## Phase 4 — Integration & cleanup

### Task 14: Cross-concept QA on local + Vercel preview

**Files:** none changed.

- [ ] **Step 1: Build production bundle locally**

```bash
npm run build
```

Expected: build succeeds. No TypeScript errors. No new lint warnings related to reveal code.

- [ ] **Step 2: Run prod server, test cosmic concept**

```bash
npm start -- -p 3200
```

Open http://localhost:3200 in incognito Chrome. Verify cosmic reveal plays smoothly. Open DevTools Performance, record a reload, confirm no frames drop below 30fps during the 3.2s reveal.

- [ ] **Step 3: Test holo concept**

Stop the prod server. Re-run with the env var:

```bash
NEXT_PUBLIC_REVEAL=holo npm start -- -p 3200
```

Re-test in incognito. Same performance check.

- [ ] **Step 4: Test reduced-motion**

Enable reduced-motion (macOS: System Settings → Accessibility → Display → Reduce motion / Linux: GNOME accessibility settings). Reload http://localhost:3200. Reveal should be skipped, content visible immediately with a soft fade.

- [ ] **Step 5: Test sessionStorage skip**

Disable reduced-motion. In incognito, reload the page — reveal plays. Reload again without closing the tab — reveal is skipped. Close tab, open new incognito tab — reveal plays again.

- [ ] **Step 6: Test mobile**

Open Chrome DevTools Device Mode → iPhone 14 Pro. Reload both concepts. Verify particle/panel counts feel right (cosmic ~100 particles, holo 3 panels).

Stop the prod server. No commit (this task is verification-only).

---

### Task 15: Deploy a Vercel preview for both concepts and pick the winner

**Files:** none changed in this task.

- [ ] **Step 1: Push branch and create Vercel preview**

```bash
git push origin main
```

Wait for Vercel auto-deploy. Open the preview URL (find via `vercel ls` or the GitHub commit status). Default concept = cosmic.

- [ ] **Step 2: Set the holo env var temporarily and redeploy preview**

```bash
vercel env add NEXT_PUBLIC_REVEAL preview <<< "holo"
vercel --yes
```

Test the new preview URL.

- [ ] **Step 3: Make the call**

User picks cosmic or holo. Record decision in commit message in the next task.

- [ ] **Step 4: Set production env to winning concept**

```bash
# If cosmic wins, no action needed (default).
# If holo wins:
printf 'holo' | vercel env add NEXT_PUBLIC_REVEAL production
```

(Use `printf` not `echo` — trailing newline corrupts env values per project memory.)

- [ ] **Step 5: Remove the preview-scoped env var**

```bash
vercel env rm NEXT_PUBLIC_REVEAL preview --yes
```

---

### Task 16: Delete the losing concept + old CurtainReveal

**Files:**
- Delete: `src/components/CurtainReveal.tsx`
- Delete: losing concept's `.tsx` file and `public/reveal/<loser>/` directory
- Modify: `src/components/reveal/RevealShell.tsx` (remove losing branch)

- [ ] **Step 1: Delete the old curtain reveal**

```bash
git rm src/components/CurtainReveal.tsx
```

- [ ] **Step 2: Delete the losing concept**

If holo lost:

```bash
git rm src/components/reveal/HoloBoot.tsx
git rm -r public/reveal/holo
```

If cosmic lost:

```bash
git rm src/components/reveal/CosmicWarp.tsx
git rm -r public/reveal/cosmic
```

- [ ] **Step 3: Simplify RevealShell to only the winner**

Edit `src/components/reveal/RevealShell.tsx`:
- Remove the unused concept import
- Replace the conditional render with the single winning component
- Keep `resolveConcept` and the env var path for now (in case a future concept gets added)
- Remove the unused asset constant

- [ ] **Step 4: Remove the now-unused test for the losing concept's data-concept value**

Open `src/components/reveal/__tests__/RevealShell.test.tsx`. Update the `defaults to cosmic concept` test if cosmic lost.

- [ ] **Step 5: Build and test**

```bash
npm run build
npm test
```

Both must pass.

- [ ] **Step 6: Commit + push**

```bash
git add -A
git commit -m "virgo-tv: ship <winner> reveal, remove losing concept + old curtain"
git push origin main
```

Wait for Vercel production deploy. Verify on https://virgo-tv.vercel.app.

---

## Self-Review

Spec coverage check:

- [x] Concept A — Tasks 6, 7, 8, 9
- [x] Concept B — Tasks 10, 11, 12, 13
- [x] RevealShell with env routing — Task 4
- [x] sessionStorage skip — Task 4 (logic) + Task 5 (test)
- [x] Reduced-motion fallback — Task 4 + Task 5
- [x] Asset preload via `usePreloadAssets` — Tasks 3, 4
- [x] ComfyUI assets generated — Tasks 6, 10
- [x] Mobile responsiveness — Tasks 7 (cosmic particles), 11 (holo panel count)
- [x] Slow device fallback (`hardwareConcurrency`) — Task 7
- [x] Visual QA on localhost + Vercel — Task 14, 15
- [x] Vitest coverage of shell logic — Tasks 2, 5
- [x] Old `CurtainReveal.tsx` deleted — Task 16
- [x] Loser deleted after pick — Task 16
- [x] `REVEAL_OFFSET` stays at 2.9 — `ComingSoon.tsx` is not modified (only `page.tsx` swaps the wrapper)

Type consistency check: `Concept`, `Phase`, `Particle`, `Props`, `REVEAL` constants are defined once and reused. `onComplete: () => void` signature identical across both concepts.

No placeholder steps; every code step contains the actual code or command.

---

Plan complete and saved to `docs/superpowers/plans/2026-04-17-virgo-tv-reveal.md`.
