import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { CITY_LAYOUT } from "@legend/shared";
import { heightAt } from "@legend/engine";
import { createFabricMaterial } from "../materials/createFabricMaterial";
import { createMetalMaterial } from "../materials/createMetalMaterial";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createWoodMaterial } from "../materials/createWoodMaterial";
import { useWorldStore } from "../store/worldStore";
const gardenStone = createStoneMaterial({ stoneColor: "#e6dec8", roughness: 0.82, seed: [18, 7] });
const gardenWood = createWoodMaterial({ woodColor: "#3b2418", roughness: 0.9 });
const gardenLeaf = createStoneMaterial({ stoneColor: "#2d6a4f", roughness: 0.92, seed: [4, 12] });
const gold = createMetalMaterial({ kind: "gold", emissive: "#d4af37", emissiveIntensity: 0.5 });
const marble = createStoneMaterial({ stoneColor: "#ffffff", roughness: 0.4, seed: [5, 5] });
const DISTRICT_COLORS = {
    castle: "#b9a77a",
    guild_hall: "#8b5b3e",
    market: "#d18b3d",
    noble: "#b79ac9",
    training: "#9a6b46",
    blacksmith: "#cf6338",
    residential: "#779c6b",
    inn: "#d4af37",
    harbor: "#5ca6b9",
};
/**
 * CapitalDetails — high-signal environmental dressing:
 * Royal Citadel Terraced Gardens, Street Gaslight Lanterns, District Threshold Monoliths,
 * Plaza Balustrades, and Landscaped Tree Planters.
 */
