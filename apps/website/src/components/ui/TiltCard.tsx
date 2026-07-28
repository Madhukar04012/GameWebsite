"use client";

import { useRef, useState, useCallback, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

export function TiltCard({ children, className = "", maxTilt = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouse = useCallback(
    (e: React.MouseEvent) => {
      if (reduced || !ref.current) {
        setTilt({ x: 0, y: 0 });
        return;
      }
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: -y * maxTilt, y: x * maxTilt });
    },
    [maxTilt, reduced],
  );

  const resetTilt = useCallback(() => setTilt({ x: 0, y: 0 }), []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={resetTilt}
      animate={
        reduced
          ? {}
          : {
              rotateX: tilt.x,
              rotateY: tilt.y,
            }
      }
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      style={{ perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
