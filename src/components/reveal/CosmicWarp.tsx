"use client";
import { useEffect, useRef } from "react";
import { REVEAL } from "./shared/revealTokens";

interface Props { onComplete: () => void; }

interface Particle {
  angle: number;
  radius: number;
  speed: number;
  size: number;
}

export function CosmicWarp({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startedRef = useRef<number>(0);
  const completedRef = useRef(false);

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

    const draw = () => {
      const now = performance.now();
      const t = (now - startedRef.current) / 1000;

      ctx.fillStyle = REVEAL.brand.bgDeep;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      // pinpoint pulse 0.0–0.4s
      if (t < 0.4) {
        const pulse = 1 + Math.sin(t * 12) * 0.4;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(cx, cy, 3 * pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      // warp particles 0.4–2.4s
      if (t >= 0.4 && t < 2.4) {
        const localT = (t - 0.4) / 1.4;
        const accel = Math.min(localT, 1);
        for (const p of particles) {
          p.radius += (p.speed * accel) / 60;
          if (p.radius > Math.hypot(cx, cy) + 20) p.radius = 0;
          const x = cx + Math.cos(p.angle) * p.radius;
          const y = cy + Math.sin(p.angle) * p.radius;
          const tail = Math.min(p.radius * 0.05, 30);
          const x2 = cx + Math.cos(p.angle) * (p.radius - tail);
          const y2 = cy + Math.sin(p.angle) * (p.radius - tail);
          const grad = ctx.createLinearGradient(x, y, x2, y2);
          grad.addColorStop(0, "rgba(255,255,255,0.9)");
          grad.addColorStop(0.5, "rgba(34,211,238,0.6)");
          grad.addColorStop(1, "rgba(217,70,239,0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = p.size;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }

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
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}
