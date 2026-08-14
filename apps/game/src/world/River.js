import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createWaterMaterial } from "../materials/createWaterMaterial";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createWoodMaterial } from "../materials/createWoodMaterial";
/**
 * River — diagonal river gorge from NE to SW crossing the terrain.
 *
 * Water surface is a subdivided plane rotated 45deg to follow the river
 * path defined in TerrainSystem (centerline x=z). Uses createWaterMaterial
 * with a perpendicular-distance shore normal so foam appears along both
 * banks. Two simple stone-and-wood bridges connect the existing road
 * network at the harbor road and plaza ring crossings.
 *
 * Architecture follows Harbor.tsx: one water draw, one shared material,
 * useFrame drives uTime. Bridges are simple box geometry with procedural
 * stone/wood materials.
 */
/* River geometry (mirrors TerrainSystem constants). */
const RIVER_WIDTH = 6;
const RIVER_LENGTH = 300;
const WATER_SEG_LEN = 64;
const WATER_SEG_WID = 4;
/* Water surface height in world Y (below city plateau, shows the gorge). */
const WATER_Y = -1.2;
/* Diagonal shore normal — perpendicular to river centerline (x=z).
 * That line's normal is (1, -1) / sqrt(2). */
const SHORE_NORMAL = [0.7071068, -0.7071068];
const BRIDGES = [
    // Bridge 1 — Harbor road at (0, 0). Road goes north-south.
    { x: 0, z: 0, rotation: 0, span: 14, width: 8 },
    // Bridge 2 — Plaza ring road at (-4, -4). Road goes east-west.
    { x: -4, z: -4, rotation: Math.PI / 2, span: 12, width: 10 },
];
/* Bridge deck height — just above the city cobble plane. */
const DECK_Y = 0.08;
/* ── Shared materials (one instance per component mount) ── */
const bridgeStoneMat = createStoneMaterial({
    stoneColor: 0x6b6b7b,
    roughness: 0.85,
});
const bridgeWoodMat = createWoodMaterial({
    woodColor: 0x7a5a3a,
    roughness: 0.75,
});
const railingMat = createStoneMaterial({
    stoneColor: 0x5a5a6a,
    roughness: 0.7,
});
export function River() {
    /* Water surface geometry — subdivided plane for vertex-wave animation. */
    const geo = useMemo(() => new THREE.PlaneGeometry(RIVER_LENGTH, RIVER_WIDTH, WATER_SEG_LEN, WATER_SEG_WID), []);
    /* Water material with diagonal shore normal so foam hugs both banks. */
    const waterMat = useMemo(() => createWaterMaterial({
        shoreNormal: SHORE_NORMAL,
        waterHalfWidth: RIVER_WIDTH / 2,
        shoreZ: 0, // centerline offset (used as center in normal mode)
        deepColor: 0x006a9e,
        skyColor: 0x8ad0ff,
    }), []);
    /* Animate water time uniform each frame. */
    useFrame(({ clock }) => {
        waterMat.uniforms.uTime.value = clock.elapsedTime;
    });
    return (_jsxs("group", { children: [_jsx("group", { rotation: [0, -Math.PI / 4, 0], children: _jsx("mesh", { geometry: geo, rotation: [-Math.PI / 2, 0, 0], position: [0, WATER_Y, 0], material: waterMat, receiveShadow: true }) }), _jsx(ShoreBanks, {}), BRIDGES.map((b, i) => (_jsx(Bridge, { def: b }, `bridge-${i}`)))] }));
}
/**
 * Low stone embankment strips along each side of the river,
 * sitting just above the water to visually define the shoreline.
 */
function ShoreBanks() {
    const bankGeo = useMemo(() => new THREE.PlaneGeometry(RIVER_LENGTH, 0.8, 1, 1), []);
    const bankMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: 0x6b6b5a,
        roughness: 0.9,
        metalness: 0.0,
    }), []);
    /* Shore normal for computing positions: (1, -1)/sqrt(2).
       Each bank is 0.4 units outward from the water edge. */
    const edgeDist = RIVER_WIDTH / 2; // 3
    const bankMatOff = 0.4;
    return (_jsxs("group", { rotation: [0, -Math.PI / 4, 0], children: [_jsx("mesh", { geometry: bankGeo, rotation: [-Math.PI / 2, 0, 0], position: [0, WATER_Y + 0.08, -(edgeDist + bankMatOff)], material: bankMat, receiveShadow: true }), _jsx("mesh", { geometry: bankGeo, rotation: [-Math.PI / 2, 0, 0], position: [0, WATER_Y + 0.08, edgeDist + bankMatOff], material: bankMat, receiveShadow: true })] }));
}
/* ── Bridge sub-component ── */
function Bridge({ def }) {
    const { x, z, rotation, span, width } = def;
    return (_jsxs("group", { position: [x, DECK_Y, z], rotation: [0, rotation, 0], children: [_jsx("mesh", { castShadow: true, receiveShadow: true, material: bridgeWoodMat, children: _jsx("boxGeometry", { args: [width, 0.25, span] }) }), _jsx("mesh", { position: [-(width / 2 - 0.15), -0.05, 0], castShadow: true, material: bridgeStoneMat, children: _jsx("boxGeometry", { args: [0.3, 0.2, span] }) }), _jsx("mesh", { position: [width / 2 - 0.15, -0.05, 0], castShadow: true, material: bridgeStoneMat, children: _jsx("boxGeometry", { args: [0.3, 0.2, span] }) }), _jsx("mesh", { position: [-(width / 2 + 0.08), 0.55, 0], castShadow: true, material: railingMat, children: _jsx("boxGeometry", { args: [0.15, 0.9, span] }) }), _jsx("mesh", { position: [width / 2 + 0.08, 0.55, 0], castShadow: true, material: railingMat, children: _jsx("boxGeometry", { args: [0.15, 0.9, span] }) }), _jsx("mesh", { position: [-(width / 2 - 0.1), -0.05, -(span / 2 - 0.1)], castShadow: true, material: bridgeStoneMat, children: _jsx("boxGeometry", { args: [0.5, 0.35, 0.5] }) }), _jsx("mesh", { position: [width / 2 - 0.1, -0.05, -(span / 2 - 0.1)], castShadow: true, material: bridgeStoneMat, children: _jsx("boxGeometry", { args: [0.5, 0.35, 0.5] }) }), _jsx("mesh", { position: [-(width / 2 - 0.1), -0.05, span / 2 - 0.1], castShadow: true, material: bridgeStoneMat, children: _jsx("boxGeometry", { args: [0.5, 0.35, 0.5] }) }), _jsx("mesh", { position: [width / 2 - 0.1, -0.05, span / 2 - 0.1], castShadow: true, material: bridgeStoneMat, children: _jsx("boxGeometry", { args: [0.5, 0.35, 0.5] }) })] }));
}
//# sourceMappingURL=River.js.map