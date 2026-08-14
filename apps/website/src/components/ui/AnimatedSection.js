"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
const variants = {
    "fade-up": { y: 48, opacity: 0 },
    "fade-left": { x: -48, opacity: 0 },
    "fade-right": { x: 48, opacity: 0 },
    scale: { scale: 0.85, opacity: 0 },
    blur: { filter: "blur(8px)", opacity: 0 },
};
export function AnimatedSection({ children, variant = "fade-up", className = "", delay = 0, duration = 0.6, once = true, margin = "-60px", as: Tag = "div", }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, margin: margin });
    const reduced = useReducedMotion();
    const initial = reduced ? {} : variants[variant];
    const MotionTag = motion[Tag];
    return (_jsx(MotionTag, { ref: ref, initial: initial, animate: isInView
            ? { x: 0, y: 0, scale: 1, opacity: 1, filter: "blur(0px)" }
            : initial, transition: { duration, delay, ease: [0.16, 1, 0.3, 1] }, className: className, children: children }));
}
//# sourceMappingURL=AnimatedSection.js.map