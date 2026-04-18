"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Status = "idle" | "submitting" | "success";

export function Waitlist() {
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
        {
          description: json.alreadyJoined
            ? "We've got you covered."
            : "We'll let you know when Virgo TV goes live.",
        },
      );
      setEmail("");
    } catch {
      setStatus("idle");
      setError("Network error. Try again.");
    }
  };

  return (
    <section id="waitlist" className="relative border-t border-white/5 bg-[var(--brand-deep)] px-6 py-24">
      <div className="mx-auto max-w-xl text-center">
        <motion.h2
          className="text-3xl font-semibold tracking-tight sm:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          Be first in line.
        </motion.h2>
        <motion.p
          className="mt-3 text-white/70"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Drop your email. We'll let you know when Virgo TV goes live.
        </motion.p>

        <motion.form
          onSubmit={submit}
          className="relative mx-auto mt-10 flex w-full max-w-md flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_0_60px_rgba(225,29,116,0.2)] sm:flex-row"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <label htmlFor="waitlist-email" className="sr-only">Email address</label>
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
            {status === "submitting" ? "Joining…" : "Join the Waitlist"}
          </Button>
        </motion.form>

        {error && (
          <p id="waitlist-error" className="mt-3 text-sm text-[var(--brand-magenta)]" role="alert">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}
