import React from "react";
import ReactDOM from "react-dom/client";

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

// Catch all async errors
async function bootGame() {
  try {
    const { GameCanvas } = await import("./components/GameCanvas");
    const { BootSequence } = await import("./systems/BootSequence");
    const { ErrorBoundary } = await import("./systems/ErrorBoundary");

    ReactDOM.createRoot(document.getElementById("root")!).render(
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
