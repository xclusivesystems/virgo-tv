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
