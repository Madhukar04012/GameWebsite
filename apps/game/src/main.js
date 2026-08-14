import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { GameCanvas } from "./components/GameCanvas";
import { BootSequence } from "./systems/BootSequence";
import { ErrorBoundary } from "./systems/ErrorBoundary";
// Log errors to the error-log div
const errLog = (msg) => {
    const el = document.getElementById("error-log");
    if (el)
        el.textContent += msg + "\n";
};
window.addEventListener("error", (e) => {
    errLog(`[ERROR] ${e.error?.message || e.message}\n${e.error?.stack || ""}`);
});
window.addEventListener("unhandledrejection", (e) => {
    errLog(`[PROMISE] ${e.reason?.message || e.reason}\n${e.reason?.stack || ""}`);
});
function bootGame() {
    try {
        const rootEl = document.getElementById("root");
        if (!rootEl)
            return;
        ReactDOM.createRoot(rootEl).render(_jsx(React.StrictMode, { children: _jsxs(ErrorBoundary, { children: [_jsx(BootSequence, {}), _jsx(GameCanvas, {})] }) }));
    }
    catch (err) {
        const error = err;
        errLog(`[BOOT FAIL] ${error?.message || String(error)}\n${error?.stack || ""}`);
    }
}
bootGame();
//# sourceMappingURL=main.js.map