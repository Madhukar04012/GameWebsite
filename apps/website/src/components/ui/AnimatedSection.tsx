"use client";

import { useRef, type ReactNode, type ElementType } from "react";
import { motion, useInView, type TargetAndTransition } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type RevealVariant = "fade-up" | "fade-left" | "fade-right" | "scale" | "blur";

interface AnimatedSectionProps {
  children: ReactNode;
  variant?: RevealVariant;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  margin?: string;
  as?: "div" | "section" | "article";
}

const variants: Record<RevealVariant, TargetAndTransition> = {
  "fade-up": { y: 48, opacity: 0 } as TargetAndTransition,
  "fade-left": { x: -48, opacity: 0 } as TargetAndTransition,
  "fade-right": { x: 48, opacity: 0 } as TargetAndTransition,
  scale: { scale: 0.85, opacity: 0 } as TargetAndTransition,
  blur: { filter: "blur(8px)", opacity: 0 } as TargetAndTransition,
};

export function AnimatedSection({
  children,
  variant = "fade-up",
  className = "",
  delay = 0,
  duration = 0.6,
  once = true,
  margin = "-60px",
  as: Tag = "div",
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: margin as never });
  const reduced = useReducedMotion();

  const initial = reduced ? ({} as TargetAndTransition) : variants[variant];
  const MotionTag = motion[Tag] as ElementType;

  return (
    <MotionTag
      ref={ref}
      initial={initial}
      animate={
        isInView
          ? ({ x: 0, y: 0, scale: 1, opacity: 1, filter: "blur(0px)" } as TargetAndTransition)
          : initial
      }
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
