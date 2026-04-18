"use client";

import { motion } from "framer-motion";

export function OrbitalRing() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2"
      initial={{ opacity: 0, rotate: 0, scale: 0.9 }}
      animate={{ opacity: 1, rotate: 360, scale: 1 }}
      transition={{
        opacity: { duration: 1.2, delay: 0.4 },
        scale: { duration: 1.2, delay: 0.4 },
        rotate: { duration: 40, repeat: Infinity, ease: "linear" },
      }}
    >
      <svg
        width="760"
        height="760"
        viewBox="0 0 760 760"
        className="max-w-[90vw]"
      >
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--brand-magenta)" stopOpacity="0.9" />
            <stop offset="50%" stopColor="var(--brand-blue)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--brand-purple)" stopOpacity="0.9" />
          </linearGradient>
          <filter id="ringGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
        <ellipse cx="380" cy="380" rx="360" ry="120" fill="none" stroke="url(#ringGrad)" strokeWidth="2" filter="url(#ringGlow)" />
        <ellipse cx="380" cy="380" rx="360" ry="120" fill="none" stroke="url(#ringGrad)" strokeWidth="1" />
      </svg>
    </motion.div>
  );
}
