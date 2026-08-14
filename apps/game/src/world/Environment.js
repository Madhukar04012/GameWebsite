import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Sky, Clouds, Cloud, Stars, Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
/**
 * Environment — sky dome, drifting clouds, stars (night reserve), gold motes,
 * floating dust particles. Warm fantasy atmosphere: golden sun low on the
 * horizon against a sapphire/gold sky. Procedural — no network fetch.
 */
export function Environment() {
    const cloudRef = useRef(null);
    useFrame((_, dt) => {
        if (cloudRef.current)
            cloudRef.current.position.x -= dt * 0.5;
    });
    return (_jsxs(_Fragment, { children: [_jsx(Sky, { distance: 450000, sunPosition: [40, 12, -20], inclination: 0.52, azimuth: 0.25, turbidity: 8, rayleigh: 1.8, mieCoefficient: 0.008, mieDirectionalG: 0.92 }), _jsxs(Clouds, { ref: cloudRef, limit: 300, children: [_jsx(Cloud, { speed: 0.1, opacity: 0.6, seed: 1, segments: 28, bounds: [140, 10, 140], volume: 22, color: "#ffffff" }), _jsx(Cloud, { speed: 0.08, opacity: 0.4, seed: 2, segments: 20, bounds: [180, 8, 100], volume: 16, color: "#fdfdff", position: [40, 25, -60] }), _jsx(Cloud, { speed: 0.05, opacity: 0.25, seed: 3, segments: 14, bounds: [200, 4, 200], volume: 10, color: "#ffeedd", position: [-60, 35, 40] })] }), _jsx(Stars, { radius: 300, depth: 60, count: 2000, factor: 4, fade: true, speed: 0.5 }), _jsx(Sparkles, { count: 120, scale: [160, 40, 160], size: 3.5, speed: 0.25, color: "#f3c649", opacity: 0.5 }), _jsx(Sparkles, { count: 80, scale: [100, 20, 100], size: 1.5, speed: 0.4, color: "#ffffff", opacity: 0.2 }), _jsx(Sparkles, { count: 40, scale: [60, 15, 60], size: 2, speed: 0.35, color: "#ff9944", opacity: 0.35, position: [0, 5, 0] })] }));
}
//# sourceMappingURL=Environment.js.map