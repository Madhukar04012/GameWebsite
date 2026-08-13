import { Instances, Instance } from "@react-three/drei";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { heightAt } from "@legend/engine";
import { VEGETATION_PATCHES, type VegKind } from "@legend/shared";
import { createFoliageMaterial } from "../materials/createFoliageMaterial";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createWoodMaterial } from "../materials/createWoodMaterial";

/**
 * Vegetation — instanced placeholder trees, bushes, flowers, grass, rocks, logs.
 *
 * Instances are seeded/scattered from VEGETATION_PATCHES so layouts are stable
 * across reloads. Every patch is one <Instances> draw call regardless of count
 * (P12 perf). LOD-ready: swap geometry per distance bucket later.
 */
function seedRand(seed: number) {
  return () => {
    const s = Math.sin((seed += 1) * 127.1) * 43758.5453;
    return s - Math.floor(s);
  };
}

interface Spot { x: number; z: number; s: number; rot: number; }

/** Authoritative terrain & city collision validator */
function isClearGround(x: number, z: number): boolean {
  // 1. City wall & district exclusion zone
  const distToCity = Math.sqrt(x * x + z * z);
  if (distToCity < 50) return false;

  // 2. River channel exclusion
  const riverX = -40 + Math.sin(z * 0.02) * 18 + Math.cos(z * 0.05) * 8;
  if (Math.abs(x - riverX) < 10) return false;

  // 3. South Gate primary roadway corridor
  if (Math.abs(x) < 6 && z > -85 && z < -40) return false;

  // 4. Steep cliff face exclusion
  const h = heightAt(x, z);
  const hN = heightAt(x, z + 1);
  if (Math.abs(h - hN) > 1.8) return false;

  return true;
}

function scatterPatch(center: { x: number; z: number }, radius: number, count: number, seed: number): Spot[] {
  const r = seedRand(seed);
  const out: Spot[] = [];
  let attempts = 0;
  while (out.length < count && attempts < count * 3) {
    attempts++;
    const ang = r() * Math.PI * 2;
    const dist = Math.sqrt(r()) * radius;
    const px = center.x + Math.cos(ang) * dist;
    const pz = center.z + Math.sin(ang) * dist;
    if (!isClearGround(px, pz)) continue;

    out.push({
      x: px,
      z: pz,
      s: 0.8 + r() * 0.5,
      rot: r() * Math.PI * 2,
    });
  }
  return out;
}

export function Vegetation() {
  const groups = useMemo(() => {
    const byKind = new Map<VegKind, Spot[]>();
    for (const patch of VEGETATION_PATCHES) {
      const spots = scatterPatch(patch.center, patch.radius, patch.count, Number(patch.id.split("-").pop()));
      byKind.set(patch.kind, spots);
    }
    return byKind;
  }, []);

  return (
    <group>
      {groups.get("tree") && <Trees spots={groups.get("tree")!} />}
      {groups.get("bush") && <Bushes spots={groups.get("bush")!} />}
      {groups.get("flower") && <Flowers spots={groups.get("flower")!} />}
      {groups.get("grass") && <Grass spots={groups.get("grass")!} />}
      {groups.get("rock") && <Rocks spots={groups.get("rock")!} />}
      {groups.get("log") && <Logs spots={groups.get("log")!} />}
    </group>
  );
}

const treeFoliageMat = createFoliageMaterial({ kind: "tree", color: "#2d7a2f" });
const treeTrunkMat = createWoodMaterial({ woodColor: "#3a2618", roughness: 0.92 });
const bushMat = createFoliageMaterial({ kind: "bush", color: "#388e3c" });
const flowerPetalMat = new THREE.MeshStandardMaterial({ color: "#e91e63", roughness: 0.5 });
const flowerGoldMat = new THREE.MeshStandardMaterial({ color: "#fbc02d", roughness: 0.4 });
const grassTuftMat = createFoliageMaterial({ kind: "grass", color: "#4caf50", side: THREE.DoubleSide });
const rockMat = createStoneMaterial({ stoneColor: "#616161", roughness: 0.88, flatShading: true });
const logMat = createWoodMaterial({ woodColor: "#4e342e", roughness: 0.9 });

function baseY(spot: Spot) {
  return heightAt(spot.x, spot.z);
}

