"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number; // 0..1, 1 = just born, 0 = dead
  decay: number;
  length: number;
}

const STAR_COUNT = 240;
// Average seconds between shooting stars (Poisson-ish via per-frame chance).
const SHOOTING_STAR_AVG_INTERVAL = 5;

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const stars: Star[] = [];
    const shooting: ShootingStar[] = [];
    let rafId = 0;
    let lastFrame = performance.now();
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    function resize() {
      width = canvas!.clientWidth;
      height = canvas!.clientHeight;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random(),
          size: Math.random() * 1.8 + 0.3,
          baseAlpha: Math.random() * 0.6 + 0.3,
          twinkleSpeed: 0.6 + Math.random() * 1.2, // each star twinkles at its own pace
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    }

    function spawnShootingStar() {
      // Diagonal streak from upper-left quadrant down-right (mostly).
      // Mix in a small chance of right-to-left for variety.
      const rightward = Math.random() > 0.3;
      const startX = rightward
        ? -50 + Math.random() * (width * 0.4)
        : width + 50 - Math.random() * (width * 0.4);
      const startY = Math.random() * (height * 0.55);
      const speed = 700 + Math.random() * 500; // px/sec
      const angle = (rightward ? 1 : -1) * (Math.PI / 6 + Math.random() * Math.PI / 12);
      shooting.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed * (rightward ? 1 : -1) * (rightward ? 1 : 1),
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.6 + Math.random() * 0.4, // life points lost per second
        length: 80 + Math.random() * 120,
      });
    }

    function render(now: number) {
      const dt = Math.min(0.05, (now - lastFrame) / 1000); // clamp dt for stability
      lastFrame = now;

      ctx!.clearRect(0, 0, width, height);
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Background stars with stronger, per-star twinkle.
      for (const s of stars) {
        const parallaxX = prefersReducedMotion ? 0 : mouseX * s.z * 20;
        const parallaxY = prefersReducedMotion ? 0 : mouseY * s.z * 20;
        const twinkle = prefersReducedMotion
          ? 1
          : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(now * 0.001 * s.twinkleSpeed + s.twinklePhase));
        const alpha = Math.min(1, s.baseAlpha * twinkle);
        ctx!.globalAlpha = alpha;
        ctx!.fillStyle = "#f8faff";
        ctx!.beginPath();
        ctx!.arc(
          (s.x + parallaxX + width) % width,
          (s.y + parallaxY + height) % height,
          s.size * (0.5 + s.z),
          0,
          Math.PI * 2,
        );
        ctx!.fill();

        if (!prefersReducedMotion) {
          s.x += (0.02 + s.z * 0.05);
          if (s.x > width) s.x = 0;
        }
      }
      ctx!.globalAlpha = 1;

      // Maybe spawn a shooting star this frame.
      if (!prefersReducedMotion) {
        const chance = dt / SHOOTING_STAR_AVG_INTERVAL;
        if (Math.random() < chance) spawnShootingStar();
      }

      // Update + draw shooting stars.
      for (let i = shooting.length - 1; i >= 0; i--) {
        const sh = shooting[i]!;
        sh.x += sh.vx * dt;
        sh.y += sh.vy * dt;
        sh.life -= sh.decay * dt;
        if (
          sh.life <= 0 ||
          sh.x < -200 ||
          sh.x > width + 200 ||
          sh.y > height + 200
        ) {
          shooting.splice(i, 1);
          continue;
        }

        // Trail: gradient from current position back along the velocity vector.
        const speed = Math.hypot(sh.vx, sh.vy);
        const tx = sh.x - (sh.vx / speed) * sh.length;
        const ty = sh.y - (sh.vy / speed) * sh.length;
        const grad = ctx!.createLinearGradient(sh.x, sh.y, tx, ty);
        const headAlpha = Math.min(1, sh.life * 1.4);
        grad.addColorStop(0, `rgba(255, 240, 220, ${headAlpha})`);
        grad.addColorStop(0.4, `rgba(255, 200, 240, ${headAlpha * 0.6})`);
        grad.addColorStop(1, "rgba(255, 200, 240, 0)");
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 2;
        ctx!.lineCap = "round";
        ctx!.beginPath();
        ctx!.moveTo(sh.x, sh.y);
        ctx!.lineTo(tx, ty);
        ctx!.stroke();

        // Bright head dot.
        ctx!.globalAlpha = headAlpha;
        ctx!.fillStyle = "#fff";
        ctx!.beginPath();
        ctx!.arc(sh.x, sh.y, 1.8, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.globalAlpha = 1;
      }

      rafId = requestAnimationFrame(render);
    }

    function onMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      targetMouseX = (e.clientX - rect.left) / rect.width - 0.5;
      targetMouseY = (e.clientY - rect.top) / rect.height - 0.5;
    }

    function onResize() {
      resize();
      seed();
    }

    resize();
    seed();
    lastFrame = performance.now();
    rafId = requestAnimationFrame(render);
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    />
  );
}
