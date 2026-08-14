import { jsx as _jsx } from "react/jsx-runtime";
const sizeStyles = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    full: "max-w-full",
};
export function Container({ children, size = "lg", as: Tag = "div", className = "", }) {
    return (_jsx(Tag, { className: `mx-auto px-6 w-full ${sizeStyles[size]} ${className}`.trim(), children: children }));
}
//# sourceMappingURL=Container.js.map