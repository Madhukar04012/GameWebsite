import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { updateMonster, rollDamage, inRange, DEFAULT_WEAPON } from "@legend/engine";
import { playerPos } from "../store/playerPosStore";
export function MonsterEntity({ data, onDeath }) {
    const meshRef = useRef(null);
    const stateRef = useRef(data);
    const [hp, setHp] = useState(data.hp);
    const [flash, setFlash] = useState(false);
    const { camera, raycaster, pointer } = useThree();
    // Check if this monster was clicked
    useEffect(() => {
        function onClick() {
            const m = stateRef.current;
            if (m.state === "death" || hp <= 0)
                return;
            // Check distance to player
            const pp = playerPos.get();
            if (!inRange(pp.x, pp.z, m.position.x, m.position.z, DEFAULT_WEAPON.range))
                return;
            // Hit!
            const damage = rollDamage(DEFAULT_WEAPON);
            const newHp = Math.max(0, hp - damage);
            setHp(newHp);
            setFlash(true);
            setTimeout(() => setFlash(false), 150);
            if (newHp <= 0) {
                setTimeout(() => onDeath?.(m.id), 500);
            }
        }
        window.addEventListener("click", onClick);
        return () => window.removeEventListener("click", onClick);
    }, [hp, onDeath]);
    useFrame((_, delta) => {
        const pp = playerPos.get();
        stateRef.current = updateMonster(stateRef.current, pp, delta);
        if (meshRef.current) {
            meshRef.current.position.set(stateRef.current.position.x, 0.3 + Math.sin(performance.now() * 0.003) * 0.05, stateRef.current.position.z);
            meshRef.current.scale.y = 1 + Math.sin(performance.now() * 0.005) * 0.1;
        }
    });
    if (hp <= 0)
        return null;
    const bodyColor = flash ? "#fff" : hpColor(hp, data.maxHp);
    return (_jsxs("group", { children: [_jsx("group", { ref: meshRef, position: [data.position.x, 0, data.position.z], children: renderKind(data.kind, bodyColor) }), _jsxs("mesh", { position: [data.position.x, monsterTopY(data.kind), data.position.z], children: [_jsx("planeGeometry", { args: [0.6, 0.06] }), _jsx("meshBasicMaterial", { color: "#333" })] }), _jsxs("mesh", { position: [data.position.x - 0.3 * (1 - hp / data.maxHp), monsterTopY(data.kind), data.position.z], children: [_jsx("planeGeometry", { args: [0.6 * hp / data.maxHp, 0.06] }), _jsx("meshBasicMaterial", { color: hpColor(hp, data.maxHp) })] })] }));
}
/** Art-bible per-kind body — distinct silhouette, palette, emissive rune accent. */
function renderKind(kind, color) {
    switch (kind) {
        case "wraith":
            // Floating void tatter — cone mantle + glowing rune core, ethereal blue fire.
            return (_jsxs("group", { children: [_jsxs("mesh", { position: [0, 1, 0], castShadow: true, children: [_jsx("coneGeometry", { args: [0.4, 1.4, 6] }), _jsx("meshStandardMaterial", { color: color, transparent: true, opacity: 0.7, emissive: "#5daeff", emissiveIntensity: 0.8 })] }), _jsxs("mesh", { position: [0, 0.7, 0], children: [_jsx("sphereGeometry", { args: [0.12, 8, 8] }), _jsx("meshStandardMaterial", { color: "#050505", emissive: "#5daeff", emissiveIntensity: 2 })] }), _jsx("pointLight", { position: [0, 0.7, 0], intensity: 2, distance: 4, color: "#5daeff" })] }));
        case "golem":
            // Hulking rune-golem — stacked stone blocks with gold rune seams.
            return (_jsxs("group", { children: [_jsxs("mesh", { position: [0, 0.7, 0], castShadow: true, children: [_jsx("boxGeometry", { args: [0.9, 1.4, 0.7] }), _jsx("meshStandardMaterial", { color: "#1a1a1a", metalness: 0.4, roughness: 0.9 })] }), _jsxs("mesh", { position: [0, 0.35, 0.37], castShadow: true, children: [_jsx("boxGeometry", { args: [0.95, 0.12, 0.04] }), _jsx("meshStandardMaterial", { color: "#d4af37", emissive: "#d4af37", emissiveIntensity: 1 })] }), _jsxs("mesh", { position: [0, 0.35, -0.37], castShadow: true, children: [_jsx("boxGeometry", { args: [0.95, 0.12, 0.04] }), _jsx("meshStandardMaterial", { color: "#d4af37", emissive: "#d4af37", emissiveIntensity: 1 })] }), _jsxs("mesh", { position: [0, 1.6, 0], castShadow: true, children: [_jsx("boxGeometry", { args: [0.7, 0.6, 0.6] }), _jsx("meshStandardMaterial", { color: "#2a2a2a", metalness: 0.3, roughness: 0.85 })] }), _jsxs("mesh", { position: [-0.2, 1.7, 0.31], children: [_jsx("sphereGeometry", { args: [0.05, 6, 6] }), _jsx("meshStandardMaterial", { color: "#f3c649", emissive: "#f3c649", emissiveIntensity: 3 })] }), _jsxs("mesh", { position: [0.2, 1.7, 0.31], children: [_jsx("sphereGeometry", { args: [0.05, 6, 6] }), _jsx("meshStandardMaterial", { color: "#f3c649", emissive: "#f3c649", emissiveIntensity: 3 })] })] }));
        case "slime":
        default:
            // Wobbling ember slime — squashed sphere with bioluminescent core.
            return (_jsxs("group", { children: [_jsxs("mesh", { position: [0, 0.3, 0], castShadow: true, children: [_jsx("sphereGeometry", { args: [0.4, 12, 12] }), _jsx("meshStandardMaterial", { color: color, emissive: color, emissiveIntensity: 0.4, transparent: true, opacity: 0.85 })] }), _jsxs("mesh", { position: [0, 0.35, 0.15], children: [_jsx("sphereGeometry", { args: [0.1, 8, 8] }), _jsx("meshStandardMaterial", { color: "#e63946", emissive: "#e63946", emissiveIntensity: 1.5 })] })] }));
    }
}
function monsterTopY(kind) {
    if (kind === "golem")
        return 2.1;
    if (kind === "wraith")
        return 1.8;
    return 0.8;
}
function hpColor(hp, max) {
    const ratio = hp / max;
    if (ratio > 0.6)
        return "#6a9a4a";
    if (ratio > 0.3)
        return "#c4a030";
    return "#c44a30";
}
//# sourceMappingURL=MonsterEntity.js.map