export function CapitalDetails() {
    return (_jsxs("group", { children: [_jsx(RoyalTerraceGardens, {}), CITY_LAYOUT.filter((d) => d.name !== "central_plaza").map((district) => (_jsx(DistrictHeraldryMonolith, { district: district }, district.name))), _jsx(StreetGaslights, {}), _jsx(PlazaBalustrade, {})] }));
}
/** District Boundary Heraldry Monolith */
function DistrictHeraldryMonolith({ district }) {
    const color = DISTRICT_COLORS[district.name] ?? district.color;
    const y = heightAt(district.center.x, district.center.z) + 0.04;
    const bannerMat = useMemo(() => createFabricMaterial({ kind: "banner", color, roughness: 0.85, side: 2, seed: [district.center.x, district.center.z] }), [color, district.center.x, district.center.z]);
    return (_jsxs("group", { position: [district.center.x, y, district.center.z], children: [_jsx("mesh", { position: [0, 0.35, 0], castShadow: true, receiveShadow: true, material: gardenStone, children: _jsx("cylinderGeometry", { args: [0.75, 0.9, 0.7, 8] }) }), _jsx("mesh", { position: [0, 2.0, 0], castShadow: true, material: gardenWood, children: _jsx("cylinderGeometry", { args: [0.08, 0.1, 3.2, 8] }) }), _jsx("mesh", { position: [0.04, 2.6, 0], rotation: [0, 0.05, 0], material: bannerMat, children: _jsx("planeGeometry", { args: [1.1, 1.6] }) }), _jsx("mesh", { position: [0, 3.65, 0], castShadow: true, material: gold, children: _jsx("octahedronGeometry", { args: [0.18, 0] }) })] }));
}
/** Royal Citadel Terraced Gardens */
function RoyalTerraceGardens() {
    const hedges = useMemo(() => [
        [-22, -26, 12, 0.9], [22, -26, 12, 0.9],
        [-22, -26, 0.9, 12], [22, -26, 0.9, 12],
        [-16, -26, 0.9, 12], [16, -26, 0.9, 12],
    ], []);
    const gardenCypress = useMemo(() => [
        { x: -18, z: -22, s: 1.1 },
        { x: 18, z: -22, s: 1.1 },
        { x: -18, z: -30, s: 1.2 },
        { x: 18, z: -30, s: 1.2 },
    ], []);
    return (_jsxs("group", { children: [_jsx("mesh", { position: [0, heightAt(0, -26) + 0.02, -26], rotation: [-Math.PI / 2, 0, 0], receiveShadow: true, material: gardenStone, children: _jsx("planeGeometry", { args: [48, 16] }) }), hedges.map(([x, z, w, d], i) => (_jsx("mesh", { position: [x, heightAt(x, z) + 0.6, z], castShadow: true, receiveShadow: true, material: gardenLeaf, children: _jsx("boxGeometry", { args: [w, 1.2, d] }) }, `hedge-${i}`))), gardenCypress.map((t, i) => (_jsxs("group", { position: [t.x, heightAt(t.x, t.z), t.z], scale: t.s, children: [_jsx("mesh", { position: [0, 1.2, 0], castShadow: true, material: gardenWood, children: _jsx("cylinderGeometry", { args: [0.15, 0.22, 2.4, 8] }) }), _jsx("mesh", { position: [0, 3.8, 0], castShadow: true, material: gardenLeaf, children: _jsx("coneGeometry", { args: [1.1, 4.5, 8] }) })] }, `cypress-${i}`))), _jsxs("group", { position: [0, heightAt(0, -26), -26], children: [_jsx("mesh", { position: [0, 0.35, 0], castShadow: true, receiveShadow: true, material: marble, children: _jsx("cylinderGeometry", { args: [3.2, 3.6, 0.7, 16] }) }), _jsxs("mesh", { position: [0, 0.72, 0], rotation: [-Math.PI / 2, 0, 0], children: [_jsx("circleGeometry", { args: [2.8, 16] }), _jsx("meshStandardMaterial", { color: "#0077b6", emissive: "#00b4d8", emissiveIntensity: 0.4, metalness: 0.8, roughness: 0.1 })] }), _jsx("mesh", { position: [0, 1.5, 0], castShadow: true, material: gold, children: _jsx("sphereGeometry", { args: [0.4, 12, 12] }) })] })] }));
}
/** Street Gaslight Lampposts along Main Avenues */
function StreetGaslights() {
    const isNight = useWorldStore((s) => s.timeOfDay >= 18 || s.timeOfDay <= 6);
    const lampSpots = useMemo(() => [
        // South Imperial High Avenue
        { x: -5, z: -40 }, { x: 5, z: -40 },
        { x: -5, z: -28 }, { x: 5, z: -28 },
        { x: -5, z: -16 }, { x: 5, z: -16 },
        // Trans-Plaza Boulevard (East-West)
        { x: -22, z: -6 }, { x: 22, z: -6 },
        { x: -36, z: -6 }, { x: 36, z: -6 },
        // North Avenue
        { x: -5, z: 8 }, { x: 5, z: 8 },
        { x: -5, z: 22 }, { x: 5, z: 22 },
        { x: -5, z: 34 }, { x: 5, z: 34 },
    ], []);
    return (_jsx("group", { children: lampSpots.map((spot, i) => {
            const y = heightAt(spot.x, spot.z);
            return (_jsxs("group", { position: [spot.x, y, spot.z], children: [_jsx("mesh", { position: [0, 1.4, 0], castShadow: true, material: gardenWood, children: _jsx("cylinderGeometry", { args: [0.08, 0.12, 2.8, 8] }) }), _jsx("mesh", { position: [0, 2.7, 0], castShadow: true, material: gold, children: _jsx("boxGeometry", { args: [0.4, 0.08, 0.08] }) }), _jsxs("mesh", { position: [0.2, 2.5, 0], castShadow: true, children: [_jsx("cylinderGeometry", { args: [0.16, 0.12, 0.35, 6] }), _jsx("meshStandardMaterial", { color: "#ffd700", emissive: "#ffb703", emissiveIntensity: isNight ? 1.8 : 0.2 })] }), isNight && (_jsx("pointLight", { position: [0.2, 2.5, 0], color: "#ffb703", intensity: 3.5, distance: 7, decay: 2 }))] }, `lamp-${i}`));
        }) }));
}
/** Central Plaza Circular Balustrade */
function PlazaBalustrade() {
    const posts = useMemo(() => {
        const arr = [];
        const r = 13.5;
        const count = 16;
        for (let i = 0; i < count; i++) {
            // Leave gaps for the 4 cardinal road avenues
            if (i % 4 === 0)
                continue;
            const ang = (i / count) * Math.PI * 2;
            arr.push({ x: Math.cos(ang) * r, z: -4 + Math.sin(ang) * r, rot: ang });
        }
        return arr;
    }, []);
    return (_jsx("group", { children: posts.map((p, i) => (_jsxs("group", { position: [p.x, heightAt(p.x, p.z), p.z], children: [_jsx("mesh", { position: [0, 0.45, 0], castShadow: true, material: marble, children: _jsx("cylinderGeometry", { args: [0.22, 0.26, 0.9, 8] }) }), _jsx("mesh", { position: [0, 0.95, 0], castShadow: true, material: gold, children: _jsx("sphereGeometry", { args: [0.15, 8, 8] }) })] }, `plaza-post-${i}`))) }));
}
//# sourceMappingURL=CapitalDetails.js.map