"use client";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
export function AnimatedCounter({ from = 0, to, suffix = "", prefix = "", duration = 2000, delay = 0, }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });
    const [count, setCount] = useState(from);
    const started = useRef(false);
    useEffect(() => {
        if (!isInView || started.current)
            return;
        started.current = true;
        const startTime = performance.now() + delay;
        const diff = to - from;
        function animate(now) {
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
            }
            else {
                setCount(to);
            }
        }
        requestAnimationFrame(animate);
    }, [isInView, from, to, duration, delay]);
    return (_jsxs("span", { ref: ref, children: [prefix, count.toLocaleString(), suffix] }));
}
//# sourceMappingURL=AnimatedCounter.js.map