"use client";
import { jsx as _jsx } from "react/jsx-runtime";
const variantStyles = {
    default: "bg-card border border-border",
    elevated: "bg-card border border-border shadow-lg",
    interactive: "bg-card border border-border cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg hover:border-primary/30",
};
const paddingStyles = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
};
export function Card({ children, variant = "default", padding = "md", className = "", as: Tag = "div", }) {
    return (_jsx(Tag, { className: `rounded-lg ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`.trim(), children: children }));
}
/* ── Card sub-components ── */
export function CardHeader({ children, className = "" }) {
    return _jsx("div", { className: `mb-4 ${className}`.trim(), children: children });
}
export function CardBody({ children, className = "" }) {
    return _jsx("div", { className: `${className}`.trim(), children: children });
}
export function CardFooter({ children, className = "" }) {
    return _jsx("div", { className: `mt-4 pt-4 border-t border-border ${className}`.trim(), children: children });
}
//# sourceMappingURL=Card.js.map