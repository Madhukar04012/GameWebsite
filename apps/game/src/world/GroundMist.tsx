import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * GroundMist -- Low-lying rolling mist layer. Uses a horizontal particle field
 * with custom shaders for wispy, drifting fog at ground level.
 *
 * Art direction: pale blue-white or magical ethereal mist that hugs the ground
 * and slowly rolls, creating depth and atmosphere in low areas, swamps, and
 * morning scenes.
 */
interface GroundMistProps {
  count?: number;
  /** Center of the mist volume. */
  position?: [number, number, number];
  /** Horizontal spread radius (default 60). */
  radius?: number;
  /** Vertical thickness (default 3 = thin ground layer). */
  thickness?: number;
  /** Mist color (default pale blue-white). */
  color?: string;
  /** Opacity scaling factor (default 1.0). */
  opacity?: number;
}

export function GroundMist({
  count = 400,
  position = [0, 0, 0],
  radius = 60,
  thickness = 3,
  color = "#c8d8f0",
  opacity = 1.0,
}: GroundMistProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, seeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius;
      pos[i * 3 + 0] = Math.cos(angle) * r;
      pos[i * 3 + 1] = Math.random() * thickness;
      pos[i * 3 + 2] = Math.sin(angle) * r;
      sds[i] = Math.random();
    }
    return [pos, sds];
  }, [count, radius, thickness]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
    }),
    [color, opacity]
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
          attach="attributes-aSeed"
          args={[seeds, 1]}
          count={count}
          array={seeds}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
        uniforms={uniforms}
        vertexShader={`
          attribute float aSeed;
          varying float vAlpha;
          uniform float uTime;

          void main() {
            vec3 pos = position;
            // Slow horizontal drift -- mist rolls, doesn't dart
            float speed = 0.08 + aSeed * 0.06;
            pos.x += sin(uTime * speed + aSeed * 6.28) * 3.0;
            pos.z += cos(uTime * speed * 0.7 + aSeed * 6.28) * 3.0;
            // Gentle vertical breathing
            pos.y += sin(uTime * 0.05 + aSeed * 12.56) * 0.4;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;

            // Mist wisps: large soft blobs
            float d = distance(pos.xz, vec2(0.0));
            float edgeFade = 1.0 - smoothstep(0.0, float(${radius}), d);
            float breathe = sin(uTime * 0.03 + aSeed * 6.28) * 0.3 + 0.7;
            gl_PointSize = (8.0 + aSeed * 12.0) / -mvPosition.z;
            vAlpha = edgeFade * breathe * ${opacity.toFixed(2)};
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying float vAlpha;

          void main() {
            vec2 cxy = 2.0 * gl_PointCoord - 1.0;
            float r = dot(cxy, cxy);
            if (r > 1.0) discard;
            // Very soft, cloudy edge -- mist isn't sharp
            float alpha = smoothstep(1.0, 0.1, r) * vAlpha * 0.35;
            gl_FragColor = vec4(uColor, alpha);
          }
        `}
      />
    </points>
  );
}
