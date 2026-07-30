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
    for (const p of VEGETATION_PATCHES) {
      const spots = scatterPatch(p.center, p.radius, p.count, p.id.length * 37 + p.kind.length);
      byKind.set(p.kind, [...(byKind.get(p.kind) ?? []), ...spots]);
    }
    return byKind;
  }, []);

  return (
    <group>
      <Trees spots={groups.get("tree") ?? []} />
      <Bushes spots={groups.get("bush") ?? []} />
      <Flowers spots={groups.get("flower") ?? []} />
      <Grass spots={groups.get("grass") ?? []} />
      <Rocks spots={groups.get("rock") ?? []} />
      <Logs spots={groups.get("log") ?? []} />
    </group>
  );
}

function baseY(s: Spot) { return heightAt(s.x, s.z); }

// Foliage materials with GPU wind sway. Time is advanced per-frame in the
// owning component so every instance sways in sync from one clock pass.
function Trees({ spots }: { spots: Spot[] }) {
  const mat = useMemo(() => createFoliageMaterial({ kind: "tree", color: "#2a4a2a" }), []);
  useFoliageClock(mat);
  return (
    <group>
      {/* Bottom Tier */}
      <Instances limit={Math.max(1, spots.length)} castShadow>
        <coneGeometry args={[1.6, 5, 7]} />
        <primitive object={mat} attach="material" />
        {spots.map((s, i) => (
          <Instance key={i} position={[s.x, baseY(s) + 2.5 * s.s, s.z]} scale={[s.s, s.s * 1.6, s.s]} rotation={[0, s.rot, 0]} />
        ))}
      </Instances>
      {/* Middle Tier */}
      <Instances limit={Math.max(1, spots.length)} castShadow>
        <coneGeometry args={[1.3, 4, 7]} />
        <primitive object={mat} attach="material" />
        {spots.map((s, i) => (
          <Instance key={i} position={[s.x, baseY(s) + 5.0 * s.s, s.z]} scale={[s.s, s.s * 1.5, s.s]} rotation={[0, s.rot + 1, 0]} />
        ))}
      </Instances>
      {/* Top Tier */}
      <Instances limit={Math.max(1, spots.length)} castShadow>
        <coneGeometry args={[0.9, 3, 7]} />
        <primitive object={mat} attach="material" />
        {spots.map((s, i) => (
          <Instance key={i} position={[s.x, baseY(s) + 7.0 * s.s, s.z]} scale={[s.s, s.s * 1.4, s.s]} rotation={[0, s.rot + 2, 0]} />
        ))}
      </Instances>
    </group>
  );
}

function Bushes({ spots }: { spots: Spot[] }) {
  const mat = useMemo(() => createFoliageMaterial({ kind: "bush", color: "#3a6a3a" }), []);
  useFoliageClock(mat);
  return (
    <group>
      <Instances limit={Math.max(1, spots.length)} castShadow>
        <sphereGeometry args={[0.7, 8, 6]} />
        <primitive object={mat} attach="material" />
        {spots.map((s, i) => (
          <Instance key={i} position={[s.x, baseY(s) + 0.4, s.z]} scale={[s.s, s.s * 0.7, s.s]} />
        ))}
      </Instances>
      <Instances limit={Math.max(1, spots.length)} castShadow>
        <sphereGeometry args={[0.5, 8, 6]} />
        <primitive object={mat} attach="material" />
        {spots.map((s, i) => (
          <Instance key={i} position={[s.x + 0.4 * s.s, baseY(s) + 0.3, s.z + 0.3 * s.s]} scale={[s.s, s.s * 0.7, s.s]} />
        ))}
      </Instances>
    </group>
  );
}

function Flowers({ spots }: { spots: Spot[] }) {
  const palette = ["#d4af37", "#c44a6a", "#6a9a4a", "#8a6ac4", "#c47a4a"];
  return (
    <Instances limit={Math.max(1, spots.length)}>
      <sphereGeometry args={[0.08, 6, 6]} />
      <meshStandardMaterial color="#d4af37" emissive="#f3c649" emissiveIntensity={0.35} roughness={0.8} />
      {spots.map((s, i) => (
        <Instance key={i} position={[s.x, baseY(s) + 0.3, s.z]} color={palette[i % palette.length]} />
      ))}
    </Instances>
  );
}

function Grass({ spots }: { spots: Spot[] }) {
  const mat = useMemo(() => createFoliageMaterial({ kind: "grass", color: "#4a8a4a" }), []);
  useFoliageClock(mat);
  
  // Expand each spot into a small cluster for dense grass
  const clusters = useMemo(() => {
    const arr: { x: number; z: number; y: number; s: number; rot: number }[] = [];
    spots.forEach(s => {
      // Create 6 blades per spot
      for(let i=0; i<6; i++) {
        const ox = (Math.random() - 0.5) * 1.5;
        const oz = (Math.random() - 0.5) * 1.5;
        arr.push({
          x: s.x + ox,
          z: s.z + oz,
          y: heightAt(s.x + ox, s.z + oz) + 0.2,
          s: s.s * (0.8 + Math.random() * 0.4),
          rot: s.rot + Math.random() * Math.PI,
        });
      }
    });
    return arr;
  }, [spots]);

  return (
    <Instances limit={Math.max(1, clusters.length)}>
      <coneGeometry args={[0.06, 0.5, 3]} />
      <primitive object={mat} attach="material" />
      {clusters.map((s, i) => (
        <Instance key={i} position={[s.x, s.y, s.z]} rotation={[0, s.rot, 0]} scale={[s.s, s.s, s.s]} />
      ))}
    </Instances>
  );
}

const rockMat = createStoneMaterial({ stoneColor: 0x8a8a8a, roughness: 0.95, flatShading: true });
const logMat = createWoodMaterial({ woodColor: 0x6a4a2a, roughness: 0.88 });

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
