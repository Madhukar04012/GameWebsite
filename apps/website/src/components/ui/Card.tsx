"use client";

import { type ReactNode } from "react";

type CardVariant = "default" | "elevated" | "interactive";
type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  className?: string;
  as?: "div" | "article" | "section";
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-card border border-border",
  elevated: "bg-card border border-border shadow-lg",
  interactive:
    "bg-card border border-border cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-primary/30",
};

const paddingStyles: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  variant = "default",
  padding = "md",
  className = "",
  as: Tag = "div",
}: CardProps) {
  return (
    <Tag className={`rounded-lg ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`.trim()}>
      {children}
    </Tag>
  );
}

/* ── Card sub-components ── */

export function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mb-4 ${className}`.trim()}>{children}</div>;
}

export function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`${className}`.trim()}>{children}</div>;
}

export function CardFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mt-4 pt-4 border-t border-border ${className}`.trim()}>{children}</div>;
}
