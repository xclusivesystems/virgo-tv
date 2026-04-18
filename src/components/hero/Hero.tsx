"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Starfield } from "./Starfield";
import { OrbitalRing } from "./OrbitalRing";
import { LogoReveal } from "./LogoReveal";
import { ChatBubbles } from "./ChatBubbles";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 -z-30"
        style={{
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(107,47,179,0.35), transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(225,29,116,0.25), transparent 55%), #0a0618",
        }}
      />
      <Starfield />
      <ChatBubbles />
      <OrbitalRing />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <LogoReveal />

        <motion.h1
          className="mt-8 text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1 }}
        >
          <span className="text-brand-gradient">Watch. Stream. Chat. Live.</span>
        </motion.h1>

        <motion.p
          className="mt-4 max-w-xl text-lg text-white/80 sm:text-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.3 }}
        >
          Coming soon — a new universe of entertainment.
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.5 }}
        >
          <Button
            size="lg"
            onClick={() => {
              document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="border-0 bg-gradient-to-r from-[var(--brand-magenta)] to-[var(--brand-blue)] px-8 py-6 text-base font-semibold text-white shadow-[0_0_40px_rgba(225,29,116,0.5)] hover:brightness-110"
          >
            Join the Waitlist
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
