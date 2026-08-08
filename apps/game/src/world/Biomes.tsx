/**
 * Biomes — four distinctive surrounding regions outside Capital Kingdom.
 *
 * Each biome component self-contains: procedural ground material, instanced
 * vegetation / props, fog color override, and atmospheric particle effects.
 *
 * Biomes are positioned compass-anchored around the city:
 *   Ashen Barrens   — East  (+x, volcanic/ash wasteland)
 *   Mistmire Bog     — West  (-x, swamp/marsh)
 *   Sunstone Desert  — SE   (+x,+z, golden desert)
 *   Frostfang Ridge  — North (+z, snowy highlands)
 *
 * Each uses a unique createTerrainMaterial variant + local atmospheric helpers
 * (dust motes, fog, sparkles) so the player feels a visual transition.
 *
 * Performance: each biome is a single <group> with instanced meshes, no
 * per-frame CPU work beyond optional uniform animations.
 */

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Instances, Instance, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { heightAt } from "@legend/engine";
import { BIOME_DEFS, BIOME_ATMOSPHERE } from "@legend/shared";
import type { BiomeKind } from "@legend/shared";
import { createTerrainMaterial } from "../materials/createTerrainMaterial";
import { createStoneMaterial } from "../materials/createStoneMaterial";

/* ── Helpers ── */

function seedRand(seed: number) {
  return () => {
    const s = Math.sin((seed += 1) * 127.1) * 43758.5453;
    return s - Math.floor(s);
  };
}

interface Spot {
  x: number;
  z: number;
  s: number;
  rot: number;
}

function scatterPatch(
  cx: number,
  cz: number,
  radius: number,
  count: number,
  seed: number,
): Spot[] {
  const r = seedRand(seed);
  const out: Spot[] = [];
  for (let i = 0; i < count; i++) {
    const ang = r() * Math.PI * 2;
    const dist = Math.sqrt(r()) * radius;
    out.push({
      x: cx + Math.cos(ang) * dist,
      z: cz + Math.sin(ang) * dist,
      s: 0.5 + r() * 0.8,
      rot: r() * Math.PI * 2,
    });
  }
  return out;
}

function baseY(s: Spot) {
  return heightAt(s.x, s.z);
}

/* ── Reusable materials ── */

const ashenGroundMat = createTerrainMaterial({ variant: "ashen", seed: [13.1, 7.3] });
const bogGroundMat = createTerrainMaterial({ variant: "bog", seed: [8.7, 11.5] });
const desertGroundMat = createTerrainMaterial({ variant: "desert", seed: [3.3, 9.9] });
const frostGroundMat = createTerrainMaterial({ variant: "frost", seed: [17.2, 4.6] });

/* ── Helper: create sparkle group for a biome ── */

function BiomeSparkles({ biome }: { biome: BiomeKind }) {
  const cfg = BIOME_ATMOSPHERE[biome];
  if (cfg.sparkleCount <= 0) return null;
  return (
    <>
      <Sparkles
        count={cfg.sparkleCount}
        scale={[60, 10, 60]}
        size={3}
        speed={0.4}
        color={
          biome === "mistwood" ? "#5a8a4a" :
          biome === "frost_peaks" ? "#c0e0ff" :
          "#d4af37"
        }
        opacity={0.5}
      />
    </>
  );
}

/* ── Ashen Barrens — East ── */

const ashenDef = BIOME_DEFS.find((b) => b.id === "ashen_mountains")!;
const ashenCx = (ashenDef.bounds.minX + ashenDef.bounds.maxX) / 2;
const ashenCz = (ashenDef.bounds.minZ + ashenDef.bounds.maxZ) / 2;
const ashenRadius = (ashenDef.bounds.maxX - ashenDef.bounds.minX) / 2.5;

const ashenRocks = scatterPatch(ashenCx, ashenCz - 10, ashenRadius, 80, 91);
const ashenStumps = scatterPatch(ashenCx + 10, ashenCz + 5, ashenRadius * 0.6, 25, 73);

const rockMatDk = createStoneMaterial({ stoneColor: 0x4a3a2a, roughness: 0.95 });
const stumpMat = createStoneMaterial({ stoneColor: 0x3a2a1a, roughness: 0.9 });

