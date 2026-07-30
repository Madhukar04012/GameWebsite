import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { PlaneGeometry } from "three";
import { heightAt } from "@legend/engine";
import { WORLD_BOUNDS } from "@legend/shared";
import { createWaterMaterial } from "../materials/createWaterMaterial";
import { createWoodMaterial } from "../materials/createWoodMaterial";

/**
 * Harbor — animated water plane north of the Harbor district + wooden docks.
 *
 * Water is a subdivided plane whose waves are computed in the vertex shader
 * (summed sines); the fragment shader adds fresnel sky reflection, a sun
 * specular highlight, animated ripple normals, and shoreline foam. No
 * textures, no network — and no per-frame CPU geometry mutation (the old
 * path recomputed every vertex + normals each frame). Docks are a grid of
 * plank meshes + posts; moored boats are simple hull silhouettes.
 *
 * Performance: one water draw, instanced posts later if expanded.
 */
const WATER_W = 40;
const WATER_D = 30;
const WATER_SEG = 32;
const DOCK_FRONT_Z = WORLD_BOUNDS.citySize / 2 - 2; // just outside the city bounds
const WATER_Z = DOCK_FRONT_Z + WATER_D / 2 + 4;

export function Harbor() {
  const geo = useMemo(() => new PlaneGeometry(WATER_W, WATER_D, WATER_SEG, WATER_SEG), []);
  const waterMat = useMemo(
    () => createWaterMaterial({ shoreZ: DOCK_FRONT_Z + 0.5 }),
    [],
  );

  // Only the time uniform updates each frame — geometry + normals come from
  // the GPU wave field, so this is constant-cost regardless of segment count.
  useFrame(({ clock }) => {
    (waterMat.uniforms.uTime.value as number) = clock.elapsedTime;
  });

  const baseY = heightAt(0, WATER_Z);

  return (
    <group>
      {/* Water */}
      <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, baseY + 0.05, WATER_Z]} material={waterMat} />

      {/* Foam line along the shoreline (thin emissive band) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, baseY + 0.07, DOCK_FRONT_Z + 0.5]}>
        <planeGeometry args={[WATER_W, 1.2]} />
        <meshStandardMaterial color="#cfe0f0" transparent opacity={0.3} emissive="#5daeff" emissiveIntensity={0.2} />
      </mesh>

      {/* Wooden dock extending into the water */}
      <Dock centerZ={DOCK_FRONT_Z + 6} baseY={baseY} />

      {/* Two moored boats */}
      <Boat position={[-6, baseY + 0.4, WATER_Z - 4]} rotation={0} />
      <Boat position={[7, baseY + 0.4, WATER_Z + 2]} rotation={Math.PI / 8} />
    </group>
  );
}

function Dock({ centerZ, baseY }: { centerZ: number; baseY: number }) {
  const planks = useMemo(() => {
    const list: { x: number; z: number; key: string }[] = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      const z = DOCK_FRONT_Z + i * 1.8 + 1;
      list.push({ x: 0, z, key: `plank-${i}` });
    }
    return list;
  }, []);

  const posts = useMemo(() => {
    const list: { x: number; z: number; key: string }[] = [];
    for (let i = 0; i < 5; i++) {
      const z = DOCK_FRONT_Z + i * 3.6 + 1;
      list.push({ x: -3, z, key: `post-l-${i}` });
      list.push({ x: 3, z, key: `post-r-${i}` });
    }
    return list;
  }, []);

  return (
    <group>
      {planks.map((p) => (
        <mesh key={p.key} position={[p.x, baseY + 0.1, p.z]} castShadow receiveShadow material={plankMat}>
          <boxGeometry args={[7, 0.15, 1.6]} />
        </mesh>
      ))}
      {posts.map((p) => (
        <mesh key={p.key} position={[p.x, baseY - 0.2, p.z]} castShadow material={postMat}>
          <cylinderGeometry args={[0.12, 0.12, 1.4, 6]} />
        </mesh>
      ))}
    </group>
  );
}

// Reused wood materials for dock/boat.
const plankMat = createWoodMaterial({ woodColor: 0x6a4a2a, roughness: 0.85 });
const postMat = createWoodMaterial({ woodColor: 0x4a3a22, roughness: 0.88 });
const hullMat = createWoodMaterial({ woodColor: 0x5a3a22, roughness: 0.85 });
const bowMat = createWoodMaterial({ woodColor: 0x4a2a18, roughness: 0.88, flatShading: true });

function Boat({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Hull */}
      <mesh castShadow material={hullMat}>
        <boxGeometry args={[1.6, 0.6, 3.5]} />
      </mesh>
      {/* Tapered bow */}
      <mesh position={[0, 0, 2.1]} castShadow material={bowMat}>
        <coneGeometry args={[0.8, 1.2, 4]} />
      </mesh>
      {/* Mast */}
      <mesh position={[0, 1.6, 0]} castShadow material={postMat}>
        <cylinderGeometry args={[0.05, 0.05, 3.2, 6]} />
      </mesh>
      {/* Sail — gold rune cloth */}
      <mesh position={[0, 1.8, 0.5]}>
        <planeGeometry args={[1.2, 2]} />
        <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.15} roughness={0.7} side={2} />
      </mesh>
    </group>
  );
}
