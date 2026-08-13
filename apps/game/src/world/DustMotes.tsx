import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WORLD_BOUNDS } from "@legend/shared";
import { useQualitySettings } from "../systems/GraphicsScalability";

/**
 * DustMotes — Ambient floating particles surrounding the player/camera.
 * Creates a magical, ethereal atmosphere with slowly drifting glowing orbs.
 */
export function DustMotes({ count: baseCount = 2000 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const settings = useQualitySettings();
  const count = Math.max(100, Math.round(baseCount * (settings.particleScale ?? 1)));

  // Generate random positions and phases for the particles
  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const phs = new Float32Array(count);
    const range = WORLD_BOUNDS.citySize * 1.5;

    for (let i = 0; i < count; i++) {
      // Scatter over a large area
      pos[i * 3 + 0] = (Math.random() - 0.5) * range;
      pos[i * 3 + 1] = Math.random() * 40; // Height from 0 to 40
      pos[i * 3 + 2] = (Math.random() - 0.5) * range;
      
      phs[i] = Math.random() * Math.PI * 2; // Random starting phase for blinking
    }
    return [pos, phs];
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#fff2a8") }, // Warm gold/yellow
    }),
    []
  );

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const mat = pointsRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3] as [Float32Array, number]}
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          args={[phases, 1] as [Float32Array, number]}
          count={count}
          array={phases}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          attribute float aPhase;
          varying float vAlpha;
          uniform float uTime;
          
          void main() {
            vec3 pos = position;
            // Slow, drifting movement
            pos.x += sin(uTime * 0.2 + aPhase) * 2.0;
            pos.y += cos(uTime * 0.15 + aPhase) * 1.0;
            pos.z += sin(uTime * 0.25 + aPhase * 1.5) * 2.0;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            // Size attenuation
            gl_PointSize = (12.0 * (sin(uTime + aPhase) * 0.5 + 0.5)) / -mvPosition.z;
            
            // Fade out based on distance and pulse
            vAlpha = (sin(uTime * 0.5 + aPhase) * 0.5 + 0.5) * 0.6;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying float vAlpha;
          
          void main() {
            // Soft circular particle
            vec2 cxy = 2.0 * gl_PointCoord - 1.0;
            float r = dot(cxy, cxy);
            if (r > 1.0) discard;
            
            // Soft edge
            float alpha = (1.0 - r) * vAlpha;
            gl_FragColor = vec4(uColor, alpha);
          }
        `}
      />
    </points>
  );
}
