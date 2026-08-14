import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";
import { GamePhase } from "@legend/engine";
import { getSocket } from "./NetworkClient";
const SUGGESTED = ["Aldric", "Mira", "Kael", "Selene", "Brennan", "Lyra", "Thorne"];
/**
 * CharacterSelectScreen — shown during CHARACTER_SELECT.
 *
 * Lets the player name their hero, then transitions to SPAWNING → PLAYING.
 * After confirming, re-emits player:join with the chosen name so server/clients
 * display the right nameplate.
 */
export function CharacterSelectScreen() {
    const phase = useGameStore((s) => s.phase);
    const playerName = useGameStore((s) => s.connection.playerName);
    const setConnection = useGameStore((s) => s.setConnection);
    const transitionTo = useGameStore((s) => s.transitionTo);
    const [name, setName] = useState(playerName || "Hero");
    useEffect(() => {
        if (phase !== GamePhase.CHARACTER_SELECT)
            return;
        function onKey(e) {
            if (e.key === "Enter")
                confirm();
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, name]);
    if (phase !== GamePhase.CHARACTER_SELECT)
        return null;
    function confirm() {
        const trimmed = name.trim().slice(0, 16) || "Hero";
        setConnection({ playerName: trimmed });
        const socket = getSocket();
        socket?.emit("player:join", { name: trimmed });
        transitionTo(GamePhase.SPAWNING);
        setTimeout(() => useGameStore.getState().transitionTo(GamePhase.PLAYING), 400);
    }
    return (_jsxs("div", { style: {
            position: "fixed",
            inset: 0,
            zIndex: 40,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "radial-gradient(ellipse at center, #0a0a14 0%, #050505 70%)",
            gap: 28,
        }, children: [_jsxs("div", { style: { textAlign: "center" }, children: [_jsx("h1", { style: {
                            fontSize: 28,
                            fontWeight: "bold",
                            fontFamily: "Inter, sans-serif",
                            letterSpacing: "0.3em",
                            color: "#d4af37",
                            textShadow: "0 0 24px rgba(212,175,55,0.4)",
                        }, children: "FORGE YOUR NAME" }), _jsx("p", { style: {
                            fontSize: 11,
                            fontFamily: "Inter, sans-serif",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: "#666",
                            marginTop: 8,
                        }, children: "The realm will remember this" })] }), _jsx("input", { autoFocus: true, value: name, onChange: (e) => setName(e.target.value), maxLength: 16, placeholder: "Enter a hero name", style: {
                    width: 280,
                    padding: "12px 16px",
                    background: "#0a0a0a",
                    border: "1px solid rgba(212,175,55,0.4)",
                    borderRadius: 4,
                    color: "#e0e0e0",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 16,
                    letterSpacing: "0.05em",
                    textAlign: "center",
                    outline: "none",
                } }), _jsx("div", { style: { display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 360 }, children: SUGGESTED.map((s) => (_jsx("button", { onClick: () => setName(s), style: {
                        padding: "4px 10px",
                        background: "transparent",
                        border: "1px solid #333",
                        borderRadius: 3,
                        color: "#888",
                        fontFamily: "Inter, sans-serif",
                        fontSize: 11,
                        cursor: "pointer",
                    }, children: s }, s))) }), _jsx("button", { onClick: confirm, style: {
                    marginTop: 8,
                    padding: "12px 40px",
                    background: "#d4af37",
                    color: "#050505",
                    border: "none",
                    borderRadius: 4,
                    fontFamily: "Inter, sans-serif",
                    fontWeight: "bold",
                    fontSize: 14,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                }, children: "Enter the Realm" })] }));
}
//# sourceMappingURL=CharacterSelectScreen.js.map