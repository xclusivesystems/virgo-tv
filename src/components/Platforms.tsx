"use client";

import { motion } from "framer-motion";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  title: string;
}

function AppleTVIcon({ title, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" role="img" {...props}>
      <title>{title}</title>
      <path d="M20.91 18.99c-.34.79-.5 1.14-.94 1.84-.61.97-1.46 2.18-2.52 2.19-.94.01-1.18-.62-2.46-.61-1.28.01-1.55.62-2.49.61-1.06-.01-1.87-1.1-2.48-2.07-1.71-2.71-1.89-5.89-.83-7.58.74-1.2 1.92-1.91 3.02-1.91 1.12 0 1.83.62 2.76.62.9 0 1.45-.62 2.75-.62 1 0 2.06.55 2.81 1.49-2.47 1.36-2.07 4.9.38 5.04zM15.06 9.04c.51-.66.9-1.59.76-2.54-.83.06-1.81.59-2.38 1.27-.51.62-.94 1.55-.78 2.46.91.03 1.85-.51 2.4-1.19zM3.84 5.83c-.39 0-.71.32-.71.71 0 .39.32.71.71.71h2.78v9.79c0 .54.43.97.97.97s.97-.43.97-.97V7.25h2.78c.39 0 .71-.32.71-.71 0-.39-.32-.71-.71-.71H3.84z" />
    </svg>
  );
}

function RokuIcon({ title, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" role="img" {...props}>
      <title>{title}</title>
      <path d="M3.027 7.628v8.745h1.953V7.628H3.027zm15.024 0c-2.412 0-4.371 1.96-4.371 4.372s1.96 4.372 4.371 4.372 4.371-1.96 4.371-4.372-1.96-4.372-4.371-4.372zm-9.04 0c-1.93 0-3.493 1.566-3.493 3.493 0 .807.273 1.547.731 2.137l-.731.879v2.236h1.953v-1.523l1.232-1.483c.103.013.205.027.308.027 1.93 0 3.493-1.566 3.493-3.493 0-1.927-1.563-3.273-3.493-3.273zm9.04 1.954c1.336 0 2.418 1.082 2.418 2.418s-1.082 2.418-2.418 2.418-2.418-1.082-2.418-2.418 1.082-2.418 2.418-2.418zm-9.04.078c.853 0 1.539.687 1.539 1.539 0 .852-.687 1.539-1.539 1.539-.853 0-1.539-.687-1.539-1.539 0-.852.687-1.539 1.539-1.539z" />
    </svg>
  );
}

function AndroidTVIcon({ title, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" role="img" {...props}>
      <title>{title}</title>
      <path d="M2 6.5C2 5.67 2.67 5 3.5 5h17c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5H14v1h2v1H8v-1h2v-1H3.5C2.67 17 2 16.33 2 15.5v-9zM3.5 6c-.28 0-.5.22-.5.5v9c0 .28.22.5.5.5h17c.28 0 .5-.22.5-.5v-9c0-.28-.22-.5-.5-.5h-17zm5.7 4.5a.7.7 0 100-1.4.7.7 0 000 1.4zm5.6 0a.7.7 0 100-1.4.7.7 0 000 1.4zM7.5 13c.83 1.2 2.6 2 4.5 2s3.67-.8 4.5-2H7.5z" />
    </svg>
  );
}

function AppStoreIcon({ title, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" role="img" {...props}>
      <title>{title}</title>
      <path d="M5.5 2A3.5 3.5 0 002 5.5v13A3.5 3.5 0 005.5 22h13a3.5 3.5 0 003.5-3.5v-13A3.5 3.5 0 0018.5 2h-13zm6.7 5.39l-.66-1.14a.737.737 0 011.27-.74l.66 1.14.66-1.14a.737.737 0 011.27.74L9.49 17.5h2.04L15.7 10.4l.79 1.36c.21.36.51.46.78.46h.79l-2.13-3.69h2.13a.737.737 0 010 1.47h-1.32l1.65 2.86h2.42l-2.42-4.19c-.21-.36-.51-.46-.78-.46h-2.42L13.6 5.4l-1.4 1.99zM6.42 17.5h2.04l1.46-2.53H6.42v2.53zm-.85-2.53l-.66 1.14a.737.737 0 01-1.27-.74l1.95-3.39h1.65l1.45 2.53H5.57l-.85.46z" />
    </svg>
  );
}

function GooglePlayIcon({ title, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" role="img" {...props}>
      <title>{title}</title>
      <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.61-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.731-2.466l2.481 1.43a1 1 0 010 1.731l-2.481 1.43-2.671-2.671 2.671-2.671zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
    </svg>
  );
}

