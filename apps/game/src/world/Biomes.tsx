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

/* ── Ashen Barrens — East (Volcanic Crags & Basalt Pillars) ── */

const ashenDef = BIOME_DEFS.find((b) => b.id === "ashen_mountains")!;
const ashenCx = (ashenDef.bounds.minX + ashenDef.bounds.maxX) / 2;
const ashenCz = (ashenDef.bounds.minZ + ashenDef.bounds.maxZ) / 2;
const ashenRadius = (ashenDef.bounds.maxX - ashenDef.bounds.minX) / 2.5;

const ashenRocks = scatterPatch(ashenCx, ashenCz - 10, ashenRadius, 60, 91);
const basaltColumns = scatterPatch(ashenCx + 15, ashenCz + 10, ashenRadius * 0.7, 35, 73);

const basaltMat = createStoneMaterial({ stoneColor: "#2b2b2b", roughness: 0.9, flatShading: true });
const magmaGlowMat = new THREE.MeshStandardMaterial({
  color: "#ff3d00",
  emissive: "#ff5722",
  emissiveIntensity: 2.0,
  roughness: 0.2,
});

function AshenBarrens() {
  return (
    <group>
      {/* Basalt Hexagonal Pillars */}
      {basaltColumns.map((s, i) => {
        const y = baseY(s);
        const colH = 2 + (i % 5) * 1.2;
        return (
          <group key={`basalt-${i}`} position={[s.x, y, s.z]}>
            <mesh castShadow receiveShadow material={basaltMat} position={[0, colH / 2, 0]}>
              <cylinderGeometry args={[0.7 * s.s, 0.7 * s.s, colH, 6]} />
            </mesh>
            {/* Glowing Magma Crevice */}
            {i % 4 === 0 && (
              <mesh position={[0, 0.05, 0]} material={magmaGlowMat}>
                <circleGeometry args={[1.2, 8]} />
              </mesh>
            )}
          </group>
        );
      })}

      {/* Volcanic Crags */}
      <Instances limit={ashenRocks.length} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.9, 0]} />
        <primitive object={basaltMat} attach="material" />
        {ashenRocks.map((s, i) => (
          <Instance
            key={i}
            position={[s.x, baseY(s) + 0.45 * s.s, s.z]}
            rotation={[s.rot, s.rot * 0.5, 0]}
            scale={[s.s * 1.3, s.s * 0.9, s.s * 1.2]}
          />
        ))}
      </Instances>

      {/* Rising Volcanic Embers */}
      <Sparkles count={45} scale={[60, 20, 60]} position={[ashenCx, 10, ashenCz]} size={4} speed={0.8} color="#ff5722" />
    </group>
  );
}

/* ── Mistmire Bog & Whistling Woods — West ── */

const bogDef = BIOME_DEFS.find((b) => b.id === "mistwood")!;
const bogCx = (bogDef.bounds.minX + bogDef.bounds.maxX) / 2;
const bogCz = (bogDef.bounds.minZ + bogDef.bounds.maxZ) / 2;
const bogRadius = (bogDef.bounds.maxX - bogDef.bounds.minX) / 2.5;

const bogTrees = scatterPatch(bogCx, bogCz, bogRadius, 40, 41);
const swampShrooms = scatterPatch(bogCx - 10, bogCz + 12, bogRadius * 0.6, 30, 67);

const willowWoodMat = createStoneMaterial({ stoneColor: "#283618", roughness: 0.92 });
const willowFoliageMat = new THREE.MeshStandardMaterial({ color: "#606c38", roughness: 0.8, flatShading: true });
const shroomCapMat = new THREE.MeshStandardMaterial({
  color: "#00f5d4",
  emissive: "#00bbf9",
  emissiveIntensity: 1.8,
  roughness: 0.3,
});

