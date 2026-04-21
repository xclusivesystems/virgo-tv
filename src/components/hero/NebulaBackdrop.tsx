"use client";

const POSTER = "/hero/nebula-backdrop-poster.jpg";
const WEBM = "/hero/nebula-backdrop.webm";
const MP4 = "/hero/nebula-backdrop.mp4";

export function NebulaBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-screen overflow-hidden"
      style={{ zIndex: -25 }}
      aria-hidden="true"
    >
      <img
        src={POSTER}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:block"
      />

      <video
        className="absolute inset-0 h-full w-full object-cover brightness-[0.55] md:brightness-100 motion-reduce:hidden"
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

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle clamp(280px, 55vw, 480px) at 50% 48%, #0a0618 0%, #0a0618 55%, rgba(10,6,24,0.85) 75%, transparent 100%)",
        }}
      />
    </div>
  );
}
