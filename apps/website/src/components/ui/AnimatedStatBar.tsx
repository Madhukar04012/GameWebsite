"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedStatBarProps {
  label: string;
  value: number;
  max: number;
  delay?: number;
}

export function AnimatedStatBar({ label, value, max, delay = 0 }: AnimatedStatBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const pct = (value / max) * 100;

  return (
    <div ref={ref} className="flex items-center gap-3">
      <span className="w-8 text-xs uppercase font-body text-text-muted tracking-wider">
        {label}
      </span>
      <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={isInView ? { width: `${pct}%` } : { width: 0 }}
          transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span className="text-xs font-mono text-white w-4 text-right tabular-nums">
        {value}
      </span>
    </div>
  );
}
