"use client";
import { useEffect, useRef, useState } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const id = window.setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }, REVEAL.contentRevealAt * 1000);
    return () => window.clearTimeout(id);
  }, [onComplete]);

  const visiblePanels = isMobile ? [PANELS[0], PANELS[1], PANELS[4]] : PANELS;

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
          mixBlendMode: "screen",
        }}
      >
        <Image
          src="/reveal/holo/holo-grid.webp"
          alt=""
          fill
          priority
          sizes="100vw"
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
            mixBlendMode: "screen",
          }}
        >
          <Image
            src="/reveal/holo/holo-panel.webp"
            alt=""
            fill
            priority
            sizes="280px"
            style={{ objectFit: "contain" }}
          />
        </motion.div>
      ))}
    </div>
  );
}
