import { Instances, Instance } from "@react-three/drei";
import { useMemo } from "react";
import { heightAt } from "@legend/engine";
import type { DistrictName } from "@legend/shared";
import { createWoodMaterial } from "../materials/createWoodMaterial";
import { createStoneMaterial } from "../materials/createStoneMaterial";

/**
 * Props — atmosphere props as primitive placeholders (barrels, crates, tents,
 * benches, fences, signposts, flags, lanterns). Composition-focused, not asset
 * quality. Instanced per-kind via drei <Instances> so hundreds cost few draws.
 *
 * Placement arrays are derived deterministically near district centers.
 */

interface PropSpot { x: number; z: number; rot?: number; }

/* Deterministic pseudo-random from a seed for stable layouts. */
function rand(seed: number): number {
  const s = Math.sin(seed * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

function scatter(center: { x: number; z: number }, radius: number, count: number, seed: number): PropSpot[] {
  const out: PropSpot[] = [];
  for (let i = 0; i < count; i++) {
    const ang = rand(seed + i) * Math.PI * 2;
    const r = Math.sqrt(rand(seed + i + 100)) * radius;
    out.push({
      x: center.x + Math.cos(ang) * r,
      z: center.z + Math.sin(ang) * r,
      rot: rand(seed + i + 50) * Math.PI * 2,
    });
  }
  return out;
}

const DISTRICT_CENTERS: { name: DistrictName; center: { x: number; z: number }; radius: number }[] = [
  { name: "market", center: { x: 22, z: 6 }, radius: 16 },
  { name: "central_plaza", center: { x: 0, z: -4 }, radius: 12 },
  { name: "residential", center: { x: 26, z: 18 }, radius: 14 },
  { name: "training", center: { x: -22, z: 18 }, radius: 12 },
  { name: "harbor", center: { x: 0, z: 40 }, radius: 14 },
];

export function Props() {
  const { barrels, crates, benches, fences, signposts, flags, lanterns, tents, banners, wells, carts, stalls } = useMemo(() => {
    const market = DISTRICT_CENTERS.find((d) => d.name === "market")!;
    const plaza = DISTRICT_CENTERS.find((d) => d.name === "central_plaza")!;
    const residential = DISTRICT_CENTERS.find((d) => d.name === "residential")!;
    const training = DISTRICT_CENTERS.find((d) => d.name === "training")!;
    const harbor = DISTRICT_CENTERS.find((d) => d.name === "harbor")!;

    return {
      barrels: [...scatter(market.center, market.radius, 14, 1), ...scatter(harbor.center, harbor.radius, 16, 101)],
      crates: [...scatter(market.center, market.radius, 10, 7), ...scatter(harbor.center, harbor.radius, 12, 107)],
      benches: scatter(plaza.center, plaza.radius, 8, 31),
      fences: scatter(residential.center, residential.radius, 30, 41),
      signposts: [
        { x: plaza.center.x + 6, z: plaza.center.z },
        { x: market.center.x - 12, z: market.center.z },
        { x: training.center.x + 8, z: training.center.z + 6 },
        { x: 0, z: -24, rot: Math.PI },
      ],
      flags: scatter(plaza.center, plaza.radius, 6, 61),
      lanterns: DISTRICT_CENTERS.flatMap((d, i) => scatter(d.center, d.radius, 5, 200 + i * 13)),
      tents: scatter(training.center, training.radius, 8, 71),
      banners: [
        { x: plaza.center.x - 5, z: plaza.center.z - 3, rot: 0 },
        { x: plaza.center.x + 5, z: plaza.center.z - 3, rot: 0 },
        { x: market.center.x, z: market.center.z - 8, rot: Math.PI / 8 },
        { x: harbor.center.x, z: harbor.center.z - 6, rot: 0 },
        { x: -10, z: -8, rot: 0 },
        { x: 10, z: -8, rot: 0 },
      ],
      wells: [
        { x: plaza.center.x, z: plaza.center.z, rot: 0 },
        { x: market.center.x - 4, z: market.center.z + 4, rot: 0 },
      ],
      carts: scatter(market.center, market.radius, 6, 311),
      stalls: scatter(market.center, market.radius, 10, 411),
    };
  }, []);

  return (
    <group>
      <Barrels spots={barrels} />
      <Crates spots={crates} />
      <Benches spots={benches} />
      <Fences spots={fences} />
      <Signposts spots={signposts} />
      <Flags spots={flags} />
      <Lanterns spots={lanterns} />
      <Tents spots={tents} />
      <Banners spots={banners} />
      <Wells spots={wells} />
      <Carts spots={carts} />
      <Stalls spots={stalls} />
    </group>
  );
}

// Shared procedural prop materials (one per kind, reused across all spots).
const woodMatDark = createWoodMaterial({ woodColor: 0x5a3a22, roughness: 0.88 });
const woodMatMid = createWoodMaterial({ woodColor: 0x6a4a2a, roughness: 0.85 });
const woodMatLight = createWoodMaterial({ woodColor: 0x8a6a3a, roughness: 0.82 });
const wellStoneMat = createStoneMaterial({ stoneColor: 0x4a4a4a, roughness: 0.95, flatShading: true });

function Barrels({ spots }: { spots: PropSpot[] }) {
  return (
    <Instances limit={spots.length} castShadow>
      <cylinderGeometry args={[0.4, 0.4, 1, 10]} />
      <primitive object={woodMatMid} attach="material" />
      {spots.map((s, i) => (
        <Instance key={i} position={[s.x, heightAt(s.x, s.z) + 0.5, s.z]} rotation={[0, s.rot ?? 0, 0]} />
      ))}
    </Instances>
  );
}

function Crates({ spots }: { spots: PropSpot[] }) {
  return (
    <Instances limit={spots.length} castShadow>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <primitive object={woodMatLight} attach="material" />
      {spots.map((s, i) => (
        <Instance key={i} position={[s.x, heightAt(s.x, s.z) + 0.4, s.z]} rotation={[0, s.rot ?? 0, 0]} />
      ))}
    </Instances>
  );
}

function Benches({ spots }: { spots: PropSpot[] }) {
  return (
    <Instances limit={spots.length} castShadow>
      <boxGeometry args={[1.6, 0.1, 0.4]} />
      <primitive object={woodMatDark} attach="material" />
      {spots.map((s, i) => (
        <Instance key={i} position={[s.x, heightAt(s.x, s.z) + 0.4, s.z]} rotation={[0, s.rot ?? 0, 0]} />
      ))}
    </Instances>
  );
}

function Fences({ spots }: { spots: PropSpot[] }) {
  return (
    <Instances limit={spots.length}>
      <boxGeometry args={[0.1, 0.6, 0.08]} />
      <primitive object={woodMatLight} attach="material" />
      {spots.map((s, i) => (
        <Instance key={i} position={[s.x, heightAt(s.x, s.z) + 0.3, s.z]} rotation={[0, s.rot ?? 0, 0]} />
      ))}
    </Instances>
  );
}

function Signposts({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          <mesh position={[0, 0.8, 0]} castShadow material={woodMatDark}>
            <cylinderGeometry args={[0.05, 0.05, 1.6, 5]} />
          </mesh>
          <mesh position={[0, 1.4, 0]} castShadow material={woodMatLight}>
            <boxGeometry args={[0.6, 0.25, 0.04]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Flags({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]}>
          <mesh position={[0, 2.2, 0]} material={woodMatDark}>
            <cylinderGeometry args={[0.04, 0.04, 4.4, 4]} />
          </mesh>
          <mesh position={[0.4, 3.3, 0]} rotation={[0, s.rot ?? 0, 0]}>
            <planeGeometry args={[0.8, 0.5]} />
            <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.25} side={2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Lanterns({ spots }: { spots: PropSpot[] }) {
  return (
    <Instances limit={spots.length} castShadow>
      <sphereGeometry args={[0.18, 8, 8]} />
      <meshStandardMaterial color="#d4af37" emissive="#f3c649" emissiveIntensity={0.9} />
      {spots.map((s, i) => (
        <Instance key={i} position={[s.x, heightAt(s.x, s.z) + 2.6, s.z]} />
      ))}
    </Instances>
  );
}

function Tents({ spots }: { spots: PropSpot[] }) {
  return (
    <Instances limit={spots.length} castShadow>
      <coneGeometry args={[1.4, 1.6, 4]} />
      <meshStandardMaterial color="#9a8a6a" roughness={0.95} flatShading />
      {spots.map((s, i) => (
        <Instance key={i} position={[s.x, heightAt(s.x, s.z) + 0.8, s.z]} rotation={[0, (s.rot ?? 0) + Math.PI / 4, 0]} />
      ))}
    </Instances>
  );
}

/** Hanging banner — crossbar pole + rune-embroidered cloth in art-bible gold. */
function Banners({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          {/* Post */}
          <mesh position={[0, 2, 0]} castShadow material={woodMatDark}>
            <cylinderGeometry args={[0.06, 0.06, 4, 6]} />
          </mesh>
          {/* Crossbar */}
          <mesh position={[0, 3.4, 0]} castShadow material={woodMatDark}>
            <cylinderGeometry args={[0.04, 0.04, 1.6, 5]} />
            {/* lie horizontal */}
            <group rotation={[0, 0, Math.PI / 2]} />
          </mesh>
          {/* Cloth — two-tone with gold stripe */}
          <mesh position={[0, 2.5, 0.02]}>
            <planeGeometry args={[1.2, 1.8]} />
            <meshStandardMaterial color="#1a3b66" emissive="#1a3b66" emissiveIntensity={0.15} roughness={0.8} side={2} />
          </mesh>
          <mesh position={[0, 2.5, 0.03]}>
            <planeGeometry args={[1.2, 0.2]} />
            <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.5} roughness={0.6} side={2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Stone wishing well — ring of stone + wooden roof + bucket rope. */
function Wells({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          {/* Stone base */}
          <mesh position={[0, 0.6, 0]} castShadow receiveShadow material={wellStoneMat}>
            <cylinderGeometry args={[1, 1.1, 1.2, 12]} />
          </mesh>
          {/* Water surface inside */}
          <mesh position={[0, 1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.8, 16]} />
            <meshStandardMaterial color="#1a3b66" metalness={0.5} roughness={0.2} />
          </mesh>
          {/* Two roof posts */}
          <mesh position={[-0.8, 1.6, 0]} castShadow material={woodMatDark}>
            <cylinderGeometry args={[0.08, 0.08, 1.4, 5]} />
          </mesh>
          <mesh position={[0.8, 1.6, 0]} castShadow material={woodMatDark}>
            <cylinderGeometry args={[0.08, 0.08, 1.4, 5]} />
          </mesh>
          {/* Conical thatch roof */}
          <mesh position={[0, 2.6, 0]} castShadow material={woodMatMid}>
            <coneGeometry args={[1.4, 0.8, 8]} />
          </mesh>
          {/* Bucket */}
          <mesh position={[0, 0.9, 0]} castShadow material={woodMatDark}>
            <cylinderGeometry args={[0.18, 0.14, 0.3, 6]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Wooden cart — plank bed + two spoked wheels + cargo crate. */
function Carts({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          {/* Bed */}
          <mesh position={[0, 0.6, 0]} castShadow receiveShadow material={woodMatMid}>
            <boxGeometry args={[1.6, 0.3, 2.4]} />
          </mesh>
          {/* Cargo */}
          <mesh position={[0, 1, 0]} castShadow material={woodMatLight}>
            <boxGeometry args={[1.2, 0.8, 1.4]} />
          </mesh>
          {/* Wheels */}
          <mesh position={[-0.7, 0.4, 0.8]} rotation={[0, 0, Math.PI / 2]} castShadow material={woodMatDark}>
            <torusGeometry args={[0.4, 0.1, 6, 12]} />
          </mesh>
          <mesh position={[0.7, 0.4, 0.8]} rotation={[0, 0, Math.PI / 2]} castShadow material={woodMatDark}>
            <torusGeometry args={[0.4, 0.1, 6, 12]} />
          </mesh>
          <mesh position={[-0.7, 0.4, -0.8]} rotation={[0, 0, Math.PI / 2]} castShadow material={woodMatDark}>
            <torusGeometry args={[0.4, 0.1, 6, 12]} />
          </mesh>
          <mesh position={[0.7, 0.4, -0.8]} rotation={[0, 0, Math.PI / 2]} castShadow material={woodMatDark}>
            <torusGeometry args={[0.4, 0.1, 6, 12]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Market stall — striped cloth canopy over a post frame + counter crate. */
const STALL_COLORS = ["#d4af37", "#c44a6a", "#2a9d8f", "#5daeff"];
function Stalls({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => {
        const color = STALL_COLORS[i % STALL_COLORS.length];
        return (
          <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
            {/* Four corner posts */}
            {[[-1, -0.8], [1, -0.8], [-1, 0.8], [1, 0.8]].map(([px, pz], j) => (
              <mesh key={j} position={[px, 1.1, pz]} castShadow material={woodMatDark}>
                <cylinderGeometry args={[0.06, 0.06, 2.2, 5]} />
              </mesh>
            ))}
            {/* Canopy */}
            <mesh position={[0, 2.2, 0]} rotation={[-0.15, 0, 0]} castShadow>
              <boxGeometry args={[2.4, 0.08, 2]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} roughness={0.7} />
            </mesh>
            {/* Counter */}
            <mesh position={[0, 0.6, 0]} castShadow receiveShadow material={woodMatDark}>
              <boxGeometry args={[2.2, 0.4, 1.4]} />
            </mesh>
            {/* Wares on counter (instanced spheres) */}
            <mesh position={[-0.6, 0.9, 0]}>
              <sphereGeometry args={[0.12, 6, 6]} />
              <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[0, 0.9, 0.2]}>
              <sphereGeometry args={[0.12, 6, 6]} />
              <meshStandardMaterial color="#c44a6a" emissive="#c44a6a" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0.6, 0.9, -0.1]}>
              <sphereGeometry args={[0.12, 6, 6]} />
              <meshStandardMaterial color="#2a9d8f" emissive="#2a9d8f" emissiveIntensity={0.2} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
