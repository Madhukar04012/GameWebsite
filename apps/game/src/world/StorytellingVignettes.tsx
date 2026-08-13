import { useMemo } from "react";
import { Instances, Instance } from "@react-three/drei";
import * as THREE from "three";
import { heightAt } from "@legend/engine";
import { createWoodMaterial } from "../materials/createWoodMaterial";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createMetalMaterial } from "../materials/createMetalMaterial";
import { createFabricMaterial } from "../materials/createFabricMaterial";

/**
 * StorytellingVignettes — Handcrafted environmental storytelling vignettes.
 * Populates key city districts and outer trails with lore-rich prop groupings:
 * - Guard Checkpoints (barricades, shields, weapon racks at gates/intersections)
 * - Market & Trade Stalls (fabric awnings, food crates, potion bottles)
 * - Training Sparring Pits (archery targets with arrows, sparring dummies, weapon racks)
 * - Harbor Fishing Docks (tied rowboats, nets, fish barrels)
 * - Traveler Camps (broken wagon, campfire with embers, spilled barrels)
 * - Ancient Shrines (weathered stone obelisks with glowing rune crystals)
 */

interface VignetteSpot {
  x: number;
  z: number;
  rot?: number;
  scale?: number;
}

export function StorytellingVignettes() {
  const materials = useMemo(() => ({
    wood: createWoodMaterial({ woodColor: "#3a2618", roughness: 0.88, seed: [11, 1] }),
    darkWood: createWoodMaterial({ woodColor: "#22150c", roughness: 0.92, seed: [11, 2] }),
    stone: createStoneMaterial({ stoneColor: "#8c8275", roughness: 0.85, seed: [11, 3] }),
    metal: createMetalMaterial({ kind: "iron", seed: [11, 4] }),
    gold: createMetalMaterial({ kind: "gold", seed: [11, 5] }),
    fabricRed: createFabricMaterial({ kind: "banner", color: "#8a2a2a", seed: [11, 6] }),
    fabricBlue: createFabricMaterial({ kind: "tent", color: "#2b4c7e", seed: [11, 7] }),
    fabricYellow: createFabricMaterial({ kind: "tent", color: "#d4af37", seed: [11, 8] }),
    ember: new THREE.MeshBasicMaterial({ color: "#ff5500" }),
    crystalRune: new THREE.MeshStandardMaterial({
      color: "#00e5ff",
      emissive: "#00aaff",
      emissiveIntensity: 1.5,
      roughness: 0.2,
      metalness: 0.8,
    }),
  }), []);

  // Preset locations anchored to world regions
  const checkpoints: VignetteSpot[] = [
    { x: 0, z: 22, rot: 0 },         // South Gate Inner Checkpoint
    { x: -18, z: 28, rot: Math.PI / 4 }, // West Road Fork
    { x: 18, z: 28, rot: -Math.PI / 4 },// East Road Fork
  ];

  const marketStalls: VignetteSpot[] = [
    { x: 20, z: 4, rot: 0 },
    { x: 26, z: 8, rot: Math.PI / 2 },
    { x: 22, z: 12, rot: -Math.PI / 4 },
  ];

  const trainingPits: VignetteSpot[] = [
    { x: -24, z: 14, rot: 0 },
    { x: -20, z: 20, rot: Math.PI / 3 },
  ];

  const fishingDocks: VignetteSpot[] = [
    { x: -6, z: 42, rot: Math.PI / 6 },
    { x: 6, z: 42, rot: -Math.PI / 6 },
  ];

  const travelerCamps: VignetteSpot[] = [
    { x: -45, z: 60, rot: 0.5 },
    { x: 50, z: 65, rot: -0.8 },
  ];

  const ancientShrines: VignetteSpot[] = [
    { x: -75, z: -40, rot: 0 }, // Whistling Woods Shrine
    { x: 80, z: -60, rot: 1.2 }, // Gloomwood Swamp Shrine
  ];

  return (
    <group>
      {/* 🛡️ Guard Checkpoints */}
      {checkpoints.map((spot, i) => (
        <GuardCheckpoint key={`chk-${i}`} spot={spot} materials={materials} />
      ))}

      {/* 🎪 Market Vignettes */}
      {marketStalls.map((spot, i) => (
        <MarketVignette key={`mkt-${i}`} spot={spot} materials={materials} idx={i} />
      ))}

      {/* 🎯 Training Sparring Pits */}
      {trainingPits.map((spot, i) => (
        <TrainingVignette key={`trn-${i}`} spot={spot} materials={materials} />
      ))}

      {/* 🎣 Fishing Docks */}
      {fishingDocks.map((spot, i) => (
        <FishingVignette key={`fsh-${i}`} spot={spot} materials={materials} />
      ))}

      {/* 🏕️ Traveler Camps & Broken Wagons */}
      {travelerCamps.map((spot, i) => (
        <TravelerCampVignette key={`cmp-${i}`} spot={spot} materials={materials} />
      ))}

      {/* 🔮 Ancient Shrines */}
      {ancientShrines.map((spot, i) => (
        <AncientShrineVignette key={`shr-${i}`} spot={spot} materials={materials} />
      ))}
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────
   Individual Vignette Components
   ───────────────────────────────────────────────────────────── */

function GuardCheckpoint({ spot, materials }: { spot: VignetteSpot; materials: any }) {
  const y = heightAt(spot.x, spot.z);
  const rot = spot.rot || 0;

  return (
    <group position={[spot.x, y, spot.z]} rotation={[0, rot, 0]}>
      {/* Wooden Barricade Spike Barrier */}
      <group position={[0, 0, 0]}>
        <mesh position={[-1.2, 0.4, 0]} rotation={[0, 0, Math.PI / 4]} material={materials.wood} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 1.8, 6]} />
        </mesh>
        <mesh position={[1.2, 0.4, 0]} rotation={[0, 0, -Math.PI / 4]} material={materials.wood} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 1.8, 6]} />
        </mesh>
        <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.darkWood} castShadow>
          <boxGeometry args={[0.15, 2.8, 0.15]} />
        </mesh>
      </group>

      {/* Weapon Rack with Shield */}
      <group position={[1.8, 0, 0.5]}>
        <mesh position={[0, 0.6, 0]} material={materials.wood} castShadow>
          <boxGeometry args={[0.1, 1.2, 0.8]} />
        </mesh>
        {/* Guard Shield */}
        <mesh position={[0.08, 0.6, 0]} rotation={[0, Math.PI / 2, 0]} material={materials.fabricRed} castShadow>
          <cylinderGeometry args={[0.3, 0.2, 0.05, 6]} />
        </mesh>
        {/* Iron Spear */}
        <mesh position={[-0.05, 0.8, 0.15]} rotation={[0, 0, 0.1]} material={materials.metal} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 2.0, 6]} />
        </mesh>
      </group>
    </group>
  );
}

