import { type HTMLMotionProps } from "framer-motion";
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";
interface ButtonProps extends Omit<HTMLMotionProps<"button">, "size" | "children"> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    children?: React.ReactNode;
}
export declare const Button: import("react").ForwardRefExoticComponent<Omit<ButtonProps, "ref"> & import("react").RefAttributes<HTMLButtonElement>>;
export {};
//# sourceMappingURL=Button.d.ts.map