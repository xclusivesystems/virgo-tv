"use client";

const POSTER = "/hero/nebula-backdrop-poster.jpg";
const WEBM = "/hero/nebula-backdrop.webm";
const MP4 = "/hero/nebula-backdrop.mp4";

export function NebulaBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: -25 }}
      aria-hidden="true"
    >
      <img
        src={POSTER}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover md:hidden motion-reduce:block"
      />

      <video
        className="absolute inset-0 hidden h-full w-full object-cover md:block motion-reduce:hidden"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={POSTER}
        aria-hidden="true"
      >
        <source src={WEBM} type="video/webm" />
        <source src={MP4} type="video/mp4" />
      </video>
    </div>
  );
}