function MarketVignette({ spot, materials, idx }: { spot: VignetteSpot; materials: any; idx: number }) {
  const y = heightAt(spot.x, spot.z);
  const rot = spot.rot || 0;
  const awningMat = idx % 2 === 0 ? materials.fabricBlue : materials.fabricYellow;

  return (
    <group position={[spot.x, y, spot.z]} rotation={[0, rot, 0]}>
      {/* Wooden Stall Counter */}
      <mesh position={[0, 0.5, 0]} material={materials.wood} castShadow receiveShadow>
        <boxGeometry args={[2.2, 1.0, 1.0]} />
      </mesh>

      {/* Fabric Awning Roof */}
      <mesh position={[0, 2.2, 0]} rotation={[0.1, 0, 0]} material={awningMat} castShadow>
        <boxGeometry args={[2.5, 0.1, 1.4]} />
      </mesh>

      {/* Wooden Support Posts */}
      <mesh position={[-1.1, 1.2, -0.4]} material={materials.wood}>
        <cylinderGeometry args={[0.04, 0.04, 2.2, 6]} />
      </mesh>
      <mesh position={[1.1, 1.2, -0.4]} material={materials.wood}>
        <cylinderGeometry args={[0.04, 0.04, 2.2, 6]} />
      </mesh>
      <mesh position={[-1.1, 1.2, 0.4]} material={materials.wood}>
        <cylinderGeometry args={[0.04, 0.04, 2.2, 6]} />
      </mesh>
      <mesh position={[1.1, 1.2, 0.4]} material={materials.wood}>
        <cylinderGeometry args={[0.04, 0.04, 2.2, 6]} />
      </mesh>

      {/* Counter Goods: Crate & Potion Bottles */}
      <mesh position={[-0.6, 1.15, 0]} material={materials.darkWood} castShadow>
        <boxGeometry args={[0.4, 0.3, 0.4]} />
      </mesh>
      <mesh position={[0.4, 1.1, 0]} material={materials.gold} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.25, 8]} />
      </mesh>
    </group>
  );
}

