"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from "react";
import { motion, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
export function CursorGlow() {
    const reduced = useReducedMotion();
    const [pos, setPos] = useState({ x: -100, y: -100 });
    const [isVisible, setIsVisible] = useState(false);
    const [trail, setTrail] = useState([]);
    const idRef = useRef(0);
    const springX = useSpring(pos.x, { stiffness: 150, damping: 15 });
    const springY = useSpring(pos.y, { stiffness: 150, damping: 15 });
    useEffect(() => {
        if (reduced)
            return;
        const isTouchDevice = "ontouchstart" in window;
        if (isTouchDevice)
            return;
        function handleMouse(e) {
            setPos({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
            setTrail((prev) => {
                const next = [
                    ...prev,
                    { x: e.clientX, y: e.clientY, id: idRef.current++, opacity: 0.5 },
                ];
                if (next.length > 8)
                    return next.slice(-8);
                return next;
            });
        }
        function handleLeave() {
            setIsVisible(false);
            setTrail([]);
        }
        window.addEventListener("mousemove", handleMouse, { passive: true });
        document.addEventListener("mouseleave", handleLeave);
        return () => {
            window.removeEventListener("mousemove", handleMouse);
            document.removeEventListener("mouseleave", handleLeave);
        };
    }, [reduced]);
    if (reduced)
        return null;
    return (_jsxs(_Fragment, { children: [_jsx(motion.div, { className: "pointer-events-none fixed z-[9999] w-[200px] h-[200px] rounded-full -translate-x-1/2 -translate-y-1/2", style: {
                    left: springX,
                    top: springY,
                    background: "radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)",
                }, "aria-hidden": "true" }), trail.map((dot, i) => (_jsx(motion.div, { className: "pointer-events-none fixed z-[9998] w-1 h-1 rounded-full bg-primary", style: {
                    left: dot.x,
                    top: dot.y,
                    opacity: (i / trail.length) * 0.3,
                }, animate: { opacity: 0 }, transition: { duration: 0.6, ease: "easeOut" }, "aria-hidden": "true" }, dot.id))), isVisible && (_jsx(motion.div, { className: "pointer-events-none fixed z-[9999] w-2 h-2 rounded-full bg-primary -translate-x-1/2 -translate-y-1/2", style: { left: springX, top: springY }, "aria-hidden": "true" }))] }));
}
//# sourceMappingURL=CursorGlow.js.map