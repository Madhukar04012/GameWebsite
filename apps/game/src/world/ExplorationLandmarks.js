import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * ExplorationLandmarks — Major world landmark silhouettes visible across the continent.
 * Creates curiosity, geographic wayfinding, and environmental storytelling:
 * 1. Ancient World Tree (Whistling Woods)
 * 2. Forgotten Sky Temple (Floating ruins with ley-line crystal)
 * 3. Dragon's Spine Colossus (Fossilized serpent arch across Sunstone Dunes)
 * 4. Frostpeak Citadel Ruins (High alpine fortress)
 * 5. Gloomwood Sunken Cathedral (Submerged gothic spire)
 * 6. Ancient Arch Bridge (Spans the river gorge)
 */
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles, Text } from "@react-three/drei";
import * as THREE from "three";
import { heightAt } from "@legend/engine";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createWoodMaterial } from "../materials/createWoodMaterial";
import { createMetalMaterial } from "../materials/createMetalMaterial";
const ancientStoneMat = createStoneMaterial({ stoneColor: "#8d867c", roughness: 0.88, flatShading: true });
const darkRuinMat = createStoneMaterial({ stoneColor: "#3c3836", roughness: 0.94 });
const ancientWoodMat = createWoodMaterial({ woodColor: "#2e2118", roughness: 0.95 });
const runeGlowMat = new THREE.MeshStandardMaterial({
    color: "#00e5ff",
    emissive: "#00b4d8",
    emissiveIntensity: 2.5,
    roughness: 0.2,
});
const goldAltarMat = createMetalMaterial({ kind: "gold" });
export function ExplorationLandmarks() {
    return (_jsxs("group", { children: [_jsx(AncientWorldTree, {}), _jsx(ForgottenSkyTemple, {}), _jsx(DragonSpineColossus, {}), _jsx(FrostpeakCitadel, {}), _jsx(GloomwoodSunkenCathedral, {}), _jsx(AncientArchBridge, {})] }));
}
/** 1. Ancient World Tree — Colossal landmark in the western forest */
function AncientWorldTree() {
    const x = -75;
    const z = -45;
    const y = heightAt(x, z);
    const foliageMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#2d6a4f",
        roughness: 0.8,
        flatShading: true,
    }), []);
    return (_jsxs("group", { position: [x, y, z], children: [[0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3].map((ang, i) => (_jsx("group", { rotation: [0, ang, 0], children: _jsx("mesh", { position: [4, 2.5, 0], rotation: [0, 0, 0.45], castShadow: true, material: ancientWoodMat, children: _jsx("cylinderGeometry", { args: [1.2, 2.2, 7, 8] }) }) }, i))), _jsx("mesh", { position: [0, 10, 0], castShadow: true, material: ancientWoodMat, children: _jsx("cylinderGeometry", { args: [3.2, 5.5, 20, 12] }) }), _jsx("mesh", { position: [0, 8, 2.8], material: runeGlowMat, children: _jsx("boxGeometry", { args: [0.5, 12, 0.4] }) }), _jsx("mesh", { position: [2.5, 9, -1.2], rotation: [0, 1.2, 0], material: runeGlowMat, children: _jsx("boxGeometry", { args: [0.4, 10, 0.4] }) }), _jsx("mesh", { position: [0, 20, 0], castShadow: true, material: foliageMat, children: _jsx("sphereGeometry", { args: [9, 10, 10] }) }), _jsx("mesh", { position: [-5, 24, 3], castShadow: true, material: foliageMat, children: _jsx("sphereGeometry", { args: [7, 9, 9] }) }), _jsx("mesh", { position: [5, 23, -4], castShadow: true, material: foliageMat, children: _jsx("sphereGeometry", { args: [6.5, 9, 9] }) }), _jsx("mesh", { position: [0, 28, 0], castShadow: true, material: foliageMat, children: _jsx("sphereGeometry", { args: [5, 8, 8] }) }), _jsx(Sparkles, { count: 50, scale: [25, 20, 25], position: [0, 14, 0], size: 4, speed: 0.3, color: "#52b788" }), _jsx(Sparkles, { count: 30, scale: [12, 10, 12], position: [0, 6, 0], size: 5, speed: 0.5, color: "#00e5ff" }), _jsx(Text, { position: [0, 32, 0], fontSize: 1.4, color: "#74c69d", anchorX: "center", children: "THE HEARTWOOD ARCH-TREE" })] }));
}
/** 2. Forgotten Sky Temple — Floating ruins above the eastern plateau */
function ForgottenSkyTemple() {
    const x = 70;
    const z = 70;
    const y = heightAt(x, z);
    const coreRef = useRef(null);
    const ringRef = useRef(null);
    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        if (coreRef.current) {
            coreRef.current.rotation.y = t * 0.5;
            coreRef.current.position.y = 18 + Math.sin(t * 1.5) * 0.4;
        }
        if (ringRef.current) {
            ringRef.current.rotation.x = t * 0.3;
            ringRef.current.rotation.z = t * 0.4;
        }
    });
    return (_jsxs("group", { position: [x, y, z], children: [_jsx("mesh", { position: [0, 1, 0], castShadow: true, receiveShadow: true, material: ancientStoneMat, children: _jsx("cylinderGeometry", { args: [6, 7.5, 2, 8] }) }), _jsx("mesh", { position: [0, 2.2, 0], castShadow: true, receiveShadow: true, material: darkRuinMat, children: _jsx("cylinderGeometry", { args: [4.5, 5.5, 0.6, 8] }) }), [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => (_jsxs("group", { position: [Math.sin(ang) * 4.2, 4.5, Math.cos(ang) * 4.2], rotation: [0, ang, 0], children: [_jsx("mesh", { castShadow: true, material: ancientStoneMat, children: _jsx("boxGeometry", { args: [1.2, 6.5, 1.2] }) }), _jsx("mesh", { position: [0, 0, 0.62], material: runeGlowMat, children: _jsx("boxGeometry", { args: [0.3, 5, 0.05] }) })] }, i))), _jsx("mesh", { position: [0, 14, 0], castShadow: true, material: ancientStoneMat, children: _jsx("coneGeometry", { args: [5, 4, 6] }) }), _jsx("mesh", { position: [0, 16.2, 0], castShadow: true, material: ancientStoneMat, children: _jsx("cylinderGeometry", { args: [4.8, 5, 0.8, 6] }) }), _jsx("mesh", { ref: coreRef, position: [0, 18, 0], material: runeGlowMat, children: _jsx("octahedronGeometry", { args: [1.6, 0] }) }), _jsxs("mesh", { ref: ringRef, position: [0, 18, 0], children: [_jsx("torusGeometry", { args: [2.8, 0.15, 8, 24] }), _jsx("meshStandardMaterial", { color: "#f5c542", emissive: "#d4af37", emissiveIntensity: 1.2 })] }), [-3, 3.5, -2, 4].map((dx, i) => (_jsx("mesh", { position: [dx, 15 + i * 1.5, (i - 1.5) * 3], rotation: [i * 0.4, i * 0.8, 0], castShadow: true, material: ancientStoneMat, children: _jsx("boxGeometry", { args: [1.2, 1.2, 1.2] }) }, i))), _jsx(Sparkles, { count: 40, scale: [12, 14, 12], position: [0, 17, 0], size: 5, speed: 0.6, color: "#00f0ff" }), _jsx(Text, { position: [0, 23, 0], fontSize: 1.3, color: "#00e5ff", anchorX: "center", children: "FORGOTTEN SKY TEMPLE" })] }));
}
/** 3. Dragon's Spine Colossus — Fossilized ancient beast in the southern desert */
function DragonSpineColossus() {
    const x = 85;
    const z = -85;
    const y = heightAt(x, z);
    const boneMat = useMemo(() => createStoneMaterial({ stoneColor: "#d6ccc2", roughness: 0.9, flatShading: true }), []);
    return (_jsxs("group", { position: [x, y, z], rotation: [0, 0.6, 0], children: [Array.from({ length: 7 }, (_, i) => {
                const span = 6 - i * 0.4;
                const ribH = 8 - i * 0.5;
                const posZ = i * 4 - 12;
                return (_jsxs("group", { position: [0, 0, posZ], children: [_jsx("mesh", { position: [-span / 2, ribH / 2, 0], rotation: [0, 0, -0.35], castShadow: true, material: boneMat, children: _jsx("cylinderGeometry", { args: [0.3, 0.5, ribH, 6] }) }), _jsx("mesh", { position: [span / 2, ribH / 2, 0], rotation: [0, 0, 0.35], castShadow: true, material: boneMat, children: _jsx("cylinderGeometry", { args: [0.3, 0.5, ribH, 6] }) }), _jsx("mesh", { position: [0, ribH, 0], castShadow: true, material: boneMat, children: _jsx("boxGeometry", { args: [1.6, 1.4, 2.2] }) })] }, i));
            }), _jsxs("group", { position: [0, 4, 18], rotation: [-0.2, 0, 0], children: [_jsx("mesh", { castShadow: true, material: boneMat, children: _jsx("boxGeometry", { args: [4.2, 3.5, 7] }) }), _jsx("mesh", { position: [-1.8, 2.5, -1], rotation: [0.4, 0, -0.5], castShadow: true, material: boneMat, children: _jsx("coneGeometry", { args: [0.5, 4.5, 6] }) }), _jsx("mesh", { position: [1.8, 2.5, -1], rotation: [0.4, 0, 0.5], castShadow: true, material: boneMat, children: _jsx("coneGeometry", { args: [0.5, 4.5, 6] }) }), _jsx("mesh", { position: [-1.2, 0.8, 2.5], material: new THREE.MeshBasicMaterial({ color: "#f39c12" }), children: _jsx("sphereGeometry", { args: [0.35, 8, 8] }) }), _jsx("mesh", { position: [1.2, 0.8, 2.5], material: new THREE.MeshBasicMaterial({ color: "#f39c12" }), children: _jsx("sphereGeometry", { args: [0.35, 8, 8] }) })] }), _jsx(Sparkles, { count: 25, scale: [14, 8, 28], position: [0, 4, 0], size: 3.5, speed: 0.2, color: "#f39c12" }), _jsx(Text, { position: [0, 11, 0], fontSize: 1.2, color: "#e67e22", anchorX: "center", children: "WYRM'S REST CRAG" })] }));
}
/** 4. Frostpeak Citadel Ruins — High northern mountain stronghold */
function FrostpeakCitadel() {
    const x = 0;
    const z = 140;
    const y = heightAt(x, z);
    const snowStoneMat = useMemo(() => createStoneMaterial({ stoneColor: "#708090", roughness: 0.7, flatShading: true }), []);
    return (_jsxs("group", { position: [x, y, z], children: [_jsx("mesh", { position: [0, 5, 0], castShadow: true, receiveShadow: true, material: snowStoneMat, children: _jsx("boxGeometry", { args: [26, 10, 4] }) }), _jsx("mesh", { position: [-13, 8, 0], castShadow: true, receiveShadow: true, material: snowStoneMat, children: _jsx("cylinderGeometry", { args: [3.2, 3.8, 16, 8] }) }), _jsx("mesh", { position: [13, 7, 0], castShadow: true, receiveShadow: true, material: snowStoneMat, children: _jsx("cylinderGeometry", { args: [3.2, 3.8, 14, 8] }) }), _jsx("mesh", { position: [0, 4, 0], castShadow: true, material: darkRuinMat, children: _jsx("boxGeometry", { args: [6, 8, 4.2] }) }), _jsx("mesh", { position: [0, 10.2, 0], receiveShadow: true, material: new THREE.MeshStandardMaterial({ color: "#f0f8ff", roughness: 0.8 }), children: _jsx("boxGeometry", { args: [26.4, 0.6, 4.4] }) }), _jsx(Sparkles, { count: 35, scale: [28, 12, 10], position: [0, 8, 0], size: 3, speed: 0.4, color: "#e0fbfc" }), _jsx(Text, { position: [0, 18, 0], fontSize: 1.4, color: "#dbe9ee", anchorX: "center", children: "FROSTPEAK CITADEL" })] }));
}
/** 5. Gloomwood Sunken Cathedral — Decaying spire in the western marsh */
function GloomwoodSunkenCathedral() {
    const x = -88;
    const z = 75;
    const y = heightAt(x, z);
    return (_jsxs("group", { position: [x, y, z], rotation: [0.08, 0.4, -0.1], children: [_jsx("mesh", { position: [0, 4, 0], castShadow: true, receiveShadow: true, material: darkRuinMat, children: _jsx("boxGeometry", { args: [14, 12, 22] }) }), _jsx("mesh", { position: [0, 13, -7], castShadow: true, material: darkRuinMat, children: _jsx("cylinderGeometry", { args: [2.2, 3.2, 10, 8] }) }), _jsx("mesh", { position: [0, 20, -7], castShadow: true, material: darkRuinMat, children: _jsx("coneGeometry", { args: [2.2, 8, 8] }) }), _jsx("mesh", { position: [0, 7, 11.1], material: runeGlowMat, children: _jsx("circleGeometry", { args: [2.2, 16] }) }), _jsx(Sparkles, { count: 30, scale: [18, 16, 24], position: [0, 8, 0], size: 4, speed: 0.3, color: "#55a630" }), _jsx(Text, { position: [0, 26, 0], fontSize: 1.3, color: "#80b918", anchorX: "center", children: "SUNKEN CATHEDRAL OF MISTS" })] }));
}
/** 6. Ancient Arch Bridge — Spans across the river gorge */
function AncientArchBridge() {
    const x = -38;
    const z = 0;
    const y = heightAt(x, z);
    return (_jsxs("group", { position: [x, y + 1.8, z], rotation: [0, Math.PI / 2, 0], children: [_jsx("mesh", { position: [0, 0, 0], castShadow: true, receiveShadow: true, material: ancientStoneMat, children: _jsx("boxGeometry", { args: [18, 0.8, 4.5] }) }), _jsx("mesh", { position: [0, 0.8, -2.1], castShadow: true, material: ancientStoneMat, children: _jsx("boxGeometry", { args: [18, 0.9, 0.4] }) }), _jsx("mesh", { position: [0, 0.8, 2.1], castShadow: true, material: ancientStoneMat, children: _jsx("boxGeometry", { args: [18, 0.9, 0.4] }) }), _jsx("mesh", { position: [0, -2.5, 0], castShadow: true, receiveShadow: true, material: darkRuinMat, children: _jsx("cylinderGeometry", { args: [2.2, 3, 5, 8] }) })] }));
}
//# sourceMappingURL=ExplorationLandmarks.js.map