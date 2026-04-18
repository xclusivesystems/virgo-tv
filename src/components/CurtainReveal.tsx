"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const CURTAIN_DURATION = 1.8;
const CURTAIN_DELAY = 0.4;

const CURTAIN_BG = `
  repeating-linear-gradient(
    90deg,
    #4a0010 0px,
    #6e0018 14px,
    #8a0020 28px,
    #6e0018 42px,
    #4a0010 56px
  )
`;

const CURTAIN_SHADOW =
  "inset -40px 0 60px rgba(0,0,0,0.6), inset 0 -30px 40px rgba(0,0,0,0.5)";

const CURTAIN_SHADOW_RIGHT =
  "inset 40px 0 60px rgba(0,0,0,0.6), inset 0 -30px 40px rgba(0,0,0,0.5)";

export function CurtainReveal({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDone(true);
      return;
    }
    const t = setTimeout(
      () => setDone(true),
      (CURTAIN_DELAY + CURTAIN_DURATION) * 1000 + 200,
    );
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
          <motion.div
            className="absolute left-0 top-0 h-full w-1/2"
            style={{
              background: CURTAIN_BG,
              boxShadow: CURTAIN_SHADOW,
            }}
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{
              duration: CURTAIN_DURATION,
              delay: CURTAIN_DELAY,
              ease: [0.7, 0, 0.3, 1],
            }}
          >
            <div
              className="absolute right-0 top-0 h-full w-3"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,210,90,0.45))",
                boxShadow: "0 0 12px rgba(255,210,90,0.4)",
              }}
            />
          </motion.div>

          <motion.div
            className="absolute right-0 top-0 h-full w-1/2"
            style={{
              background: CURTAIN_BG,
              boxShadow: CURTAIN_SHADOW_RIGHT,
            }}
            initial={{ x: 0 }}
            animate={{ x: "100%" }}
            transition={{
              duration: CURTAIN_DURATION,
              delay: CURTAIN_DELAY,
              ease: [0.7, 0, 0.3, 1],
            }}
          >
            <div
              className="absolute left-0 top-0 h-full w-3"
              style={{
                background:
                  "linear-gradient(-90deg, transparent, rgba(255,210,90,0.45))",
                boxShadow: "0 0 12px rgba(255,210,90,0.4)",
              }}
            />
          </motion.div>

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
              delay: CURTAIN_DELAY + CURTAIN_DURATION * 0.4,
              ease: [0.7, 0, 0.3, 1],
            }}
          />
        </div>
      )}
    </>
  );
}
