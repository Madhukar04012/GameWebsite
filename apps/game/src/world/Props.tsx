import { Instances, Instance } from "@react-three/drei";
import { useMemo } from "react";
import { heightAt } from "@legend/engine";
import { createWoodMaterial } from "../materials/createWoodMaterial";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createMetalMaterial } from "../materials/createMetalMaterial";

interface PropSpot {
  x: number;
  z: number;
  rot?: number;
}

function rand(seed: number): number {
  const s = Math.sin(seed * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

function scatter(center: { x: number; z: number }, radius: number, count: number, seed: number): PropSpot[] {
  const out: PropSpot[] = [];
  for (let i = 0; i < count; i++) {
    const ang = rand(seed + i) * Math.PI * 2;
    const r = (0.2 + rand(seed + i + 100) * 0.8) * radius;
    out.push({
      x: center.x + Math.cos(ang) * r,
      z: center.z + Math.sin(ang) * r,
      rot: rand(seed + i + 50) * Math.PI * 2,
    });
  }
  return out;
}

export function Props() {
  const {
    barrels,
    crates,
    benches,
    trainingDummies,
    archeryTargets,
    weaponRacks,
    anvils,
    marketStalls,
    merchantCarts,
    noticeBoards,
    wishingWells,
  } = useMemo(() => {
    return {
      barrels: [
        ...scatter({ x: 24, z: 4 }, 14, 16, 10), // Market
        ...scatter({ x: 36, z: 10 }, 8, 10, 20), // Tavern
        ...scatter({ x: 0, z: 40 }, 12, 14, 30), // Harbor
      ],
      crates: [
        ...scatter({ x: 24, z: 4 }, 14, 18, 50), // Market
        ...scatter({ x: 0, z: 40 }, 12, 16, 60), // Harbor
        ...scatter({ x: 36, z: 10 }, 8, 8, 70), // Tavern
      ],
      benches: [
        { x: -6, z: -8, rot: 0 },
        { x: 6, z: -8, rot: 0 },
        { x: -6, z: 0, rot: Math.PI },
        { x: 6, z: 0, rot: Math.PI },
        { x: 26, z: -20, rot: Math.PI / 2 },
        { x: -26, z: -20, rot: -Math.PI / 2 },
      ],
      trainingDummies: [
        { x: -16, z: 20, rot: 0.3 },
        { x: -18, z: 23, rot: -0.5 },
        { x: -15, z: 25, rot: 0.8 },
      ],
      archeryTargets: [
        { x: -21, z: 30, rot: 0 },
        { x: -18, z: 30, rot: 0 },
        { x: -15, z: 30, rot: 0 },
      ],
      weaponRacks: [
        { x: -26, z: 20, rot: 0 },
        { x: -22, z: 16, rot: Math.PI / 2 },
      ],
      anvils: [
        { x: -36, z: 26, rot: 0 },
        { x: -33, z: 30, rot: 0.4 },
      ],
      marketStalls: [
        { x: 21, z: -2, rot: 0.1 },
        { x: 27, z: -1, rot: -0.2 },
        { x: 21, z: 7, rot: 0.2 },
        { x: 27, z: 8, rot: -0.1 },
        { x: 24, z: 12, rot: 0 },
      ],
      merchantCarts: [
        { x: 16, z: 2, rot: 0.4 },
        { x: 32, z: 5, rot: -0.3 },
        { x: -4, z: 36, rot: 0.2 },
      ],
      noticeBoards: [
        { x: -4, z: -4, rot: Math.PI / 4 }, // Plaza notice board
        { x: -26, z: -8, rot: 0 }, // Guild notice board
      ],
      wishingWells: [
        { x: 26, z: 20, rot: 0 }, // Residential well
      ],
    };
  }, []);

  return (
    <group>
      <InstancedBarrels spots={barrels} />
      <InstancedCrates spots={crates} />
      <PlazaBenches spots={benches} />
      <KnightTrainingDummies spots={trainingDummies} />
      <ArcheryTargets spots={archeryTargets} />
      <WeaponRacks spots={weaponRacks} />
      <BlacksmithAnvils spots={anvils} />
      <MarketStalls spots={marketStalls} />
      <MerchantCarts spots={merchantCarts} />
      <NoticeBoards spots={noticeBoards} />
      <WishingWells spots={wishingWells} />
    </group>
  );
}

const woodDark = createWoodMaterial({ woodColor: "#3a2416", roughness: 0.9 });
const woodMid = createWoodMaterial({ woodColor: "#5c3c24", roughness: 0.86 });
const woodLight = createWoodMaterial({ woodColor: "#8c6239", roughness: 0.82 });
const ironMat = createMetalMaterial({ kind: "iron" });
const goldMat = createMetalMaterial({ kind: "gold" });
const stoneMat = createStoneMaterial({ stoneColor: "#555248", roughness: 0.92 });

function InstancedBarrels({ spots }: { spots: PropSpot[] }) {
  return (
    <Instances limit={spots.length} castShadow>
      <cylinderGeometry args={[0.42, 0.48, 1.05, 10]} />
      <primitive object={woodMid} attach="material" />
      {spots.map((s, i) => (
        <Instance key={i} position={[s.x, heightAt(s.x, s.z) + 0.52, s.z]} rotation={[0, s.rot ?? 0, 0]} />
      ))}
    </Instances>
  );
}

function InstancedCrates({ spots }: { spots: PropSpot[] }) {
  return (
    <Instances limit={spots.length} castShadow>
      <boxGeometry args={[0.85, 0.85, 0.85]} />
      <primitive object={woodLight} attach="material" />
      {spots.map((s, i) => (
        <Instance key={i} position={[s.x, heightAt(s.x, s.z) + 0.42, s.z]} rotation={[0, s.rot ?? 0, 0]} />
      ))}
    </Instances>
  );
}

function PlazaBenches({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          {/* Bench seat */}
          <mesh position={[0, 0.45, 0]} castShadow material={woodMid}>
            <boxGeometry args={[1.8, 0.1, 0.5]} />
          </mesh>
          {/* Bench backrest */}
          <mesh position={[0, 0.85, -0.22]} castShadow material={woodMid}>
            <boxGeometry args={[1.8, 0.4, 0.08]} />
          </mesh>
          {/* Iron legs */}
          {[-0.75, 0.75].map((lx) => (
            <mesh key={lx} position={[lx, 0.22, 0]} castShadow material={ironMat}>
              <boxGeometry args={[0.08, 0.44, 0.45]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function KnightTrainingDummies({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          {/* Stand post */}
          <mesh position={[0, 1.0, 0]} castShadow material={woodDark}>
            <cylinderGeometry args={[0.08, 0.1, 2.0, 6]} />
          </mesh>
          {/* Straw torso */}
          <mesh position={[0, 1.4, 0]} castShadow material={woodLight}>
            <cylinderGeometry args={[0.35, 0.4, 1.0, 8]} />
          </mesh>
          {/* Dummy head */}
          <mesh position={[0, 2.05, 0]} castShadow material={woodLight}>
            <sphereGeometry args={[0.22, 8, 8]} />
          </mesh>
          {/* Wooden cross-arm holding target shields */}
          <mesh position={[0, 1.5, 0]} castShadow material={woodDark}>
            <boxGeometry args={[1.6, 0.1, 0.1]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ArcheryTargets({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          {/* Target stand */}
          <mesh position={[0, 0.9, -0.2]} rotation={[-0.2, 0, 0]} castShadow material={woodDark}>
            <boxGeometry args={[0.1, 1.8, 0.1]} />
          </mesh>
          {/* Target straw boss */}
          <mesh position={[0, 1.2, 0]} rotation={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.65, 0.65, 0.2, 16]} />
            <meshStandardMaterial color="#d4a373" roughness={0.9} />
          </mesh>
          {/* Target bullseye rings */}
          <mesh position={[0, 1.2, 0.11]}>
            <circleGeometry args={[0.45, 16]} />
            <meshStandardMaterial color="#e63946" />
          </mesh>
          <mesh position={[0, 1.2, 0.12]}>
            <circleGeometry args={[0.22, 16]} />
            <meshStandardMaterial color="#ffd166" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function WeaponRacks({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          {/* Timber frame */}
          <mesh position={[0, 0.9, 0]} castShadow material={woodDark}>
            <boxGeometry args={[1.8, 1.6, 0.5]} />
          </mesh>
          {/* Iron Halberds & Swords standing in rack */}
          {[-0.5, 0, 0.5].map((wx, j) => (
            <mesh key={j} position={[wx, 1.1, 0]} rotation={[0, 0, 0.1]} castShadow material={ironMat}>
              <boxGeometry args={[0.04, 2.2, 0.04]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function BlacksmithAnvils({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          {/* Wooden log base */}
          <mesh position={[0, 0.35, 0]} castShadow material={woodDark}>
            <cylinderGeometry args={[0.45, 0.5, 0.7, 10]} />
          </mesh>
          {/* Heavy Cast Iron Anvil */}
          <mesh position={[0, 0.82, 0]} castShadow material={ironMat}>
            <boxGeometry args={[0.8, 0.28, 0.35]} />
          </mesh>
          {/* Anvil Horn */}
          <mesh position={[0.45, 0.85, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow material={ironMat}>
            <coneGeometry args={[0.14, 0.35, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const STALL_FABRICS = ["#e63946", "#457b9d", "#2a9d8f", "#e76f51", "#f4a261"];
function MarketStalls({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => {
        const fabricColor = STALL_FABRICS[i % STALL_FABRICS.length];
        return (
          <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
            {/* Counter */}
            <mesh position={[0, 0.6, 0]} castShadow receiveShadow material={woodMid}>
              <boxGeometry args={[2.4, 0.4, 1.2]} />
            </mesh>
            {/* 4 Corner Posts */}
            {[[-1.1, -0.5], [1.1, -0.5], [-1.1, 0.5], [1.1, 0.5]].map(([px, pz], j) => (
              <mesh key={j} position={[px, 1.25, pz]} castShadow material={woodDark}>
                <cylinderGeometry args={[0.05, 0.05, 2.5, 6]} />
              </mesh>
            ))}
            {/* Fabric Canopy */}
            <mesh position={[0, 2.45, 0]} rotation={[-0.12, 0, 0]} castShadow>
              <boxGeometry args={[2.6, 0.08, 1.6]} />
              <meshStandardMaterial color={fabricColor} emissive={fabricColor} emissiveIntensity={0.25} roughness={0.7} />
            </mesh>
            {/* Wares on counter */}
            {[-0.6, 0, 0.6].map((wx, k) => (
              <mesh key={k} position={[wx, 0.92, 0]}>
                <sphereGeometry args={[0.14, 8, 8]} />
                <meshStandardMaterial color={k === 0 ? "#ffd166" : k === 1 ? "#06d6a0" : "#ef476f"} emissiveIntensity={0.3} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

function MerchantCarts({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          {/* Cart Bed */}
          <mesh position={[0, 0.6, 0]} castShadow material={woodMid}>
            <boxGeometry args={[1.6, 0.4, 2.4]} />
          </mesh>
          {/* Spoked Wheels */}
          {[-0.85, 0.85].map((wx) => (
            <mesh key={wx} position={[wx, 0.45, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={woodDark}>
              <torusGeometry args={[0.45, 0.08, 6, 12]} />
            </mesh>
          ))}
          {/* Cargo Crate inside cart */}
          <mesh position={[0, 1.0, 0]} castShadow material={woodLight}>
            <boxGeometry args={[1.2, 0.7, 1.6]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function NoticeBoards({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          {/* Timber Posts */}
          {[-0.7, 0.7].map((px) => (
            <mesh key={px} position={[px, 1.2, 0]} castShadow material={woodDark}>
              <cylinderGeometry args={[0.08, 0.08, 2.4, 6]} />
            </mesh>
          ))}
          {/* Wooden Board */}
          <mesh position={[0, 1.4, 0]} castShadow material={woodMid}>
            <boxGeometry args={[1.6, 1.2, 0.12]} />
          </mesh>
          {/* Pinned Parchments */}
          {[-0.4, 0.3].map((px, j) => (
            <mesh key={j} position={[px, 1.4 + j * 0.2, 0.07]}>
              <planeGeometry args={[0.35, 0.45]} />
              <meshStandardMaterial color="#f4ebd9" roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function WishingWells({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          {/* Stone Well Wall */}
          <mesh position={[0, 0.6, 0]} castShadow receiveShadow material={stoneMat}>
            <cylinderGeometry args={[1.2, 1.3, 1.2, 16]} />
          </mesh>
          {/* Water Surface inside */}
          <mesh position={[0, 0.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.95, 16]} />
            <meshStandardMaterial color="#0077b6" emissive="#00b4d8" emissiveIntensity={0.4} metalness={0.8} roughness={0.1} />
          </mesh>
          {/* Two Timber Posts */}
          {[-1.0, 1.0].map((px) => (
            <mesh key={px} position={[px, 1.8, 0]} castShadow material={woodDark}>
              <cylinderGeometry args={[0.09, 0.09, 1.6, 6]} />
            </mesh>
          ))}
          {/* Conical Roof */}
          <mesh position={[0, 2.9, 0]} castShadow material={woodMid}>
            <coneGeometry args={[1.6, 0.9, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
