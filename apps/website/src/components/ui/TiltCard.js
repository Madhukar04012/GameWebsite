"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
export function TiltCard({ children, className = "", maxTilt = 8 }) {
    const ref = useRef(null);
    const reduced = useReducedMotion();
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const handleMouse = useCallback((e) => {
        if (reduced || !ref.current) {
            setTilt({ x: 0, y: 0 });
            return;
        }
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: -y * maxTilt, y: x * maxTilt });
    }, [maxTilt, reduced]);
    const resetTilt = useCallback(() => setTilt({ x: 0, y: 0 }), []);
    return (_jsx(motion.div, { ref: ref, onMouseMove: handleMouse, onMouseLeave: resetTilt, animate: reduced
            ? {}
            : {
                rotateX: tilt.x,
                rotateY: tilt.y,
            }, transition: { type: "spring", stiffness: 150, damping: 15 }, style: { perspective: 1000 }, className: className, children: children }));
}
//# sourceMappingURL=TiltCard.js.map