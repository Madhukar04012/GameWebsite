import { useMemo } from "react";
import * as THREE from "three";
import { Instances, Instance } from "@react-three/drei";
import { CITY_LAYOUT, ROADS } from "@legend/shared";
import { heightAt } from "@legend/engine";
import { createFabricMaterial } from "../materials/createFabricMaterial";
import { createMetalMaterial } from "../materials/createMetalMaterial";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createWoodMaterial } from "../materials/createWoodMaterial";
import { useWorldStore } from "../store/worldStore";

const gardenStone = createStoneMaterial({ stoneColor: "#e6dec8", roughness: 0.82, seed: [18, 7] });
const gardenWood = createWoodMaterial({ woodColor: "#3b2418", roughness: 0.9 });
const gardenLeaf = createStoneMaterial({ stoneColor: "#2d6a4f", roughness: 0.92, seed: [4, 12] });
const gold = createMetalMaterial({ kind: "gold", emissive: "#d4af37", emissiveIntensity: 0.5 });
const marble = createStoneMaterial({ stoneColor: "#ffffff", roughness: 0.4, seed: [5, 5] });

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

/**
 * CapitalDetails — high-signal environmental dressing:
 * Royal Citadel Terraced Gardens, Street Gaslight Lanterns, District Threshold Monoliths,
 * Plaza Balustrades, and Landscaped Tree Planters.
 */
export function CapitalDetails() {
  return (
    <group>
      {/* 1. Royal Citadel Terraced Gardens */}
      <RoyalTerraceGardens />

      {/* 2. District Threshold Heraldry Monoliths */}
      {CITY_LAYOUT.filter((d) => d.name !== "central_plaza").map((district) => (
        <DistrictHeraldryMonolith key={district.name} district={district} />
      ))}

      {/* 3. Street Gaslight Lampposts along Main Avenues */}
      <StreetGaslights />

      {/* 4. Central Plaza Perimeter Balustrade */}
      <PlazaBalustrade />
    </group>
  );
}

