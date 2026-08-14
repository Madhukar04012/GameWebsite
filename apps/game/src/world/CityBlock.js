import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { CityBuilding } from "./CityBuilding";
import * as THREE from "three";
const courtyardMat = new THREE.MeshStandardMaterial({ color: "#3a3832", roughness: 0.9 });
const blockPropMat = new THREE.MeshStandardMaterial({ color: "#8b5a2b", roughness: 0.9 });
/** PRNG for deterministic layout */
function seededRandom(seed) {
    return function () {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };
}
function getFamily(district, rnd) {
    let probs = { residential: 1, commercial: 0, craft: 0, noble: 0, civic: 0 };
    if (district === "castle" || district === "noble")
        probs = { residential: 0.05, commercial: 0, craft: 0, noble: 0.8, civic: 0.15 };
    else if (district === "market")
        probs = { residential: 0.2, commercial: 0.7, craft: 0.1, noble: 0, civic: 0 };
    else if (district === "blacksmith")
        probs = { residential: 0.1, commercial: 0.1, craft: 0.8, noble: 0, civic: 0 };
    else if (district === "harbor")
        probs = { residential: 0.4, commercial: 0.3, craft: 0.3, noble: 0, civic: 0 };
    else if (district === "guild_hall")
        probs = { residential: 0.1, commercial: 0.3, craft: 0.2, noble: 0.2, civic: 0.2 };
    else if (district === "training")
        probs = { residential: 0.2, commercial: 0, craft: 0.3, noble: 0, civic: 0.5 };
    else if (district === "inn")
        probs = { residential: 0.5, commercial: 0.5, craft: 0, noble: 0, civic: 0 };
    else if (district === "central_plaza")
        probs = { residential: 0.1, commercial: 0.4, craft: 0, noble: 0.3, civic: 0.2 };
    let accum = 0;
    for (const [fam, prob] of Object.entries(probs)) {
        accum += prob;
        if (rnd < accum)
            return fam;
    }
    return "residential";
}
function getFacade(family, rnd) {
    if (family === "noble" || family === "civic")
        return rnd > 0.3 ? "stone" : "mixed";
    if (family === "craft")
        return rnd > 0.4 ? "brick" : (rnd > 0.2 ? "mixed" : "timber");
    if (family === "commercial")
        return rnd > 0.5 ? "plaster" : (rnd > 0.2 ? "mixed" : "timber");
    return rnd > 0.4 ? "timber" : (rnd > 0.2 ? "plaster" : "mixed");
}
function getRoofs(family) {
    if (family === "noble" || family === "civic")
        return ["hip", "mansard", "gable", "double-gable"];
    if (family === "commercial")
        return ["gable", "shallow", "flat"];
    if (family === "craft")
        return ["shallow", "flat", "gable"];
    return ["gable", "gable", "double-gable"];
}
export function generateBlockLayout(block, district) {
    const rnd = seededRandom(block.seed);
    const bldgs = [];
    const props = [];
    // Perimeter tracing
    const cellSize = 4;
    const cols = Math.floor(block.w / cellSize);
    const rows = Math.floor(block.d / cellSize);
    for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
            const isPerimeter = c === 0 || c === cols - 1 || r === 0 || r === rows - 1;
            const isCorner = (c === 0 && r === 0) || (c === 0 && r === rows - 1) || (c === cols - 1 && r === 0) || (c === cols - 1 && r === rows - 1);
            const bx = block.x - block.w / 2 + c * (block.w / cols) + (block.w / cols) / 2;
            const bz = block.z - block.d / 2 + r * (block.d / rows) + (block.d / rows) / 2;
            if (!isPerimeter) {
                // Interior courtyard / props / small craft
                if (rnd() > 0.7) {
                    props.push({ type: rnd() > 0.5 ? "crate" : "barrel", x: bx, z: bz, isProp: true });
                }
                else if (rnd() > 0.9) {
                    bldgs.push({
                        x: bx, z: bz, w: 2.5, d: 2.5, h: 3, floors: 1, roof: "flat", family: "craft", facadeType: "timber", hasChimney: true
                    });
                }
                continue;
            }
            // Leave some gaps for alleys, except on corners
            if (!isCorner && rnd() > 0.85) {
                continue;
            }
            const family = getFamily(district, rnd());
            const facadeType = getFacade(family, rnd());
            const roofs = getRoofs(family);
            let roof = roofs[Math.floor(rnd() * roofs.length)];
            // Force tower/cone/mansard on corners for visual interest
            if (isCorner && (family === "noble" || family === "commercial") && rnd() > 0.5) {
                roof = rnd() > 0.5 ? "tower" : "mansard";
            }
            let w = 3.5 + rnd() * 1.5;
            let d = 3.5 + rnd() * 1.5;
            if (isCorner) {
                w = 4.5 + rnd();
                d = 4.5 + rnd();
            }
            let minH = 4, maxH = 7, floors = 2;
            if (family === "noble" || family === "civic") {
                minH = 6;
                maxH = 10;
                floors = Math.floor(2 + rnd() * 3); // 2-4
            }
            else if (family === "commercial") {
                minH = 5;
                maxH = 8;
                floors = Math.floor(2 + rnd() * 2); // 2-3
            }
            else if (family === "craft") {
                minH = 3;
                maxH = 6;
                floors = Math.floor(1 + rnd() * 3); // 1-3
            }
            else {
                minH = 4;
                maxH = 6.5;
                floors = Math.floor(1 + rnd() * 3); // 1-3
            }
            if (isCorner) {
                minH += 1;
                maxH += 1.5;
            }
            const h = minH + rnd() * (maxH - minH);
            bldgs.push({
                x: bx,
                z: bz,
                w,
                d,
                h,
                floors,
                roof,
                family,
                facadeType,
                isCorner,
                hasChimney: rnd() > 0.3,
                hasBalcony: family === "noble" ? rnd() > 0.3 : (family === "commercial" ? rnd() > 0.6 : rnd() > 0.8),
            });
        }
    }
    return { bldgs, props };
}
export function CityBlock({ block, district, color }) {
    const buildings = useMemo(() => generateBlockLayout(block, district), [block, district]);
    return (_jsxs("group", { children: [_jsx("mesh", { position: [block.x, 0.015, block.z], rotation: [-Math.PI / 2, 0, 0], receiveShadow: true, material: courtyardMat, children: _jsx("planeGeometry", { args: [block.w - 0.2, block.d - 0.2] }) }), buildings.props.map((p, i) => (_jsx("mesh", { position: [p.x, 0.4, p.z], castShadow: true, receiveShadow: true, material: blockPropMat, children: p.type === "barrel" ? _jsx("cylinderGeometry", { args: [0.3, 0.3, 0.8, 8] }) : _jsx("boxGeometry", { args: [0.8, 0.8, 0.8] }) }, `block-${block.seed}-prop-${i}`))), buildings.bldgs.map((b, i) => (_jsx(CityBuilding, { def: b, color: color, district: district }, `block-${block.seed}-bldg-${i}`)))] }));
}
//# sourceMappingURL=CityBlock.js.map