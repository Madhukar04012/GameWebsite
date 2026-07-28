"use client";

import { useState, useEffect } from "react";

interface MousePosition {
  x: number;
  y: number;
  normX: number;
  normY: number;
}

export function useMousePosition(): MousePosition {
  const [pos, setPos] = useState<MousePosition>({ x: 0, y: 0, normX: 0, normY: 0 });

  useEffect(() => {
    function handle(e: MouseEvent) {
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
