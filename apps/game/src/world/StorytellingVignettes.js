import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import * as THREE from "three";
import { heightAt } from "@legend/engine";
import { createWoodMaterial } from "../materials/createWoodMaterial";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createMetalMaterial } from "../materials/createMetalMaterial";
import { createFabricMaterial } from "../materials/createFabricMaterial";
export function StorytellingVignettes() {
    const materials = useMemo(() => ({
        wood: createWoodMaterial({ woodColor: "#3a2618", roughness: 0.88, seed: [11, 1] }),
        darkWood: createWoodMaterial({ woodColor: "#22150c", roughness: 0.92, seed: [11, 2] }),
        stone: createStoneMaterial({ stoneColor: "#8c8275", roughness: 0.85, seed: [11, 3] }),
        metal: createMetalMaterial({ kind: "iron", seed: [11, 4] }),
        gold: createMetalMaterial({ kind: "gold", seed: [11, 5] }),
        fabricRed: createFabricMaterial({ kind: "banner", color: "#8a2a2a", seed: [11, 6] }),
        fabricBlue: createFabricMaterial({ kind: "tent", color: "#2b4c7e", seed: [11, 7] }),
        fabricYellow: createFabricMaterial({ kind: "tent", color: "#d4af37", seed: [11, 8] }),
        ember: new THREE.MeshBasicMaterial({ color: "#ff5500" }),
        crystalRune: new THREE.MeshStandardMaterial({
            color: "#00e5ff",
            emissive: "#00aaff",
            emissiveIntensity: 1.5,
            roughness: 0.2,
            metalness: 0.8,
        }),
    }), []);
    // Preset locations anchored to world regions
    const checkpoints = [
        { x: 0, z: 22, rot: 0 }, // South Gate Inner Checkpoint
        { x: -18, z: 28, rot: Math.PI / 4 }, // West Road Fork
        { x: 18, z: 28, rot: -Math.PI / 4 }, // East Road Fork
    ];
    const marketStalls = [
        { x: 20, z: 4, rot: 0 },
        { x: 26, z: 8, rot: Math.PI / 2 },
        { x: 22, z: 12, rot: -Math.PI / 4 },
    ];
    const trainingPits = [
        { x: -24, z: 14, rot: 0 },
        { x: -20, z: 20, rot: Math.PI / 3 },
    ];
    const fishingDocks = [
        { x: -6, z: 42, rot: Math.PI / 6 },
        { x: 6, z: 42, rot: -Math.PI / 6 },
    ];
    const travelerCamps = [
        { x: -45, z: 60, rot: 0.5 },
        { x: 50, z: 65, rot: -0.8 },
    ];
    const ancientShrines = [
        { x: -75, z: -40, rot: 0 }, // Whistling Woods Shrine
        { x: 80, z: -60, rot: 1.2 }, // Gloomwood Swamp Shrine
    ];
    return (_jsxs("group", { children: [checkpoints.map((spot, i) => (_jsx(GuardCheckpoint, { spot: spot, materials: materials }, `chk-${i}`))), marketStalls.map((spot, i) => (_jsx(MarketVignette, { spot: spot, materials: materials, idx: i }, `mkt-${i}`))), trainingPits.map((spot, i) => (_jsx(TrainingVignette, { spot: spot, materials: materials }, `trn-${i}`))), fishingDocks.map((spot, i) => (_jsx(FishingVignette, { spot: spot, materials: materials }, `fsh-${i}`))), travelerCamps.map((spot, i) => (_jsx(TravelerCampVignette, { spot: spot, materials: materials }, `cmp-${i}`))), ancientShrines.map((spot, i) => (_jsx(AncientShrineVignette, { spot: spot, materials: materials }, `shr-${i}`)))] }));
}
/* ─────────────────────────────────────────────────────────────
   Individual Vignette Components
   ───────────────────────────────────────────────────────────── */
