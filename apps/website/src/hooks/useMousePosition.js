"use client";
import { useState, useEffect } from "react";
export function useMousePosition() {
    const [pos, setPos] = useState({ x: 0, y: 0, normX: 0, normY: 0 });
    useEffect(() => {
        function handle(e) {
            setPos({
                x: e.clientX,
                y: e.clientY,
                normX: (e.clientX / window.innerWidth - 0.5) * 2,
                normY: (e.clientY / window.innerHeight - 0.5) * 2,
            });
        }
        window.addEventListener("mousemove", handle, { passive: true });
        return () => window.removeEventListener("mousemove", handle);
    }, []);
    return pos;
}
//# sourceMappingURL=useMousePosition.js.map