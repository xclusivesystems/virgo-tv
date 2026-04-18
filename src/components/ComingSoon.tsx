"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Star, Radio, Play, Mic, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Starfield } from "@/components/hero/Starfield";

type Status = "idle" | "submitting" | "success";

const COMING_SOON_WORDS = ["COMING", "SOON"];
// Reveal cadence — curtains finish ~2.65s in (8 strips × 0.05s stagger + 1.9s draw + 0.4s delay).
// Hold an extra beat so the page is empty when the curtains finish, then content begins.
const REVEAL_OFFSET = 2.9;

const PROVIDING = [
  { Icon: Star, label: "Virgo Originals" },
  { Icon: Radio, label: "Live Shows" },
  { Icon: Play, label: "On-Demand Library" },
  { Icon: Mic, label: "Podcasts" },
  { Icon: MessageCircle, label: "Live Chat Community" },
];

export function ComingSoon() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }
    setStatus("submitting");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setStatus("idle");
        setError(json.error ?? "Something went wrong. Try again.");
        return;
      }
      setStatus("success");
      toast.success(
        json.alreadyJoined ? "You're already on the list." : "You're on the list.",
        { description: "We'll let you know when Virgo TV goes live." },
      );
      setEmail("");
    } catch {
      setStatus("idle");
      setError("Network error. Try again.");
    }
  };

  return (
    <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-16">
      <div
        className="absolute inset-0 -z-30"
        style={{
          background:
            "radial-gradient(ellipse at 30% 30%, rgba(107,47,179,0.30), transparent 55%), radial-gradient(ellipse at 70% 70%, rgba(225,29,116,0.20), transparent 60%), #0a0618",
        }}
      />
      <Starfield />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: REVEAL_OFFSET, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/logo.png"
            alt="Virgo TV"
            width={900}
            height={600}
            priority
            className="h-auto w-[min(85vw,520px)] drop-shadow-[0_0_50px_rgba(225,29,116,0.35)]"
          />
        </motion.div>

        <motion.h1
          aria-label="Coming Soon"
          className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-3xl font-extrabold leading-tight tracking-[0.18em] sm:text-5xl sm:tracking-[0.24em] md:text-6xl md:tracking-[0.28em]"
          style={{
            filter:
              "drop-shadow(0 0 14px rgba(225,29,116,0.55)) drop-shadow(0 0 28px rgba(45,212,255,0.35)) drop-shadow(0 6px 10px rgba(0,0,0,0.7)) drop-shadow(0 1px 0 rgba(0,0,0,0.9))",
          }}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.07,
                delayChildren: REVEAL_OFFSET + 0.6,
              },
            },
          }}
        >
          {COMING_SOON_WORDS.map((word, wi) => (
            <span key={word} className="inline-flex whitespace-nowrap">
              {word.split("").map((ch, i) => (
                <motion.span
                  key={`${wi}-${ch}-${i}`}
                  className="relative inline-block text-brand-gradient"
                  variants={{
                    hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
                    visible: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                >
                  {ch}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.h1>

        <motion.p
          className="mt-5 max-w-md text-base text-white/85 sm:text-lg"
          style={{
            textShadow:
              "0 1px 0 rgba(0,0,0,0.6), 0 4px 14px rgba(0,0,0,0.7), 0 0 18px rgba(45,212,255,0.18)",
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: REVEAL_OFFSET + 1.7 }}
        >
          A new universe of entertainment.
        </motion.p>

        <motion.ul
          className="mt-10 grid w-full max-w-md grid-cols-1 gap-3 text-left sm:grid-cols-2"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.08,
                delayChildren: REVEAL_OFFSET + 1.9,
              },
            },
          }}
        >
          {PROVIDING.map(({ Icon, label }) => (
            <motion.li
              key={label}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] px-3 py-2.5 text-sm font-medium text-white"
              style={{
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.08), 0 6px 18px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,0,0,0.4)",
              }}
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
              }}
            >
              <Icon
                className="h-4 w-4 shrink-0"
                style={{
                  color: "var(--brand-magenta)",
                  filter:
                    "drop-shadow(0 0 6px rgba(225,29,116,0.6)) drop-shadow(0 1px 1px rgba(0,0,0,0.6))",
                }}
              />
              <span
                style={{
                  textShadow:
                    "0 1px 0 rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.5)",
                }}
              >
                {label}
              </span>
            </motion.li>
          ))}
        </motion.ul>

        <motion.form
          onSubmit={submit}
          className="mt-10 flex w-full max-w-md flex-col gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: REVEAL_OFFSET + 2.5 }}
        >
          <label htmlFor="waitlist-email" className="sr-only">
            Email address
          </label>
          <Input
            id="waitlist-email"
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status !== "idle"}
            required
            aria-invalid={!!error}
            aria-describedby={error ? "waitlist-error" : undefined}
            className="border-white/15 bg-black/30 text-white placeholder:text-white/40 focus-visible:border-[var(--brand-blue)] focus-visible:ring-[var(--brand-blue)]/30"
          />
          <Button
            type="submit"
            disabled={status !== "idle"}
            className="border-0 bg-gradient-to-r from-[var(--brand-magenta)] to-[var(--brand-blue)] font-semibold text-white hover:brightness-110"
          >
            {status === "submitting" ? "Joining…" : "Notify me"}
          </Button>
        </motion.form>

        {error && (
          <p
            id="waitlist-error"
            className="mt-3 text-sm text-[var(--brand-magenta)]"
            role="alert"
          >
            {error}
          </p>
        )}

        <motion.p
          className="mt-12 text-xs text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: REVEAL_OFFSET + 3 }}
        >
          © 2026 Virgo TV
        </motion.p>
      </div>
    </section>
  );
}
