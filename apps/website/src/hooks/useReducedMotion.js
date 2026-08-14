"use client";
import { useState, useEffect } from "react";
export function useReducedMotion() {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setReduced(mq.matches);
        function onChange(e) {
            setReduced(e.matches);
        }
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);
    return reduced;
}
//# sourceMappingURL=useReducedMotion.js.map