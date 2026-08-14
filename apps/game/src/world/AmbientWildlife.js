import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * AmbientWildlife — Living micro-creatures and ambient fauna:
 * 1. Elemental Crystalflies & Butterflies (Anemo cyan, Geo amber, Cryo azure)
 * 2. Sparrows / Pigeons (Pecking, hopping, head-bobbing near city gates & plazas)
 * 3. Schooling River & Fountain Koi (Swimming in circular orbits with tail wagging)
 * 4. Woodland Critters (Squirrels & rabbits near tree hollows)
 */
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { heightAt } from "@legend/engine";
export function AmbientWildlife() {
    return (_jsxs("group", { children: [_jsx(Crystalflies, {}), _jsx(AmbientBirds, {}), _jsx(FountainKoiSchool, {}), _jsx(WoodlandCritters, {})] }));
}
/** 1. Elemental Crystalflies & Butterflies */
function Crystalflies() {
    const groupRef = useRef(null);
    const leftWings = useRef([]);
    const rightWings = useRef([]);
    // 12 Crystalfly spawn locations around meadows, flowers, and shrines
    const flies = useMemo(() => [
        { x: 12, z: -8, color: "#00f5d4", speed: 1.2, radius: 4, phase: 0 },
        { x: -18, z: -14, color: "#ffd166", speed: 1.0, radius: 5, phase: 1.5 },
        { x: -28, z: 15, color: "#00f5d4", speed: 1.4, radius: 6, phase: 3.0 },
        { x: 25, z: 20, color: "#90e0ef", speed: 1.1, radius: 4.5, phase: 4.5 },
        { x: 0, z: -12, color: "#ff758f", speed: 1.3, radius: 3.5, phase: 2.2 },
        { x: -45, z: -35, color: "#00f5d4", speed: 0.9, radius: 7, phase: 5.1 },
        { x: 35, z: -25, color: "#ffd166", speed: 1.2, radius: 5, phase: 0.8 },
        { x: -8, z: 28, color: "#90e0ef", speed: 1.5, radius: 4, phase: 3.7 },
    ], []);
    const wingGeom = useMemo(() => new THREE.PlaneGeometry(0.35, 0.45), []);
    const bodyGeom = useMemo(() => new THREE.OctahedronGeometry(0.12, 0), []);
    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        flies.forEach((f, i) => {
            // Flapping wings
            const flap = Math.sin(t * 14 + f.phase) * 0.7;
            if (leftWings.current[i])
                leftWings.current[i].rotation.y = flap;
            if (rightWings.current[i])
                rightWings.current[i].rotation.y = -flap;
        });
        if (groupRef.current) {
            groupRef.current.children.forEach((child, i) => {
                const f = flies[i];
                if (!f)
                    return;
                const ang = t * 0.5 * f.speed + f.phase;
                const cx = f.x + Math.cos(ang) * f.radius;
                const cz = f.z + Math.sin(ang) * f.radius;
                const cy = heightAt(cx, cz) + 1.2 + Math.sin(t * 2 + f.phase) * 0.4;
                child.position.set(cx, cy, cz);
                child.rotation.y = -ang + Math.PI / 2;
            });
        }
    });
    return (_jsx("group", { ref: groupRef, children: flies.map((f, i) => {
            const mat = new THREE.MeshStandardMaterial({
                color: f.color,
                emissive: f.color,
                emissiveIntensity: 2.2,
                transparent: true,
                opacity: 0.85,
                side: THREE.DoubleSide,
            });
            return (_jsxs("group", { children: [_jsx("mesh", { geometry: bodyGeom, material: mat }), _jsx("mesh", { ref: (el) => { if (el)
                            leftWings.current[i] = el; }, geometry: wingGeom, material: mat, position: [-0.18, 0.05, 0] }), _jsx("mesh", { ref: (el) => { if (el)
                            rightWings.current[i] = el; }, geometry: wingGeom, material: mat, position: [0.18, 0.05, 0], rotation: [0, Math.PI, 0] }), _jsx(Sparkles, { count: 4, scale: [1, 1, 1], size: 2, speed: 0.5, color: f.color })] }, `crystalfly-${i}`));
        }) }));
}
/** 2. Sparrows & Pigeons hopping and pecking */
function AmbientBirds() {
    const birdsGroupRef = useRef(null);
    const birdSpawns = useMemo(() => [
        { x: -5, z: -10, rot: 0.4 },
        { x: -4.2, z: -10.8, rot: 1.8 },
        { x: -3.5, z: -9.5, rot: 3.1 },
        { x: 12, z: -4, rot: 0.2 },
        { x: 13.2, z: -4.8, rot: 2.4 },
        { x: -15, z: 8, rot: 1.1 },
    ], []);
    const birdBodyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#6c584c", roughness: 0.8 }), []);
    const birdChestMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#dde5b6", roughness: 0.9 }), []);
    const birdBeakMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#e07a5f", roughness: 0.4 }), []);
    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        if (birdsGroupRef.current) {
            birdsGroupRef.current.children.forEach((bird, i) => {
                const peckCycle = Math.sin(t * 3 + i * 2.1);
                // Periodic pecking motion
                bird.rotation.x = peckCycle > 0.4 ? 0.35 : 0;
                // Small hopping
                const hop = Math.max(0, Math.sin(t * 4 + i * 1.7) - 0.7) * 0.15;
                const origY = heightAt(birdSpawns[i].x, birdSpawns[i].z);
                bird.position.y = origY + hop;
            });
        }
    });
    return (_jsx("group", { ref: birdsGroupRef, children: birdSpawns.map((b, i) => {
            const y = heightAt(b.x, b.z);
            return (_jsxs("group", { position: [b.x, y, b.z], rotation: [0, b.rot, 0], scale: [0.65, 0.65, 0.65], children: [_jsx("mesh", { position: [0, 0.15, 0], castShadow: true, material: birdBodyMat, children: _jsx("sphereGeometry", { args: [0.16, 8, 8] }) }), _jsx("mesh", { position: [0, 0.14, 0.08], material: birdChestMat, children: _jsx("sphereGeometry", { args: [0.12, 6, 6] }) }), _jsx("mesh", { position: [0, 0.28, 0.1], castShadow: true, material: birdBodyMat, children: _jsx("sphereGeometry", { args: [0.09, 8, 8] }) }), _jsx("mesh", { position: [0, 0.28, 0.19], rotation: [Math.PI / 2, 0, 0], material: birdBeakMat, children: _jsx("coneGeometry", { args: [0.03, 0.08, 4] }) }), _jsx("mesh", { position: [0, 0.18, -0.16], rotation: [-0.4, 0, 0], material: birdBodyMat, children: _jsx("boxGeometry", { args: [0.08, 0.03, 0.16] }) })] }, `bird-${i}`));
        }) }));
}
/** 3. Fountain & River Swimming Koi Fish */
function FountainKoiSchool() {
    const fishGroupRef = useRef(null);
    const koi = useMemo(() => [
        { radius: 2.2, speed: 0.8, phase: 0, color: "#e76f51" },
        { radius: 2.8, speed: 0.7, phase: 1.8, color: "#f4a261" },
        { radius: 1.8, speed: 0.9, phase: 3.5, color: "#e9c46a" },
        { radius: 3.1, speed: 0.65, phase: 4.9, color: "#e76f51" },
    ], []);
    const fishMat1 = useMemo(() => new THREE.MeshStandardMaterial({ color: "#e76f51", roughness: 0.3 }), []);
    const fishMat2 = useMemo(() => new THREE.MeshStandardMaterial({ color: "#f4a261", roughness: 0.3 }), []);
    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        if (fishGroupRef.current) {
            fishGroupRef.current.children.forEach((fish, i) => {
                const k = koi[i];
                const ang = t * k.speed + k.phase;
                const fx = Math.cos(ang) * k.radius;
                const fz = -4 + Math.sin(ang) * k.radius;
                fish.position.set(fx, 0.45, fz);
                fish.rotation.y = -ang;
                // Tail waggle
                fish.rotation.z = Math.sin(t * 8 + i) * 0.15;
            });
        }
    });
    return (_jsx("group", { ref: fishGroupRef, children: koi.map((k, i) => (_jsx("group", { children: _jsx("mesh", { castShadow: true, material: i % 2 === 0 ? fishMat1 : fishMat2, scale: [0.15, 0.08, 0.35], children: _jsx("sphereGeometry", { args: [1, 8, 8] }) }) }, `koi-${i}`))) }));
}
/** 4. Woodland Critters (Squirrels & Rabbits) */
function WoodlandCritters() {
    const critterSpawns = useMemo(() => [
        { x: -26, z: 10, type: "squirrel" },
        { x: -23, z: 14, type: "rabbit" },
        { x: -70, z: -42, type: "squirrel" },
        { x: -78, z: -48, type: "rabbit" },
    ], []);
    const furMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#a0522d", roughness: 0.85 }), []);
    const whiteMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#fdf0d5", roughness: 0.9 }), []);
    return (_jsx("group", { children: critterSpawns.map((c, i) => {
            const y = heightAt(c.x, c.z);
            return (_jsxs("group", { position: [c.x, y, c.z], scale: [0.5, 0.5, 0.5], children: [_jsx("mesh", { position: [0, 0.25, 0], castShadow: true, material: furMat, children: _jsx("sphereGeometry", { args: [0.25, 8, 8] }) }), _jsx("mesh", { position: [0, 0.45, 0.15], castShadow: true, material: furMat, children: _jsx("sphereGeometry", { args: [0.16, 8, 8] }) }), c.type === "rabbit" ? (_jsxs(_Fragment, { children: [_jsx("mesh", { position: [-0.08, 0.7, 0.12], material: whiteMat, children: _jsx("cylinderGeometry", { args: [0.03, 0.05, 0.35, 6] }) }), _jsx("mesh", { position: [0.08, 0.7, 0.12], material: whiteMat, children: _jsx("cylinderGeometry", { args: [0.03, 0.05, 0.35, 6] }) })] })) : (
                    /* Fluffy Squirrel Tail */
                    _jsx("mesh", { position: [0, 0.45, -0.28], rotation: [0.4, 0, 0], material: furMat, children: _jsx("cylinderGeometry", { args: [0.12, 0.2, 0.5, 8] }) }))] }, `critter-${i}`));
        }) }));
}
//# sourceMappingURL=AmbientWildlife.js.map