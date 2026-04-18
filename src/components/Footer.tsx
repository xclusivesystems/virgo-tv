import { Tv, Share2, Rss, Video } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/40 px-6 py-10 text-white/60">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
        <p className="flex items-center gap-2 text-sm tracking-wide text-white/70">
          <Tv className="h-4 w-4" />
          Coming soon to Web · Mobile · TV
        </p>
        <div className="flex items-center gap-5">
          <a href="#" aria-label="Instagram" className="transition-colors hover:text-white">
            <Share2 className="h-5 w-5" />
          </a>
          <a href="#" aria-label="Twitter / X" className="transition-colors hover:text-white">
            <Rss className="h-5 w-5" />
          </a>
          <a href="#" aria-label="YouTube" className="transition-colors hover:text-white">
            <Video className="h-5 w-5" />
          </a>
        </div>
        <p className="text-xs text-white/40">© 2026 Virgo TV · All rights reserved.</p>
      </div>
    </footer>
  );
}