function Trees({ spots }: { spots: Spot[] }) {
  return (
    <group>
      {spots.map((s, i) => {
        const y = baseY(s);
        return (
          <group key={`tree-${i}`} position={[s.x, y, s.z]} rotation={[0, s.rot, 0]} scale={[s.s, s.s, s.s]}>
            {/* Root Flare Base */}
            <mesh castShadow receiveShadow material={treeTrunkMat} position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.32, 0.52, 0.6, 8]} />
            </mesh>
            {/* Tapered Wooden Trunk */}
            <mesh castShadow receiveShadow material={treeTrunkMat} position={[0, 1.8, 0]}>
              <cylinderGeometry args={[0.22, 0.34, 2.6, 8]} />
            </mesh>
            {/* Sculpted 3-Tier Canopy Cloud Masses */}
            <mesh castShadow receiveShadow material={treeFoliageMat} position={[0, 2.8, 0]}>
              <sphereGeometry args={[1.5, 10, 10]} />
            </mesh>
            <mesh castShadow receiveShadow material={treeFoliageMat} position={[0.2, 3.8, -0.15]}>
              <sphereGeometry args={[1.15, 9, 9]} />
            </mesh>
            <mesh castShadow receiveShadow material={treeFoliageMat} position={[-0.15, 4.6, 0.15]}>
              <sphereGeometry args={[0.8, 8, 8]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Bushes({ spots }: { spots: Spot[] }) {
  return (
    <group>
      {spots.map((s, i) => {
        const y = baseY(s);
        return (
          <group key={`bush-${i}`} position={[s.x, y, s.z]} rotation={[0, s.rot, 0]} scale={[s.s, s.s, s.s]}>
            <mesh castShadow receiveShadow material={bushMat} position={[0, 0.45, 0]}>
              <sphereGeometry args={[0.55, 8, 8]} />
            </mesh>
            <mesh castShadow receiveShadow material={bushMat} position={[0.3, 0.35, 0]}>
              <sphereGeometry args={[0.4, 7, 7]} />
            </mesh>
            <mesh castShadow receiveShadow material={bushMat} position={[-0.25, 0.35, 0.2]}>
              <sphereGeometry args={[0.38, 7, 7]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Flowers({ spots }: { spots: Spot[] }) {
  return (
    <group>
      {spots.map((s, i) => {
        const y = baseY(s);
        const mat = i % 2 === 0 ? flowerPetalMat : flowerGoldMat;
        return (
          <group key={`flw-${i}`} position={[s.x, y, s.z]} rotation={[0, s.rot, 0]} scale={[s.s * 1.2, s.s * 1.2, s.s * 1.2]}>
            {/* Green Stem */}
            <mesh position={[0, 0.2, 0]} material={grassTuftMat}>
              <cylinderGeometry args={[0.02, 0.02, 0.4, 4]} />
            </mesh>
            {/* Flower Blossom Head */}
            <mesh position={[0, 0.4, 0]} material={mat}>
              <sphereGeometry args={[0.12, 6, 6]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Grass({ spots }: { spots: Spot[] }) {
  return (
    <group>
      {spots.map((s, i) => {
        const y = baseY(s);
        return (
          <group key={`grs-${i}`} position={[s.x, y, s.z]} rotation={[0, s.rot, 0]} scale={[s.s * 1.4, s.s * 1.4, s.s * 1.4]}>
            {/* Crossed Blade Cluster */}
            <mesh position={[0, 0.3, 0]} material={grassTuftMat}>
              <planeGeometry args={[0.55, 0.6]} />
            </mesh>
            <mesh position={[0, 0.3, 0]} rotation={[0, Math.PI / 2, 0]} material={grassTuftMat}>
              <planeGeometry args={[0.55, 0.6]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function Rocks({ spots }: { spots: Spot[] }) {
  return (
    <Instances limit={Math.max(1, spots.length)} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.7, 0]} />
      <primitive object={rockMat} attach="material" />
      {spots.map((s, i) => (
        <Instance key={i} position={[s.x, baseY(s) + 0.35 * s.s, s.z]} rotation={[s.rot, s.rot * 0.7, 0]} scale={[s.s * 1.2, s.s * 0.8, s.s * 1.1]} />
      ))}
    </Instances>
  );
}

function Logs({ spots }: { spots: Spot[] }) {
  return (
    <Instances limit={Math.max(1, spots.length)} castShadow receiveShadow>
      <cylinderGeometry args={[0.25, 0.28, 2.0, 7]} />
      <primitive object={logMat} attach="material" />
      {spots.map((s, i) => (
        <Instance key={i} position={[s.x, baseY(s) + 0.25, s.z]} rotation={[Math.PI / 2, s.rot, 0]} scale={[s.s, s.s, s.s]} />
      ))}
    </Instances>
  );
}