function MistmireBog() {
  return (
    <group>
      {/* Whistling Woods Towering Willows */}
      {bogTrees.map((s, i) => {
        const y = baseY(s);
        return (
          <group key={`tree-${i}`} position={[s.x, y, s.z]} rotation={[0, s.rot, 0]} scale={[s.s * 1.3, s.s * 1.3, s.s * 1.3]}>
            {/* Twisted Trunk */}
            <mesh castShadow receiveShadow material={willowWoodMat} position={[0, 2.2, 0]}>
              <cylinderGeometry args={[0.3, 0.6, 4.4, 7]} />
            </mesh>
            {/* Weeping Canopy */}
            <mesh castShadow receiveShadow material={willowFoliageMat} position={[0, 4.2, 0]}>
              <sphereGeometry args={[1.8, 8, 8]} />
            </mesh>
            <mesh castShadow receiveShadow material={willowFoliageMat} position={[0.5, 3.2, 0.4]}>
              <coneGeometry args={[1.2, 2.5, 6]} />
            </mesh>
          </group>
        );
      })}

      {/* Bioluminescent Glowing Mushrooms */}
      {swampShrooms.map((s, i) => {
        const y = baseY(s);
        return (
          <group key={`shroom-${i}`} position={[s.x, y, s.z]} scale={[s.s * 1.4, s.s * 1.4, s.s * 1.4]}>
            <mesh position={[0, 0.25, 0]} material={willowWoodMat}>
              <cylinderGeometry args={[0.06, 0.1, 0.5, 6]} />
            </mesh>
            <mesh position={[0, 0.5, 0]} material={shroomCapMat}>
              <sphereGeometry args={[0.3, 8, 6]} />
            </mesh>
          </group>
        );
      })}

      {/* Floating Marsh Spores & Fireflies */}
      <Sparkles count={55} scale={[65, 14, 65]} position={[bogCx, 6, bogCz]} size={4} speed={0.3} color="#90be6d" />
      <Sparkles count={30} scale={[40, 8, 40]} position={[bogCx, 3, bogCz]} size={5} speed={0.4} color="#00f5d4" />
    </group>
  );
}

/* ── Sunstone Desert — South-East (Dunes & Oasis Palms) ── */

const desertDef = BIOME_DEFS.find((b) => b.id === "golden_desert")!;
const desertCx = (desertDef.bounds.minX + desertDef.bounds.maxX) / 2;
const desertCz = (desertDef.bounds.minZ + desertDef.bounds.maxZ) / 2;
const desertRadius = (desertDef.bounds.maxX - desertDef.bounds.minX) / 2.5;

const desertPalms = scatterPatch(desertCx, desertCz, desertRadius * 0.7, 25, 13);
const desertRockFormations = scatterPatch(desertCx + 15, desertCz - 10, desertRadius, 40, 59);

const palmTrunkMat = createStoneMaterial({ stoneColor: "#8d6e63", roughness: 0.9 });
const palmFrondMat = new THREE.MeshStandardMaterial({ color: "#2e7d32", roughness: 0.6, side: THREE.DoubleSide });
const desertSandstoneMat = createStoneMaterial({ stoneColor: "#d7ccc8", roughness: 0.85, flatShading: true });

