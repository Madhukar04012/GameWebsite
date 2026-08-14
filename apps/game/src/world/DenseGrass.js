import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * DenseGrass — Genshin-style dense stylized grass tufts & collectible fantasy flora:
 * 1. Clustered 3D star-plane grass tufts with wind sway & root-to-tip color gradients.
 * 2. Sunblossom (Golden flower with warm amber aura)
 * 3. Windchime Lily (Cyan bell flower with wind chime particles)
 * 4. Starlight Mushroom (Bioluminescent night mushroom)
 * 5. Dandelion Seedheads (Floating seed fluff particles)
 */
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { heightAt } from "@legend/engine";
export function DenseGrass() {
    return (_jsxs("group", { children: [_jsx(GrassField, {}), _jsx(CollectibleFlora, {})] }));
}
/** 1. Dense Stylized Grass Clumps */
function GrassField() {
    const grassMat = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uRootColor: { value: new THREE.Color("#1b4332") },
                uMidColor: { value: new THREE.Color("#2d6a4f") },
                uTipColor: { value: new THREE.Color("#74c69d") },
            },
            vertexShader: /* glsl */ `
        uniform float uTime;
        varying vec2 vUv;
        varying float vHeight;

        void main() {
          vUv = uv;
          vHeight = uv.y;
          vec3 pos = position;

          // Wind sway amplitude increases toward the tip (uv.y)
          float wind = sin(uTime * 3.0 + pos.x * 1.5 + pos.z * 1.5) * 0.15 * uv.y;
          float gust = cos(uTime * 4.5 + pos.z * 2.0) * 0.08 * uv.y;
          pos.x += wind;
          pos.z += gust;

          vec4 wp = modelMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * viewMatrix * wp;
        }
      `,
            fragmentShader: /* glsl */ `
        uniform vec3 uRootColor;
        uniform vec3 uMidColor;
        uniform vec3 uTipColor;
        varying vec2 vUv;
        varying float vHeight;

        void main() {
          vec3 col = mix(uRootColor, uMidColor, smoothstep(0.0, 0.45, vHeight));
          col = mix(col, uTipColor, smoothstep(0.45, 1.0, vHeight));
          gl_FragColor = vec4(col, 1.0);
        }
      `,
            side: THREE.DoubleSide,
        });
    }, []);
    useFrame(({ clock }) => {
        grassMat.uniforms.uTime.value = clock.elapsedTime;
    });
    // Dense grass tuft clusters around wilderness meadows and city approaches
    const grassTufts = useMemo(() => {
        const spots = [];
        for (let i = 0; i < 60; i++) {
            const ang = (i / 60) * Math.PI * 2;
            const r = 52 + (i % 8) * 8;
            const x = Math.cos(ang) * r;
            const z = Math.sin(ang) * r;
            // 1. Skip city walls
            if (Math.abs(x) < 48 && Math.abs(z) < 48)
                continue;
            // 2. Skip riverbed
            const riverX = -40 + Math.sin(z * 0.02) * 18 + Math.cos(z * 0.05) * 8;
            if (Math.abs(x - riverX) < 10)
                continue;
            // 3. Skip south road
            if (Math.abs(x) < 5 && z > -80 && z < -40)
                continue;
            spots.push({
                x,
                z,
                s: 1.0 + (i % 3) * 0.25,
                rot: (i * 1.7),
            });
        }
        return spots;
    }, []);
    return (_jsx("group", { children: grassTufts.map((s, i) => {
            const y = heightAt(s.x, s.z);
            return (_jsxs("group", { position: [s.x, y, s.z], rotation: [0, s.rot, 0], scale: [s.s, s.s, s.s], children: [_jsx("mesh", { position: [0, 0.4, 0], material: grassMat, children: _jsx("planeGeometry", { args: [0.9, 0.8] }) }), _jsx("mesh", { position: [0, 0.4, 0], rotation: [0, Math.PI / 3, 0], material: grassMat, children: _jsx("planeGeometry", { args: [0.9, 0.8] }) }), _jsx("mesh", { position: [0, 0.4, 0], rotation: [0, (2 * Math.PI) / 3, 0], material: grassMat, children: _jsx("planeGeometry", { args: [0.9, 0.8] }) })] }, `gtuft-${i}`));
        }) }));
}
/** 2. Genshin-Style Collectible Flora */
function CollectibleFlora() {
    const floraNodes = useMemo(() => [
        { x: -18, z: -26, type: "sunblossom", color: "#fca311" }, // Royal Gardens
        { x: 18, z: -26, type: "windchime", color: "#00b4d8" }, // Royal Gardens
        { x: 28, z: 12, type: "dandelion", color: "#fdf0d5" }, // Cathedral Courtyard
        { x: -28, z: -22, type: "sunblossom", color: "#fca311" }, // Noble Garden
        { x: -36, z: 12, type: "starlight", color: "#7209b7" }, // Guild Herb Garden
        { x: 0, z: -65, type: "sunblossom", color: "#fca311" }, // South Gate Meadow
    ], []);
    const stemMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#2d6a4f", roughness: 0.6 }), []);
    const sunblossomMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#fca311",
        emissive: "#ffb703",
        emissiveIntensity: 1.8,
        roughness: 0.2,
    }), []);
    const windchimeMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#48cae4",
        emissive: "#0077b6",
        emissiveIntensity: 1.6,
        roughness: 0.2,
    }), []);
    const dandelionPuffMat = useMemo(() => new THREE.MeshStandardMaterial({
        color: "#ffffff",
        roughness: 0.9,
        transparent: true,
        opacity: 0.85,
    }), []);
    return (_jsx("group", { children: floraNodes.map((f, i) => {
            const y = heightAt(f.x, f.z);
            return (_jsxs("group", { position: [f.x, y, f.z], children: [_jsx("mesh", { position: [0, 0.35, 0], material: stemMat, children: _jsx("cylinderGeometry", { args: [0.03, 0.04, 0.7, 6] }) }), f.type === "sunblossom" && (_jsxs(_Fragment, { children: [_jsx("mesh", { position: [0, 0.75, 0], material: sunblossomMat, children: _jsx("sphereGeometry", { args: [0.22, 8, 8] }) }), _jsx(Sparkles, { count: 8, scale: [1.5, 1.5, 1.5], size: 3.5, speed: 0.4, color: "#ffb703" })] })), f.type === "windchime" && (_jsxs(_Fragment, { children: [_jsx("mesh", { position: [0, 0.72, 0], rotation: [Math.PI, 0, 0], material: windchimeMat, children: _jsx("coneGeometry", { args: [0.25, 0.35, 6] }) }), _jsx(Sparkles, { count: 8, scale: [1.5, 1.5, 1.5], size: 3.5, speed: 0.5, color: "#48cae4" })] })), f.type === "dandelion" && (_jsxs(_Fragment, { children: [_jsx("mesh", { position: [0, 0.75, 0], material: dandelionPuffMat, children: _jsx("sphereGeometry", { args: [0.28, 12, 12] }) }), _jsx(Sparkles, { count: 14, scale: [3, 4, 3], position: [0, 1.5, 0], size: 2, speed: 0.6, color: "#ffffff" })] })), f.type === "starlight" && (_jsxs(_Fragment, { children: [_jsx("mesh", { position: [0, 0.4, 0], material: sunblossomMat, children: _jsx("cylinderGeometry", { args: [0.08, 0.12, 0.4, 6] }) }), _jsx("mesh", { position: [0, 0.65, 0], material: windchimeMat, children: _jsx("sphereGeometry", { args: [0.26, 8, 6] }) }), _jsx(Sparkles, { count: 8, scale: [1.5, 1.5, 1.5], size: 3, speed: 0.3, color: "#b5179e" })] }))] }, `flora-${i}`));
        }) }));
}
//# sourceMappingURL=DenseGrass.js.map