"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
export function LoadingScreen({ onFinish, minDuration = 2000 }) {
    const [phase, setPhase] = useState("entering");
    const [progress, setProgress] = useState(0);
    const [particles, setParticles] = useState([]);
    useEffect(() => {
        // Generate particle positions after mount (window is available)
        const w = typeof window !== "undefined" ? window.innerWidth : 800;
        const h = typeof window !== "undefined" ? window.innerHeight : 600;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setParticles(Array.from({ length: 15 }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            dy: Math.random() * -200 - 100,
            delay: Math.random() * 2,
        })));
    }, []);
    useEffect(() => {
        const enterTimer = setTimeout(() => setPhase("progress"), 400);
        const progressInterval = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                const increment = Math.max(1, (100 - p) / 10);
                return Math.min(100, p + increment);
            });
        }, 120);
        const exitTimer = setTimeout(() => {
            setPhase("exiting");
            setTimeout(() => onFinish?.(), 600);
        }, minDuration + 300);
        return () => {
            clearTimeout(enterTimer);
            clearTimeout(exitTimer);
            clearInterval(progressInterval);
        };
    }, [minDuration, onFinish]);
    return (_jsx(AnimatePresence, { children: phase !== "exited" && (_jsxs(motion.div, { className: "fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center", initial: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }, children: [_jsx("div", { className: "absolute inset-0 opacity-[0.08]", style: {
                        background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(212,175,55,0.3) 0%, transparent 70%)",
                    }, "aria-hidden": "true" }), _jsx("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", "aria-hidden": "true", children: particles.map((p, i) => (_jsx(motion.div, { className: "absolute w-1 h-1 rounded-full bg-primary/30", initial: {
                            x: p.x,
                            y: p.y,
                            opacity: 0,
                            scale: 0,
                        }, animate: {
                            y: p.y + p.dy,
                            opacity: [0, 0.5, 0],
                            scale: [0, 1, 0],
                        }, transition: {
                            duration: 3 + (i % 3) * 0.7,
                            repeat: Infinity,
                            delay: p.delay,
                            ease: "easeInOut",
                        } }, i))) }), _jsx(motion.h1, { className: "text-7xl md:text-9xl font-heading text-primary tracking-widest mb-8", initial: { opacity: 0, scale: 0.8, y: 20 }, animate: phase === "entering"
                        ? { opacity: 0, scale: 0.8, y: 20 }
                        : { opacity: 1, scale: 1, y: 0 }, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }, children: "LEGEND" }), _jsx(motion.p, { className: "text-xs uppercase tracking-[0.3em] text-text-muted font-body mb-12", initial: { opacity: 0 }, animate: phase === "entering" ? { opacity: 0 } : { opacity: 1 }, transition: { delay: 0.3, duration: 0.6 }, children: "Your story starts today" }), _jsx("div", { className: "w-48 h-[2px] bg-border rounded-full overflow-hidden", children: _jsx(motion.div, { className: "h-full bg-primary", initial: { width: "0%" }, animate: { width: `${progress}%` }, transition: { duration: 0.3, ease: "easeOut" } }) }), _jsxs(motion.p, { className: "text-[10px] uppercase tracking-widest text-text-muted font-body mt-3", initial: { opacity: 0 }, animate: { opacity: 1 }, children: [progress < 30 && "Awakening the realm...", progress >= 30 && progress < 60 && "Forging legends...", progress >= 60 && progress < 90 && "Weaving destinies...", progress >= 90 && "Entering the world..."] })] })) }));
}
//# sourceMappingURL=LoadingScreen.js.map