function SunstoneDesert() {
  return (
    <group>
      {/* Oasis Date Palm Trees */}
      {desertPalms.map((s, i) => {
        const y = baseY(s);
        return (
          <group key={`palm-${i}`} position={[s.x, y, s.z]} rotation={[0, s.rot, 0]} scale={[s.s * 1.2, s.s * 1.2, s.s * 1.2]}>
            {/* Curved Palm Trunk */}
            <mesh castShadow receiveShadow material={palmTrunkMat} position={[0.4, 2.5, 0]} rotation={[0, 0, -0.15]}>
              <cylinderGeometry args={[0.2, 0.35, 5.2, 7]} />
            </mesh>
            {/* Palm Fronds Star */}
            {[0, 1, 2, 3, 4, 5].map((ang) => (
              <mesh
                key={ang}
                position={[0.8, 5.1, 0]}
                rotation={[0.35, (ang * Math.PI) / 3, 0.4]}
                castShadow
                material={palmFrondMat}
              >
                <planeGeometry args={[1.2, 2.2]} />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* Weathered Sandstone Boulders */}
      <Instances limit={desertRockFormations.length} castShadow receiveShadow>
        <dodecahedronGeometry args={[0.9, 0]} />
        <primitive object={desertSandstoneMat} attach="material" />
        {desertRockFormations.map((s, i) => (
          <Instance
            key={i}
            position={[s.x, baseY(s) + 0.35 * s.s, s.z]}
            rotation={[s.rot, s.rot * 0.7, 0]}
            scale={[s.s * 1.5, s.s * 0.6, s.s * 1.2]}
          />
        ))}
      </Instances>

      {/* Shimmering Golden Dust Motes */}
      <Sparkles count={45} scale={[70, 16, 70]} position={[desertCx, 8, desertCz]} size={4} speed={0.5} color="#ffd166" />
    </group>
  );
}

/* ── Frostfang Ridge — North (Glacial Monoliths & Snow Pines) ── */

const frostDef = BIOME_DEFS.find((b) => b.id === "frost_peaks")!;
const frostCx = (frostDef.bounds.minX + frostDef.bounds.maxX) / 2;
const frostCz = (frostDef.bounds.minZ + frostDef.bounds.maxZ) / 2;
const frostRadius = (frostDef.bounds.maxZ - frostDef.bounds.minZ) / 2.5;

const frostPines = scatterPatch(frostCx, frostCz, frostRadius, 35, 47);
const glacialMonoliths = scatterPatch(frostCx + 8, frostCz - 8, frostRadius * 0.7, 20, 89);

const pineFoliageMat = new THREE.MeshStandardMaterial({ color: "#2d6a4f", roughness: 0.8 });
const pineSnowMat = new THREE.MeshStandardMaterial({ color: "#f8f9fa", roughness: 0.6 });
const glacialIceMat = new THREE.MeshStandardMaterial({
  color: "#a0e7e5",
  emissive: "#48cae4",
  emissiveIntensity: 1.4,
  roughness: 0.15,
  metalness: 0.1,
  transparent: true,
  opacity: 0.88,
});

function FrostfangRidge() {
  return (
    <group>
      {/* Snow-covered Alpine Pine Trees */}
      {frostPines.map((s, i) => {
        const y = baseY(s);
        return (
          <group key={`pine-${i}`} position={[s.x, y, s.z]} rotation={[0, s.rot, 0]} scale={[s.s * 1.3, s.s * 1.3, s.s * 1.3]}>
            {/* Trunk */}
            <mesh castShadow receiveShadow material={palmTrunkMat} position={[0, 1.2, 0]}>
              <cylinderGeometry args={[0.18, 0.3, 2.4, 6]} />
            </mesh>
            {/* 3 Tier Cones with Snow Caps */}
            <mesh castShadow receiveShadow material={pineFoliageMat} position={[0, 2.4, 0]}>
              <coneGeometry args={[1.3, 1.8, 7]} />
            </mesh>
            <mesh position={[0, 2.7, 0]} material={pineSnowMat}>
              <coneGeometry args={[1.35, 0.4, 7]} />
            </mesh>
            <mesh castShadow receiveShadow material={pineFoliageMat} position={[0, 3.6, 0]}>
              <coneGeometry args={[1.0, 1.6, 7]} />
            </mesh>
            <mesh position={[0, 3.9, 0]} material={pineSnowMat}>
              <coneGeometry args={[1.05, 0.4, 7]} />
            </mesh>
          </group>
        );
      })}

      {/* Glowing Glacial Monoliths */}
      {glacialMonoliths.map((s, i) => {
        const y = baseY(s);
        return (
          <group key={`ice-${i}`} position={[s.x, y, s.z]} scale={[s.s * 1.4, s.s * 1.6, s.s * 1.4]}>
            <mesh castShadow receiveShadow material={glacialIceMat} position={[0, 2.2, 0]} rotation={[0.1, s.rot, -0.1]}>
              <cylinderGeometry args={[0.4, 0.9, 4.5, 6]} />
            </mesh>
          </group>
        );
      })}

      {/* Floating Snow Flurries */}
      <Sparkles count={55} scale={[65, 18, 65]} position={[frostCx, 10, frostCz]} size={4} speed={0.6} color="#e0fbfc" />
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
