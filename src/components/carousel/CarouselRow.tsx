"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PlaceholderTile, type PlaceholderTileProps } from "./PlaceholderTile";

export interface CarouselRowProps {
  title: string;
  accent?: "live" | "default";
  tiles: PlaceholderTileProps[];
}

export function CarouselRow({ title, accent = "default", tiles }: CarouselRowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (delta: number) => {
    scrollerRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className="group/row relative">
      <div className="mb-4 flex items-center gap-2 px-6">
        {accent === "live" && (
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand-live)] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--brand-live)]" />
          </span>
        )}
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scrollBy(-600)}
          aria-label="Scroll left"
          className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/60 p-2 opacity-0 backdrop-blur transition-opacity group-hover/row:opacity-100 md:block"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div
          ref={scrollerRef}
          className="flex gap-3 overflow-x-auto scroll-smooth px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tiles.map((t, i) => (
            <PlaceholderTile key={i} {...t} />
          ))}
        </div>
        <button
          type="button"
          onClick={() => scrollBy(600)}
          aria-label="Scroll right"
          className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/60 p-2 opacity-0 backdrop-blur transition-opacity group-hover/row:opacity-100 md:block"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
