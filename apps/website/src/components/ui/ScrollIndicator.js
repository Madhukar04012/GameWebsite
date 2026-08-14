"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion, useScroll, useSpring, useMotionValueEvent } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
export function ScrollIndicator() {
    const { scrollYProgress } = useScroll();
    const reduced = useReducedMotion();
    const [showButton, setShowButton] = useState(false);
    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        setShowButton(latest > 0.3);
    });
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });
    if (reduced)
        return null;
    return (_jsxs(_Fragment, { children: [_jsx(motion.div, { className: "fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left bg-primary", style: { scaleX: scrollYProgress }, "aria-hidden": "true" }), _jsx(motion.button, { onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }), className: "fixed bottom-8 right-8 z-50 w-10 h-10 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-md flex items-center justify-center text-primary hover:bg-primary hover:text-background transition-colors", initial: { opacity: 0, scale: 0.5 }, animate: { opacity: showButton ? 1 : 0, scale: showButton ? 1 : 0.5 }, style: { pointerEvents: showButton ? "auto" : "none" }, "aria-label": "Scroll to top", children: _jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: _jsx("path", { d: "M8 13V3M3 8l5-5 5 5" }) }) })] }));
}
//# sourceMappingURL=ScrollIndicator.js.map