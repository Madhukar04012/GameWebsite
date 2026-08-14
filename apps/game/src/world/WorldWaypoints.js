import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * WorldWaypoints — Genshin-style exploration waypoints, Seelie spirits, & treasure camps:
 * 1. Resonant Waypoint Monoliths (Hovering spinning crystal with vertical sky beam)
 * 2. Luminous Seelie Guide Spirits (Floating wisps leading along scenic paths)
 * 3. Ancient Sealed Treasure Chests (Gilded chests with glowing lock rings)
 * 4. Adventurer Cooking Camps (Hanging cauldron over campfire, tents, bedrolls)
 */
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles, Text } from "@react-three/drei";
import * as THREE from "three";
import { heightAt } from "@legend/engine";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createWoodMaterial } from "../materials/createWoodMaterial";
const stoneMat = createStoneMaterial({ stoneColor: "#5c5549", roughness: 0.88 });
const woodMat = createWoodMaterial({ woodColor: "#402a1e", roughness: 0.9 });
const goldMat = new THREE.MeshStandardMaterial({
    color: "#f5c542",
    metalness: 0.85,
    roughness: 0.25,
    emissive: "#d4af37",
    emissiveIntensity: 0.4,
});
const waypointGlowMat = new THREE.MeshStandardMaterial({
    color: "#00f0ff",
    emissive: "#00b4d8",
    emissiveIntensity: 2.8,
    roughness: 0.1,
});
export function WorldWaypoints() {
    return (_jsxs("group", { children: [_jsx(WaypointMonolith, { position: [15, 0, -22], name: "South Plains Waypoint" }), _jsx(WaypointMonolith, { position: [-35, 0, -28], name: "Whistling Woods Waypoint" }), _jsx(WaypointMonolith, { position: [45, 0, 45], name: "Sunstone Plateau Waypoint" }), _jsx(SeelieGuideSpirit, {}), _jsx(SealedTreasureChests, {}), _jsx(AdventurerCookingCamp, { position: [-18, 0, -32] })] }));
}
/** 1. Teleport Waypoint Monolith with Sky Light Beam */
function WaypointMonolith({ position, name }) {
    const [x, , z] = position;
    const y = heightAt(x, z);
    const crystalRef = useRef(null);
    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        if (crystalRef.current) {
            crystalRef.current.rotation.y = t * 0.8;
            crystalRef.current.position.y = 2.4 + Math.sin(t * 2) * 0.12;
        }
    });
    return (_jsxs("group", { position: [x, y, z], children: [_jsx("mesh", { position: [0, 0.25, 0], castShadow: true, receiveShadow: true, material: stoneMat, children: _jsx("cylinderGeometry", { args: [2.2, 2.6, 0.5, 12] }) }), _jsx("mesh", { position: [0, 0.65, 0], castShadow: true, receiveShadow: true, material: stoneMat, children: _jsx("cylinderGeometry", { args: [1.7, 2.0, 0.35, 12] }) }), [-1, 1].map((s) => (_jsxs("group", { position: [s * 1.3, 1.8, 0], rotation: [0, 0, s * -0.2], children: [_jsx("mesh", { castShadow: true, material: stoneMat, children: _jsx("boxGeometry", { args: [0.45, 2.6, 0.7] }) }), _jsx("mesh", { position: [0, 1.3, 0], material: goldMat, children: _jsx("coneGeometry", { args: [0.3, 0.8, 6] }) })] }, s))), _jsx("mesh", { ref: crystalRef, position: [0, 2.4, 0], material: waypointGlowMat, children: _jsx("octahedronGeometry", { args: [0.55, 0] }) }), _jsxs("mesh", { position: [0, 45, 0], children: [_jsx("cylinderGeometry", { args: [0.35, 0.8, 90, 8, 1, true] }), _jsx("meshBasicMaterial", { color: "#00f0ff", transparent: true, opacity: 0.2, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })] }), _jsx(Sparkles, { count: 25, scale: [3, 5, 3], position: [0, 2.5, 0], size: 4, speed: 0.7, color: "#00f0ff" }), _jsx(Text, { position: [0, 4.5, 0], fontSize: 0.65, color: "#00f0ff", anchorX: "center", children: name })] }));
}
/** 2. Luminous Seelie Guide Spirit */
function SeelieGuideSpirit() {
    const seelieRef = useRef(null);
    const seelieMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#a0e7e5",
        emissive: "#48cae4",
        emissiveIntensity: 2.2,
        transparent: true,
        opacity: 0.85,
    }), []);
    useFrame(({ clock }) => {
        const t = clock.elapsedTime * 0.4;
        // Follows scenic curve near the south gate path
        const px = -8 + Math.cos(t) * 12;
        const pz = -18 + Math.sin(t * 1.5) * 8;
        const py = heightAt(px, pz) + 1.4 + Math.sin(clock.elapsedTime * 2) * 0.25;
        if (seelieRef.current) {
            seelieRef.current.position.set(px, py, pz);
        }
    });
    return (_jsxs("group", { ref: seelieRef, children: [_jsx("mesh", { material: seelieMat, children: _jsx("sphereGeometry", { args: [0.3, 12, 12] }) }), _jsx("mesh", { position: [0, -0.25, -0.15], rotation: [0.3, 0, 0], material: seelieMat, children: _jsx("coneGeometry", { args: [0.18, 0.6, 8] }) }), _jsx(Sparkles, { count: 18, scale: [1.5, 1.5, 1.5], size: 3.5, speed: 0.8, color: "#90e0ef" })] }));
}
/** 3. Ancient Sealed Treasure Chests */
function SealedTreasureChests() {
    const chestSpots = useMemo(() => [
        { x: -32, z: -18, rot: 0.5 },
        { x: 22, z: -28, rot: -0.8 },
        { x: -48, z: 22, rot: 1.2 },
    ], []);
    const chestWoodMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#5c3d2e", roughness: 0.8 }), []);
    return (_jsx("group", { children: chestSpots.map((c, i) => {
            const y = heightAt(c.x, c.z);
            return (_jsxs("group", { position: [c.x, y, c.z], rotation: [0, c.rot, 0], children: [_jsx("mesh", { position: [0, 0.15, 0], castShadow: true, receiveShadow: true, material: stoneMat, children: _jsx("boxGeometry", { args: [1.6, 0.3, 1.3] }) }), _jsx("mesh", { position: [0, 0.45, 0], castShadow: true, material: chestWoodMat, children: _jsx("boxGeometry", { args: [0.9, 0.45, 0.6] }) }), _jsx("mesh", { position: [0, 0.72, 0], castShadow: true, material: chestWoodMat, children: _jsx("cylinderGeometry", { args: [0.3, 0.3, 0.9, 8, 1, false, 0, Math.PI] }) }), _jsx("mesh", { position: [0, 0.5, 0.31], material: goldMat, children: _jsx("boxGeometry", { args: [0.16, 0.18, 0.05] }) }), _jsx("mesh", { position: [0, 0.5, 0.33], material: waypointGlowMat, children: _jsx("ringGeometry", { args: [0.04, 0.08, 12] }) }), _jsx(Sparkles, { count: 6, scale: [1.2, 1, 1.2], position: [0, 0.6, 0], size: 2.5, speed: 0.4, color: "#ffd166" })] }, `chest-${i}`));
        }) }));
}
/** 4. Adventurer Field Cooking Camp */
function AdventurerCookingCamp({ position }) {
    const [x, , z] = position;
    const y = heightAt(x, z);
    const tentFabricMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#3d5a80", roughness: 0.8, side: THREE.DoubleSide }), []);
    const cauldronMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#1c1c1c", metalness: 0.8, roughness: 0.4 }), []);
    const emberMat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ff5400" }), []);
    return (_jsxs("group", { position: [x, y, z], children: [_jsxs("group", { position: [-2.5, 1.1, 0], children: [_jsx("mesh", { castShadow: true, material: tentFabricMat, children: _jsx("coneGeometry", { args: [1.8, 2.2, 4] }) }), _jsx("mesh", { position: [0, -0.9, 0], material: new THREE.MeshStandardMaterial({ color: "#e0a96d" }), children: _jsx("boxGeometry", { args: [0.9, 0.2, 1.6] }) })] }), _jsxs("group", { position: [0, 0, 0], children: [[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((ang, i) => (_jsx("mesh", { position: [Math.sin(ang) * 0.4, 0.8, Math.cos(ang) * 0.4], rotation: [0.2 * Math.cos(ang), 0, -0.2 * Math.sin(ang)], material: woodMat, children: _jsx("cylinderGeometry", { args: [0.03, 0.04, 1.6, 6] }) }, i))), _jsx("mesh", { position: [0, 0.6, 0], castShadow: true, material: cauldronMat, children: _jsx("sphereGeometry", { args: [0.35, 12, 10] }) }), _jsx("mesh", { position: [0, 0.08, 0], material: emberMat, children: _jsx("cylinderGeometry", { args: [0.25, 0.35, 0.15, 8] }) }), _jsx(Sparkles, { count: 15, scale: [1, 1.5, 1], position: [0, 0.6, 0], size: 3.5, speed: 0.8, color: "#ff7b00" })] }), _jsxs("group", { position: [2.2, 1.2, 0], rotation: [0, -0.4, 0], children: [_jsx("mesh", { position: [0, 0, 0], castShadow: true, material: woodMat, children: _jsx("boxGeometry", { args: [1.4, 1.0, 0.1] }) }), _jsx("mesh", { position: [0, -0.8, 0], castShadow: true, material: woodMat, children: _jsx("cylinderGeometry", { args: [0.06, 0.08, 1.6, 6] }) }), _jsx(Text, { position: [0, 0.1, 0.06], fontSize: 0.14, color: "#f4a261", anchorX: "center", children: "ADVENTURER POST" })] })] }));
}
//# sourceMappingURL=WorldWaypoints.js.map