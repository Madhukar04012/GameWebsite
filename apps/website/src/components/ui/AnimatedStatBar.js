"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
export function AnimatedStatBar({ label, value, max, delay = 0 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-40px" });
    const pct = (value / max) * 100;
    return (_jsxs("div", { ref: ref, className: "flex items-center gap-3", children: [_jsx("span", { className: "w-8 text-xs uppercase font-body text-text-muted tracking-wider", children: label }), _jsx("div", { className: "flex-1 h-2 bg-surface rounded-full overflow-hidden", children: _jsx(motion.div, { className: "h-full bg-primary rounded-full", initial: { width: 0 }, animate: isInView ? { width: `${pct}%` } : { width: 0 }, transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] } }) }), _jsx("span", { className: "text-xs font-mono text-white w-4 text-right tabular-nums", children: value })] }));
}
//# sourceMappingURL=AnimatedStatBar.js.map