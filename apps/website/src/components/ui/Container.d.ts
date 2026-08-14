import { type ReactNode } from "react";
type ContainerSize = "sm" | "md" | "lg" | "full";
interface ContainerProps {
    children: ReactNode;
    size?: ContainerSize;
    as?: "div" | "section" | "article" | "main";
    className?: string;
}
export declare function Container({ children, size, as: Tag, className, }: ContainerProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=Container.d.ts.map