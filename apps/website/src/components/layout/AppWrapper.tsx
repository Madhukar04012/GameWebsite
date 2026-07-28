"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface AppWrapperProps {
  children: React.ReactNode;
}

export function AppWrapper({ children }: AppWrapperProps) {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const reduced = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {loading && (
        <LoadingScreen onFinish={() => setLoading(false)} minDuration={2200} />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={reduced ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