function TrainingVignette({ spot, materials }: { spot: VignetteSpot; materials: any }) {
  const y = heightAt(spot.x, spot.z);
  const rot = spot.rot || 0;

  return (
    <group position={[spot.x, y, spot.z]} rotation={[0, rot, 0]}>
      {/* Straw & Wood Sparring Dummy */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 0.8, 0]} material={materials.wood} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 1.6, 6]} />
        </mesh>
        {/* Dummy Crossbar Arms */}
        <mesh position={[0, 1.2, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.wood} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.2, 6]} />
        </mesh>
        {/* Straw Target Head */}
        <mesh position={[0, 1.7, 0]} material={materials.darkWood} castShadow>
          <sphereGeometry args={[0.2, 8, 8]} />
        </mesh>
      </group>

      {/* Archery Target Board */}
      <group position={[2.5, 0, 0]} rotation={[0, -Math.PI / 6, 0]}>
        <mesh position={[0, 1.1, 0]} rotation={[0, 0, 0]} material={materials.fabricRed} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.08, 16]} />
        </mesh>
        <mesh position={[0, 0.6, -0.2]} rotation={[0.2, 0, 0]} material={materials.wood} castShadow>
          <boxGeometry args={[0.1, 1.2, 0.1]} />
        </mesh>
      </group>
    </group>
  );
}

function FishingVignette({ spot, materials }: { spot: VignetteSpot; materials: any }) {
  const y = heightAt(spot.x, spot.z);
  const rot = spot.rot || 0;

  return (
    <group position={[spot.x, y, spot.z]} rotation={[0, rot, 0]}>
      {/* Small Wooden Rowboat */}
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, 0]} material={materials.darkWood} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.4, 2.6]} />
      </mesh>
      {/* Fish Barrel */}
      <mesh position={[0.9, 0.4, 0.5]} material={materials.wood} castShadow>
        <cylinderGeometry args={[0.3, 0.28, 0.8, 10]} />
      </mesh>
    </group>
  );
}

function TravelerCampVignette({ spot, materials }: { spot: VignetteSpot; materials: any }) {
  const y = heightAt(spot.x, spot.z);
  const rot = spot.rot || 0;

  return (
    <group position={[spot.x, y, spot.z]} rotation={[0, rot, 0]}>
      {/* Campfire Stone Ring */}
      <mesh position={[0, 0.1, 0]} material={materials.stone} receiveShadow>
        <torusGeometry args={[0.5, 0.12, 8, 12]} />
      </mesh>
      {/* Glowing Embers */}
      <mesh position={[0, 0.08, 0]} material={materials.ember}>
        <cylinderGeometry args={[0.35, 0.35, 0.05, 8]} />
      </mesh>

      {/* Log Seats around Campfire */}
      <mesh position={[1.1, 0.15, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.wood} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 1.2, 8]} />
      </mesh>
      <mesh position={[-1.1, 0.15, 0.4]} rotation={[0, Math.PI / 4, Math.PI / 2]} material={materials.wood} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 1.2, 8]} />
      </mesh>

      {/* Spilled Barrel & Broken Wheel */}
      <group position={[-2.2, 0.2, -1.0]} rotation={[0.4, 0.2, Math.PI / 2]}>
        <mesh material={materials.wood} castShadow>
          <cylinderGeometry args={[0.3, 0.28, 0.8, 10]} />
        </mesh>
      </group>
    </group>
  );
}

function AncientShrineVignette({ spot, materials }: { spot: VignetteSpot; materials: any }) {
  const y = heightAt(spot.x, spot.z);
  const rot = spot.rot || 0;

  return (
    <group position={[spot.x, y, spot.z]} rotation={[0, rot, 0]}>
      {/* Weathered Stone Obelisk Pedestal */}
      <mesh position={[0, 1.2, 0]} material={materials.stone} castShadow receiveShadow>
        <boxGeometry args={[1.0, 2.4, 1.0]} />
      </mesh>
      {/* Step Base */}
      <mesh position={[0, 0.2, 0]} material={materials.stone} receiveShadow>
        <boxGeometry args={[2.0, 0.4, 2.0]} />
      </mesh>

      {/* Floating Glowing Magic Rune Crystal */}
      <mesh position={[0, 2.8, 0]} rotation={[Math.PI / 4, Math.PI / 4, 0]} material={materials.crystalRune}>
        <octahedronGeometry args={[0.4, 0]} />
      </mesh>
    </group>
  );
}
