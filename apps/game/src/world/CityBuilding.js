import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useWorldStore } from "../store/worldStore";
import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { heightAt } from "@legend/engine";
import { getDistrictMaterials, getAllDistrictMaterials } from "../materials/createDistrictMaterials";
import { INTERIOR_REGISTRY } from "./interiors/InteriorRegistry";
const shopSignGoldMat = new THREE.MeshStandardMaterial({ color: "#d4af37", roughness: 0.4, metalness: 0.8 });
export function CityBuilding({ def, color = "#cccccc", district = "residential" }) {
    const { x, z, w, d, h, roof = "gable", floors = 2, family = "residential", isCorner = false, facadeType = "timber", hasBalcony = false, hasChimney = false, shopSign } = def;
    const roofH = Math.max(1.2, h * 0.32);
    const mats = useMemo(() => getDistrictMaterials(district), [district]);
    const { wall, plaster, brick, roof: roofMat, wood, glass, metal, accent, banner } = mats;
    let baseMat = wall;
    let upperMat = wall;
    if (facadeType === "plaster") {
        baseMat = plaster;
        upperMat = plaster;
    }
    else if (facadeType === "brick") {
        baseMat = brick;
        upperMat = brick;
    }
    else if (facadeType === "mixed") {
        baseMat = wall;
        upperMat = plaster;
    }
    else if (facadeType === "timber") {
        baseMat = plaster;
        upperMat = plaster;
    }
    const beamW = 0.18;
    const corners = [
        [-w / 2, -d / 2], [w / 2, -d / 2], [-w / 2, d / 2], [w / 2, d / 2],
    ];
    const { baseY, minH, doorTerrainY } = useMemo(() => {
        let maxH = -Infinity;
        let minH = Infinity;
        const pts = [[0, 0], ...corners];
        for (const [cx, cz] of pts) {
            const h = heightAt(x + cx, z + cz);
            if (h > maxH)
                maxH = h;
            if (h < minH)
                minH = h;
        }
        const baseY = maxH + 0.1;
        const doorTerrainY = heightAt(x, z + d / 2);
        return { baseY, minH, doorTerrainY };
    }, [x, z, w, d]);
    const fndHeight = baseY - minH + 1.2;
    const fndCenterY = 0.7 - fndHeight / 2;
    const storyH = h / floors;
    // Calculate stairs if door is above terrain
    const stairDrop = baseY - doorTerrainY;
    const stairSteps = stairDrop > 0.2 ? Math.ceil(stairDrop / 0.2) : 0;
    const interiorDef = def.label ? INTERIOR_REGISTRY[def.label] : undefined;
    return (_jsxs("group", { position: [x, baseY, z], children: [_jsx("mesh", { position: [0, fndCenterY, 0], castShadow: true, receiveShadow: true, material: baseMat, children: _jsx("boxGeometry", { args: [w + 0.5, fndHeight, d + 0.5] }) }), _jsx("mesh", { position: [0, 0.7, 0], castShadow: true, receiveShadow: true, material: wood, children: _jsx("boxGeometry", { args: [w + 0.25, 0.12, d + 0.25] }) }), stairSteps > 0 && Array.from({ length: stairSteps }).map((_, i) => {
                const stepY = -0.1 - i * 0.2;
                const stepZ = d / 2 + 0.25 + i * 0.3;
                return (_jsx("mesh", { position: [0, stepY, stepZ], castShadow: true, receiveShadow: true, material: baseMat, children: _jsx("boxGeometry", { args: [1.8, 0.2, 0.3] }) }, `stair-${i}`));
            }), interiorDef ? (_jsxs("group", { position: [0, storyH / 2 + 0.3, 0], children: [_jsx("mesh", { position: [0, 0, -d / 2 + 0.1], castShadow: true, receiveShadow: true, material: baseMat, children: _jsx("boxGeometry", { args: [w, storyH, 0.2] }) }), _jsx("mesh", { position: [-w / 2 + 0.1, 0, 0], castShadow: true, receiveShadow: true, material: baseMat, children: _jsx("boxGeometry", { args: [0.2, storyH, d] }) }), _jsx("mesh", { position: [w / 2 - 0.1, 0, 0], castShadow: true, receiveShadow: true, material: baseMat, children: _jsx("boxGeometry", { args: [0.2, storyH, d] }) }), _jsx("mesh", { position: [-w / 4 - 0.3, 0, d / 2 - 0.1], castShadow: true, receiveShadow: true, material: baseMat, children: _jsx("boxGeometry", { args: [w / 2 - 0.6, storyH, 0.2] }) }), _jsx("mesh", { position: [w / 4 + 0.3, 0, d / 2 - 0.1], castShadow: true, receiveShadow: true, material: baseMat, children: _jsx("boxGeometry", { args: [w / 2 - 0.6, storyH, 0.2] }) }), storyH > 2.4 && (_jsx("mesh", { position: [0, 1.2, d / 2 - 0.1], castShadow: true, receiveShadow: true, material: baseMat, children: _jsx("boxGeometry", { args: [1.2, storyH - 2.4, 0.2] }) }))] })) : (_jsx("mesh", { position: [0, storyH / 2 + 0.3, 0], castShadow: true, receiveShadow: true, material: baseMat, children: _jsx("boxGeometry", { args: [w, storyH, d] }) })), floors > 1 && (_jsx("mesh", { position: [0, storyH + (h - storyH) / 2 + 0.3, 0], castShadow: true, receiveShadow: true, material: upperMat, children: _jsx("boxGeometry", { args: [w, h - storyH, d] }) })), facadeType === "timber" && corners.map((c, i) => (_jsx("mesh", { position: [c[0], h / 2 + 0.3, c[1]], castShadow: true, receiveShadow: true, material: wood, children: _jsx("boxGeometry", { args: [beamW, h + 0.1, beamW] }) }, `corner-${i}`))), Array.from({ length: floors }).map((_, f) => {
                const floorY = (f + 1) * storyH + 0.3;
                if (floorY >= h + 0.2)
                    return null;
                return (_jsxs("group", { position: [0, floorY, 0], children: [_jsx("mesh", { castShadow: true, receiveShadow: true, material: wood, children: _jsx("boxGeometry", { args: [w + 0.22, 0.2, d + 0.22] }) }), [-w / 2 + 0.4, w / 2 - 0.4].map((bx) => (_jsx("mesh", { position: [bx, -0.15, d / 2 + 0.1], castShadow: true, material: wood, children: _jsx("boxGeometry", { args: [0.2, 0.3, 0.25] }) }, `corbel-${bx}`)))] }, `floor-beam-${f}`));
            }), _jsx("mesh", { position: [0, h + 0.35, 0], castShadow: true, material: accent ?? wood, children: _jsx("boxGeometry", { args: [w * 1.04, 0.16, d * 1.04] }) }), _jsx(BuildingRoof, { kind: roof, w: w, d: d, h: h + 0.35, roofH: roofH, material: roofMat, accent: accent, isCorner: isCorner, wood: wood }), interiorDef && (_jsx("group", { position: [0, 0.3, 0], children: _jsx(interiorDef.component, { w: w, d: d, storyH: storyH }) })), _jsx(BuildingDoor, { family: family, w: w, d: d, storyH: storyH, woodMat: wood, metalMat: metal, glassMat: glass, isOpen: !!interiorDef }), _jsx(BuildingWindows, { family: family, w: w, d: d, h: h, floors: floors, storyH: storyH, woodMat: wood, glassMat: glass, bannerMat: banner, isCorner: isCorner }), hasBalcony && floors >= 2 && (_jsx(BuildingBalcony, { family: family, w: Math.min(3.2, w * 0.6), d: d, floorY: storyH + 0.4, woodMat: wood, stoneMat: wall, metalMat: metal })), family === "craft" && (_jsx(BuildingCraftProps, { w: w, d: d, woodMat: wood, metalMat: metal })), hasChimney && (_jsx(BuildingChimney, { w: w, d: d, totalH: h + roofH * (roof === "flat" ? 0.2 : 0.8), wallMat: brick })), shopSign && (_jsx(BuildingShopSign, { sign: shopSign, d: d, woodMat: wood, metalMat: metal }))] }));
}
function BuildingRoof({ kind, w, d, h, roofH, material, accent, isCorner, wood }) {
    switch (kind) {
        case "flat":
            return (_jsxs("group", { position: [0, h, 0], children: [_jsx("mesh", { position: [0, 0.12, 0], castShadow: true, receiveShadow: true, material: material, children: _jsx("boxGeometry", { args: [w * 1.02, 0.24, d * 1.02] }) }), [-d / 2, d / 2].map((pz, zi) => (_jsx("mesh", { position: [0, 0.45, pz], castShadow: true, material: material, children: _jsx("boxGeometry", { args: [w * 0.98, 0.5, 0.28] }) }, `parapet-z-${zi}`))), [-w / 2, w / 2].map((px, xi) => (_jsx("mesh", { position: [px, 0.45, 0], castShadow: true, material: material, children: _jsx("boxGeometry", { args: [0.28, 0.5, d * 0.98] }) }, `parapet-x-${xi}`)))] }));
        case "shallow":
            return (_jsx("group", { position: [0, h, 0], children: _jsx("mesh", { position: [0, 0.2, 0], rotation: [0.1, 0, 0], castShadow: true, material: material, children: _jsx("boxGeometry", { args: [w * 1.1, 0.2, d * 1.1] }) }) }));
        case "hip":
            return (_jsx("group", { position: [0, h + roofH / 2, 0], children: _jsx("mesh", { rotation: [0, Math.PI / 4, 0], castShadow: true, material: material, children: _jsx("cylinderGeometry", { args: [0, Math.max(w, d) * 0.8, roofH * 1.2, 4] }) }) }));
        case "mansard":
            return (_jsxs("group", { position: [0, h + roofH / 2, 0], children: [_jsx("mesh", { castShadow: true, material: material, children: _jsx("cylinderGeometry", { args: [Math.min(w, d) * 0.4, Math.min(w, d) * 0.6, roofH * 1.2, 4] }) }), _jsx("mesh", { position: [0, roofH * 0.6 + 0.1, 0], material: accent ?? wood, children: _jsx("boxGeometry", { args: [Math.min(w, d) * 0.7, 0.2, Math.min(w, d) * 0.7] }) })] }));
        case "double-gable":
            return (_jsx("group", { position: [0, h + roofH / 2, 0], children: [-w * 0.25, w * 0.25].map((wx, i) => (_jsx("mesh", { position: [wx, 0, 0], rotation: [0, Math.PI / 4, 0], castShadow: true, material: material, children: _jsx("coneGeometry", { args: [Math.min(w, d) * 0.5, roofH * 1.4, 4] }) }, `gable-${i}`))) }));
        case "tower":
            return (_jsxs("group", { position: [0, h, 0], children: [_jsx("mesh", { position: [0, 0.2, 0], castShadow: true, material: material, children: _jsx("cylinderGeometry", { args: [Math.min(w, d) * 0.72, Math.min(w, d) * 0.76, 0.4, 8] }) }), _jsx("mesh", { position: [0, roofH * 0.7, 0], castShadow: true, material: material, children: _jsx("coneGeometry", { args: [Math.min(w, d) * 0.7, roofH * 1.4, 8] }) })] }));
        case "cone":
            return (_jsx("group", { position: [0, h, 0], children: _jsx("mesh", { position: [0, roofH / 2, 0], castShadow: true, material: material, children: _jsx("coneGeometry", { args: [Math.max(w, d) * 0.72, roofH * 1.3, 8] }) }) }));
        case "dome":
            return (_jsx("group", { position: [0, h, 0], children: _jsx("mesh", { position: [0, 0, 0], castShadow: true, material: material, children: _jsx("sphereGeometry", { args: [Math.min(w, d) * 0.58, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2] }) }) }));
        case "gable":
        default:
            return (_jsxs("group", { position: [0, h + roofH / 2, 0], children: [_jsx("mesh", { rotation: [0, Math.PI / 4, 0], castShadow: true, material: material, children: _jsx("coneGeometry", { args: [Math.max(w, d) * 1.06, roofH * 1.4, 4] }) }), w > 4 && d > 4 && !isCorner && (_jsx(_Fragment, { children: [-w * 0.25, w * 0.25].map((dx, i) => (_jsxs("group", { position: [dx, roofH * 0.1, d * 0.35], children: [_jsx("mesh", { castShadow: true, material: wood, children: _jsx("boxGeometry", { args: [0.8, 1.2, 0.8] }) }), _jsx("mesh", { position: [0, 0.7, 0], rotation: [0, Math.PI / 4, 0], castShadow: true, material: material, children: _jsx("coneGeometry", { args: [0.8, 0.6, 4] }) })] }, `dormer-${i}`))) }))] }));
    }
}
function BuildingDoor({ family, w, d, storyH, woodMat, metalMat, glassMat, isOpen = false }) {
    if (family === "commercial") {
        // Grand double doors for shops
        return (_jsxs("group", { position: [0, 0, d / 2 + 0.02], children: [_jsx("mesh", { position: [0, 1.3, 0.02], castShadow: true, receiveShadow: true, material: woodMat, children: _jsx("boxGeometry", { args: [1.8, 2.6, 0.14] }) }), !isOpen && (_jsxs(_Fragment, { children: [_jsx("mesh", { position: [-0.45, 1.25, 0.06], castShadow: true, material: woodMat, children: _jsx("boxGeometry", { args: [0.7, 2.3, 0.06] }) }), _jsx("mesh", { position: [0.45, 1.25, 0.06], castShadow: true, material: woodMat, children: _jsx("boxGeometry", { args: [0.7, 2.3, 0.06] }) }), _jsx("mesh", { position: [-0.45, 1.7, 0.1], material: glassMat, children: _jsx("planeGeometry", { args: [0.4, 0.8] }) }), _jsx("mesh", { position: [0.45, 1.7, 0.1], material: glassMat, children: _jsx("planeGeometry", { args: [0.4, 0.8] }) })] }))] }));
    }
    if (family === "craft") {
        // Large double workshop doors
        return (_jsxs("group", { position: [0, 0, d / 2 + 0.02], children: [_jsx("mesh", { position: [0, 1.4, 0.06], castShadow: true, material: woodMat, children: _jsx("boxGeometry", { args: [2.4, 2.6, 0.1] }) }), !isOpen && [-0.6, 0.6].map(hx => (_jsx("mesh", { position: [hx, 1.4, 0.12], material: metalMat, children: _jsx("boxGeometry", { args: [0.8, 0.1, 0.04] }) }, `hinge-${hx}`)))] }));
    }
    if (family === "noble") {
        // Ornate stone portal + heavy door
        return (_jsxs("group", { position: [0, 0, d / 2 + 0.02], children: [_jsx("mesh", { position: [0, 1.4, 0.15], castShadow: true, material: woodMat, children: _jsx("boxGeometry", { args: [1.6, 2.6, 0.4] }) }), !isOpen && (_jsx("mesh", { position: [0, 1.3, 0.06], castShadow: true, material: woodMat, children: _jsx("boxGeometry", { args: [1.2, 2.4, 0.1] }) }))] }));
    }
    // Standard residential
    return (_jsxs("group", { position: [0, 0, d / 2 + 0.02], children: [_jsx("mesh", { position: [0, 1.15, 0.02], castShadow: true, receiveShadow: true, material: woodMat, children: _jsx("boxGeometry", { args: [1.2, 2.3, 0.14] }) }), !isOpen && (_jsxs(_Fragment, { children: [_jsx("mesh", { position: [-0.26, 1.1, 0.06], castShadow: true, material: woodMat, children: _jsx("boxGeometry", { args: [0.48, 2.0, 0.06] }) }), _jsx("mesh", { position: [0.26, 1.1, 0.06], castShadow: true, material: woodMat, children: _jsx("boxGeometry", { args: [0.48, 2.0, 0.06] }) })] }))] }));
}
function BuildingWindows({ family, w, d, h, floors, storyH, woodMat, glassMat, bannerMat, isCorner }) {
    const positions = [];
    const colsX = Math.max(1, Math.floor(w / 2.2));
    const spacingX = w / (colsX + 1);
    for (let f = 1; f <= floors; f++) {
        const wy = (f - 0.45) * storyH;
        for (let col = 1; col <= colsX; col++) {
            if (f === 1 && colsX > 1 && col === Math.ceil(colsX / 2))
                continue;
            if (f === 1 && family === "commercial")
                continue; // Ground floor commercial handled by doors
            if (f === 1 && family === "craft")
                continue; // Ground floor craft handled by double doors
            const wx = -w / 2 + col * spacingX;
            positions.push({ pos: [wx, wy, d / 2 + 0.04], rotY: 0, f });
            if (!isCorner) {
                positions.push({ pos: [wx, wy, -d / 2 - 0.04], rotY: Math.PI, f });
            }
        }
        if (d >= 4) {
            const colsZ = Math.max(1, Math.floor(d / 2.2));
            const spacingZ = d / (colsZ + 1);
            for (let col = 1; col <= colsZ; col++) {
                const wz = -d / 2 + col * spacingZ;
                positions.push({ pos: [-w / 2 - 0.04, wy, wz], rotY: -Math.PI / 2, f });
                if (!isCorner) {
                    positions.push({ pos: [w / 2 + 0.04, wy, wz], rotY: Math.PI / 2, f });
                }
            }
        }
    }
    return (_jsxs("group", { children: [family === "commercial" && (_jsx("mesh", { position: [0, storyH * 0.9, d / 2 + 0.4], rotation: [-0.4, 0, 0], material: bannerMat, children: _jsx("boxGeometry", { args: [w * 0.9, 0.05, 1.2] }) })), positions.map(({ pos, rotY, f }, i) => (_jsx("group", { position: pos, rotation: [0, rotY, 0], children: family === "noble" ? (
                // Tall ornate window
                _jsxs("group", { children: [_jsx("mesh", { position: [0, 0.2, 0], castShadow: true, receiveShadow: true, material: woodMat, children: _jsx("boxGeometry", { args: [0.8, 1.4, 0.08] }) }), _jsx("mesh", { position: [0, 0.2, 0.02], material: glassMat, children: _jsx("planeGeometry", { args: [0.65, 1.2] }) })] })) : family === "craft" ? (
                // Small workshop vent/window
                _jsxs("group", { children: [_jsx("mesh", { castShadow: true, receiveShadow: true, material: woodMat, children: _jsx("boxGeometry", { args: [0.6, 0.5, 0.08] }) }), _jsx("mesh", { position: [0, 0, 0.02], material: glassMat, children: _jsx("planeGeometry", { args: [0.4, 0.3] }) })] })) : (
                // Standard residential/commercial upper window
                _jsxs("group", { children: [_jsx("mesh", { castShadow: true, receiveShadow: true, material: woodMat, children: _jsx("boxGeometry", { args: [0.7, 0.85, 0.08] }) }), _jsx("mesh", { position: [0, 0, 0.02], material: glassMat, children: _jsx("planeGeometry", { args: [0.55, 0.7] }) }), _jsx("mesh", { position: [-0.42, 0, 0.03], rotation: [0, 0.35, 0], castShadow: true, material: woodMat, children: _jsx("boxGeometry", { args: [0.26, 0.75, 0.03] }) }), _jsx("mesh", { position: [0.42, 0, 0.03], rotation: [0, -0.35, 0], castShadow: true, material: woodMat, children: _jsx("boxGeometry", { args: [0.26, 0.75, 0.03] }) })] })) }, `win-${i}`)))] }));
}
function BuildingBalcony({ family, w, d, floorY, woodMat, stoneMat, metalMat }) {
    if (family === "noble") {
        return (_jsxs("group", { position: [0, floorY, d / 2 + 0.5], children: [_jsx("mesh", { castShadow: true, material: stoneMat, children: _jsx("boxGeometry", { args: [w, 0.2, 1.2] }) }), _jsx("mesh", { position: [0, 0.45, 0.55], material: stoneMat, children: _jsx("boxGeometry", { args: [w, 0.15, 0.15] }) }), [-w / 2 + 0.1, 0, w / 2 - 0.1].map(x => (_jsx("mesh", { position: [x, 0.25, 0.55], material: stoneMat, children: _jsx("cylinderGeometry", { args: [0.05, 0.05, 0.4] }) }, `pillar-${x}`)))] }));
    }
    return (_jsxs("group", { position: [0, floorY, d / 2 + 0.5], children: [_jsx("mesh", { castShadow: true, receiveShadow: true, material: woodMat, children: _jsx("boxGeometry", { args: [w, 0.12, 1.0] }) }), [-w / 2 + 0.3, w / 2 - 0.3].map((bx) => (_jsx("mesh", { position: [bx, -0.4, -0.2], rotation: [0.45, 0, 0], castShadow: true, material: woodMat, children: _jsx("boxGeometry", { args: [0.12, 0.8, 0.12] }) }, `brace-${bx}`))), _jsx("mesh", { position: [0, 0.45, 0.45], castShadow: true, material: woodMat, children: _jsx("boxGeometry", { args: [w, 0.08, 0.08] }) })] }));
}
function BuildingCraftProps({ w, d, woodMat, metalMat }) {
    return (_jsxs("group", { position: [-w / 2 - 0.4, 0.4, 0], children: [_jsx("mesh", { castShadow: true, material: woodMat, children: _jsx("boxGeometry", { args: [0.8, 0.8, 0.8] }) }), _jsx("mesh", { position: [0, 0.6, 0], castShadow: true, material: metalMat, children: _jsx("cylinderGeometry", { args: [0.2, 0.2, 0.4] }) })] }));
}
function BuildingChimney({ w, d, totalH, wallMat }) {
    return (_jsxs("group", { position: [-w * 0.32, totalH * 0.6, d * 0.28], children: [_jsx("mesh", { castShadow: true, receiveShadow: true, material: wallMat, children: _jsx("boxGeometry", { args: [0.7, totalH * 0.8, 0.7] }) }), _jsx("mesh", { position: [0, totalH * 0.4 + 0.1, 0], castShadow: true, material: wallMat, children: _jsx("boxGeometry", { args: [0.9, 0.15, 0.9] }) }), _jsx("mesh", { position: [0, totalH * 0.4 + 0.3, 0], castShadow: true, material: wallMat, children: _jsx("cylinderGeometry", { args: [0.18, 0.22, 0.35, 8] }) })] }));
}
function BuildingShopSign({ sign, d, woodMat, metalMat }) {
    return (_jsxs("group", { position: [1.4, 2.2, d / 2 + 0.05], children: [_jsx("mesh", { position: [0, 0, 0.35], material: metalMat, children: _jsx("boxGeometry", { args: [0.05, 0.05, 0.7] }) }), _jsx("mesh", { position: [0, -0.2, 0.2], rotation: [0.6, 0, 0], material: metalMat, children: _jsx("boxGeometry", { args: [0.04, 0.5, 0.04] }) }), _jsx("mesh", { position: [0, -0.3, 0.55], castShadow: true, material: woodMat, children: _jsx("boxGeometry", { args: [0.06, 0.5, 0.5] }) }), _jsx("mesh", { position: [0.04, -0.3, 0.55], rotation: [0, Math.PI / 2, 0], material: shopSignGoldMat, children: _jsx("circleGeometry", { args: [0.16, 8] }) })] }));
}
export function NightLightingUpdater() {
    const timeOfDay = useWorldStore(s => s.timeOfDay);
    const isNight = timeOfDay >= 18 || timeOfDay <= 6;
    const cachedMats = useMemo(() => getAllDistrictMaterials(), []);
    useFrame(() => {
        const target = isNight ? 1 : 0;
        for (const mat of cachedMats) {
            if (mat.glass) {
                if (!mat.glass.userData.baseEmissive) {
                    mat.glass.userData.baseEmissive = mat.glass.color.clone();
                }
                mat.glass.emissive.copy(mat.glass.userData.baseEmissive).multiplyScalar(0.8);
                mat.glass.emissiveIntensity = THREE.MathUtils.lerp(mat.glass.emissiveIntensity, target, 0.05);
            }
        }
    });
    return null;
}
//# sourceMappingURL=CityBuilding.js.map