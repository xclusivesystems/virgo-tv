import { Tv } from "lucide-react";

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608.975-.975 2.242-1.249 3.608-1.311C8.416 2.175 8.796 2.163 12 2.163zm0 1.8c-3.155 0-3.507.012-4.748.068-.96.044-1.48.204-1.827.34-.459.178-.787.392-1.132.737-.345.345-.559.673-.737 1.132-.136.347-.296.867-.34 1.827-.056 1.241-.068 1.593-.068 4.748s.012 3.507.068 4.748c.044.96.204 1.48.34 1.827.178.459.392.787.737 1.132.345.345.673.559 1.132.737.347.136.867.296 1.827.34 1.241.056 1.593.068 4.748.068s3.507-.012 4.748-.068c.96-.044 1.48-.204 1.827-.34.459-.178.787-.392 1.132-.737.345-.345.559-.673.737-1.132.136-.347.296-.867.34-1.827.056-1.241.068-1.593.068-4.748s-.012-3.507-.068-4.748c-.044-.96-.204-1.48-.34-1.827-.178-.459-.392-.787-.737-1.132-.345-.345-.673-.559-1.132-.737-.347-.136-.867-.296-1.827-.34-1.241-.056-1.593-.068-4.748-.068zM12 6.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YouTubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.971-1.166-1.955-1.277-2.642h.005c-.015-.09-.022-.18-.022-.27h-3.415v13.35c0 .18-.015.353-.044.524a2.764 2.764 0 01-2.722 2.315c-1.526 0-2.764-1.239-2.764-2.765s1.238-2.764 2.764-2.764c.3 0 .588.048.858.137V9.35a6.223 6.223 0 00-.858-.06c-3.405 0-6.164 2.76-6.164 6.164 0 3.404 2.76 6.164 6.164 6.164 3.405 0 6.164-2.76 6.164-6.164V8.915a8.548 8.548 0 005.066 1.625v-3.404a5.078 5.078 0 01-2.175-1.574z" />
    </svg>
  );
}

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
            <InstagramIcon className="h-5 w-5" />
          </a>
          <a href="#" aria-label="X" className="transition-colors hover:text-white">
            <XIcon className="h-5 w-5" />
          </a>
          <a href="#" aria-label="TikTok" className="transition-colors hover:text-white">
            <TikTokIcon className="h-5 w-5" />
          </a>
          <a href="#" aria-label="YouTube" className="transition-colors hover:text-white">
            <YouTubeIcon className="h-5 w-5" />
          </a>
        </div>
        <p className="text-xs text-white/40">© 2026 Virgo TV · All rights reserved.</p>
      </div>
    </footer>
  );
}
