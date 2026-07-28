import { type ReactNode } from "react";

type ContainerSize = "sm" | "md" | "lg" | "full";

interface ContainerProps {
  children: ReactNode;
  size?: ContainerSize;
  as?: "div" | "section" | "article" | "main";
  className?: string;
}

const sizeStyles: Record<ContainerSize, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  full: "max-w-full",
};

export function Container({
  children,
  size = "lg",
  as: Tag = "div",
  className = "",
}: ContainerProps) {
  return (
    <Tag className={`mx-auto px-6 w-full ${sizeStyles[size]} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
