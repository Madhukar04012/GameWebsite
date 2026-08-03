import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * FireflySwarm -- Bioluminescent particles that drift and pulse like living
 * fireflies. Smaller, faster, and blink more erratically than DustMotes.
 * Intended for groves, flower fields, marshes, and damp forest understory.
 *
 * Art direction: each firefly has a small warm glow (green/gold/blue-green)
 * with a sharp decay so they read as discrete points of light, not fog.
 */
interface FireflySwarmProps {
  count?: number;
  /** Center of the swarm volume. */
  position?: [number, number, number];
  /** Horizontal spread radius (default 20). */
  radius?: number;
  /** Vertical spread (default 10). */
  height?: number;
  /** Glow color. Default bioluminescent green. */
  color?: string;
}

export function FireflySwarm({
  count = 120,
  position = [0, 0, 0],
  radius = 20,
  height = 10,
  color = "#2a9d8f",
}: FireflySwarmProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const phs = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * radius * 2;
      pos[i * 3 + 1] = Math.random() * height;
      pos[i * 3 + 2] = (Math.random() - 0.5) * radius * 2;
      phs[i] = Math.random() * Math.PI * 2;
    }
    return [pos, phs];
  }, [count, radius, height]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
    }),
    [color]
  );

  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const mat = pointsRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aPhase"
          args={[phases, 1]}
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
            // Fireflies dart more erratically than dust motes
            float t = uTime * 0.4;
            pos.x += sin(t * 1.3 + aPhase) * 2.5;
            pos.y += cos(t * 0.9 + aPhase * 1.7) * 1.5 + sin(t * 0.5 + aPhase) * 0.8;
            pos.z += sin(t * 1.1 + aPhase * 1.3) * 2.5;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;

            // Smaller point size than dust motes, sharp falloff
            float pulse = sin(uTime * 2.0 + aPhase * 3.0) * 0.5 + 0.5;
            gl_PointSize = (6.0 + pulse * 4.0) / -mvPosition.z;

            // Brighter when "on", dimmer when "off" (firefly blink)
            vAlpha = pow(pulse, 2.0) * 0.9;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying float vAlpha;

          void main() {
            vec2 cxy = 2.0 * gl_PointCoord - 1.0;
            float r = dot(cxy, cxy);
            if (r > 1.0) discard;
            // Sharp inner glow, soft edge
            float alpha = smoothstep(1.0, 0.2, r) * vAlpha;
            gl_FragColor = vec4(uColor, alpha);
          }
        `}
      />
    </points>
  );
}
