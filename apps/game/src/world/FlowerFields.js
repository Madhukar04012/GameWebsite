import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Sparkles } from "@react-three/drei";
import { createSlime, createWraith, createGolem } from "@legend/engine";
import { MonsterEntity } from "./MonsterEntity";
import { createTerrainMaterial } from "../materials/createTerrainMaterial";
/** Art-bible: bioluminescent flora palette — emerald + sapphire + crimson glow. */
const COLORS = ["#d4af37", "#c44a6a", "#2a9d8f", "#5daeff", "#e63946"];
function Flower({ position }) {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    // No per-flower pointLight — the grove previously spawned ~200, killing
    // integrated-GPU perf. Emissive glow is the bloom-fake stand-in.
    return (_jsxs("group", { position: position, children: [_jsxs("mesh", { position: [0, 0.3, 0], children: [_jsx("cylinderGeometry", { args: [0.01, 0.015, 0.5] }), _jsx("meshStandardMaterial", { color: "#1a3b2a" })] }), _jsxs("mesh", { position: [0, 0.6, 0], children: [_jsx("sphereGeometry", { args: [0.06, 6, 6] }), _jsx("meshStandardMaterial", { color: color, emissive: color, emissiveIntensity: 1.2 })] })] }));
}
const flowers = Array.from({ length: 200 }, () => [(Math.random() - 0.5) * 40, 0, (Math.random() - 0.5) * 40]);
/** Floating ember particles — warm gold motes drifting above the field. */
const embers = Array.from({ length: 40 }, () => [(Math.random() - 0.5) * 38, 0.5 + Math.random() * 3, (Math.random() - 0.5) * 38]);
const SPAWNS = [
    { x: -6, z: -4, kind: "slime" },
    { x: 4, z: -6, kind: "slime" },
    { x: -2, z: -10, kind: "slime" },
    { x: 8, z: -2, kind: "wraith" },
    { x: -8, z: -8, kind: "wraith" },
    { x: 0, z: -14, kind: "golem" },
];
function makeMonster(kind, idx, x, z) {
    if (kind === "wraith")
        return createWraith(idx, x, z);
    if (kind === "golem")
        return createGolem(idx, x, z);
    return createSlime(idx, x, z);
}
const initialMonsters = SPAWNS.map((s, i) => makeMonster(s.kind, `${s.kind}-${i}`, s.x, s.z));
const groveMat = createTerrainMaterial({ variant: "grove", seed: [5.1, 2.7] });
export function FlowerFields() {
    const [monsters, setMonsters] = useState(initialMonsters);
    const handleDeath = useCallback((id) => {
        setMonsters((prev) => prev.filter((s) => s.id !== id));
        const spawn = SPAWNS[Math.floor(Math.random() * SPAWNS.length)];
        setTimeout(() => {
            setMonsters((prev) => [...prev, makeMonster(spawn.kind, `${spawn.kind}-${Date.now()}`, spawn.x, spawn.z)]);
        }, 5000);
    }, []);
    return (_jsxs("group", { position: [0, 0, -150], children: [_jsx("mesh", { rotation: [-Math.PI / 2, 0, 0], position: [0, -0.5, 0], receiveShadow: true, material: groveMat, children: _jsx("planeGeometry", { args: [50, 50] }) }), flowers.map((pos, i) => _jsx(Flower, { position: pos }, i)), embers.map((pos, i) => _jsx(Ember, { position: pos }, i)), _jsx(Sparkles, { count: 80, scale: [40, 8, 40], size: 4, speed: 0.6, color: "#2a9d8f", opacity: 0.7 }), _jsx(Sparkles, { count: 50, scale: [35, 5, 35], size: 2.5, speed: 0.8, color: "#d4af37", opacity: 0.5 }), _jsx(Sparkles, { count: 30, scale: [30, 4, 30], size: 2, speed: 0.5, color: "#c44a6a", opacity: 0.4 }), monsters.map((s) => _jsx(MonsterEntity, { data: s, onDeath: handleDeath }, s.id)), _jsx(Text, { position: [0, 4, 0], fontSize: 0.8, color: "#2a9d8f", anchorX: "center", anchorY: "middle", children: "Flower Fields" })] }));
}
function Ember({ position }) {
    const ref = useRef(null);
    const baseY = position[1];
    useFrame((_, delta) => {
        if (!ref.current)
            return;
        ref.current.position.y = baseY + Math.sin(performance.now() * 0.001 + position[0]) * 0.3;
        ref.current.rotation.y += delta;
    });
    return (_jsxs("mesh", { ref: ref, position: position, children: [_jsx("sphereGeometry", { args: [0.03, 6, 6] }), _jsx("meshBasicMaterial", { color: "#f3c649", transparent: true, opacity: 0.7 })] }));
}
//# sourceMappingURL=FlowerFields.js.map