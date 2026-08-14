import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
export default function NotFound() {
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: _jsxs("div", { className: "text-center px-6 max-w-lg", children: [_jsx("h1", { className: "text-8xl font-heading text-primary mb-4", children: "404" }), _jsx("p", { className: "text-xl text-text-secondary font-subheading mb-2", children: "Realm not found" }), _jsx("p", { className: "text-sm text-text-muted font-body mb-8", children: "The region you're looking for doesn't exist on our maps." }), _jsx(Link, { href: "/", className: "inline-flex items-center gap-2 font-heading uppercase tracking-wider rounded-sm px-6 py-3 text-lg bg-primary text-background hover:bg-primary-hover transition-colors", children: "Return Home" })] }) }));
}
//# sourceMappingURL=not-found.js.map