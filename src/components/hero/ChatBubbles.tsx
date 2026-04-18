"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Bubble {
  id: number;
  left: number;
  delay: number;
  duration: number;
  scale: number;
  hue: "purple" | "magenta" | "blue";
}

const HUES: Record<Bubble["hue"], string> = {
  purple: "rgba(107,47,179,0.35)",
  magenta: "rgba(225,29,116,0.32)",
  blue: "rgba(45,212,255,0.3)",
};

export function ChatBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const huesList: Bubble["hue"][] = ["purple", "magenta", "blue"];
    setBubbles(
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 10,
        duration: 14 + Math.random() * 10,
        scale: 0.6 + Math.random() * 0.9,
        hue: huesList[i % 3]!,
      })),
    );
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {bubbles.map((b) => (
        <motion.span
          key={b.id}
          className="absolute bottom-[-40px] block rounded-full"
          style={{
            left: `${b.left}%`,
            width: 28 * b.scale,
            height: 18 * b.scale,
            background: HUES[b.hue],
            boxShadow: `0 0 14px ${HUES[b.hue]}`,
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: "-110vh", opacity: [0, 0.8, 0] }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
