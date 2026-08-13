import React from "react";
import ReactDOM from "react-dom/client";
import { GameCanvas } from "./components/GameCanvas";
import { BootSequence } from "./systems/BootSequence";
import { ErrorBoundary } from "./systems/ErrorBoundary";

// Log errors to the error-log div
const errLog = (msg: string) => {
  const el = document.getElementById("error-log");
  if (el) el.textContent += msg + "\n";
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
    if (!rootEl) return;
    ReactDOM.createRoot(rootEl).render(
      <React.StrictMode>
        <ErrorBoundary>
          <BootSequence />
          <GameCanvas />
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (err: unknown) {
    const error = err as Error;
    errLog(`[BOOT FAIL] ${error?.message || String(error)}\n${error?.stack || ""}`);
  }
}

bootGame();

