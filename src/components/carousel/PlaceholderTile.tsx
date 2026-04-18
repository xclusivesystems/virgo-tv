"use client";

import { motion } from "framer-motion";

export type TileVariant = "landscape" | "square";
export type TileBadge = "LIVE" | "ORIGINAL" | null;

export interface PlaceholderTileProps {
  label: string;
  gradient: string;
  variant?: TileVariant;
  badge?: TileBadge;
  meta?: string;
}

export function PlaceholderTile({
  label,
  gradient,
  variant = "landscape",
  badge = null,
  meta,
}: PlaceholderTileProps) {
  const dims = variant === "landscape" ? "w-[260px] h-[146px]" : "w-[180px] h-[180px]";

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`group relative flex shrink-0 flex-col justify-end overflow-hidden rounded-xl border border-white/10 ${dims}`}
      style={{ background: gradient }}
      tabIndex={0}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      {badge === "LIVE" && (
        <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-full bg-black/70 px-2 py-1 backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand-live)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand-live)]" />
          </span>
          <span className="text-xs font-semibold tracking-wide">LIVE</span>
        </div>
      )}
      {badge === "ORIGINAL" && (
        <div className="absolute left-2 top-2 rounded-full bg-[var(--brand-purple)] px-2 py-1 text-[10px] font-bold tracking-[0.2em] text-white">
          ORIGINAL
        </div>
      )}

      <div className="relative z-10 p-3">
        <div className="text-sm font-semibold leading-tight">{label}</div>
        {meta && <div className="mt-1 text-[11px] text-white/70">{meta}</div>}
      </div>

      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-xl shadow-[0_0_40px_rgba(225,29,116,0.5)]" />
      </div>
    </motion.div>
  );
}
