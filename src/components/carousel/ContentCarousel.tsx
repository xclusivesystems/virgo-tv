"use client";

import { CarouselRow } from "./CarouselRow";
import type { PlaceholderTileProps } from "./PlaceholderTile";

const GRAD = {
  purpleMagenta: "linear-gradient(135deg, #4c1a80, #e11d74)",
  blueCyan: "linear-gradient(135deg, #1a1e80, #2dd4ff)",
  magentaOrange: "linear-gradient(135deg, #e11d74, #ff8a3d)",
  purpleBlue: "linear-gradient(135deg, #6b2fb3, #2dd4ff)",
  darkMagenta: "linear-gradient(135deg, #200618, #e11d74)",
  greenTeal: "linear-gradient(135deg, #0e6659, #2dd4ff)",
  pinkViolet: "linear-gradient(135deg, #ff3d9a, #6b2fb3)",
  deepBlue: "linear-gradient(135deg, #0a0618, #2dd4ff)",
};

const LIVE: PlaceholderTileProps[] = [
  { label: "Late Night w/ Marco", gradient: GRAD.purpleMagenta, badge: "LIVE", meta: "12.4K watching" },
  { label: "Gaming w/ Tasha", gradient: GRAD.blueCyan, badge: "LIVE", meta: "8.2K watching" },
  { label: "Chopped It Up", gradient: GRAD.pinkViolet, badge: "LIVE", meta: "4.1K watching" },
  { label: "The Culture Hour", gradient: GRAD.magentaOrange, badge: "LIVE", meta: "21.7K watching" },
  { label: "Virgo News Live", gradient: GRAD.deepBlue, badge: "LIVE", meta: "3.6K watching" },
  { label: "Real Talk Tonight", gradient: GRAD.darkMagenta, badge: "LIVE", meta: "9.9K watching" },
  { label: "Hoops Aftershow", gradient: GRAD.greenTeal, badge: "LIVE", meta: "15.3K watching" },
  { label: "Studio Sessions", gradient: GRAD.purpleBlue, badge: "LIVE", meta: "2.8K watching" },
];

const ORIGINALS: PlaceholderTileProps[] = [
  { label: "Cosmic Drift", gradient: GRAD.purpleBlue, badge: "ORIGINAL" },
  { label: "Neon City", gradient: GRAD.magentaOrange, badge: "ORIGINAL" },
  { label: "The Lineage", gradient: GRAD.darkMagenta, badge: "ORIGINAL" },
  { label: "After Dark", gradient: GRAD.purpleMagenta, badge: "ORIGINAL" },
  { label: "Block By Block", gradient: GRAD.blueCyan, badge: "ORIGINAL" },
  { label: "South of Somewhere", gradient: GRAD.pinkViolet, badge: "ORIGINAL" },
  { label: "Queens", gradient: GRAD.greenTeal, badge: "ORIGINAL" },
  { label: "The Takeover", gradient: GRAD.deepBlue, badge: "ORIGINAL" },
];

const ON_DEMAND: PlaceholderTileProps[] = [
  { label: "Drama", gradient: GRAD.darkMagenta },
  { label: "Comedy", gradient: GRAD.magentaOrange },
  { label: "Action", gradient: GRAD.purpleMagenta },
  { label: "Docs", gradient: GRAD.greenTeal },
  { label: "Sci-Fi", gradient: GRAD.blueCyan },
  { label: "Reality", gradient: GRAD.pinkViolet },
  { label: "Anime", gradient: GRAD.purpleBlue },
  { label: "Thriller", gradient: GRAD.deepBlue },
  { label: "Romance", gradient: GRAD.magentaOrange },
  { label: "Sports", gradient: GRAD.greenTeal },
];

const PODCASTS: PlaceholderTileProps[] = [
  { label: "The Rundown", gradient: GRAD.purpleMagenta, variant: "square" },
  { label: "Culture Capsule", gradient: GRAD.blueCyan, variant: "square" },
  { label: "Money Moves", gradient: GRAD.magentaOrange, variant: "square" },
  { label: "Late Mic", gradient: GRAD.darkMagenta, variant: "square" },
  { label: "Studio Sessions", gradient: GRAD.purpleBlue, variant: "square" },
  { label: "Real Ones", gradient: GRAD.pinkViolet, variant: "square" },
  { label: "Tech Tuesdays", gradient: GRAD.greenTeal, variant: "square" },
  { label: "Open Mic", gradient: GRAD.deepBlue, variant: "square" },
];

export function ContentCarousel() {
  return (
    <section className="relative bg-[var(--brand-deep)] py-16">
      <div className="flex flex-col gap-10">
        <CarouselRow title="Live Now" accent="live" tiles={LIVE} />
        <CarouselRow title="Virgo Originals" tiles={ORIGINALS} />
        <CarouselRow title="On-Demand" tiles={ON_DEMAND} />
        <CarouselRow title="Podcasts" tiles={PODCASTS} />
      </div>
    </section>
  );
}