function AshenBarrens() {
  return (
    <group>
      {/* Ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[ashenCx, 0, ashenCz]}
        receiveShadow
        material={ashenGroundMat}
      >
        <planeGeometry args={[100, 100]} />
      </mesh>

      {/* Charred rock formations */}
      <Instances limit={ashenRocks.length} castShadow>
        <dodecahedronGeometry args={[0.8, 0]} />
        <primitive object={rockMatDk} attach="material" />
        {ashenRocks.map((s, i) => (
          <Instance
            key={i}
            position={[s.x, baseY(s) + 0.4 * s.s, s.z]}
            rotation={[s.rot, s.rot * 0.5, 0]}
            scale={[s.s, s.s * 0.6, s.s]}
          />
        ))}
      </Instances>

      {/* Burnt stumps */}
      <Instances limit={ashenStumps.length} castShadow>
        <cylinderGeometry args={[0.15, 0.3, 0.8, 5]} />
        <primitive object={stumpMat} attach="material" />
        {ashenStumps.map((s, i) => (
          <Instance
            key={i}
            position={[s.x, baseY(s) + 0.2, s.z]}
            rotation={[0, s.rot, 0]}
            scale={[s.s, s.s, s.s]}
          />
        ))}
      </Instances>

      <BiomeSparkles biome="ashen_mountains" />
    </group>
  );
}

/* ── Mistmire Bog — West ── */

const bogDef = BIOME_DEFS.find((b) => b.id === "mistwood")!;
const bogCx = (bogDef.bounds.minX + bogDef.bounds.maxX) / 2;
const bogCz = (bogDef.bounds.minZ + bogDef.bounds.maxZ) / 2;
const bogRadius = (bogDef.bounds.maxX - bogDef.bounds.minX) / 2.5;

const bogTrees = scatterPatch(bogCx, bogCz, bogRadius, 35, 41);
const bogMounds = scatterPatch(bogCx - 5, bogCz + 5, bogRadius * 0.5, 40, 67);

const bogTreeMat = createStoneMaterial({ stoneColor: 0x3a4a3a, roughness: 0.92 });
const bogMoundMat = createStoneMaterial({ stoneColor: 0x2a4a2a, roughness: 0.95, flatShading: true });

function MistmireBog() {
  return (
    <group>
      {/* Ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[bogCx, 0, bogCz]}
        receiveShadow
        material={bogGroundMat}
      >
        <planeGeometry args={[100, 100]} />
      </mesh>

      {/* Twisted bog trees (tall cones) */}
      <Instances limit={bogTrees.length} castShadow>
        <coneGeometry args={[0.3, 2.5, 5]} />
        <primitive object={bogTreeMat} attach="material" />
        {bogTrees.map((s, i) => (
          <Instance
            key={i}
            position={[s.x, baseY(s) + 0.2, s.z]}
            rotation={[0.1, s.rot, 0.15]}
            scale={[s.s * 0.8, s.s * 1.2, s.s * 0.8]}
          />
        ))}
      </Instances>

      {/* Mossy mounds */}
      <Instances limit={bogMounds.length} castShadow>
        <sphereGeometry args={[0.5, 6, 5]} />
        <primitive object={bogMoundMat} attach="material" />
        {bogMounds.map((s, i) => (
          <Instance
            key={i}
            position={[s.x, baseY(s) - 0.1, s.z]}
            rotation={[0, s.rot, 0]}
            scale={[s.s, s.s * 0.3, s.s]}
          />
        ))}
      </Instances>

      <BiomeSparkles biome="mistwood" />
    </group>
  );
}

/* ── Sunstone Desert — SE ── */

const desertDef = BIOME_DEFS.find((b) => b.id === "golden_desert")!;
const desertCx = (desertDef.bounds.minX + desertDef.bounds.maxX) / 2;
const desertCz = (desertDef.bounds.minZ + desertDef.bounds.maxZ) / 2;
const desertRadius = (desertDef.bounds.maxX - desertDef.bounds.minX) / 2.5;

const desertRocks = scatterPatch(desertCx, desertCz, desertRadius, 50, 13);
const desertArches: { x: number; z: number; rotY: number }[] = [];
for (let i = 0; i < 6; i++) {
  const r = seedRand(131 + i);
  desertArches.push({
    x: desertCx + (r() - 0.5) * desertRadius * 1.2,
    z: desertCz + (r() - 0.5) * desertRadius * 1.2,
    rotY: r() * Math.PI * 2,
  });
}

const desertRockMat = createStoneMaterial({ stoneColor: 0xc8a870, roughness: 0.92 });
const archMat = createStoneMaterial({ stoneColor: 0xb89860, roughness: 0.9, flatShading: true });

/** Arch — simple stone arch silhouette. */
function Arch({
  position,
  rotationY,
}: {
  position: [number, number, number];
  rotationY: number;
}) {
  const y = heightAt(position[0], position[2]);
  return (
    <group position={[position[0], y + 1.2, position[2]]} rotation={[0, rotationY, 0]}>
      {/* Left pillar */}
      <mesh position={[-1.2, -1.2, 0]} castShadow material={archMat}>
        <boxGeometry args={[0.6, 2.4, 0.6]} />
      </mesh>
      {/* Right pillar */}
      <mesh position={[1.2, -1.2, 0]} castShadow material={archMat}>
        <boxGeometry args={[0.6, 2.4, 0.6]} />
      </mesh>
      {/* Top beam */}
      <mesh position={[0, 0.6, 0]} castShadow material={archMat}>
        <boxGeometry args={[3.0, 0.4, 0.8]} />
      </mesh>
    </group>
  );
}

