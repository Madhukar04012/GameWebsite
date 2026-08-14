"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { useReducedMotion } from "@/hooks/useReducedMotion";
export function AppWrapper({ children }) {
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const reduced = useReducedMotion();
    useEffect(() => {
        // Component mounted
    }, []);
    return (_jsxs(_Fragment, { children: [loading && (_jsx(LoadingScreen, { onFinish: () => setLoading(false), minDuration: 2200 })), _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { initial: reduced ? undefined : { opacity: 0 }, animate: { opacity: 1 }, exit: reduced ? undefined : { opacity: 0 }, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }, children: children }, pathname) })] }));
}
//# sourceMappingURL=AppWrapper.js.map