function GuardCheckpoint({ spot, materials }) {
    const y = heightAt(spot.x, spot.z);
    const rot = spot.rot || 0;
    return (_jsxs("group", { position: [spot.x, y, spot.z], rotation: [0, rot, 0], children: [_jsxs("group", { position: [0, 0, 0], children: [_jsx("mesh", { position: [-1.2, 0.4, 0], rotation: [0, 0, Math.PI / 4], material: materials.wood, castShadow: true, children: _jsx("cylinderGeometry", { args: [0.08, 0.1, 1.8, 6] }) }), _jsx("mesh", { position: [1.2, 0.4, 0], rotation: [0, 0, -Math.PI / 4], material: materials.wood, castShadow: true, children: _jsx("cylinderGeometry", { args: [0.08, 0.1, 1.8, 6] }) }), _jsx("mesh", { position: [0, 0.6, 0], rotation: [0, 0, Math.PI / 2], material: materials.darkWood, castShadow: true, children: _jsx("boxGeometry", { args: [0.15, 2.8, 0.15] }) })] }), _jsxs("group", { position: [1.8, 0, 0.5], children: [_jsx("mesh", { position: [0, 0.6, 0], material: materials.wood, castShadow: true, children: _jsx("boxGeometry", { args: [0.1, 1.2, 0.8] }) }), _jsx("mesh", { position: [0.08, 0.6, 0], rotation: [0, Math.PI / 2, 0], material: materials.fabricRed, castShadow: true, children: _jsx("cylinderGeometry", { args: [0.3, 0.2, 0.05, 6] }) }), _jsx("mesh", { position: [-0.05, 0.8, 0.15], rotation: [0, 0, 0.1], material: materials.metal, castShadow: true, children: _jsx("cylinderGeometry", { args: [0.02, 0.02, 2.0, 6] }) })] })] }));
}
function MarketVignette({ spot, materials, idx }) {
    const y = heightAt(spot.x, spot.z);
    const rot = spot.rot || 0;
    const awningMat = idx % 2 === 0 ? materials.fabricBlue : materials.fabricYellow;
    return (_jsxs("group", { position: [spot.x, y, spot.z], rotation: [0, rot, 0], children: [_jsx("mesh", { position: [0, 0.5, 0], material: materials.wood, castShadow: true, receiveShadow: true, children: _jsx("boxGeometry", { args: [2.2, 1.0, 1.0] }) }), _jsx("mesh", { position: [0, 2.2, 0], rotation: [0.1, 0, 0], material: awningMat, castShadow: true, children: _jsx("boxGeometry", { args: [2.5, 0.1, 1.4] }) }), _jsx("mesh", { position: [-1.1, 1.2, -0.4], material: materials.wood, children: _jsx("cylinderGeometry", { args: [0.04, 0.04, 2.2, 6] }) }), _jsx("mesh", { position: [1.1, 1.2, -0.4], material: materials.wood, children: _jsx("cylinderGeometry", { args: [0.04, 0.04, 2.2, 6] }) }), _jsx("mesh", { position: [-1.1, 1.2, 0.4], material: materials.wood, children: _jsx("cylinderGeometry", { args: [0.04, 0.04, 2.2, 6] }) }), _jsx("mesh", { position: [1.1, 1.2, 0.4], material: materials.wood, children: _jsx("cylinderGeometry", { args: [0.04, 0.04, 2.2, 6] }) }), _jsx("mesh", { position: [-0.6, 1.15, 0], material: materials.darkWood, castShadow: true, children: _jsx("boxGeometry", { args: [0.4, 0.3, 0.4] }) }), _jsx("mesh", { position: [0.4, 1.1, 0], material: materials.gold, castShadow: true, children: _jsx("cylinderGeometry", { args: [0.06, 0.08, 0.25, 8] }) })] }));
}
function TrainingVignette({ spot, materials }) {
    const y = heightAt(spot.x, spot.z);
    const rot = spot.rot || 0;
    return (_jsxs("group", { position: [spot.x, y, spot.z], rotation: [0, rot, 0], children: [_jsxs("group", { position: [0, 0, 0], children: [_jsx("mesh", { position: [0, 0.8, 0], material: materials.wood, castShadow: true, children: _jsx("cylinderGeometry", { args: [0.08, 0.08, 1.6, 6] }) }), _jsx("mesh", { position: [0, 1.2, 0], rotation: [0, 0, Math.PI / 2], material: materials.wood, castShadow: true, children: _jsx("cylinderGeometry", { args: [0.06, 0.06, 1.2, 6] }) }), _jsx("mesh", { position: [0, 1.7, 0], material: materials.darkWood, castShadow: true, children: _jsx("sphereGeometry", { args: [0.2, 8, 8] }) })] }), _jsxs("group", { position: [2.5, 0, 0], rotation: [0, -Math.PI / 6, 0], children: [_jsx("mesh", { position: [0, 1.1, 0], rotation: [0, 0, 0], material: materials.fabricRed, castShadow: true, children: _jsx("cylinderGeometry", { args: [0.5, 0.5, 0.08, 16] }) }), _jsx("mesh", { position: [0, 0.6, -0.2], rotation: [0.2, 0, 0], material: materials.wood, castShadow: true, children: _jsx("boxGeometry", { args: [0.1, 1.2, 0.1] }) })] })] }));
}
function FishingVignette({ spot, materials }) {
    const y = heightAt(spot.x, spot.z);
    const rot = spot.rot || 0;
    return (_jsxs("group", { position: [spot.x, y, spot.z], rotation: [0, rot, 0], children: [_jsx("mesh", { position: [0, 0.2, 0], rotation: [0, 0, 0], material: materials.darkWood, castShadow: true, receiveShadow: true, children: _jsx("boxGeometry", { args: [1.2, 0.4, 2.6] }) }), _jsx("mesh", { position: [0.9, 0.4, 0.5], material: materials.wood, castShadow: true, children: _jsx("cylinderGeometry", { args: [0.3, 0.28, 0.8, 10] }) })] }));
}
function TravelerCampVignette({ spot, materials }) {
    const y = heightAt(spot.x, spot.z);
    const rot = spot.rot || 0;
    return (_jsxs("group", { position: [spot.x, y, spot.z], rotation: [0, rot, 0], children: [_jsx("mesh", { position: [0, 0.1, 0], material: materials.stone, receiveShadow: true, children: _jsx("torusGeometry", { args: [0.5, 0.12, 8, 12] }) }), _jsx("mesh", { position: [0, 0.08, 0], material: materials.ember, children: _jsx("cylinderGeometry", { args: [0.35, 0.35, 0.05, 8] }) }), _jsx("mesh", { position: [1.1, 0.15, 0], rotation: [0, 0, Math.PI / 2], material: materials.wood, castShadow: true, children: _jsx("cylinderGeometry", { args: [0.18, 0.18, 1.2, 8] }) }), _jsx("mesh", { position: [-1.1, 0.15, 0.4], rotation: [0, Math.PI / 4, Math.PI / 2], material: materials.wood, castShadow: true, children: _jsx("cylinderGeometry", { args: [0.18, 0.18, 1.2, 8] }) }), _jsx("group", { position: [-2.2, 0.2, -1.0], rotation: [0.4, 0.2, Math.PI / 2], children: _jsx("mesh", { material: materials.wood, castShadow: true, children: _jsx("cylinderGeometry", { args: [0.3, 0.28, 0.8, 10] }) }) })] }));
}
function AncientShrineVignette({ spot, materials }) {
    const y = heightAt(spot.x, spot.z);
    const rot = spot.rot || 0;
    return (_jsxs("group", { position: [spot.x, y, spot.z], rotation: [0, rot, 0], children: [_jsx("mesh", { position: [0, 1.2, 0], material: materials.stone, castShadow: true, receiveShadow: true, children: _jsx("boxGeometry", { args: [1.0, 2.4, 1.0] }) }), _jsx("mesh", { position: [0, 0.2, 0], material: materials.stone, receiveShadow: true, children: _jsx("boxGeometry", { args: [2.0, 0.4, 2.0] }) }), _jsx("mesh", { position: [0, 2.8, 0], rotation: [Math.PI / 4, Math.PI / 4, 0], material: materials.crystalRune, children: _jsx("octahedronGeometry", { args: [0.4, 0] }) })] }));
}
//# sourceMappingURL=StorytellingVignettes.js.map