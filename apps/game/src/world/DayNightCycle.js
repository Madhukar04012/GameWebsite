import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * DayNightCycle — dynamic sky, sun, moon, stars, and lighting driven by in-game time.
 *
 * Advances worldStore time each frame, applies celestial state to scene lighting
 * via refs (no re-render), and invalidates R3F for Sky/Stars prop updates.
 *
 * Replaces the static SceneLighting + Environment components entirely.
 */
import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Sky, Stars, Cloud, Clouds, Sparkles } from "@react-three/drei";
import { useWorldStore } from "../store/worldStore";
import { useGraphicsStore } from "../store/graphicsStore";
/**
 * Compute 3D position on a sphere from altitude/azimuth angles at a given radius.
 */
function sunPos(altitude, azimuth, radius) {
    return [
        radius * Math.cos(altitude) * Math.sin(azimuth),
        radius * Math.sin(altitude),
        radius * Math.cos(altitude) * Math.cos(azimuth),
    ];
}
/** Convert altitude to inclination for drei Sky (0 = horizon, PI/2 = zenith). */
function altToInclination(altitude) {
    return Math.max(0, Math.min(Math.PI / 2, altitude + Math.PI / 6));
}
/** Moon brightness from phase: 0=new, 0.5=full, 1=new. Sine curve peaks at full. */
function moonBrightness(phase) {
    return Math.sin(phase * Math.PI);
}
export function DayNightCycle() {
    const advanceTime = useWorldStore((s) => s.advanceTime);
    const timeScale = useWorldStore((s) => s.timeScale);
    const shadowMapSize = useGraphicsStore((s) => s.shadowMapSize);
    const quality = useGraphicsStore((s) => s.quality);
    const { scene, invalidate } = useThree();
    // Refs to 3D objects we mutate each frame (no re-render cost)
    const sunRef = useRef(null);
    const rimRef = useRef(null);
    const ambientRef = useRef(null);
    const hemiRef = useRef(null);
    const cloudRef = useRef(null);
    const moonRef = useRef(null);
    const moonGlowRef = useRef(null);
    const moonLightRef = useRef(null);
    const target = useMemo(() => new THREE.Object3D(), []);
    // Grab store state each frame without subscribing (synchronous read)
    const storeRef = useRef(useWorldStore.getState());
    useWorldStore.subscribe((s) => { storeRef.current = s; });
    // Frame tick: advance time, mutate scene lights directly
    useFrame((_, dt) => {
        const store = storeRef.current;
        if (store.timeScale > 0) {
            store.advanceTime(dt);
        }
        const c = store.celestial;
        const sp = sunPos(c.altitude, c.azimuth, 150);
        // Sun
        if (sunRef.current) {
            sunRef.current.position.set(sp[0], sp[1], sp[2]);
            sunRef.current.target.position.set(0, 0, 0);
            sunRef.current.color.setHex(c.sunColor);
            sunRef.current.intensity = c.sunIntensity * 2.2;
            sunRef.current.shadow.camera.left = -60;
            sunRef.current.shadow.camera.right = 60;
        }
        // Rim fill (opposite hemisphere)
        if (rimRef.current) {
            rimRef.current.position.set(-sp[0] * 0.7, sp[1] * 0.3 + 8, -sp[2] * 0.7);
            rimRef.current.intensity = Math.max(0.2, 1.5 - c.sunIntensity * 0.8);
            rimRef.current.color.set(c.altitude > 0.1 ? "#87ceeb" : "#334466");
        }
        // Ambient
        if (ambientRef.current) {
            ambientRef.current.intensity = c.ambientIntensity;
            ambientRef.current.color.setHex(c.skyColor);
        }
        // Hemisphere
        if (hemiRef.current) {
            hemiRef.current.color.setHex(c.skyColor);
            hemiRef.current.groundColor.set(c.altitude > 0 ? "#6b6b9e" : "#1a1a2e");
            hemiRef.current.intensity = Math.max(0.2, c.ambientIntensity * 2.5);
        }
        // Fog
        if (scene.fog instanceof THREE.FogExp2) {
            scene.fog.color.setHex(c.fogColor);
            scene.fog.density = 0.0065 * (1 + (1 - c.ambientIntensity) * 0.6);
        }
        // Sky background color
        if (scene.background instanceof THREE.Color) {
            scene.background.setHex(c.skyColor);
        }
        // Cloud drift
        if (cloudRef.current) {
            cloudRef.current.position.x -= dt * 0.5;
        }
        // Moon: opposite sun, visible at night
        const moonAlt = -c.altitude; // opposite altitude
        const moonAz = c.azimuth + Math.PI; // opposite azimuth
        const moonRadius = 300;
        const msp = sunPos(moonAlt, moonAz, moonRadius);
        const mBright = moonBrightness(c.moonPhase);
        // Moon mesh (visible when above horizon and bright enough)
        if (moonRef.current) {
            moonRef.current.position.set(msp[0], msp[1], msp[2]);
            moonRef.current.lookAt(0, 0, 0);
            const visible = moonAlt > 0.05 && mBright > 0.05;
            moonRef.current.visible = visible;
            // Scale by phase (new moon smaller)
            const scale = 0.8 + mBright * 0.4;
            moonRef.current.scale.setScalar(scale);
            // Color: cool white at full, warmer at gibbous
            const r = 255;
            const g = Math.round(220 + mBright * 35);
            const b = Math.round(180 + mBright * 75);
            const mat = moonRef.current.material;
            if (mat && "color" in mat) {
                mat.color.setRGB(r / 255, g / 255, b / 255);
                mat.opacity = 0.9 * (0.3 + mBright * 0.7);
            }
        }
        // Moon glow (additive sprite/halo) — quality gated
        if (moonGlowRef.current && quality !== "low") {
            moonGlowRef.current.position.set(msp[0], msp[1], msp[2]);
            moonGlowRef.current.lookAt(0, 0, 0);
            const visible = moonAlt > 0.05 && mBright > 0.05;
            moonGlowRef.current.visible = visible;
            const glowScale = 2.5 + mBright * 1.5;
            moonGlowRef.current.scale.setScalar(glowScale);
            const glowMat = moonGlowRef.current.material;
            if (glowMat && "opacity" in glowMat) {
                glowMat.opacity = 0.15 * mBright;
            }
        }
        // Moonlight directional light (casts soft shadows at night)
        if (moonLightRef.current) {
            moonLightRef.current.position.set(msp[0], msp[1], msp[2]);
            moonLightRef.current.target.position.set(0, 0, 0);
            // Intensity: inverse of sun, scaled by moon phase
            moonLightRef.current.intensity = Math.max(0, (1 - c.sunIntensity) * 0.35 * mBright);
            moonLightRef.current.color.setHex(mBright > 0.7 ? 0xc8d0f0 : 0x8899bb); // cooler at full
            moonLightRef.current.shadow.camera.left = -80;
            moonLightRef.current.shadow.camera.right = 80;
            moonLightRef.current.shadow.camera.top = 80;
            moonLightRef.current.shadow.camera.bottom = -80;
            moonLightRef.current.shadow.camera.near = 1;
            moonLightRef.current.shadow.camera.far = 200;
        }
        // Invalidate to trigger re-render for Sky/Sparkles prop changes
        invalidate();
    });
    return (_jsxs("group", { children: [_jsx(Sky, { distance: 450000, sunPosition: [40, 50, -20], inclination: altToInclination(0.5), azimuth: 0.25, turbidity: 8, rayleigh: 1.8, mieCoefficient: 0.008, mieDirectionalG: 0.92 }), quality !== "low" && (_jsxs(Clouds, { ref: cloudRef, limit: quality === "medium" ? 150 : 300, children: [_jsx(Cloud, { speed: 0.1, opacity: 0.6, seed: 1, segments: quality === "medium" ? 16 : 28, bounds: [140, 10, 140], volume: 22, color: "#ffffff" }), _jsx(Cloud, { speed: 0.08, opacity: 0.4, seed: 2, segments: quality === "medium" ? 12 : 20, bounds: [180, 8, 100], volume: 16, color: "#fdfdff", position: [40, 25, -60] }), _jsx(Cloud, { speed: 0.05, opacity: 0.25, seed: 3, segments: quality === "medium" ? 10 : 14, bounds: [200, 4, 200], volume: 10, color: "#ffeedd", position: [-60, 35, 40] })] })), _jsx(Stars, { radius: 300, depth: 60, count: quality === "low" ? 600 : quality === "medium" ? 1200 : 2000, factor: 4, fade: true, speed: 0.5 }), quality !== "low" && _jsx(Sparkles, { count: quality === "medium" ? 60 : 120, scale: [160, 40, 160], size: 3.5, speed: 0.25, color: "#f3c649", opacity: 0.5 }), (quality === "high" || quality === "ultra") && _jsx(Sparkles, { count: 80, scale: [100, 20, 100], size: 1.5, speed: 0.4, color: "#ffffff", opacity: 0.2 }), quality !== "low" && (_jsxs("group", { position: [40, 50, -20], rotation: [0.4, -0.6, 0], children: [_jsxs("mesh", { children: [_jsx("cylinderGeometry", { args: [4, 28, 90, 8, 1, true] }), _jsx("meshBasicMaterial", { color: "#ffeaa7", transparent: true, opacity: 0.08, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })] }), _jsxs("mesh", { rotation: [0, Math.PI / 4, 0], children: [_jsx("cylinderGeometry", { args: [2, 22, 90, 8, 1, true] }), _jsx("meshBasicMaterial", { color: "#ffd369", transparent: true, opacity: 0.06, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })] })] })), _jsxs("mesh", { position: [120, 150, -60], children: [_jsx("sphereGeometry", { args: [18, 16, 16] }), _jsx("meshBasicMaterial", { color: "#fffbe6" })] }), _jsxs("mesh", { position: [120, 150, -60], children: [_jsx("sphereGeometry", { args: [28, 16, 16] }), _jsx("meshBasicMaterial", { color: "#ffd56b", transparent: true, opacity: 0.3, depthWrite: false, blending: THREE.AdditiveBlending })] }), _jsxs("mesh", { ref: moonRef, renderOrder: 10, children: [_jsx("sphereGeometry", { args: [12, 32, 32] }), _jsx("meshBasicMaterial", { color: "#ffeedd", transparent: true, opacity: 0.9, depthWrite: false })] }), quality !== "low" && (_jsxs("mesh", { ref: moonGlowRef, renderOrder: 9, children: [_jsx("sphereGeometry", { args: [14, 16, 16] }), _jsx("meshBasicMaterial", { color: "#aaccee", transparent: true, opacity: 0.15, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.BackSide })] })), _jsx("directionalLight", { ref: moonLightRef, position: [-300, 100, -300], intensity: 0, color: "#aaccee", castShadow: true, "shadow-mapSize-width": 1024, "shadow-mapSize-height": 1024, "shadow-camera-near": 1, "shadow-camera-far": 200, "shadow-camera-left": -80, "shadow-camera-right": 80, "shadow-camera-top": 80, "shadow-camera-bottom": -80, "shadow-bias": -0.0002, "shadow-normalBias": 0.02 }), _jsx("ambientLight", { ref: ambientRef, intensity: 0.5, color: "#87ceeb" }), _jsx("directionalLight", { ref: sunRef, position: [40, 50, -20], intensity: 2.8, color: "#fff1d0", castShadow: true, "shadow-mapSize-width": shadowMapSize, "shadow-mapSize-height": shadowMapSize, "shadow-camera-near": 0.5, "shadow-camera-far": 160, "shadow-camera-left": -60, "shadow-camera-right": 60, "shadow-camera-top": 60, "shadow-camera-bottom": -60, "shadow-bias": -0.0004, "shadow-normalBias": 0.02, target: target }), _jsx("primitive", { object: target }), _jsx("hemisphereLight", { ref: hemiRef, args: ["#fff1d0", "#5c6b7e", 1.4] }), _jsx("directionalLight", { ref: rimRef, position: [-30, 18, -25], intensity: 1.6, color: "#8ecae6" })] }));
}
//# sourceMappingURL=DayNightCycle.js.map