/** District Boundary Heraldry Monolith */
function DistrictHeraldryMonolith({ district }: { district: (typeof CITY_LAYOUT)[number] }) {
  const color = DISTRICT_COLORS[district.name] ?? district.color;
  const y = heightAt(district.center.x, district.center.z) + 0.04;
  const bannerMat = useMemo(
    () => createFabricMaterial({ kind: "banner", color, roughness: 0.85, side: 2, seed: [district.center.x, district.center.z] }),
    [color, district.center.x, district.center.z],
  );

  return (
    <group position={[district.center.x, y, district.center.z]}>
      {/* Stone Pedestal */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow material={gardenStone}>
        <cylinderGeometry args={[0.75, 0.9, 0.7, 8]} />
      </mesh>
      {/* Polished Timber Pole */}
      <mesh position={[0, 2.0, 0]} castShadow material={gardenWood}>
        <cylinderGeometry args={[0.08, 0.1, 3.2, 8]} />
      </mesh>
      {/* Heraldic Banner */}
      <mesh position={[0.04, 2.6, 0]} rotation={[0, 0.05, 0]} material={bannerMat}>
        <planeGeometry args={[1.1, 1.6]} />
      </mesh>
      {/* Gold Octahedron Finial */}
      <mesh position={[0, 3.65, 0]} castShadow material={gold}>
        <octahedronGeometry args={[0.18, 0]} />
      </mesh>
    </group>
  );
}

/** Royal Citadel Terraced Gardens */
function RoyalTerraceGardens() {
  const hedges = useMemo(
    () => [
      [-22, -26, 12, 0.9], [22, -26, 12, 0.9],
      [-22, -26, 0.9, 12], [22, -26, 0.9, 12],
      [-16, -26, 0.9, 12], [16, -26, 0.9, 12],
    ] as [number, number, number, number][],
    [],
  );

  const gardenCypress = useMemo(
    () => [
      { x: -18, z: -22, s: 1.1 },
      { x: 18, z: -22, s: 1.1 },
      { x: -18, z: -30, s: 1.2 },
      { x: 18, z: -30, s: 1.2 },
    ],
    [],
  );

  return (
    <group>
      {/* Garden Promenade Ground */}
      <mesh position={[0, heightAt(0, -26) + 0.02, -26]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={gardenStone}>
        <planeGeometry args={[48, 16]} />
      </mesh>

      {/* Sculpted Boxwood Hedges */}
      {hedges.map(([x, z, w, d], i) => (
        <mesh key={`hedge-${i}`} position={[x, heightAt(x, z) + 0.6, z]} castShadow receiveShadow material={gardenLeaf}>
          <boxGeometry args={[w, 1.2, d]} />
        </mesh>
      ))}

      {/* Sculpted Cypress Trees */}
      <Instances limit={gardenCypress.length} castShadow>
        <cylinderGeometry args={[0.15, 0.22, 2.4, 8]} />
        <primitive object={gardenWood} attach="material" />
        {gardenCypress.map((t, i) => (
          <group key={`cypress-wood-${i}`} position={[t.x, heightAt(t.x, t.z), t.z]} scale={t.s}>
            <Instance position={[0, 1.2, 0]} />
          </group>
        ))}
      </Instances>
      <Instances limit={gardenCypress.length} castShadow>
        <coneGeometry args={[1.1, 4.5, 8]} />
        <primitive object={gardenLeaf} attach="material" />
        {gardenCypress.map((t, i) => (
          <group key={`cypress-leaf-${i}`} position={[t.x, heightAt(t.x, t.z), t.z]} scale={t.s}>
            <Instance position={[0, 3.8, 0]} />
          </group>
        ))}
      </Instances>

      {/* Garden Reflecting Pool */}
      <group position={[0, heightAt(0, -26), -26]}>
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow material={marble}>
          <cylinderGeometry args={[3.2, 3.6, 0.7, 16]} />
        </mesh>
        <mesh position={[0, 0.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.8, 16]} />
          <meshStandardMaterial color="#0077b6" emissive="#00b4d8" emissiveIntensity={0.4} metalness={0.8} roughness={0.1} />
        </mesh>
        <mesh position={[0, 1.5, 0]} castShadow material={gold}>
          <sphereGeometry args={[0.4, 12, 12]} />
        </mesh>
      </group>
    </group>
  );
}

/** Street Gaslight Lampposts along Main Avenues */
function StreetGaslights() {
  const isNight = useWorldStore((s: any) => s.timeOfDay >= 18 || s.timeOfDay <= 6);
  const lampSpots = useMemo(() => [
    // South Imperial High Avenue
    { x: -5, z: -40 }, { x: 5, z: -40 },
    { x: -5, z: -28 }, { x: 5, z: -28 },
    { x: -5, z: -16 }, { x: 5, z: -16 },
    // Trans-Plaza Boulevard (East-West)
    { x: -22, z: -6 }, { x: 22, z: -6 },
    { x: -36, z: -6 }, { x: 36, z: -6 },
    // North Avenue
    { x: -5, z: 8 }, { x: 5, z: 8 },
    { x: -5, z: 22 }, { x: 5, z: 22 },
    { x: -5, z: 34 }, { x: 5, z: 34 },
  ], []);

  const limit = Math.max(1, lampSpots.length);

  return (
    <group>
      <Instances limit={limit} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 2.8, 8]} />
        <primitive object={gardenWood} attach="material" />
        {lampSpots.map((spot, i) => (
          <group key={`lamp-wood-${i}`} position={[spot.x, heightAt(spot.x, spot.z), spot.z]}>
            <Instance position={[0, 1.4, 0]} />
          </group>
        ))}
      </Instances>
      
      <Instances limit={limit} castShadow>
        <boxGeometry args={[0.4, 0.08, 0.08]} />
        <primitive object={gold} attach="material" />
        {lampSpots.map((spot, i) => (
          <group key={`lamp-gold-${i}`} position={[spot.x, heightAt(spot.x, spot.z), spot.z]}>
            <Instance position={[0, 2.7, 0]} />
          </group>
        ))}
      </Instances>
      
      <Instances limit={limit} castShadow>
        <cylinderGeometry args={[0.16, 0.12, 0.35, 6]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffb703" emissiveIntensity={isNight ? 5.0 : 0.2} />
        {lampSpots.map((spot, i) => (
          <group key={`lamp-glass-${i}`} position={[spot.x, heightAt(spot.x, spot.z), spot.z]}>
            <Instance position={[0.2, 2.5, 0]} />
          </group>
        ))}
      </Instances>
    </group>
  );
}

/** Central Plaza Circular Balustrade */
function PlazaBalustrade() {
  const posts = useMemo(() => {
    const arr: { x: number; z: number; rot: number }[] = [];
    const r = 13.5;
    const count = 16;
    for (let i = 0; i < count; i++) {
      // Leave gaps for the 4 cardinal road avenues
      if (i % 4 === 0) continue;
      const ang = (i / count) * Math.PI * 2;
      arr.push({ x: Math.cos(ang) * r, z: -4 + Math.sin(ang) * r, rot: ang });
    }
    return arr;
  }, []);

  const limit = Math.max(1, posts.length);
  return (
    <group>
      <Instances limit={limit} castShadow>
        <cylinderGeometry args={[0.22, 0.26, 0.9, 8]} />
        <primitive object={marble} attach="material" />
        {posts.map((p, i) => (
          <group key={`plaza-post-marble-${i}`} position={[p.x, heightAt(p.x, p.z), p.z]}>
            <Instance position={[0, 0.45, 0]} />
          </group>
        ))}
      </Instances>
      <Instances limit={limit} castShadow>
        <sphereGeometry args={[0.15, 8, 8]} />
        <primitive object={gold} attach="material" />
        {posts.map((p, i) => (
          <group key={`plaza-post-gold-${i}`} position={[p.x, heightAt(p.x, p.z), p.z]}>
            <Instance position={[0, 0.95, 0]} />
          </group>
        ))}
      </Instances>
    </group>
  );
}
