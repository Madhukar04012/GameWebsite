import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useGameStore } from "../store/gameStore";
import { GamePhase } from "@legend/engine";
const styles = {
    container: {
        position: "fixed",
        bottom: 20,
        left: 20,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        zIndex: 100,
        pointerEvents: "none",
    },
    hpRow: {
        display: "flex",
        alignItems: "center",
        gap: 8,
    },
    hpLabel: {
        fontSize: 10,
        fontFamily: "Inter, sans-serif",
        color: "#a0a0a0",
        width: 30,
    },
    hpBarOuter: {
        width: 200,
        height: 6,
        background: "#2a2a2a",
        borderRadius: 3,
        overflow: "hidden",
    },
    hpBarInner: (pct) => ({
        width: `${pct}%`,
        height: "100%",
        background: pct > 50 ? "#6a9a4a" : pct > 25 ? "#c4a030" : "#c44a30",
        borderRadius: 3,
        transition: "width 0.3s ease-out",
    }),
    hpText: {
        fontSize: 10,
        fontFamily: "monospace",
        color: "#666",
        width: 50,
    },
    crosshair: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 100,
        pointerEvents: "none",
        color: "rgba(212,175,55,0.4)",
        fontSize: 20,
        fontFamily: "monospace",
    },
    level: {
        fontSize: 10,
        fontFamily: "Inter, sans-serif",
        color: "#666",
    },
};
export function HUD() {
    const player = useGameStore((s) => s.player);
    const phase = useGameStore((s) => s.phase);
    const isPlaying = phase === GamePhase.PLAYING;
    const hpPct = (player.hp / player.maxHp) * 100;
    if (!isPlaying)
        return null;
    return (_jsxs(_Fragment, { children: [_jsx("div", { style: styles.crosshair, children: "+" }), _jsxs("div", { style: styles.container, children: [_jsxs("div", { style: styles.level, children: ["Level ", player.level] }), _jsxs("div", { style: styles.hpRow, children: [_jsx("span", { style: styles.hpLabel, children: "HP" }), _jsx("div", { style: styles.hpBarOuter, children: _jsx("div", { style: styles.hpBarInner(hpPct) }) }), _jsxs("span", { style: styles.hpText, children: [player.hp, "/", player.maxHp] })] })] })] }));
}
//# sourceMappingURL=HUD.js.map