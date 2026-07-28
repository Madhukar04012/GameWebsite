"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (reduced) return null;

  return (
    <>
      {/* Progress bar at top */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-primary"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />

      {/* Scroll-to-top button */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 z-50 w-10 h-10 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-md flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-colors"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: scrollYProgress.get() > 0.3 ? 1 : 0, scale: scrollYProgress.get() > 0.3 ? 1 : 0.5 }}
        aria-label="Scroll to top"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M8 13V3M3 8l5-5 5 5" />
        </svg>
      </motion.button>
    </>
  );
}
