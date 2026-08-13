/**
 * Waterfall — Reusable natural landmark with animated cascades,
 * turbulent foam basins, wet rocks, and ambient spray mist particles.
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { heightAt } from "@legend/engine";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createWaterMaterial } from "../materials/createWaterMaterial";

interface WaterfallProps {
  position?: [number, number, number];
  height?: number;
  width?: number;
}

const wetRockMat = createStoneMaterial({
  stoneColor: "#2a333a",
  roughness: 0.25,
  flatShading: true,
});

export function Waterfall({ position = [-45, 0, 35], height = 14, width = 8 }: WaterfallProps) {
  const [x, , z] = position;
  const groundY = useMemo(() => heightAt(x, z), [x, z]);
  const cascadeRef = useRef<THREE.Mesh>(null);
  const foamRef = useRef<THREE.Mesh>(null);

  // Flowing waterfall shader material
  const cascadeMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#48cae4") },
        uFoamColor: { value: new THREE.Color("#ffffff") },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform vec3 uColor;
        uniform vec3 uFoamColor;
        varying vec2 vUv;

        // Fast hash for vertical water noise
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        void main() {
          // Fast vertical flow
          float stream = sin(vUv.x * 24.0 + sin(vUv.y * 10.0 + uTime * 6.0)) * 0.5 + 0.5;
          float flow = fract(vUv.y * 3.0 - uTime * 2.5);
          float foamLines = smoothstep(0.4, 0.9, stream + hash(vec2(vUv.x * 12.0, flow)));

          vec3 col = mix(uColor, uFoamColor, foamLines * 0.8);
          float alpha = 0.85 + 0.15 * foamLines;
          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  const basinWaterMat = useMemo(() => createWaterMaterial({
    deepColor: 0x0077b6,
    skyColor: 0x90e0ef,
    foamColor: 0xffffff,
  }), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    cascadeMat.uniforms.uTime.value = t;
    if (foamRef.current) {
      foamRef.current.rotation.z = t * 0.4;
      const pulse = 1.0 + Math.sin(t * 3.0) * 0.08;
      foamRef.current.scale.set(pulse, pulse, 1);
    }
  });

  return (
    <group position={[x, groundY, z]}>
      {/* ── Canyon Cliff Backdrop ── */}
      <mesh position={[0, height / 2, -2]} castShadow receiveShadow material={wetRockMat}>
        <boxGeometry args={[width + 6, height + 4, 4]} />
      </mesh>

      {/* Side Cliff Flanks */}
      <mesh position={[-width / 2 - 2, height / 2, 0]} castShadow receiveShadow material={wetRockMat}>
        <boxGeometry args={[4, height + 2, 6]} />
      </mesh>
      <mesh position={[width / 2 + 2, height / 2, 0]} castShadow receiveShadow material={wetRockMat}>
        <boxGeometry args={[4, height + 2, 6]} />
      </mesh>

      {/* ── Main Vertical Water Cascade ── */}
      <mesh ref={cascadeRef} position={[0, height / 2, 0.1]} material={cascadeMat}>
        <planeGeometry args={[width, height, 16, 32]} />
      </mesh>

      {/* Secondary Inner Water Sheet */}
      <mesh position={[0, height / 2, -0.4]} material={cascadeMat}>
        <planeGeometry args={[width * 0.9, height, 8, 16]} />
      </mesh>

      {/* ── Turbulent Splash Basin at Base ── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 4]} receiveShadow material={basinWaterMat}>
        <circleGeometry args={[width * 0.9, 24]} />
      </mesh>

      {/* Foam Crest Ring */}
      <mesh ref={foamRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.15, 1.5]}>
        <ringGeometry args={[0.5, width * 0.65, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>

      {/* ── Ambient Splash Particles & Mist ── */}
      <Sparkles count={40} scale={[width * 1.5, 4, 6]} position={[0, 1.5, 3]} size={4} speed={0.8} color="#caf0f8" />
      <Sparkles count={25} scale={[width, height * 0.8, 3]} position={[0, height / 2, 1]} size={2.5} speed={0.4} color="#e0fbfc" />
    </group>
  );
}
