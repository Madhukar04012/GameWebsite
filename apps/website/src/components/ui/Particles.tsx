"use client";

import { useRef, useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

interface ParticlesProps {
  count?: number;
  color?: string;
  speed?: number;
  className?: string;
}

export function Particles({
  count = 30,
  color = "rgba(212, 175, 55, 0.3)",
  speed = 0.3,
  className = "",
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (reduced || !mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * speed,
      speedY: (Math.random() - 0.5) * speed,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    let animId: number;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    function animate() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      }

      animId = requestAnimationFrame(animate);
    }

    animate();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [count, speed, color, reduced, mounted]);

  if (reduced || !mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-0 ${className}`}
      aria-hidden="true"
    />
  );
}
