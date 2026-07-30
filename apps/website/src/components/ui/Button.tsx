"use client";

import { forwardRef, useState, useCallback } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "size" | "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-background hover:bg-primary-hover shadow-gold hover:shadow-gold-lg",
  secondary:
    "bg-surface text-text-primary border border-border hover:border-primary hover:text-primary",
  outline:
    "bg-transparent text-primary border border-primary hover:bg-primary hover:text-background",
  ghost:
    "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-lg",
  lg: "px-8 py-4 text-2xl",
};

/** Per-click ripple effect: spawns an expanding gold ring at the pointer. */
function spawnRipple(e: React.MouseEvent<HTMLButtonElement>, setRipples: (updater: (r: Ripple[]) => Ripple[]) => void) {
  const rect = e.currentTarget.getBoundingClientRect();
  const id = e.timeStamp;
  const ripple: Ripple = {
    id,
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
  setRipples((prev) => [...prev, ripple]);
  window.setTimeout(() => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, 600);
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading = false, disabled, className = "", children, onClick, ...props }, ref) => {
    const [ripples, setRipples] = useState<Ripple[]>([]);

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || loading) return;
        spawnRipple(e, setRipples);
        onClick?.(e);
      },
      [disabled, loading, onClick],
    );

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.03 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
        disabled={disabled || loading}
        onClick={handleClick}
        className={`
          group relative overflow-hidden font-heading uppercase tracking-wider rounded-sm
          transition-all duration-300 ease-out
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `.trim()}
        {...props}
      >
        {/* Light-sweep shine — diagonal shimmer on hover. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm"
        >
          <span
            className="absolute -inset-y-4 -left-1/3 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-[transform,opacity] duration-700 ease-out group-hover:translate-x-[400%] group-hover:opacity-100"
          />
        </span>

        {/* Ripples */}
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            aria-hidden="true"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: r.x,
              top: r.y,
              width: 12,
              height: 12,
              marginLeft: -6,
              marginTop: -6,
              borderRadius: "9999px",
              background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(212,175,55,0.15) 60%, transparent 100%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          />
        ))}

        {/* Content above effects */}
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              {children}
            </>
          ) : (
            children
          )}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";
