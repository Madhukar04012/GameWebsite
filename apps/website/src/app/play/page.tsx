"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GAME_URL = process.env.NEXT_PUBLIC_GAME_URL || "http://localhost:5173";

export default function PlayPage() {
  const [phase, setPhase] = useState<"entering" | "redirect">("entering");

  useEffect(() => {
    // Brief pause for visual transition, then redirect
    const timer = setTimeout(() => {
      setPhase("redirect");
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase === "redirect") {
      window.location.href = GAME_URL;
    }
  }, [phase]);

  return (
    <AnimatePresence>
      {phase === "entering" && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              background:
                "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(212,175,55,0.3) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />

          {/* Logo */}
          <motion.h1
            className="text-7xl md:text-9xl font-heading text-primary tracking-widest mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            LEGEND
          </motion.h1>

          <motion.p
            className="text-xs uppercase tracking-[0.3em] text-text-muted font-body mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Entering the realm...
          </motion.p>

          {/* Loading bar */}
          <div className="w-48 h-[2px] bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
