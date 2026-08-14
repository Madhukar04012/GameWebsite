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
export declare function Card({ children, variant, padding, className, as: Tag, }: CardProps): import("react").JSX.Element;
export declare function CardHeader({ children, className }: {
    children: ReactNode;
    className?: string;
}): import("react").JSX.Element;
export declare function CardBody({ children, className }: {
    children: ReactNode;
    className?: string;
}): import("react").JSX.Element;
export declare function CardFooter({ children, className }: {
    children: ReactNode;
    className?: string;
}): import("react").JSX.Element;
export {};
//# sourceMappingURL=Card.d.ts.map