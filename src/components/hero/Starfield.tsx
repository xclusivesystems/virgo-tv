"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  baseAlpha: number;
  twinklePhase: number;
}

const STAR_COUNT = 220;

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
    let rafId = 0;
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
          size: Math.random() * 1.6 + 0.3,
          baseAlpha: Math.random() * 0.6 + 0.3,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    }

    function render(t: number) {
      ctx!.clearRect(0, 0, width, height);
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      for (const s of stars) {
        const parallaxX = prefersReducedMotion ? 0 : mouseX * s.z * 20;
        const parallaxY = prefersReducedMotion ? 0 : mouseY * s.z * 20;
        const twinkle = prefersReducedMotion
          ? 1
          : 0.7 + 0.3 * Math.sin(t / 1000 + s.twinklePhase);
        const alpha = s.baseAlpha * twinkle;
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
          s.x += 0.02 + s.z * 0.05;
          if (s.x > width) s.x = 0;
        }
      }
      ctx!.globalAlpha = 1;
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
