"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading = false, disabled, className = "", children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.03 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
        disabled={disabled || loading}
        className={`
          font-heading uppercase tracking-wider rounded-sm
          transition-all duration-300 ease-out
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `.trim()}
        {...props}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            {children}
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
