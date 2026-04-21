export const REVEAL = {
  totalDuration: 4.8,        // seconds, full reveal layer lifetime
  contentRevealAt: 4.5,      // seconds, when onComplete fires
  layerFadeOut: 0.3,         // seconds, reveal layer fade after onComplete
  logoPopAt: 3.5,            // seconds, when logo finale begins (each concept)
  logoHold: 1.0,             // seconds, logo pop+hold duration before content
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
