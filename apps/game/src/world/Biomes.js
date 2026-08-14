import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Instances, Instance, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { heightAt } from "@legend/engine";
import { BIOME_DEFS, BIOME_ATMOSPHERE } from "@legend/shared";
import { createTerrainMaterial } from "../materials/createTerrainMaterial";
import { createStoneMaterial } from "../materials/createStoneMaterial";
/* ── Helpers ── */
function seedRand(seed) {
    return () => {
        const s = Math.sin((seed += 1) * 127.1) * 43758.5453;
        return s - Math.floor(s);
    };
}
function scatterPatch(cx, cz, radius, count, seed) {
    const r = seedRand(seed);
    const out = [];
    for (let i = 0; i < count; i++) {
        const ang = r() * Math.PI * 2;
        const dist = Math.sqrt(r()) * radius;
        out.push({
            x: cx + Math.cos(ang) * dist,
            z: cz + Math.sin(ang) * dist,
            s: 0.5 + r() * 0.8,
            rot: r() * Math.PI * 2,
        });
    }
    return out;
}
function baseY(s) {
    return heightAt(s.x, s.z);
}
/* ── Reusable materials ── */
const ashenGroundMat = createTerrainMaterial({ variant: "ashen", seed: [13.1, 7.3] });
const bogGroundMat = createTerrainMaterial({ variant: "bog", seed: [8.7, 11.5] });
const desertGroundMat = createTerrainMaterial({ variant: "desert", seed: [3.3, 9.9] });
const frostGroundMat = createTerrainMaterial({ variant: "frost", seed: [17.2, 4.6] });
/* ── Helper: create sparkle group for a biome ── */
function BiomeSparkles({ biome }) {
    const cfg = BIOME_ATMOSPHERE[biome];
    if (cfg.sparkleCount <= 0)
        return null;
    return (_jsx(_Fragment, { children: _jsx(Sparkles, { count: cfg.sparkleCount, scale: [60, 10, 60], size: 3, speed: 0.4, color: biome === "mistwood" ? "#5a8a4a" :
                biome === "frost_peaks" ? "#c0e0ff" :
                    "#d4af37", opacity: 0.5 }) }));
}
/* ── Ashen Barrens — East (Volcanic Crags & Basalt Pillars) ── */
const ashenDef = BIOME_DEFS.find((b) => b.id === "ashen_mountains");
const ashenCx = (ashenDef.bounds.minX + ashenDef.bounds.maxX) / 2;
const ashenCz = (ashenDef.bounds.minZ + ashenDef.bounds.maxZ) / 2;
const ashenRadius = (ashenDef.bounds.maxX - ashenDef.bounds.minX) / 2.5;
const ashenRocks = scatterPatch(ashenCx, ashenCz - 10, ashenRadius, 60, 91);
const basaltColumns = scatterPatch(ashenCx + 15, ashenCz + 10, ashenRadius * 0.7, 35, 73);
const basaltMat = createStoneMaterial({ stoneColor: "#2b2b2b", roughness: 0.9, flatShading: true });
const magmaGlowMat = new THREE.MeshStandardMaterial({
    color: "#ff3d00",
    emissive: "#ff5722",
    emissiveIntensity: 2.0,
    roughness: 0.2,
});
function AshenBarrens() {
    return (_jsxs("group", { children: [basaltColumns.map((s, i) => {
                const y = baseY(s);
                const colH = 2 + (i % 5) * 1.2;
                return (_jsxs("group", { position: [s.x, y, s.z], children: [_jsx("mesh", { castShadow: true, receiveShadow: true, material: basaltMat, position: [0, colH / 2, 0], children: _jsx("cylinderGeometry", { args: [0.7 * s.s, 0.7 * s.s, colH, 6] }) }), i % 4 === 0 && (_jsx("mesh", { position: [0, 0.05, 0], material: magmaGlowMat, children: _jsx("circleGeometry", { args: [1.2, 8] }) }))] }, `basalt-${i}`));
            }), _jsxs(Instances, { limit: ashenRocks.length, castShadow: true, receiveShadow: true, children: [_jsx("dodecahedronGeometry", { args: [0.9, 0] }), _jsx("primitive", { object: basaltMat, attach: "material" }), ashenRocks.map((s, i) => (_jsx(Instance, { position: [s.x, baseY(s) + 0.45 * s.s, s.z], rotation: [s.rot, s.rot * 0.5, 0], scale: [s.s * 1.3, s.s * 0.9, s.s * 1.2] }, i)))] }), _jsx(Sparkles, { count: 45, scale: [60, 20, 60], position: [ashenCx, 10, ashenCz], size: 4, speed: 0.8, color: "#ff5722" })] }));
}
/* ── Mistmire Bog & Whistling Woods — West ── */
const bogDef = BIOME_DEFS.find((b) => b.id === "mistwood");
const bogCx = (bogDef.bounds.minX + bogDef.bounds.maxX) / 2;
const bogCz = (bogDef.bounds.minZ + bogDef.bounds.maxZ) / 2;
const bogRadius = (bogDef.bounds.maxX - bogDef.bounds.minX) / 2.5;
const bogTrees = scatterPatch(bogCx, bogCz, bogRadius, 40, 41);
const swampShrooms = scatterPatch(bogCx - 10, bogCz + 12, bogRadius * 0.6, 30, 67);
const willowWoodMat = createStoneMaterial({ stoneColor: "#283618", roughness: 0.92 });
const willowFoliageMat = new THREE.MeshStandardMaterial({ color: "#606c38", roughness: 0.8, flatShading: true });
const shroomCapMat = new THREE.MeshStandardMaterial({
    color: "#00f5d4",
    emissive: "#00bbf9",
    emissiveIntensity: 1.8,
    roughness: 0.3,
});
function MistmireBog() {
    return (_jsxs("group", { children: [bogTrees.map((s, i) => {
                const y = baseY(s);
                return (_jsxs("group", { position: [s.x, y, s.z], rotation: [0, s.rot, 0], scale: [s.s * 1.3, s.s * 1.3, s.s * 1.3], children: [_jsx("mesh", { castShadow: true, receiveShadow: true, material: willowWoodMat, position: [0, 2.2, 0], children: _jsx("cylinderGeometry", { args: [0.3, 0.6, 4.4, 7] }) }), _jsx("mesh", { castShadow: true, receiveShadow: true, material: willowFoliageMat, position: [0, 4.2, 0], children: _jsx("sphereGeometry", { args: [1.8, 8, 8] }) }), _jsx("mesh", { castShadow: true, receiveShadow: true, material: willowFoliageMat, position: [0.5, 3.2, 0.4], children: _jsx("coneGeometry", { args: [1.2, 2.5, 6] }) })] }, `tree-${i}`));
            }), swampShrooms.map((s, i) => {
                const y = baseY(s);
                return (_jsxs("group", { position: [s.x, y, s.z], scale: [s.s * 1.4, s.s * 1.4, s.s * 1.4], children: [_jsx("mesh", { position: [0, 0.25, 0], material: willowWoodMat, children: _jsx("cylinderGeometry", { args: [0.06, 0.1, 0.5, 6] }) }), _jsx("mesh", { position: [0, 0.5, 0], material: shroomCapMat, children: _jsx("sphereGeometry", { args: [0.3, 8, 6] }) })] }, `shroom-${i}`));
            }), _jsx(Sparkles, { count: 55, scale: [65, 14, 65], position: [bogCx, 6, bogCz], size: 4, speed: 0.3, color: "#90be6d" }), _jsx(Sparkles, { count: 30, scale: [40, 8, 40], position: [bogCx, 3, bogCz], size: 5, speed: 0.4, color: "#00f5d4" })] }));
}
/* ── Sunstone Desert — South-East (Dunes & Oasis Palms) ── */
const desertDef = BIOME_DEFS.find((b) => b.id === "golden_desert");
const desertCx = (desertDef.bounds.minX + desertDef.bounds.maxX) / 2;
const desertCz = (desertDef.bounds.minZ + desertDef.bounds.maxZ) / 2;
const desertRadius = (desertDef.bounds.maxX - desertDef.bounds.minX) / 2.5;
const desertPalms = scatterPatch(desertCx, desertCz, desertRadius * 0.7, 25, 13);
const desertRockFormations = scatterPatch(desertCx + 15, desertCz - 10, desertRadius, 40, 59);
const palmTrunkMat = createStoneMaterial({ stoneColor: "#8d6e63", roughness: 0.9 });
const palmFrondMat = new THREE.MeshStandardMaterial({ color: "#2e7d32", roughness: 0.6, side: THREE.DoubleSide });
const desertSandstoneMat = createStoneMaterial({ stoneColor: "#d7ccc8", roughness: 0.85, flatShading: true });
function SunstoneDesert() {
    return (_jsxs("group", { children: [desertPalms.map((s, i) => {
                const y = baseY(s);
                return (_jsxs("group", { position: [s.x, y, s.z], rotation: [0, s.rot, 0], scale: [s.s * 1.2, s.s * 1.2, s.s * 1.2], children: [_jsx("mesh", { castShadow: true, receiveShadow: true, material: palmTrunkMat, position: [0.4, 2.5, 0], rotation: [0, 0, -0.15], children: _jsx("cylinderGeometry", { args: [0.2, 0.35, 5.2, 7] }) }), [0, 1, 2, 3, 4, 5].map((ang) => (_jsx("mesh", { position: [0.8, 5.1, 0], rotation: [0.35, (ang * Math.PI) / 3, 0.4], castShadow: true, material: palmFrondMat, children: _jsx("planeGeometry", { args: [1.2, 2.2] }) }, ang)))] }, `palm-${i}`));
            }), _jsxs(Instances, { limit: desertRockFormations.length, castShadow: true, receiveShadow: true, children: [_jsx("dodecahedronGeometry", { args: [0.9, 0] }), _jsx("primitive", { object: desertSandstoneMat, attach: "material" }), desertRockFormations.map((s, i) => (_jsx(Instance, { position: [s.x, baseY(s) + 0.35 * s.s, s.z], rotation: [s.rot, s.rot * 0.7, 0], scale: [s.s * 1.5, s.s * 0.6, s.s * 1.2] }, i)))] }), _jsx(Sparkles, { count: 45, scale: [70, 16, 70], position: [desertCx, 8, desertCz], size: 4, speed: 0.5, color: "#ffd166" })] }));
}
/* ── Frostfang Ridge — North (Glacial Monoliths & Snow Pines) ── */
const frostDef = BIOME_DEFS.find((b) => b.id === "frost_peaks");
const frostCx = (frostDef.bounds.minX + frostDef.bounds.maxX) / 2;
const frostCz = (frostDef.bounds.minZ + frostDef.bounds.maxZ) / 2;
const frostRadius = (frostDef.bounds.maxZ - frostDef.bounds.minZ) / 2.5;
const frostPines = scatterPatch(frostCx, frostCz, frostRadius, 35, 47);
const glacialMonoliths = scatterPatch(frostCx + 8, frostCz - 8, frostRadius * 0.7, 20, 89);
const pineFoliageMat = new THREE.MeshStandardMaterial({ color: "#2d6a4f", roughness: 0.8 });
const pineSnowMat = new THREE.MeshStandardMaterial({ color: "#f8f9fa", roughness: 0.6 });
const glacialIceMat = new THREE.MeshStandardMaterial({
    color: "#a0e7e5",
    emissive: "#48cae4",
    emissiveIntensity: 1.4,
    roughness: 0.15,
    metalness: 0.1,
    transparent: true,
    opacity: 0.88,
});
function FrostfangRidge() {
    return (_jsxs("group", { children: [frostPines.map((s, i) => {
                const y = baseY(s);
                return (_jsxs("group", { position: [s.x, y, s.z], rotation: [0, s.rot, 0], scale: [s.s * 1.3, s.s * 1.3, s.s * 1.3], children: [_jsx("mesh", { castShadow: true, receiveShadow: true, material: palmTrunkMat, position: [0, 1.2, 0], children: _jsx("cylinderGeometry", { args: [0.18, 0.3, 2.4, 6] }) }), _jsx("mesh", { castShadow: true, receiveShadow: true, material: pineFoliageMat, position: [0, 2.4, 0], children: _jsx("coneGeometry", { args: [1.3, 1.8, 7] }) }), _jsx("mesh", { position: [0, 2.7, 0], material: pineSnowMat, children: _jsx("coneGeometry", { args: [1.35, 0.4, 7] }) }), _jsx("mesh", { castShadow: true, receiveShadow: true, material: pineFoliageMat, position: [0, 3.6, 0], children: _jsx("coneGeometry", { args: [1.0, 1.6, 7] }) }), _jsx("mesh", { position: [0, 3.9, 0], material: pineSnowMat, children: _jsx("coneGeometry", { args: [1.05, 0.4, 7] }) })] }, `pine-${i}`));
            }), glacialMonoliths.map((s, i) => {
                const y = baseY(s);
                return (_jsx("group", { position: [s.x, y, s.z], scale: [s.s * 1.4, s.s * 1.6, s.s * 1.4], children: _jsx("mesh", { castShadow: true, receiveShadow: true, material: glacialIceMat, position: [0, 2.2, 0], rotation: [0.1, s.rot, -0.1], children: _jsx("cylinderGeometry", { args: [0.4, 0.9, 4.5, 6] }) }) }, `ice-${i}`));
            }), _jsx(Sparkles, { count: 55, scale: [65, 18, 65], position: [frostCx, 10, frostCz], size: 4, speed: 0.6, color: "#e0fbfc" })] }));
}
/* ── Exports ── */
export const BIOME_WORLD_COMPONENTS = {
    ashen_mountains: AshenBarrens,
    mistwood: MistmireBog,
    golden_desert: SunstoneDesert,
    frost_peaks: FrostfangRidge,
};
export function Biomes() {
    return (_jsxs("group", { children: [_jsx(AshenBarrens, {}), _jsx(MistmireBog, {}), _jsx(SunstoneDesert, {}), _jsx(FrostfangRidge, {})] }));
}
//# sourceMappingURL=Biomes.js.map