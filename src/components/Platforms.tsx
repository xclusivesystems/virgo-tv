"use client";

import { motion } from "framer-motion";
import {
  SiAppletv,
  SiRoku,
  SiAndroid,
  SiAppstore,
  SiGoogleplay,
  SiSamsung,
} from "react-icons/si";
import { FaAmazon } from "react-icons/fa6";
import type { IconType } from "react-icons";

interface Platform {
  Icon: IconType;
  name: string;
}

const PLATFORMS: Platform[] = [
  { Icon: SiAppletv, name: "Apple TV" },
  { Icon: SiRoku, name: "Roku" },
  { Icon: SiAndroid, name: "Android TV" },
  { Icon: SiAppstore, name: "App Store" },
  { Icon: SiGoogleplay, name: "Google Play" },
  { Icon: SiSamsung, name: "Samsung TV" },
  { Icon: FaAmazon, name: "Fire TV" },
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
        className="mt-5 flex w-full max-w-xl flex-wrap items-center justify-center gap-x-7 gap-y-5"
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
            className="group flex flex-col items-center gap-2 text-white/70 transition-colors hover:text-white"
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
          >
            <Icon
              size={32}
              aria-hidden="true"
              style={{
                filter:
                  "drop-shadow(0 1px 2px rgba(0,0,0,0.65)) drop-shadow(0 0 10px rgba(45,212,255,0.18))",
              }}
            />
            <span className="text-[10px] font-medium uppercase tracking-wider sm:text-[11px]">
              {name}
            </span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}
