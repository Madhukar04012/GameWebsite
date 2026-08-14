import { type ReactNode } from "react";
type RevealVariant = "fade-up" | "fade-left" | "fade-right" | "scale" | "blur";
interface AnimatedSectionProps {
    children: ReactNode;
    variant?: RevealVariant;
    className?: string;
    delay?: number;
    duration?: number;
    once?: boolean;
    margin?: string;
    as?: "div" | "section" | "article";
}
export declare function AnimatedSection({ children, variant, className, delay, duration, once, margin, as: Tag, }: AnimatedSectionProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=AnimatedSection.d.ts.map