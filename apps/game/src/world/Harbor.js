import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PlaneGeometry } from "three";
import { heightAt } from "@legend/engine";
import { WORLD_BOUNDS } from "@legend/shared";
import { createWaterMaterial } from "../materials/createWaterMaterial";
import { createWoodMaterial } from "../materials/createWoodMaterial";
/**
 * Harbor — animated water plane north of the Harbor district + wooden docks.
 *
 * Water is a subdivided plane whose waves are computed in the vertex shader
 * (summed sines); the fragment shader adds fresnel sky reflection, a sun
 * specular highlight, animated ripple normals, and shoreline foam. No
 * textures, no network — and no per-frame CPU geometry mutation (the old
 * path recomputed every vertex + normals each frame). Docks are a grid of
 * plank meshes + posts; moored boats are simple hull silhouettes.
 *
 * Performance: one water draw, instanced posts later if expanded.
 */
const WATER_W = 40;
const WATER_D = 30;
const WATER_SEG = 32;
const DOCK_FRONT_Z = WORLD_BOUNDS.citySize / 2 - 2; // just outside the city bounds
const WATER_Z = DOCK_FRONT_Z + WATER_D / 2 + 4;
export function Harbor() {
    const geo = useMemo(() => new PlaneGeometry(WATER_W, WATER_D, WATER_SEG, WATER_SEG), []);
    const waterMat = useMemo(() => createWaterMaterial({ shoreZ: DOCK_FRONT_Z + 0.5 }), []);
    // Only the time uniform updates each frame — geometry + normals come from
    // the GPU wave field, so this is constant-cost regardless of segment count.
    useFrame(({ clock }) => {
        waterMat.uniforms.uTime.value = clock.elapsedTime;
    });
    const baseY = heightAt(0, WATER_Z);
    return (_jsxs("group", { children: [_jsx("mesh", { geometry: geo, rotation: [-Math.PI / 2, 0, 0], position: [0, baseY + 0.05, WATER_Z], material: waterMat }), _jsxs("mesh", { rotation: [-Math.PI / 2, 0, 0], position: [0, baseY + 0.07, DOCK_FRONT_Z + 0.5], children: [_jsx("planeGeometry", { args: [WATER_W, 1.2] }), _jsx("meshStandardMaterial", { color: "#cfe0f0", transparent: true, opacity: 0.3, emissive: "#5daeff", emissiveIntensity: 0.2 })] }), _jsx(Dock, { centerZ: DOCK_FRONT_Z + 6, baseY: baseY }), _jsx(Boat, { position: [-6, baseY + 0.4, WATER_Z - 4], rotation: 0 }), _jsx(Boat, { position: [7, baseY + 0.4, WATER_Z + 2], rotation: Math.PI / 8 })] }));
}
function Dock({ centerZ, baseY }) {
    const planks = useMemo(() => {
        const list = [];
        const count = 8;
        for (let i = 0; i < count; i++) {
            const z = DOCK_FRONT_Z + i * 1.8 + 1;
            list.push({ x: 0, z, key: `plank-${i}` });
        }
        return list;
    }, []);
    const posts = useMemo(() => {
        const list = [];
        for (let i = 0; i < 5; i++) {
            const z = DOCK_FRONT_Z + i * 3.6 + 1;
            list.push({ x: -3, z, key: `post-l-${i}` });
            list.push({ x: 3, z, key: `post-r-${i}` });
        }
        return list;
    }, []);
    return (_jsxs("group", { children: [planks.map((p) => (_jsx("mesh", { position: [p.x, baseY + 0.1, p.z], castShadow: true, receiveShadow: true, material: plankMat, children: _jsx("boxGeometry", { args: [7, 0.15, 1.6] }) }, p.key))), posts.map((p) => (_jsx("mesh", { position: [p.x, baseY - 0.2, p.z], castShadow: true, material: postMat, children: _jsx("cylinderGeometry", { args: [0.12, 0.12, 1.4, 6] }) }, p.key)))] }));
}
// Reused wood materials for dock/boat.
const plankMat = createWoodMaterial({ woodColor: 0x6a4a2a, roughness: 0.85 });
const postMat = createWoodMaterial({ woodColor: 0x4a3a22, roughness: 0.88 });
const hullMat = createWoodMaterial({ woodColor: 0x5a3a22, roughness: 0.85 });
const bowMat = createWoodMaterial({ woodColor: 0x4a2a18, roughness: 0.88, flatShading: true });
const sailMat = new THREE.MeshStandardMaterial({ color: "#d4af37", roughness: 0.7, side: THREE.DoubleSide });
function Boat({ position, rotation }) {
    return (_jsxs("group", { position: position, rotation: [0, rotation, 0], children: [_jsx("mesh", { castShadow: true, material: hullMat, children: _jsx("boxGeometry", { args: [1.6, 0.6, 3.5] }) }), _jsx("mesh", { position: [0, 0, 2.1], castShadow: true, material: bowMat, children: _jsx("coneGeometry", { args: [0.8, 1.2, 4] }) }), _jsx("mesh", { position: [0, 1.6, 0], castShadow: true, material: postMat, children: _jsx("cylinderGeometry", { args: [0.05, 0.05, 3.2, 6] }) }), _jsx("mesh", { position: [0, 1.8, 0.5], material: sailMat, children: _jsx("planeGeometry", { args: [1.2, 2] }) })] }));
}
//# sourceMappingURL=Harbor.js.map