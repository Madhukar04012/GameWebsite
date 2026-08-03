import { Instances, Instance } from "@react-three/drei";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
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

function scatterPatch(center: { x: number; z: number }, radius: number, count: number, seed: number): Spot[] {
  const r = seedRand(seed);
  const out: Spot[] = [];
  for (let i = 0; i < count; i++) {
    const ang = r() * Math.PI * 2;
    const dist = Math.sqrt(r()) * radius;
    out.push({
      x: center.x + Math.cos(ang) * dist,
      z: center.z + Math.sin(ang) * dist,
      s: 0.7 + r() * 0.6,
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

const treeMat = createFoliageMaterial({ kind: "tree" });
const bushMat = createFoliageMaterial({ kind: "bush" });
const flowerMat = createFoliageMaterial({ kind: "flower", color: 0xffd700 });
const grassMat = createFoliageMaterial({ kind: "grass", color: 0x7bdc55 });
const rockMat = createStoneMaterial({ stoneColor: 0x8a8a8a, roughness: 0.95, flatShading: true });
const logMat = createWoodMaterial({ woodColor: 0x6a4a2a, roughness: 0.88 });

function baseY(spot: Spot) {
  return heightAt(spot.x, spot.z);
}

function Trees({ spots }: { spots: Spot[] }) {
  return (
    <Instances limit={Math.max(1, spots.length)} castShadow>
      <coneGeometry args={[0.8, 3, 8]} />
      <primitive object={treeMat} attach="material" />
      {spots.map((s, i) => (
        <Instance key={i} position={[s.x, baseY(s) + 1.5, s.z]} rotation={[0, s.rot, 0]} scale={[s.s, s.s, s.s]} />
      ))}
    </Instances>
  );
}

function Bushes({ spots }: { spots: Spot[] }) {
  return (
    <Instances limit={Math.max(1, spots.length)} castShadow>
      <sphereGeometry args={[0.6, 8, 8]} />
      <primitive object={bushMat} attach="material" />
      {spots.map((s, i) => (
        <Instance key={i} position={[s.x, baseY(s) + 0.6, s.z]} rotation={[0, s.rot, 0]} scale={[s.s, s.s, s.s]} />
      ))}
    </Instances>
  );
}

function Flowers({ spots }: { spots: Spot[] }) {
  return (
    <Instances limit={Math.max(1, spots.length)}>
      <coneGeometry args={[0.06, 0.5, 3]} />
      <primitive object={flowerMat} attach="material" />
      {spots.map((s, i) => (
        <Instance key={i} position={[s.x, baseY(s) + 0.25, s.z]} rotation={[0, s.rot, 0]} scale={[s.s, s.s, s.s]} />
      ))}
    </Instances>
  );
}

function Grass({ spots }: { spots: Spot[] }) {
  return (
    <Instances limit={Math.max(1, spots.length)}>
      <coneGeometry args={[0.1, 0.4, 3]} />
      <primitive object={grassMat} attach="material" />
      {spots.map((s, i) => (
        <Instance key={i} position={[s.x, baseY(s) + 0.2, s.z]} rotation={[0, s.rot, 0]} scale={[s.s, s.s, s.s]} />
      ))}
    </Instances>
  );
}

function Rocks({ spots }: { spots: Spot[] }) {
  return (
    <Instances limit={Math.max(1, spots.length)} castShadow>
      <dodecahedronGeometry args={[0.6, 0]} />
      <primitive object={rockMat} attach="material" />
      {spots.map((s, i) => (
        <Instance key={i} position={[s.x, baseY(s) + 0.3 * s.s, s.z]} rotation={[s.rot, s.rot, 0]} scale={[s.s, s.s * 0.7, s.s]} />
      ))}
    </Instances>
  );
}

function Logs({ spots }: { spots: Spot[] }) {
  return (
    <Instances limit={Math.max(1, spots.length)} castShadow>
      <cylinderGeometry args={[0.25, 0.25, 1.8, 6]} />
      <primitive object={logMat} attach="material" />
      {spots.map((s, i) => (
        <Instance key={i} position={[s.x, baseY(s) + 0.25, s.z]} rotation={[Math.PI / 2, s.rot, 0]} scale={[s.s, s.s, s.s]} />
      ))}
    </Instances>
  );
}

/** Advances a foliage material's uTime each frame using the patch's stable hook. */
function useFoliageClock(mat: import("three").MeshStandardMaterial) {
  useFrame(({ clock }) => {
    (mat as any).userData.__setUniform?.("uTime", clock.elapsedTime);
  });
}