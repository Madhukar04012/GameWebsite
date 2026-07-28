"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

type SectionVariant = "default" | "surface" | "dark";

interface SectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  variant?: SectionVariant;
  id?: string;
  className?: string;
  animate?: boolean;
}

const variantStyles: Record<SectionVariant, string> = {
  default: "bg-background",
  surface: "bg-surface",
  dark: "bg-background border-t border-b border-border",
};

function SectionContent({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <div className="container mx-auto px-6">
      {(title || description) && (
        <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto">
          {title && (
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading text-primary mb-4 text-balance">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-lg md:text-xl text-text-secondary font-subheading">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

export function Section({
  children,
  title,
  description,
  variant = "default",
  id,
  className = "",
  animate = true,
}: SectionProps) {
  const baseClass = `py-16 md:py-24 ${variantStyles[variant]} ${className}`.trim();

  if (animate) {
    return (
      <motion.section
        id={id}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={baseClass}
      >
        <SectionContent title={title} description={description}>
          {children}
        </SectionContent>
      </motion.section>
    );
  }

  return (
    <section id={id} className={baseClass}>
      <SectionContent title={title} description={description}>
        {children}
      </SectionContent>
    </section>
  );
}
