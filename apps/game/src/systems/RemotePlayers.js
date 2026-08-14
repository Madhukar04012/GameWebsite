import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useGameStore } from "../store/gameStore";
/**
 * RemotePlayers — renders all other connected players from the network store.
 * Positions are updated server-side and lerped for smooth interpolation.
 */
export function RemotePlayers() {
    const remotePlayers = useGameStore((s) => s.remotePlayers);
    const list = useMemo(() => Object.values(remotePlayers), [remotePlayers]);
    return (_jsx("group", { children: list.map((p) => (_jsx(RemotePlayer, { player: p }, p.id))) }));
}
function RemotePlayer({ player }) {
    const groupRef = useRef(null);
    const meshRef = useRef(null);
    const target = useRef(player.position);
    // Keep target in sync when server sends new position
    target.current = player.position;
    useFrame(() => {
        const g = groupRef.current;
        if (!g)
            return;
        // Lerp toward latest server position (including Y)
        const lerp = 0.15;
        g.position.x += (target.current.x - g.position.x) * lerp;
        g.position.y += (target.current.y - g.position.y) * lerp;
        g.position.z += (target.current.z - g.position.z) * lerp;
        g.rotation.y = player.rotation;
    });
    return (_jsxs("group", { ref: groupRef, position: [player.position.x, player.position.y, player.position.z], children: [_jsxs("mesh", { ref: meshRef, position: [0, 0.5, 0], castShadow: true, children: [_jsx("capsuleGeometry", { args: [0.3, 0.6, 8, 16] }), _jsx("meshStandardMaterial", { color: "#4a6a8a" })] }), _jsx(Html, { position: [0, 1.6, 0], center: true, distanceFactor: 10, occlude: true, children: _jsx("div", { style: {
                        background: "rgba(5,5,5,0.7)",
                        color: "#d4af37",
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontSize: 12,
                        fontFamily: "Inter, sans-serif",
                        whiteSpace: "nowrap",
                        border: "1px solid rgba(212,175,55,0.3)",
                        pointerEvents: "none",
                        userSelect: "none",
                    }, children: player.name }) })] }));
}
//# sourceMappingURL=RemotePlayers.js.map