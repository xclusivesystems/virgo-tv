"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function LogoReveal() {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.6, filter: "blur(20px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute inset-0 -z-10 rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.8, 0.5] }}
        transition={{ duration: 2, delay: 0.3 }}
        style={{
          background:
            "radial-gradient(closest-side, rgba(225,29,116,0.45), rgba(45,212,255,0.25), transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <Image
        src="/logo.png"
        alt="Virgo TV"
        width={900}
        height={600}
        priority
        className="h-auto w-[min(80vw,700px)] drop-shadow-[0_0_60px_rgba(225,29,116,0.35)]"
      />
    </motion.div>
  );
}
