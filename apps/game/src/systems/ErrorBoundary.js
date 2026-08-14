import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
export class ErrorBoundary extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, info) {
        console.error("[Game] Error:", error, info);
        const el = document.getElementById("error-log");
        if (el)
            el.textContent += `[REACT] ${error.message}\n${error.stack}\n`;
    }
    render() {
        if (this.state.hasError) {
            return (_jsxs("div", { style: {
                    position: "fixed", inset: 0, display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", background: "#050505",
                    color: "#ef4444", fontFamily: "Inter, sans-serif", padding: 40,
                }, children: [_jsx("h2", { style: { fontSize: 24, marginBottom: 16 }, children: "Something went wrong" }), _jsx("pre", { style: { fontSize: 12, color: "#a0a0a0", maxWidth: 600, overflow: "auto" }, children: this.state.error?.message }), _jsx("button", { onClick: () => window.location.reload(), style: {
                            marginTop: 24, padding: "12px 24px", background: "#d4af37",
                            color: "#050505", border: "none", cursor: "pointer", fontSize: 14,
                        }, children: "Reload" })] }));
        }
        return this.props.children;
    }
}
//# sourceMappingURL=ErrorBoundary.js.map