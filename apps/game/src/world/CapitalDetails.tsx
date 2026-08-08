import { useMemo } from "react";
import { CITY_LAYOUT } from "@legend/shared";
import { heightAt } from "@legend/engine";
import { createFabricMaterial } from "../materials/createFabricMaterial";
import { createMetalMaterial } from "../materials/createMetalMaterial";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createWoodMaterial } from "../materials/createWoodMaterial";

const gardenStone = createStoneMaterial({ stoneColor: "#d8cab6", roughness: 0.84, seed: [18, 7] });
const gardenWood = createWoodMaterial({ woodColor: "#3b2418", roughness: 0.9 });
const gardenLeaf = createStoneMaterial({ stoneColor: "#356044", roughness: 0.95, seed: [4, 12] });
const gold = createMetalMaterial({ kind: "gold", emissive: "#d4af37", emissiveIntensity: 0.35 });

const DISTRICT_COLORS: Record<string, string> = {
  castle: "#b9a77a",
  guild_hall: "#8b5b3e",
  market: "#d18b3d",
  noble: "#b79ac9",
  training: "#9a6b46",
  blacksmith: "#cf6338",
  residential: "#779c6b",
  inn: "#d4af37",
  harbor: "#5ca6b9",
};

/** High-signal Capital details: district thresholds, royal gardens, and skyline pennants. */
export function CapitalDetails() {
  return (
    <group>
      <RoyalGardens />
      {CITY_LAYOUT.filter((district) => district.name !== "central_plaza").map((district) => (
        <DistrictMarker key={district.name} district={district} />
      ))}
    </group>
  );
}

function DistrictMarker({ district }: { district: (typeof CITY_LAYOUT)[number] }) {
  const color = DISTRICT_COLORS[district.name] ?? district.color;
  const y = heightAt(district.center.x, district.center.z) + 0.04;
  const banner = useMemo(
    () => createFabricMaterial({ kind: "banner", color, roughness: 0.88, side: 2, seed: [district.center.x, district.center.z] }),
    [color, district.center.x, district.center.z],
  );

  return (
    <group position={[district.center.x, y, district.center.z]}>
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow material={gardenStone}>
        <cylinderGeometry args={[0.7, 0.82, 0.5, 8]} />
      </mesh>
      <mesh position={[0, 1.65, 0]} castShadow material={gardenWood}>
        <cylinderGeometry args={[0.07, 0.09, 2.5, 6]} />
      </mesh>
      <mesh position={[0.04, 2.15, 0]} rotation={[0, 0.04, 0]} material={banner}>
        <planeGeometry args={[0.9, 1.1]} />
      </mesh>
      <mesh position={[0, 2.72, 0]} castShadow material={gold}>
        <octahedronGeometry args={[0.13, 0]} />
      </mesh>
    </group>
  );
}

function RoyalGardens() {
  const hedges = useMemo(
    () => [
      [-24, -25, 12, 0.8], [24, -25, 12, 0.8],
      [-24, -25, 0.8, 12], [24, -25, 0.8, 12],
      [-17, -25, 0.8, 12], [17, -25, 0.8, 12],
    ] as [number, number, number, number][],
    [],
  );
  const trees = useMemo(
    () => [-20, -12, 12, 20].map((x, i) => ({ x, z: -22 + (i % 2) * 5, scale: 0.9 + (i % 3) * 0.15 })),
    [],
  );
  return (
    <group>
      <mesh position={[0, heightAt(0, -25) + 0.015, -25]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={gardenStone}>
        <planeGeometry args={[52, 18]} />
      </mesh>
      {hedges.map(([x, z, w, d], i) => (
        <mesh key={`hedge-${i}`} position={[x, heightAt(x, z) + 0.55, z]} castShadow receiveShadow material={gardenLeaf}>
          <boxGeometry args={[w, 1.1, d]} />
        </mesh>
      ))}
      {trees.map((tree, i) => (
        <group key={`garden-tree-${i}`} position={[tree.x, heightAt(tree.x, tree.z), tree.z]} scale={tree.scale}>
          <mesh position={[0, 2.2, 0]} castShadow material={gardenWood}>
            <cylinderGeometry args={[0.22, 0.34, 4.4, 8]} />
          </mesh>
          <mesh position={[0, 4.65, 0]} castShadow material={gardenLeaf}>
            <icosahedronGeometry args={[1.5, 1]} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, heightAt(0, -25) + 0.3, -25]} castShadow receiveShadow material={gardenStone}>
        <cylinderGeometry args={[2.5, 2.8, 0.6, 12]} />
      </mesh>
      <mesh position={[0, heightAt(0, -25) + 0.66, -25]} castShadow material={gold}>
        <cylinderGeometry args={[1.9, 1.9, 0.08, 24]} />
      </mesh>
    </group>
  );
}
