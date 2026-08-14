import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * WeatherController — animated weather effects: rain, fog, lightning, wind.
 *
 * Consumes worldStore.weather each frame and renders visual effects:
 *   - Rain particle system (GPU particles, no per-frame CPU update)
 *   - Lightning flashes (brief emissive burst)
 *   - Fog density driven by weather state
 *   - Wind affects foliage materials via shared uniform
 *
 * Performance: rain uses a single Points mesh with pre-baked positions in a
 * large volume, recycled each frame via shader offset (no geometry mutation).
 */
import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useWorldStore } from "../store/worldStore";
import { windAmplitude } from "@legend/engine";
const RAIN_COUNT = 8000;
const RAIN_VOLUME = 120; // world units
export function WeatherController({ seed = 42 }) {
    const { scene } = useThree();
    const weatherRef = useRef(useWorldStore.getState().weather);
    const windAmplitudeRef = useRef(0);
    // Subscribe to weather changes without re-render
    useWorldStore.subscribe((s) => {
        weatherRef.current = s.weather;
        windAmplitudeRef.current = windAmplitude(s.weather.wind) * (1 + s.weather.gustFactor);
    });
    // Rain geometry: pre-generated positions in a 3D volume
    const rainPos = useMemo(() => {
        const pos = new Float32Array(RAIN_COUNT * 3);
        const rng = (n) => {
            const s = Math.sin(n * 127.1 + seed) * 43758.5453;
            return s - Math.floor(s);
        };
        for (let i = 0; i < RAIN_COUNT; i++) {
            const idx = i * 3;
            pos[idx] = (rng(i * 3) - 0.5) * RAIN_VOLUME;
            pos[idx + 1] = rng(i * 3 + 1) * RAIN_VOLUME;
            pos[idx + 2] = (rng(i * 3 + 2) - 0.5) * RAIN_VOLUME;
        }
        return pos;
    }, [seed]);
    const rainUniforms = useMemo(() => ({
        uTime: { value: 0 },
        uRainIntensity: { value: 0 },
        uWind: { value: 0 },
        uVolume: { value: RAIN_VOLUME },
    }), []);
    // Lightning flash state
    const flashRef = useRef({ timer: 0, visible: false });
    const flashMatRef = useRef(null);
    // Fog density reference for smooth adjustment
    const fogRef = useRef({ current: 0.0065, target: 0.0065 });
    // Frame tick: update rain, fog, lightning
    useFrame((_, dt) => {
        const w = weatherRef.current;
        // Update rain uniforms
        const u = rainUniforms;
        u.uTime.value = u.uTime.value + dt;
        u.uRainIntensity.value = w.rainIntensity;
        u.uWind.value = windAmplitudeRef.current * 0.8;
        // Fog density smoothing
        const fogTarget = 0.0065 + w.fogDensity * 0.03;
        fogRef.current.target = fogTarget;
        fogRef.current.current += (fogTarget - fogRef.current.current) * Math.min(1, dt * 0.5);
        // Apply fog density to scene fog
        if (scene.fog instanceof THREE.FogExp2) {
            scene.fog.density = fogRef.current.current;
        }
        // Lightning
        if (w.lightningFreq > 0) {
            flashRef.current.timer -= dt;
            if (flashRef.current.timer <= 0) {
                flashRef.current.timer = 60 / w.lightningFreq * (0.5 + Math.random() * 1.5);
                flashRef.current.visible = true;
                if (flashMatRef.current) {
                    flashMatRef.current.opacity = 0.6 + Math.random() * 0.4;
                }
                setTimeout(() => {
                    flashRef.current.visible = false;
                    if (flashMatRef.current)
                        flashMatRef.current.opacity = 0;
                }, 80 + Math.random() * 120);
            }
        }
        else {
            flashRef.current.visible = false;
            if (flashMatRef.current)
                flashMatRef.current.opacity = 0;
        }
    });
    return (_jsxs("group", { children: [_jsxs("points", { visible: true, children: [_jsx("bufferGeometry", { children: _jsx("bufferAttribute", { attach: "attributes-position", args: [rainPos, 3], count: RAIN_COUNT, array: rainPos, itemSize: 3 }) }), _jsx("shaderMaterial", { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: rainUniforms, vertexShader: `
            uniform float uTime;
            uniform float uRainIntensity;
            uniform float uWind;
            uniform float uVolume;

            varying float vAlpha;

            // Deterministic hash from position
            float hashF(float x) {
              float s = sin(x * 127.1) * 43758.5453;
              return s - floor(s);
            }

            void main() {
              vec3 pos = position;
              // Per-particle speed derived from position seed
              float speed = 15.0 + hashF(pos.x * 3.0 + pos.z * 7.0) * 10.0;

              // Fall downward with wind offset
              float fall = mod(uTime * speed + pos.y, uVolume) - uVolume * 0.5;
              pos.y = fall;
              pos.x += uWind * fall * 0.02 + sin(uTime * 0.5 + pos.x) * 0.1;

              vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
              gl_Position = projectionMatrix * mvPos;

              // Line length and alpha by rain intensity
              float len = 0.3 + uRainIntensity * 0.7;
              gl_PointSize = (len * 80.0) / -mvPos.z;
              vAlpha = uRainIntensity * 0.6;
            }
          `, fragmentShader: `
            varying float vAlpha;

            void main() {
              // Rain streak (elongated along Y)
              vec2 uv = gl_PointCoord;
              float streak = 1.0 - abs(uv.y - 0.5) * 2.0;
              streak = pow(streak, 6.0);
              float alpha = streak * vAlpha;
              if (alpha < 0.01) discard;
              gl_FragColor = vec4(0.75, 0.80, 1.0, alpha);
            }
          ` })] }), _jsxs("mesh", { children: [_jsx("planeGeometry", { args: [200, 200] }), _jsx("meshBasicMaterial", { ref: flashMatRef, color: "#ffffff", transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide })] })] }));
}
//# sourceMappingURL=WeatherController.js.map