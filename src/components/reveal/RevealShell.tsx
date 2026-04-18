"use client";
import { useEffect, useState, useCallback, type ReactNode } from "react";
import { resolveConcept, REVEAL, type Concept } from "./shared/revealTokens";
import { usePreloadAssets } from "./shared/usePreloadAssets";
import { CosmicWarp } from "./CosmicWarp";
import { HoloBoot } from "./HoloBoot";

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
          {concept === "cosmic" && <CosmicWarp onComplete={handleComplete} />}
          {concept === "holo" && <HoloBoot onComplete={handleComplete} />}
        </div>
      )}
    </>
  );
}
