import { type ReactNode } from "react";
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
export declare function Section({ children, title, description, variant, id, className, animate, }: SectionProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=Section.d.ts.map