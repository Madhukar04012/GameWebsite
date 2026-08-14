import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Instances, Instance } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { heightAt } from "@legend/engine";
import { createWoodMaterial } from "../materials/createWoodMaterial";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createMetalMaterial } from "../materials/createMetalMaterial";
import { generateCityDressing } from "./generateCityDressing";
import { useWorldStore } from "../store/worldStore";
export function Props({ visible = true }) {
    const dressing = useMemo(() => generateCityDressing(), []);
    if (!visible)
        return null;
    return (_jsxs("group", { children: [_jsx(InstancedBarrels, { spots: dressing.barrels }), _jsx(InstancedCrates, { spots: dressing.crates }), _jsx(PlazaBenches, { spots: dressing.benches }), _jsx(KnightTrainingDummies, { spots: dressing.trainingDummies }), _jsx(ArcheryTargets, { spots: dressing.archeryTargets }), _jsx(WeaponRacks, { spots: dressing.weaponRacks }), _jsx(BlacksmithAnvils, { spots: dressing.anvils }), _jsx(MarketStalls, { spots: dressing.marketStalls }), _jsx(MerchantCarts, { spots: dressing.merchantCarts }), _jsx(NoticeBoards, { spots: dressing.noticeBoards }), _jsx(WishingWells, { spots: dressing.wishingWells }), _jsx(InstancedStreetLamps, { spots: dressing.streetLamps, type: "normal" }), _jsx(InstancedStreetLamps, { spots: dressing.ornateLamps, type: "ornate" }), _jsx(InstancedPlanters, { spots: dressing.planters }), _jsx(InstancedFlowerBoxes, { spots: dressing.flowerBoxes }), _jsx(InstancedHedges, { spots: dressing.hedges }), _jsx(InstancedFountains, { spots: dressing.fountains }), _jsx(InstancedStatues, { spots: dressing.statues }), _jsx(InstancedWoodPiles, { spots: dressing.woodPiles }), _jsx(InstancedLaundry, { spots: dressing.laundry }), _jsx(InstancedCargoPallets, { spots: dressing.cargoPallets })] }));
}
const woodDark = createWoodMaterial({ woodColor: "#3a2416", roughness: 0.9 });
const woodMid = createWoodMaterial({ woodColor: "#5c3c24", roughness: 0.86 });
const woodLight = createWoodMaterial({ woodColor: "#8c6239", roughness: 0.82 });
const ironMat = createMetalMaterial({ kind: "iron" });
const goldMat = createMetalMaterial({ kind: "gold" });
const stoneMat = createStoneMaterial({ stoneColor: "#555248", roughness: 0.92 });
const hedgeMat = new THREE.MeshStandardMaterial({ color: "#2d5a2d", roughness: 0.9 });
const clothMat = new THREE.MeshStandardMaterial({ color: "#e9ecef", roughness: 0.9, side: THREE.DoubleSide });
function InstancedBarrels({ spots }) {
    return (_jsxs(Instances, { limit: Math.max(1, spots.length), castShadow: true, children: [_jsx("cylinderGeometry", { args: [0.42, 0.48, 1.05, 10] }), _jsx("primitive", { object: woodMid, attach: "material" }), spots.map((s, i) => (_jsx(Instance, { position: [s.x, heightAt(s.x, s.z) + 0.52, s.z], rotation: [0, s.rot ?? 0, 0] }, i)))] }));
}
function InstancedCrates({ spots }) {
    return (_jsxs(Instances, { limit: Math.max(1, spots.length), castShadow: true, children: [_jsx("boxGeometry", { args: [0.85, 0.85, 0.85] }), _jsx("primitive", { object: woodLight, attach: "material" }), spots.map((s, i) => (_jsx(Instance, { position: [s.x, heightAt(s.x, s.z) + 0.42, s.z], rotation: [0, s.rot ?? 0, 0] }, i)))] }));
}
function PlazaBenches({ spots }) {
    return (_jsx("group", { children: spots.map((s, i) => (_jsxs("group", { position: [s.x, heightAt(s.x, s.z), s.z], rotation: [0, s.rot ?? 0, 0], children: [_jsx("mesh", { position: [0, 0.45, 0], castShadow: true, material: woodMid, children: _jsx("boxGeometry", { args: [1.8, 0.1, 0.5] }) }), _jsx("mesh", { position: [0, 0.85, -0.22], castShadow: true, material: woodMid, children: _jsx("boxGeometry", { args: [1.8, 0.4, 0.08] }) }), [-0.75, 0.75].map((lx) => (_jsx("mesh", { position: [lx, 0.22, 0], castShadow: true, material: ironMat, children: _jsx("boxGeometry", { args: [0.08, 0.44, 0.45] }) }, lx)))] }, i))) }));
}
function KnightTrainingDummies({ spots }) {
    return (_jsx("group", { children: spots.map((s, i) => (_jsxs("group", { position: [s.x, heightAt(s.x, s.z), s.z], rotation: [0, s.rot ?? 0, 0], children: [_jsx("mesh", { position: [0, 1.0, 0], castShadow: true, material: woodDark, children: _jsx("cylinderGeometry", { args: [0.08, 0.1, 2.0, 6] }) }), _jsx("mesh", { position: [0, 1.4, 0], castShadow: true, material: woodLight, children: _jsx("cylinderGeometry", { args: [0.35, 0.4, 1.0, 8] }) }), _jsx("mesh", { position: [0, 2.05, 0], castShadow: true, material: woodLight, children: _jsx("sphereGeometry", { args: [0.22, 8, 8] }) }), _jsx("mesh", { position: [0, 1.5, 0], castShadow: true, material: woodDark, children: _jsx("boxGeometry", { args: [1.6, 0.1, 0.1] }) })] }, i))) }));
}
function ArcheryTargets({ spots }) {
    return (_jsx("group", { children: spots.map((s, i) => (_jsxs("group", { position: [s.x, heightAt(s.x, s.z), s.z], rotation: [0, s.rot ?? 0, 0], children: [_jsx("mesh", { position: [0, 0.9, -0.2], rotation: [-0.2, 0, 0], castShadow: true, material: woodDark, children: _jsx("boxGeometry", { args: [0.1, 1.8, 0.1] }) }), _jsxs("mesh", { position: [0, 1.2, 0], rotation: [0, 0, 0], castShadow: true, children: [_jsx("cylinderGeometry", { args: [0.65, 0.65, 0.2, 16] }), _jsx("meshStandardMaterial", { color: "#d4a373", roughness: 0.9 })] })] }, i))) }));
}
function WeaponRacks({ spots }) {
    return (_jsx("group", { children: spots.map((s, i) => (_jsxs("group", { position: [s.x, heightAt(s.x, s.z), s.z], rotation: [0, s.rot ?? 0, 0], children: [_jsx("mesh", { position: [0, 0.9, 0], castShadow: true, material: woodDark, children: _jsx("boxGeometry", { args: [1.8, 1.6, 0.5] }) }), [-0.5, 0, 0.5].map((wx, j) => (_jsx("mesh", { position: [wx, 1.1, 0], rotation: [0, 0, 0.1], castShadow: true, material: ironMat, children: _jsx("boxGeometry", { args: [0.04, 2.2, 0.04] }) }, j)))] }, i))) }));
}
function BlacksmithAnvils({ spots }) {
    return (_jsx("group", { children: spots.map((s, i) => (_jsxs("group", { position: [s.x, heightAt(s.x, s.z), s.z], rotation: [0, s.rot ?? 0, 0], children: [_jsx("mesh", { position: [0, 0.35, 0], castShadow: true, material: woodDark, children: _jsx("cylinderGeometry", { args: [0.45, 0.5, 0.7, 10] }) }), _jsx("mesh", { position: [0, 0.82, 0], castShadow: true, material: ironMat, children: _jsx("boxGeometry", { args: [0.8, 0.28, 0.35] }) })] }, i))) }));
}
const STALL_FABRICS = ["#e63946", "#457b9d", "#2a9d8f", "#e76f51", "#f4a261"];
function MarketStalls({ spots }) {
    return (_jsx("group", { children: spots.map((s, i) => {
            const fabricColor = STALL_FABRICS[i % STALL_FABRICS.length];
            return (_jsxs("group", { position: [s.x, heightAt(s.x, s.z), s.z], rotation: [0, s.rot ?? 0, 0], children: [_jsx("mesh", { position: [0, 0.6, 0], castShadow: true, receiveShadow: true, material: woodMid, children: _jsx("boxGeometry", { args: [2.4, 0.4, 1.2] }) }), [[-1.1, -0.5], [1.1, -0.5], [-1.1, 0.5], [1.1, 0.5]].map(([px, pz], j) => (_jsx("mesh", { position: [px, 1.25, pz], castShadow: true, material: woodDark, children: _jsx("cylinderGeometry", { args: [0.05, 0.05, 2.5, 6] }) }, j))), _jsxs("mesh", { position: [0, 2.45, 0], rotation: [-0.12, 0, 0], castShadow: true, children: [_jsx("boxGeometry", { args: [2.6, 0.08, 1.6] }), _jsx("meshStandardMaterial", { color: fabricColor, emissive: fabricColor, emissiveIntensity: 0.25, roughness: 0.7 })] }), [-0.6, 0, 0.6].map((wx, k) => (_jsxs("mesh", { position: [wx, 0.92, 0], children: [_jsx("sphereGeometry", { args: [0.14, 8, 8] }), _jsx("meshStandardMaterial", { color: k === 0 ? "#ffd166" : k === 1 ? "#06d6a0" : "#ef476f", emissiveIntensity: 0.3 })] }, k)))] }, i));
        }) }));
}
function MerchantCarts({ spots }) {
    return (_jsx("group", { children: spots.map((s, i) => (_jsxs("group", { position: [s.x, heightAt(s.x, s.z), s.z], rotation: [0, s.rot ?? 0, 0], children: [_jsx("mesh", { position: [0, 0.6, 0], castShadow: true, material: woodMid, children: _jsx("boxGeometry", { args: [1.6, 0.4, 2.4] }) }), [-0.85, 0.85].map((wx) => (_jsx("mesh", { position: [wx, 0.45, 0], rotation: [0, 0, Math.PI / 2], castShadow: true, material: woodDark, children: _jsx("torusGeometry", { args: [0.45, 0.08, 6, 12] }) }, wx))), _jsx("mesh", { position: [0, 1.0, 0], castShadow: true, material: woodLight, children: _jsx("boxGeometry", { args: [1.2, 0.7, 1.6] }) })] }, i))) }));
}
function NoticeBoards({ spots }) {
    return (_jsx("group", { children: spots.map((s, i) => (_jsxs("group", { position: [s.x, heightAt(s.x, s.z), s.z], rotation: [0, s.rot ?? 0, 0], children: [[-0.7, 0.7].map((px) => (_jsx("mesh", { position: [px, 1.2, 0], castShadow: true, material: woodDark, children: _jsx("cylinderGeometry", { args: [0.08, 0.08, 2.4, 6] }) }, px))), _jsx("mesh", { position: [0, 1.4, 0], castShadow: true, material: woodMid, children: _jsx("boxGeometry", { args: [1.6, 1.2, 0.12] }) })] }, i))) }));
}
function WishingWells({ spots }) {
    return (_jsx("group", { children: spots.map((s, i) => (_jsxs("group", { position: [s.x, heightAt(s.x, s.z), s.z], rotation: [0, s.rot ?? 0, 0], children: [_jsx("mesh", { position: [0, 0.6, 0], castShadow: true, receiveShadow: true, material: stoneMat, children: _jsx("cylinderGeometry", { args: [1.2, 1.3, 1.2, 16] }) }), _jsxs("mesh", { position: [0, 0.95, 0], rotation: [-Math.PI / 2, 0, 0], children: [_jsx("circleGeometry", { args: [0.95, 16] }), _jsx("meshStandardMaterial", { color: "#0077b6", emissive: "#00b4d8", emissiveIntensity: 0.4, metalness: 0.8, roughness: 0.1 })] }), [-1.0, 1.0].map((px) => (_jsx("mesh", { position: [px, 1.8, 0], castShadow: true, material: woodDark, children: _jsx("cylinderGeometry", { args: [0.09, 0.09, 1.6, 6] }) }, px))), _jsx("mesh", { position: [0, 2.9, 0], castShadow: true, material: woodMid, children: _jsx("coneGeometry", { args: [1.6, 0.9, 8] }) })] }, i))) }));
}
// ==========================================
// NEW INSTANCED DRESSING
// ==========================================
function InstancedStreetLamps({ spots, type }) {
    const isNight = useWorldStore(s => s.timeOfDay >= 18 || s.timeOfDay <= 6);
    const intensity = isNight ? 2 : 0;
    return (_jsx("group", { children: spots.map((s, i) => (_jsx("group", { position: [s.x, heightAt(s.x, s.z), s.z], rotation: [0, s.rot ?? 0, 0], children: type === "ornate" ? (_jsxs(_Fragment, { children: [_jsx("mesh", { position: [0, 1.5, 0], castShadow: true, material: ironMat, children: _jsx("cylinderGeometry", { args: [0.08, 0.12, 3, 8] }) }), _jsx("mesh", { position: [0, 3.2, 0], material: goldMat, children: _jsx("cylinderGeometry", { args: [0.2, 0.2, 0.4, 8] }) }), isNight && _jsx("pointLight", { position: [0, 3.2, 0], intensity: intensity, distance: 10, color: "#ffcc88" })] })) : (_jsxs(_Fragment, { children: [_jsx("mesh", { position: [0, 1.2, 0], castShadow: true, material: ironMat, children: _jsx("cylinderGeometry", { args: [0.06, 0.08, 2.4, 6] }) }), _jsx("mesh", { position: [0, 2.5, 0], material: ironMat, children: _jsx("boxGeometry", { args: [0.3, 0.4, 0.3] }) }), isNight && _jsx("pointLight", { position: [0, 2.5, 0], intensity: intensity, distance: 8, color: "#ffb366" })] })) }, i))) }));
}
function InstancedPlanters({ spots }) {
    return (_jsx("group", { children: spots.map((s, i) => (_jsxs("group", { position: [s.x, heightAt(s.x, s.z), s.z], rotation: [0, s.rot ?? 0, 0], children: [_jsx("mesh", { position: [0, 0.4, 0], castShadow: true, material: stoneMat, children: _jsx("boxGeometry", { args: [1.2, 0.8, 1.2] }) }), _jsx("mesh", { position: [0, 0.9, 0], castShadow: true, material: hedgeMat, children: _jsx("sphereGeometry", { args: [0.5, 8, 8] }) })] }, i))) }));
}
function InstancedFlowerBoxes({ spots }) {
    return (_jsx("group", { children: spots.map((s, i) => (_jsxs("group", { position: [s.x, heightAt(s.x, s.z) + 0.1, s.z], rotation: [0, s.rot ?? 0, 0], children: [_jsx("mesh", { position: [0, 0, 0], castShadow: true, material: woodMid, children: _jsx("boxGeometry", { args: [1.0, 0.3, 0.4] }) }), _jsxs("mesh", { position: [0, 0.2, 0], castShadow: true, children: [_jsx("boxGeometry", { args: [0.9, 0.2, 0.3] }), _jsx("meshStandardMaterial", { color: "#8a5a44" })] }), _jsxs("mesh", { position: [0, 0.3, 0], castShadow: true, children: [_jsx("sphereGeometry", { args: [0.3, 8, 8] }), _jsx("meshStandardMaterial", { color: "#e07a5f" })] })] }, i))) }));
}
function InstancedHedges({ spots }) {
    return (_jsx("group", { children: _jsxs(Instances, { limit: Math.max(1, spots.length), castShadow: true, children: [_jsx("boxGeometry", { args: [2.0, 1.2, 0.8] }), _jsx("primitive", { object: hedgeMat, attach: "material" }), spots.map((s, i) => (_jsx(Instance, { position: [s.x, heightAt(s.x, s.z) + 0.6, s.z], rotation: [0, s.rot ?? 0, 0] }, i)))] }) }));
}
function InstancedFountains({ spots }) {
    return (_jsx("group", { children: spots.map((s, i) => (_jsxs("group", { position: [s.x, heightAt(s.x, s.z), s.z], rotation: [0, s.rot ?? 0, 0], children: [_jsx("mesh", { position: [0, 0.2, 0], castShadow: true, material: stoneMat, children: _jsx("cylinderGeometry", { args: [2, 2.2, 0.4, 16] }) }), _jsx("mesh", { position: [0, 1.0, 0], castShadow: true, material: stoneMat, children: _jsx("cylinderGeometry", { args: [0.8, 0.9, 0.2, 16] }) }), _jsx("mesh", { position: [0, 1.8, 0], castShadow: true, material: stoneMat, children: _jsx("cylinderGeometry", { args: [0.4, 0.5, 0.2, 16] }) }), _jsx("mesh", { position: [0, 1, 0], castShadow: true, material: stoneMat, children: _jsx("cylinderGeometry", { args: [0.2, 0.3, 2.0, 8] }) })] }, i))) }));
}
function InstancedStatues({ spots }) {
    return (_jsx("group", { children: spots.map((s, i) => (_jsxs("group", { position: [s.x, heightAt(s.x, s.z), s.z], rotation: [0, s.rot ?? 0, 0], children: [_jsx("mesh", { position: [0, 0.5, 0], castShadow: true, material: stoneMat, children: _jsx("boxGeometry", { args: [1.2, 1.0, 1.2] }) }), _jsx("mesh", { position: [0, 2.0, 0], castShadow: true, material: stoneMat, children: _jsx("cylinderGeometry", { args: [0.4, 0.4, 2.0, 8] }) })] }, i))) }));
}
function InstancedWoodPiles({ spots }) {
    return (_jsx("group", { children: spots.map((s, i) => (_jsxs("group", { position: [s.x, heightAt(s.x, s.z), s.z], rotation: [0, s.rot ?? 0, 0], children: [[-0.2, 0, 0.2].map(x => (_jsx("mesh", { position: [x, 0.15, 0], rotation: [0, 0, Math.PI / 2], castShadow: true, material: woodMid, children: _jsx("cylinderGeometry", { args: [0.1, 0.1, 1.2, 6] }) }, x))), [-0.1, 0.1].map(x => (_jsx("mesh", { position: [x, 0.3, 0], rotation: [0, 0, Math.PI / 2], castShadow: true, material: woodMid, children: _jsx("cylinderGeometry", { args: [0.1, 0.1, 1.0, 6] }) }, x)))] }, i))) }));
}
function InstancedLaundry({ spots }) {
    return (_jsx("group", { children: spots.map((s, i) => (_jsxs("group", { position: [s.x, heightAt(s.x, s.z) + 1.5, s.z], rotation: [0, s.rot ?? 0, 0], children: [_jsx("mesh", { position: [0, 0, 0], rotation: [0, 0, Math.PI / 2], castShadow: true, material: woodDark, children: _jsx("cylinderGeometry", { args: [0.02, 0.02, 2.0, 4] }) }), _jsx("mesh", { position: [-0.4, -0.4, 0], castShadow: true, material: clothMat, children: _jsx("planeGeometry", { args: [0.6, 0.8] }) }), _jsx("mesh", { position: [0.4, -0.3, 0], castShadow: true, material: clothMat, children: _jsx("planeGeometry", { args: [0.4, 0.6] }) })] }, i))) }));
}
function InstancedCargoPallets({ spots }) {
    return (_jsx("group", { children: spots.map((s, i) => (_jsxs("group", { position: [s.x, heightAt(s.x, s.z), s.z], rotation: [0, s.rot ?? 0, 0], children: [_jsx("mesh", { position: [0, 0.1, 0], castShadow: true, material: woodMid, children: _jsx("boxGeometry", { args: [1.5, 0.2, 1.5] }) }), _jsx("mesh", { position: [0, 0.6, 0], castShadow: true, material: woodLight, children: _jsx("boxGeometry", { args: [1.0, 0.8, 1.0] }) }), _jsx("mesh", { position: [0, 1.3, 0], castShadow: true, material: woodLight, children: _jsx("boxGeometry", { args: [0.8, 0.6, 0.8] }) })] }, i))) }));
}
//# sourceMappingURL=Props.js.map