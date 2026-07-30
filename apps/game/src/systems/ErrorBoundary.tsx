import React from "react";

interface State { hasError: boolean; error: Error | null; }
interface Props { children: React.ReactNode; }

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[Game] Error:", error, info);
    const el = document.getElementById("error-log");
    if (el) el.textContent += `[REACT] ${error.message}\n${error.stack}\n`;
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: "fixed", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", background: "#050505",
          color: "#ef4444", fontFamily: "Inter, sans-serif", padding: 40,
        }}>
          <h2 style={{ fontSize: 24, marginBottom: 16 }}>Something went wrong</h2>
          <pre style={{ fontSize: 12, color: "#a0a0a0", maxWidth: 600, overflow: "auto" }}>
            {this.state.error?.message}
          </pre>
          <button onClick={() => window.location.reload()} style={{
            marginTop: 24, padding: "12px 24px", background: "#d4af37",
            color: "#050505", border: "none", cursor: "pointer", fontSize: 14,
          }}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
