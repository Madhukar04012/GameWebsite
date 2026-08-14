"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "framer-motion";
const variantStyles = {
    default: "bg-background",
    surface: "bg-surface",
    dark: "bg-background border-t border-b border-border",
};
function SectionContent({ children, title, description, }) {
    return (_jsxs("div", { className: "container mx-auto px-6", children: [(title || description) && (_jsxs("div", { className: "mb-12 md:mb-16 text-center max-w-3xl mx-auto", children: [title && (_jsx("h2", { className: "text-4xl md:text-6xl lg:text-7xl font-heading text-primary mb-4 text-balance", children: title })), description && (_jsx("p", { className: "text-lg md:text-xl text-text-secondary font-subheading", children: description }))] })), children] }));
}
export function Section({ children, title, description, variant = "default", id, className = "", animate = true, }) {
    const baseClass = `py-16 md:py-24 ${variantStyles[variant]} ${className}`.trim();
    if (animate) {
        return (_jsx(motion.section, { id: id, initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" }, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }, className: baseClass, children: _jsx(SectionContent, { title: title, description: description, children: children }) }));
    }
    return (_jsx("section", { id: id, className: baseClass, children: _jsx(SectionContent, { title: title, description: description, children: children }) }));
}
//# sourceMappingURL=Section.js.map