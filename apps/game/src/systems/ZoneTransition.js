import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/gameStore";
import { GamePhase } from "@legend/engine";
import { playerPos } from "../store/playerPosStore";
const ZONES = {
    capital: {
        label: "Capital Kingdom",
        subtitle: "Where the golden banners fly",
    },
    flower_fields: {
        label: "Flower Fields",
        subtitle: "Wild blooms and wandering slimes",
    },
};
/** Boundary between the two zones. South Gate sits at the city wall (z=-46). */
const GATE_Z = -50;
export function ZoneTransition() {
    const phase = useGameStore((s) => s.phase);
    const [zone, setZone] = useState("capital");
    const [active, setActive] = useState(false);
    const current = useRef("capital");
    const hideTimer = useRef(null);
    useEffect(() => {
        // Only run while world is active (playing); bail in cinematic/spawn.
        if (phase !== GamePhase.PLAYING)
            return;
        const unsub = playerPos.subscribe((pos) => {
            const next = pos.z < GATE_Z ? "flower_fields" : "capital";
            if (next === current.current)
                return;
            current.current = next;
            setZone(next);
            setActive(true);
            if (hideTimer.current)
                clearTimeout(hideTimer.current);
            hideTimer.current = setTimeout(() => setActive(false), 1600);
        });
        return () => {
            unsub();
        };
    }, [phase]);
    if (!active)
        return null;
    const meta = ZONES[zone];
    return (_jsxs("div", { style: {
            position: "fixed",
            inset: 0,
            zIndex: 60,
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
        }, children: [_jsxs("div", { style: {
                    animation: "zt-fade 1.6s ease-out forwards",
                    textAlign: "center",
                }, children: [_jsx("div", { style: {
                            fontSize: 42,
                            fontWeight: "bold",
                            fontFamily: "Inter, sans-serif",
                            letterSpacing: "0.2em",
                            color: "#d4af37",
                            textShadow: "0 0 24px rgba(212,175,55,0.5)",
                        }, children: meta.label }), _jsx("div", { style: {
                            fontSize: 11,
                            fontFamily: "Inter, sans-serif",
                            letterSpacing: "0.3em",
                            textTransform: "uppercase",
                            color: "#a0a0a0",
                            marginTop: 8,
                        }, children: meta.subtitle })] }, zone), _jsx("style", { children: `
        @keyframes zt-fade {
          0% { opacity: 0; transform: translateY(8px); }
          18% { opacity: 1; transform: translateY(0); }
          78% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-8px); }
        }
      ` })] }));
}
//# sourceMappingURL=ZoneTransition.js.map