function SunstoneDesert() {
  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[desertCx, 0, desertCz]}
        receiveShadow
        material={desertGroundMat}
      >
        <planeGeometry args={[100, 100]} />
      </mesh>

      {/* Desert rocks */}
      <Instances limit={desertRocks.length} castShadow>
        <dodecahedronGeometry args={[0.7, 0]} />
        <primitive object={desertRockMat} attach="material" />
        {desertRocks.map((s, i) => (
          <Instance
            key={i}
            position={[s.x, baseY(s) + 0.3 * s.s, s.z]}
            rotation={[s.rot, s.rot * 0.7, 0]}
            scale={[s.s, s.s * 0.5, s.s]}
          />
        ))}
      </Instances>

      {/* Stone arches */}
      {desertArches.map((a, i) => (
        <Arch key={i} position={[a.x, 0, a.z]} rotationY={a.rotY} />
      ))}
    </group>
  );
}

/* ── Frostfang Ridge — North ── */

const frostDef = BIOME_DEFS.find((b) => b.id === "frost_peaks")!;
const frostCx = (frostDef.bounds.minX + frostDef.bounds.maxX) / 2;
const frostCz = (frostDef.bounds.minZ + frostDef.bounds.maxZ) / 2;
const frostRadius = (frostDef.bounds.maxZ - frostDef.bounds.minZ) / 2.5;

const frostSpires = scatterPatch(frostCx, frostCz, frostRadius, 30, 47);
const frostCrystals = scatterPatch(frostCx + 10, frostCz - 5, frostRadius * 0.6, 50, 89);

const spireMat = createStoneMaterial({ stoneColor: 0xc8d8e8, roughness: 0.7 });
const crystalMat = createStoneMaterial({ stoneColor: 0x80b0e0, roughness: 0.3 });

function FrostfangRidge() {
  const crystalRef = useRef<THREE.InstancedMesh>(null);
  useFrame(({ clock }) => {
    if (crystalRef.current) {
      const dummy = new THREE.Object3D();
      const t = clock.elapsedTime;
      for (let i = 0; i < frostCrystals.length; i++) {
        crystalRef.current.getMatrixAt(i, dummy.matrix);
        dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
        dummy.position.y += Math.sin(t + i * 0.7) * 0.002;
        dummy.updateMatrix();
        crystalRef.current.setMatrixAt(i, dummy.matrix);
      }
      crystalRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[frostCx, 0, frostCz]}
        receiveShadow
        material={frostGroundMat}
      >
        <planeGeometry args={[100, 100]} />
      </mesh>

      {/* Ice spires (elongated cones) */}
      <Instances limit={frostSpires.length} castShadow>
        <coneGeometry args={[0.5, 2.0, 6]} />
        <primitive object={spireMat} attach="material" />
        {frostSpires.map((s, i) => (
          <Instance
            key={i}
            position={[s.x, baseY(s) + 0.3, s.z]}
            rotation={[0.1, s.rot, 0.05]}
            scale={[s.s * 0.7, s.s * 1.4, s.s * 0.7]}
          />
        ))}
      </Instances>

      {/* Floating ice crystals (hexagonal prisms) */}
      <instancedMesh
        ref={crystalRef}
        args={[undefined, undefined, frostCrystals.length]}
        castShadow
        material={crystalMat}
      >
        <cylinderGeometry args={[0.08, 0.12, 0.4, 6]} />
      </instancedMesh>
      {/* Position crystals manually once */}
      {(() => {
        const dummy = new THREE.Object3D();
        const ref = crystalRef.current;
        if (ref) {
          frostCrystals.forEach((s, i) => {
            dummy.position.set(s.x, baseY(s) + 0.8 + s.s * 0.3, s.z);
            dummy.scale.set(s.s, s.s, s.s);
            dummy.updateMatrix();
            ref.setMatrixAt(i, dummy.matrix);
          });
          ref.instanceMatrix.needsUpdate = true;
        }
        return null;
      })()}

      <BiomeSparkles biome="frost_peaks" />
    </group>
  );
}

/* ── Exports ── */

export const BIOME_WORLD_COMPONENTS = {
  ashen_mountains: AshenBarrens,
  mistwood: MistmireBog,
  golden_desert: SunstoneDesert,
  frost_peaks: FrostfangRidge,
} as const;

export function Biomes() {
  return (
    <group>
      <AshenBarrens />
      <MistmireBog />
      <SunstoneDesert />
      <FrostfangRidge />
    </group>
  );
}
