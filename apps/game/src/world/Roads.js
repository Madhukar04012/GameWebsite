import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo } from "react";
import * as THREE from "three";
import { ROADS } from "@legend/shared";
import { heightAt, normalAt } from "@legend/engine";
import { createCobbleMaterial } from "../materials/createCobbleMaterial";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createTerrainMaterial } from "../materials/createTerrainMaterial";
/**
 * Roads — AAA city road network with granite curbs, gold inlays, grass verges,
 * and blended intersection roundels.
 */
const ROAD_MATS = {
    main: createCobbleMaterial({ kind: "main" }),
    plaza: createCobbleMaterial({ kind: "plaza" }),
    district: createCobbleMaterial({ kind: "district" }),
    dirt: createCobbleMaterial({ kind: "dirt" }),
};
const CURB_MAT = createStoneMaterial({ stoneColor: "#524e42", roughness: 0.88, metalness: 0.02, seed: [50, 1] });
const VERGE_MAT = createTerrainMaterial({ variant: "world", seed: [50, 2] });
const INTERSECTION_MAT = createCobbleMaterial({ kind: "plaza", scale: 2.2 });
const ROAD_EDGE = {
    main: "#b8963e",
    plaza: "#d4af37",
    district: null,
    dirt: null,
};
export function Roads({ visible = true }) {
    if (!visible)
        return null;
    return (_jsxs("group", { children: [ROADS.map((r) => (_jsx(RoadStrip, { seg: r }, r.id))), _jsx(IntersectionRoundels, {})] }));
}
function RoadStrip({ seg }) {
    const { length, angle, pitch, midX, midY, midZ, width } = useMemo(() => {
        const dx = seg.to.x - seg.from.x;
        const dz = seg.to.z - seg.from.z;
        const len = Math.sqrt(dx * dx + dz * dz);
        const angle = Math.atan2(dx, dz);
        const startY = heightAt(seg.from.x, seg.from.z);
        const endY = heightAt(seg.to.x, seg.to.z);
        // Pitch: positive if endY is higher than startY
        // We are rotating around X-axis. A positive rotation around X dips the "forward" (Z) direction down.
        // Wait, the plane is length-wise along Z.
        // Actually, we rotate by `angle` around Y first, then we need the plane to tilt.
        // Wait, the order of rotation matters! The default euler order is XYZ.
        // If we apply rotation=[pitch, angle, 0, "YXZ"], it rotates Y first, then X.
        const pitch = Math.atan2(startY - endY, len);
        const midX = (seg.from.x + seg.to.x) / 2;
        const midZ = (seg.from.z + seg.to.z) / 2;
        const midY = (startY + endY) / 2 + 0.04;
        return { length: len, angle, pitch, midX, midY, midZ, width: seg.width };
    }, [seg]);
    const edge = ROAD_EDGE[seg.type];
    const hasVerge = seg.type === "main" || seg.type === "plaza";
    return (_jsxs("group", { position: [midX, midY, midZ], rotation: [pitch, angle, 0, "YXZ"], children: [_jsx("mesh", { position: [0, 0.01, 0], rotation: [-Math.PI / 2, 0, 0], material: ROAD_MATS[seg.type], receiveShadow: true, children: _jsx("planeGeometry", { args: [width, length] }) }), seg.type !== "dirt" && (_jsxs(_Fragment, { children: [_jsx("mesh", { position: [-width / 2 - 0.16, 0.08, 0], castShadow: true, receiveShadow: true, material: CURB_MAT, children: _jsx("boxGeometry", { args: [0.32, 0.18, length + 0.4] }) }), _jsx("mesh", { position: [width / 2 + 0.16, 0.08, 0], castShadow: true, receiveShadow: true, material: CURB_MAT, children: _jsx("boxGeometry", { args: [0.32, 0.18, length + 0.4] }) })] })), edge && (_jsxs(_Fragment, { children: [_jsxs("mesh", { position: [-width / 2 + 0.12, 0.02, 0], rotation: [-Math.PI / 2, 0, 0], children: [_jsx("planeGeometry", { args: [0.24, length] }), _jsx("meshStandardMaterial", { color: edge, emissive: edge, emissiveIntensity: 0.3, roughness: 0.6 })] }), _jsxs("mesh", { position: [width / 2 - 0.12, 0.02, 0], rotation: [-Math.PI / 2, 0, 0], children: [_jsx("planeGeometry", { args: [0.24, length] }), _jsx("meshStandardMaterial", { color: edge, emissive: edge, emissiveIntensity: 0.3, roughness: 0.6 })] })] })), seg.type !== "dirt" && (_jsxs(_Fragment, { children: [_jsx("mesh", { position: [-width / 2 - 1.2, 0.04, 0], rotation: [-Math.PI / 2, 0, 0], receiveShadow: true, material: ROAD_MATS.district, children: _jsx("planeGeometry", { args: [2.0, length] }) }), _jsx("mesh", { position: [width / 2 + 1.2, 0.04, 0], rotation: [-Math.PI / 2, 0, 0], receiveShadow: true, material: ROAD_MATS.district, children: _jsx("planeGeometry", { args: [2.0, length] }) })] })), hasVerge && (_jsxs(_Fragment, { children: [_jsx("mesh", { position: [-width / 2 - 2.8, 0.015, 0], rotation: [-Math.PI / 2, 0, 0], receiveShadow: true, material: VERGE_MAT, children: _jsx("planeGeometry", { args: [1.2, length] }) }), _jsx("mesh", { position: [width / 2 + 2.8, 0.015, 0], rotation: [-Math.PI / 2, 0, 0], receiveShadow: true, material: VERGE_MAT, children: _jsx("planeGeometry", { args: [1.2, length] }) })] }))] }));
}
/** Blended intersection roundels */
function IntersectionRoundels() {
    const roundels = useMemo(() => {
        const map = new Map();
        ROADS.forEach((r) => {
            [r.from, r.to].forEach((pt) => {
                const key = `${Math.round(pt.x * 10) / 10},${Math.round(pt.z * 10) / 10}`;
                const existing = map.get(key);
                if (existing)
                    existing.count++;
                else
                    map.set(key, { x: pt.x, z: pt.z, count: 1 });
            });
        });
        const intersections = Array.from(map.values()).filter((p) => p.count > 1);
        return intersections.map((p) => {
            const y = heightAt(p.x, p.z) + 0.05;
            const n = normalAt(p.x, p.z);
            const normalVec = new THREE.Vector3(n.x, n.y, n.z);
            const upVec = new THREE.Vector3(0, 1, 0);
            const quaternion = new THREE.Quaternion().setFromUnitVectors(upVec, normalVec);
            const euler = new THREE.Euler().setFromQuaternion(quaternion);
            return { x: p.x, z: p.z, y, rotation: [euler.x, euler.y, euler.z] };
        });
    }, []);
    return (_jsx(_Fragment, { children: roundels.map((r, i) => {
            const radius = 6.5;
            return (_jsxs("group", { position: [r.x, r.y, r.z], rotation: r.rotation, children: [_jsx("mesh", { position: [0, 0.01, 0], rotation: [-Math.PI / 2, 0, 0], receiveShadow: true, material: INTERSECTION_MAT, children: _jsx("circleGeometry", { args: [radius, 32] }) }), _jsxs("mesh", { position: [0, 0.02, 0], rotation: [-Math.PI / 2, 0, 0], children: [_jsx("circleGeometry", { args: [1.4, 8] }), _jsx("meshStandardMaterial", { color: "#d4af37", emissive: "#d4af37", emissiveIntensity: 0.5 })] })] }, `intersection-${i}`));
        }) }));
}
//# sourceMappingURL=Roads.js.map