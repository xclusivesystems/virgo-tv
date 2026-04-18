"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { REVEAL } from "./shared/revealTokens";

interface Props { onComplete: () => void; }

interface Particle {
  angle: number;
  radius: number;
  speed: number;
  size: number;
}

type Phase = "warp" | "nebula" | "constellation" | "bloom" | "logo";
const PHASE_ORDER: Phase[] = ["warp", "nebula", "constellation", "bloom", "logo"];
const phaseAtLeast = (current: Phase, target: Phase) =>
  PHASE_ORDER.indexOf(current) >= PHASE_ORDER.indexOf(target);

export function CosmicWarp({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startedRef = useRef<number>(0);
  const completedRef = useRef(false);
  const phaseRef = useRef<Phase>("warp");
  const [phase, setPhase] = useState<Phase>("warp");

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

    const advancePhase = (next: Phase) => {
      if (phaseRef.current !== next && PHASE_ORDER.indexOf(next) > PHASE_ORDER.indexOf(phaseRef.current)) {
        phaseRef.current = next;
        setPhase(next);
      }
    };

    const draw = () => {
      const now = performance.now();
      const t = (now - startedRef.current) / 1000;

      ctx.fillStyle = REVEAL.brand.bgDeep;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      // pinpoint pulse 0.0–0.5s (was 0.0–0.4s)
      if (t < 0.5) {
        const pulse = 1 + Math.sin(t * 12) * 0.4;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(cx, cy, 3 * pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      // warp particles 0.5–3.4s (was 0.4–2.6s)
      // decel from 2.4s (was 1.8s), fade from 2.9s (was 2.2s)
      if (t >= 0.5 && t < 3.4) {
        const localT = (t - 0.5) / 1.9;
        const accel = Math.min(localT, 1);
        // decel after 2.4s
        const decel = t > 2.4 ? Math.max(0, 1 - (t - 2.4) / 0.8) : 1;
        for (const p of particles) {
          p.radius += (p.speed * accel * decel) / 60;
          if (p.radius > Math.hypot(cx, cy) + 20) p.radius = 0;
          const x = cx + Math.cos(p.angle) * p.radius;
          const y = cy + Math.sin(p.angle) * p.radius;
          const tail = Math.min(p.radius * 0.05, 30);
          const x2 = cx + Math.cos(p.angle) * (p.radius - tail);
          const y2 = cy + Math.sin(p.angle) * (p.radius - tail);
          const grad = ctx.createLinearGradient(x, y, x2, y2);
          // fade from 2.9s (was 2.2s)
          const fade = t > 2.9 ? Math.max(0, 1 - (t - 2.9) / 0.5) : 1;
          grad.addColorStop(0, `rgba(255,255,255,${0.9 * fade})`);
          grad.addColorStop(0.5, `rgba(34,211,238,${0.6 * fade})`);
          grad.addColorStop(1, "rgba(217,70,239,0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

      // phase transitions (all shifted ~30% later)
      if (t >= 2.4) advancePhase("nebula");       // was 1.8s
      if (t >= 3.0) advancePhase("constellation"); // was 2.4s
      if (t >= 3.3) advancePhase("bloom");         // was 2.7s
      if (t >= REVEAL.logoPopAt) advancePhase("logo"); // 3.5s (new)

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
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
      <AnimatePresence>
        {phaseAtLeast(phase, "nebula") && (
          <motion.div
            key="nebula"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={phaseAtLeast(phase, "logo")
              ? { opacity: 0.45, scale: 1.05 }
              : { opacity: 0.85, scale: 1.0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: REVEAL.ease.decel }}
            style={{
              position: "absolute",
              inset: 0,
              mixBlendMode: "screen",
            }}
          >
            <Image
              src="/reveal/cosmic/nebula-plate.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
          </motion.div>
        )}
        {phaseAtLeast(phase, "constellation") && (
          <motion.div
            key="con"
            initial={{ opacity: 0 }}
            animate={phaseAtLeast(phase, "logo")
              ? { opacity: 0.5 }
              : { opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mixBlendMode: "screen",
            }}
          >
            <div style={{ position: "relative", width: 480, height: 480 }}>
              <Image
                src="/reveal/cosmic/virgo-constellation.webp"
                alt=""
                fill
                priority
                sizes="480px"
                style={{ objectFit: "contain" }}
              />
            </div>
          </motion.div>
        )}
        {phaseAtLeast(phase, "bloom") && (
          <motion.div
            key="bloom"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={phaseAtLeast(phase, "logo")
              ? { opacity: 0.7, scale: 1.4 }
              : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mixBlendMode: "screen",
            }}
          >
            <div style={{ position: "relative", width: 600, height: 600 }}>
              <Image
                src="/reveal/cosmic/lens-bloom.webp"
                alt=""
                fill
                priority
                sizes="600px"
                style={{ objectFit: "contain" }}
              />
            </div>
          </motion.div>
        )}
        {phaseAtLeast(phase, "logo") && (
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
            <div
              style={{
                position: "relative",
                width: 360,
                height: 360,
                filter:
                  "drop-shadow(0 0 40px rgba(217,70,239,0.5)) drop-shadow(0 0 80px rgba(34,211,238,0.3))",
              }}
            >
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
                  background:
                    "linear-gradient(110deg, transparent 30%, rgba(34,211,238,0.55) 50%, transparent 70%)",
                  mixBlendMode: "screen",
                  pointerEvents: "none",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
