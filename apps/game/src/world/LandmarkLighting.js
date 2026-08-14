import { jsx as _jsx } from "react/jsx-runtime";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useWorldStore } from "../store/worldStore";
import { heightAt } from "@legend/engine";
const LIGHT_SPOTS = [
    // South Gate Entrance Portals
    { x: -4.5, z: -46, yOffset: 4.5, color: "#ff8833", intensity: 14, distance: 24 },
    { x: 4.5, z: -46, yOffset: 4.5, color: "#ff8833", intensity: 14, distance: 24 },
    // Central Royal Plaza Sunwell
    { x: 0, z: -4, yOffset: 4.0, color: "#ffd166", intensity: 12, distance: 22 },
    // Royal High Palace Portico
    { x: 0, z: -28, yOffset: 6.0, color: "#ffd700", intensity: 16, distance: 28 },
    // Cathedral of Light Azure Rose Window
    { x: 28, z: 15, yOffset: 12.0, color: "#00b4d8", intensity: 18, distance: 30 },
    // Grand Market Bazaar
    { x: 24, z: 4, yOffset: 3.8, color: "#ffaa44", intensity: 10, distance: 20 },
    // Sleeping Giant Inn
    { x: 36, z: 10, yOffset: 4.0, color: "#ff9f1c", intensity: 12, distance: 22 },
    // Adventurer's Guildhall
    { x: -30, z: -10, yOffset: 4.5, color: "#ffd166", intensity: 12, distance: 22 },
    // Great Forge Hearth Molten Crucible
    { x: -36, z: 26, yOffset: 3.5, color: "#ff4800", intensity: 20, distance: 26 },
    // Defensive Corner Fortress Bastions
    { x: -44, z: -44, yOffset: 14.0, color: "#ff7722", intensity: 16, distance: 28 },
    { x: 44, z: -44, yOffset: 14.0, color: "#ff7722", intensity: 16, distance: 28 },
    { x: -44, z: 44, yOffset: 14.0, color: "#ff7722", intensity: 16, distance: 28 },
    { x: 44, z: 44, yOffset: 14.0, color: "#ff7722", intensity: 16, distance: 28 },
];
export function LandmarkLighting() {
    const groupRef = useRef(null);
    useFrame(({ clock }) => {
        if (!groupRef.current)
            return;
        const timeOfDay = useWorldStore.getState().timeOfDay;
        const isNight = timeOfDay >= 18 || timeOfDay < 6;
        // Flicker animation factor
        const flicker = Math.sin(clock.elapsedTime * 8) * 0.15 + 0.92;
        groupRef.current.children.forEach((child, i) => {
            if (child instanceof THREE.PointLight) {
                const spot = LIGHT_SPOTS[i];
                if (!spot)
                    return;
                const targetIntensity = isNight ? (spot.intensity || 10) * flicker : 0;
                child.intensity = THREE.MathUtils.lerp(child.intensity, targetIntensity, 0.1);
            }
        });
    });
    return (_jsx("group", { ref: groupRef, children: LIGHT_SPOTS.map((spot, i) => {
            const groundY = heightAt(spot.x, spot.z);
            const y = groundY + (spot.yOffset || 3);
            return (_jsx("pointLight", { position: [spot.x, y, spot.z], color: spot.color || "#ffaa44", intensity: 0, distance: spot.distance || 15, decay: 2 }, `lm-lit-${i}`));
        }) }));
}
//# sourceMappingURL=LandmarkLighting.js.map