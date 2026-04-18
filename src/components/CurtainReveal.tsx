"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const CURTAIN_DURATION = 1.9;
const CURTAIN_DELAY = 0.4;
const STRIPS = 8;
const STRIP_STAGGER = 0.05;

const CURTAIN_BG = `
  repeating-linear-gradient(
    90deg,
    #3a0010 0px,
    #5a0018 6px,
    #7e0024 12px,
    #5a0018 18px,
    #3a0010 24px
  )
`;

interface PanelProps {
  side: "left" | "right";
}

function CurtainPanel({ side }: PanelProps) {
  const isLeft = side === "left";
  return (
    <div
      className={`absolute top-0 h-full w-1/2 ${isLeft ? "left-0" : "right-0"}`}
    >
      {Array.from({ length: STRIPS }).map((_, i) => {
        // Strips closer to the inner (center) edge animate first, outer ones lag.
        // For left panel: strip[STRIPS-1] is the inner edge → smallest delay.
        // For right panel: strip[0] is the inner edge → smallest delay.
        const innerIndex = isLeft ? STRIPS - 1 - i : i;
        const delay = CURTAIN_DELAY + innerIndex * STRIP_STAGGER;
        const stripWidthPct = 100 / STRIPS;
        const leftPct = i * stripWidthPct;
        const isInnermost = innerIndex === 0;

        return (
          <motion.div
            key={i}
            className="absolute top-0 h-full"
            style={{
              left: `${leftPct}%`,
              width: `${stripWidthPct + 0.3}%`, // overlap to hide hairline gaps
              background: CURTAIN_BG,
              boxShadow: isLeft
                ? `inset -8px 0 14px rgba(0,0,0,0.55), inset 8px 0 12px rgba(0,0,0,0.35)`
                : `inset 8px 0 14px rgba(0,0,0,0.55), inset -8px 0 12px rgba(0,0,0,0.35)`,
              transformOrigin: isLeft ? "left center" : "right center",
              willChange: "transform",
            }}
            initial={{
              x: 0,
              skewX: 0,
              scaleX: 1,
            }}
            animate={{
              x: isLeft ? "-110%" : "110%",
              // Slight skew during pull → fabric tilts toward leading edge
              skewX: isLeft ? [-0, -4, 0] : [0, 4, 0],
              // Slight horizontal compression as the fold bunches
              scaleX: [1, 0.92, 1],
            }}
            transition={{
              duration: CURTAIN_DURATION,
              delay,
              ease: [0.65, 0, 0.35, 1],
              skewX: { duration: CURTAIN_DURATION, delay, times: [0, 0.5, 1] },
              scaleX: { duration: CURTAIN_DURATION, delay, times: [0, 0.55, 1] },
            }}
          >
            {/* shadow on the trailing (back) edge of each strip — fold depth */}
            <div
              className="pointer-events-none absolute top-0 h-full w-full"
              style={{
                background: isLeft
                  ? "linear-gradient(90deg, rgba(0,0,0,0.35) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.55) 100%)"
                  : "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.35) 100%)",
              }}
            />
            {/* gold trim on innermost strip's center-facing edge */}
            {isInnermost && (
              <div
                className={`absolute top-0 h-full w-2 ${isLeft ? "right-0" : "left-0"}`}
                style={{
                  background: isLeft
                    ? "linear-gradient(90deg, transparent, rgba(255,210,90,0.55))"
                    : "linear-gradient(-90deg, transparent, rgba(255,210,90,0.55))",
                  boxShadow: "0 0 14px rgba(255,210,90,0.45)",
                }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export function CurtainReveal({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDone(true);
      return;
    }
    const totalMs =
      (CURTAIN_DELAY + CURTAIN_DURATION + STRIPS * STRIP_STAGGER) * 1000 + 200;
    const t = setTimeout(() => setDone(true), totalMs);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {children}

      {!done && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
        >
          <CurtainPanel side="left" />
          <CurtainPanel side="right" />

          {/* gold valance at top */}
          <motion.div
            className="absolute left-0 top-0 h-6 w-full"
            style={{
              background:
                "linear-gradient(180deg, #2a0008, #1a0006 40%, transparent)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.6)",
            }}
            initial={{ y: 0 }}
            animate={{ y: "-100%" }}
            transition={{
              duration: CURTAIN_DURATION * 0.6,
              delay: CURTAIN_DELAY + CURTAIN_DURATION * 0.45,
              ease: [0.7, 0, 0.3, 1],
            }}
          />
        </div>
      )}
    </>
  );
}
