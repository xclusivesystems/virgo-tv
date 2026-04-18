"use client";

import { motion } from "framer-motion";
import { Star, Radio, Play, Mic, MessageCircle } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

interface Feature {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  blurb: string;
}

const FEATURES: Feature[] = [
  { Icon: Star, title: "Virgo Originals", blurb: "First-party shows you won't find anywhere else." },
  { Icon: Radio, title: "Live Shows", blurb: "Tune in to live broadcasts as they happen." },
  { Icon: Play, title: "On-Demand", blurb: "Every genre. Every mood. Ready when you are." },
  { Icon: Mic, title: "Podcasts", blurb: "Stories, talk, and culture — on demand." },
  { Icon: MessageCircle, title: "Live Chat", blurb: "Watch together. Talk in real time." },
];

export function Features() {
  return (
    <section id="features" className="relative border-t border-white/5 bg-[var(--brand-deep)] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="mb-12 text-center text-3xl font-semibold tracking-tight sm:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          What's coming to <span className="text-brand-gradient">Virgo TV</span>
        </motion.h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {FEATURES.map(({ Icon, title, blurb }, i) => (
            <motion.div
              key={title}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/25"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(circle at 30% 0%, rgba(225,29,116,0.25), transparent 60%), radial-gradient(circle at 70% 100%, rgba(45,212,255,0.2), transparent 60%)",
                }}
              />
              <Icon className="relative h-8 w-8" style={{ color: "var(--brand-magenta)" }} />
              <h3 className="relative mt-4 text-lg font-semibold">{title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-white/70">{blurb}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
