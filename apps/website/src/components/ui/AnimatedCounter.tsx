"use client";

import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  from?: number;
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  delay?: number;
}

export function AnimatedCounter({
  from = 0,
  to,
  suffix = "",
  prefix = "",
  duration = 2000,
  delay = 0,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [count, setCount] = useState(from);
  const started = useRef(false);

  useEffect(() => {
    if (!isInView || started.current) return;
    started.current = true;

    const startTime = performance.now() + delay;
    const diff = to - from;

    function animate(now: number) {
      if (now < startTime) {
        requestAnimationFrame(animate);
        return;
      }
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.round(from + diff * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(to);
      }
    }

    requestAnimationFrame(animate);
  }, [isInView, from, to, duration, delay]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
}
