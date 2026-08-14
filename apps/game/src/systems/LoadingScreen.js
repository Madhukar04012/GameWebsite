import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";
import { GamePhase, PHASE_LABELS } from "@legend/engine";
const LOADING_TIPS = [
    "Every decision shapes the world.",
    "Forged in gold and shadow.",
    "Ancient powers stir beneath the capital.",
    "Some legends are born. Others are coded.",
    "The guild halls are waiting for you.",
    "Beware of wolves wearing fleece.",
    "Magic flows strongest at dawn.",
    "The city gates never close.",
];
const styles = {
    overlay: {
        position: "absolute",
        inset: 0,
        zIndex: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#050505",
        overflow: "hidden",
    },
    glow: {
        position: "absolute",
        inset: 0,
        opacity: 0.06,
        background: "radial-gradient(ellipse 60% 40% at 50% 40%, rgba(212,175,55,0.3) 0%, transparent 70%)",
        pointerEvents: "none",
    },
    logo: {
        fontSize: "clamp(2.5rem, 8vw, 6rem)",
        fontFamily: "Bebas Neue, sans-serif",
        color: "#d4af37",
        letterSpacing: "0.2em",
        margin: 0,
        marginBottom: 16,
    },
    phaseLabel: {
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: "0.3em",
        color: "#666",
        fontFamily: "Inter, sans-serif",
        marginBottom: 32,
    },
    barOuter: {
        width: 224,
        height: 2,
        background: "#2a2a2a",
        borderRadius: 999,
        overflow: "hidden",
        marginBottom: 16,
    },
    barInner: {
        height: "100%",
        background: "#d4af37",
        borderRadius: 999,
        transition: "width 0.3s ease-out",
    },
    percentage: {
        fontSize: 10,
        fontFamily: "monospace",
        color: "#666",
        marginBottom: 32,
    },
    tip: {
        fontSize: 12,
        color: "#a0a0a0",
        fontFamily: "Inter, sans-serif",
        fontStyle: "italic",
        height: 20,
        textAlign: "center",
    },
    statusBar: {
        fontSize: 10,
        fontFamily: "Inter, sans-serif",
        marginTop: 24,
    },
    particle: {
        position: "absolute",
        width: 4,
        height: 4,
        borderRadius: "50%",
        background: "rgba(212,175,55,0.2)",
        pointerEvents: "none",
    },
};
export function LoadingScreen() {
    const phase = useGameStore((s) => s.phase);
    const loading = useGameStore((s) => s.loading);
    const connection = useGameStore((s) => s.connection);
    const [tipIndex, setTipIndex] = useState(0);
    const [particles] = useState(() => Array.from({ length: 12 }, (_, i) => ({
        left: `${10 + (i * 7) % 80}%`,
        top: `${20 + (i * 13) % 60}%`,
        delay: i * 0.3,
        duration: 2 + (i % 3),
    })));
    const isVisible = [
        GamePhase.PRELOAD,
        GamePhase.AUTH,
        GamePhase.CONNECT_SERVER,
        GamePhase.LOAD_WORLD,
        GamePhase.ERROR,
    ].includes(phase);
    const isError = phase === GamePhase.ERROR;
    function retry() {
        useGameStore.getState().reset();
        // Re-running BootSequence requires remount; full reload is simplest + reliable.
        window.location.reload();
    }
    useEffect(() => {
        if (!isVisible)
            return;
        const interval = setInterval(() => {
            setTipIndex((i) => (i + 1) % LOADING_TIPS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isVisible]);
    if (!isVisible)
        return null;
    return (_jsxs("div", { style: styles.overlay, children: [_jsx("div", { style: styles.glow, "aria-hidden": "true" }), particles.map((p, i) => (_jsx("div", { style: {
                    ...styles.particle,
                    left: p.left,
                    top: p.top,
                    animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
                }, "aria-hidden": "true" }, i))), _jsx("h1", { style: styles.logo, children: "LEGEND" }), _jsx("div", { style: styles.phaseLabel, children: PHASE_LABELS[phase] }), _jsx("div", { style: styles.barOuter, children: _jsx("div", { style: { ...styles.barInner, width: `${loading.progress}%` } }) }), _jsxs("div", { style: styles.percentage, children: [Math.round(loading.progress), "%"] }), _jsx("div", { style: styles.tip, children: LOADING_TIPS[tipIndex] }, tipIndex), connection.status === "connecting" && (_jsx("div", { style: { ...styles.statusBar, color: "rgba(212,175,55,0.6)" }, children: "Connecting to server..." })), connection.status === "connected" && (_jsxs("div", { style: { ...styles.statusBar, color: "#22c55e" }, children: ["Connected (", connection.latency, "ms)"] })), connection.error && (_jsx("div", { style: { ...styles.statusBar, color: "#ef4444" }, children: connection.error })), isError && (_jsx("button", { onClick: retry, style: {
                    marginTop: 24,
                    padding: "12px 32px",
                    background: "#d4af37",
                    color: "#050505",
                    border: "none",
                    borderRadius: 4,
                    fontFamily: "Inter, sans-serif",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: 13,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                }, children: "Retry Connection" })), _jsx("style", { children: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0; }
          50% { transform: translateY(-30px); opacity: 0.4; }
        }
      ` })] }));
}
//# sourceMappingURL=LoadingScreen.js.map