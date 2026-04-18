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

type HoloPhase = "boot" | "rush" | "resolve" | "logo";

export function HoloBoot({ onComplete }: Props) {
  const completedRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const [phase, setPhase] = useState<HoloPhase>("boot");

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const t1 = window.setTimeout(() => setPhase("rush"), 2800);
    const t2 = window.setTimeout(() => setPhase("resolve"), 3300);
    const t3 = window.setTimeout(() => setPhase("logo"), 3500);
    const tComplete = window.setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }, REVEAL.contentRevealAt * 1000);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(tComplete);
    };
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
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes virgoHoloGlitch {
          0%, 100% { clip-path: inset(0 0 0 0); transform: translateX(0); }
          20% { clip-path: inset(40% 0 30% 0); transform: translateX(-3px); }
          40% { clip-path: inset(10% 0 70% 0); transform: translateX(3px); }
          60% { clip-path: inset(0 0 0 0); transform: translateX(0); }
        }
      ` }} />
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
        transition={{ duration: 0.5, delay: 0.1, ease: REVEAL.ease.decel }}
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
      {visiblePanels.map((p, i) => {
        const isCenter = i === visiblePanels.length - 1;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.6, z: -200 }}
            animate={
              phase === "boot"
                ? { opacity: 1, scale: p.scale, z: p.z }
                : phase === "rush" && !isCenter
                  ? { opacity: 0, scale: p.scale * 1.5, z: 800 }
                  : phase === "rush" && isCenter
                    ? { opacity: 1, scale: 1.4, z: 100 }
                    : phase === "resolve" && isCenter
                      ? { opacity: 1, scale: 1, z: 0 }  // settles
                      : phase === "logo" && isCenter
                        ? { opacity: 0, scale: 1.6, z: 200 }  // dissolves into logo
                        : { opacity: 0 }  // outer panels stay gone in resolve/logo
            }
            transition={{
              duration: phase === "rush" ? 0.5 : 0.8,
              delay: phase === "boot" ? 0.7 + i * 0.1 : 0,
              ease: phase === "rush" ? REVEAL.ease.warpAccel : REVEAL.ease.bounce,
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
            {/* Inner wrapper: isolates glitch animation from Framer Motion transforms */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                animation:
                  isCenter
                    ? "virgoHoloGlitch 60ms linear 2.3s 1"
                    : undefined,
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

              {/* Glyph strip scrolling inside panel */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.6,
                  delay: 1.5 + i * 0.05,
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
                  pointerEvents: "none",
                }}
              />

              {/* Scan-line sweep */}
              <motion.div
                initial={{ y: "-100%", opacity: 0 }}
                animate={{ y: "100%", opacity: [0, 1, 0] }}
                transition={{
                  duration: 0.4,
                  delay: 1.9 + i * 0.06,
                  ease: "linear",
                }}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  height: 4,
                  background:
                    "linear-gradient(90deg, transparent, #22d3ee, transparent)",
                  boxShadow: "0 0 12px rgba(34,211,238,0.8)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Shimmer sweep — resolve phase, center panel only */}
            {phase === "resolve" && isCenter && (
              <motion.div
                initial={{ x: "-100%", opacity: 0.8 }}
                animate={{ x: "100%", opacity: 0 }}
                transition={{ duration: 0.4, ease: "linear" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                  mixBlendMode: "screen",
                  pointerEvents: "none",
                }}
              />
            )}
          </motion.div>
        );
      })}

      {/* Logo finale — pops in during logo phase */}
      {phase === "logo" && (
        <motion.div
          key="logo"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: [0.4, 1.1, 1.0] }}
          transition={{ duration: 0.7, ease: REVEAL.ease.bounce, times: [0, 0.65, 1] }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ position: "relative", width: 360, height: 360, filter: "drop-shadow(0 0 40px rgba(34,211,238,0.55)) drop-shadow(0 0 80px rgba(217,70,239,0.3))" }}>
            <Image
              src="/logo.png"
              alt="Virgo TV"
              fill
              priority
              sizes="360px"
              style={{ objectFit: "contain" }}
            />
            {/* Cyan shimmer sweep */}
            <motion.div
              initial={{ x: "-120%", opacity: 0 }}
              animate={{ x: "120%", opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, delay: 0.3, ease: "linear" }}
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(110deg, transparent 30%, rgba(34,211,238,0.55) 50%, transparent 70%)",
                mixBlendMode: "screen",
                pointerEvents: "none",
              }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