function SamsungIcon({ title, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" role="img" {...props}>
      <title>{title}</title>
      <path d="M3 5.5C3 4.67 3.67 4 4.5 4h15c.83 0 1.5.67 1.5 1.5v12c0 .83-.67 1.5-1.5 1.5H14v1h2v1H8v-1h2v-1H4.5C3.67 19 3 18.33 3 17.5v-12zM4.5 5c-.28 0-.5.22-.5.5v12c0 .28.22.5.5.5h15c.28 0 .5-.22.5-.5v-12c0-.28-.22-.5-.5-.5h-15zm6 3.5c-.83 0-1.5.4-1.5 1.1 0 .6.5.9 1.5 1.1.7.15 1 .25 1 .55 0 .25-.3.4-.8.4-.6 0-1-.2-1.05-.7H8.4c.05.95.85 1.5 2.05 1.5 1.15 0 1.9-.5 1.9-1.3 0-.7-.55-1-1.55-1.2-.7-.15-1-.3-1-.55 0-.2.25-.35.7-.35.5 0 .8.2.85.6h1.2c-.05-.85-.85-1.45-2-1.45zm5 0c-1.4 0-2.4 1-2.4 2.4 0 1.4 1 2.4 2.4 2.4s2.4-1 2.4-2.4c0-1.4-1-2.4-2.4-2.4zm0 .9c.85 0 1.45.65 1.45 1.5s-.6 1.5-1.45 1.5-1.45-.65-1.45-1.5.6-1.5 1.45-1.5z" />
    </svg>
  );
}

function FireTVIcon({ title, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" role="img" {...props}>
      <title>{title}</title>
      <path d="M14.6 2.7c-.4 1.6-.4 3.4.6 4.7.9 1.2 2.3 1.7 3.4 2.6 1.5 1.2 2.4 3.1 2.4 5 0 1.7-.6 3.4-1.7 4.7-1.5 1.7-3.7 2.7-5.9 2.7-2.5 0-5-1.2-6.5-3.2-1.4-1.9-1.8-4.4-1-6.6.5-1.5 1.5-2.8 2.7-3.8.4-.3.9-.6 1.4-.8-.3.7-.5 1.5-.5 2.3 0 1.5.6 2.9 1.6 4 .9 1 2.2 1.6 3.5 1.6 1.1 0 2.2-.4 3-1.1.8-.7 1.3-1.7 1.4-2.8.1-.9-.1-1.8-.6-2.6-.4-.7-1-1.2-1.7-1.6.1-.3.2-.6.2-.9.4-1.2.5-2.5.4-3.7l.5-.5z" />
    </svg>
  );
}

interface Platform {
  Icon: React.ComponentType<IconProps>;
  name: string;
}

const PLATFORMS: Platform[] = [
  { Icon: AppleTVIcon, name: "Apple TV" },
  { Icon: RokuIcon, name: "Roku" },
  { Icon: AndroidTVIcon, name: "Android TV" },
  { Icon: AppStoreIcon, name: "App Store" },
  { Icon: GooglePlayIcon, name: "Google Play" },
  { Icon: SamsungIcon, name: "Samsung TV" },
  { Icon: FireTVIcon, name: "Fire TV" },
];

interface PlatformsProps {
  /** Animation start delay (seconds) */
  delay?: number;
}

export function Platforms({ delay = 0 }: PlatformsProps) {
  return (
    <motion.div
      className="mt-12 flex w-full flex-col items-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
    >
      <h2
        className="text-xs font-semibold uppercase tracking-[0.3em] text-white/55"
        style={{ textShadow: "0 1px 0 rgba(0,0,0,0.5)" }}
      >
        Coming to these platforms soon
      </h2>
      <motion.ul
        className="mt-5 flex w-full max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.06, delayChildren: delay + 0.1 },
          },
        }}
      >
        {PLATFORMS.map(({ Icon, name }) => (
          <motion.li
            key={name}
            className="group flex flex-col items-center gap-1.5 text-white/65 transition-colors hover:text-white"
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
          >
            <Icon
              title={name}
              className="h-7 w-7 sm:h-8 sm:w-8"
              style={{
                filter:
                  "drop-shadow(0 1px 2px rgba(0,0,0,0.6)) drop-shadow(0 0 8px rgba(45,212,255,0.15))",
              }}
              aria-hidden="true"
            />
            <span className="text-[10px] font-medium uppercase tracking-wider sm:text-xs">
              {name}
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}
