import { useMemo } from "react";
import { ROADS, ROAD_WIDTH, type RoadType } from "@legend/shared";
import { heightAt } from "@legend/engine";
import { createCobbleMaterial } from "../materials/createCobbleMaterial";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createTerrainMaterial } from "../materials/createTerrainMaterial";

/**
 * Roads — road network with curbs, intersection blending, and roadside detail.
 * Each segment: cobble strip + stone curbs + roadside grass verge on main/plaza.
 * Intersections get a blended roundel to hide z-fighting.
 */
const ROAD_MATS: Record<RoadType, import("three").MeshStandardMaterial> = {
  main: createCobbleMaterial({ kind: "main" }),
  plaza: createCobbleMaterial({ kind: "plaza" }),
  district: createCobbleMaterial({ kind: "district" }),
  dirt: createCobbleMaterial({ kind: "dirt" }),
};

const CURB_MAT = createStoneMaterial({ stoneColor: "#4a463a", roughness: 0.9, metalness: 0.02, seed: [50, 1] });
const VERGE_MAT = createTerrainMaterial({ variant: "world", seed: [50, 2] });
const INTERSECTION_MAT = createCobbleMaterial({ kind: "plaza", scale: 2.2 });

const ROAD_EDGE: Record<RoadType, string | null> = {
  main: "#b8963e",
  plaza: "#d4af37",
  district: null,
  dirt: null,
};

export function Roads({ visible = true }: { visible?: boolean }) {
  if (!visible) return null;
  return (
    <group>
      {ROADS.map((r) => (
        <RoadStrip key={r.id} seg={r} />
      ))}
      <IntersectionRoundels />
    </group>
  );
}

interface StripProps {
  seg: (typeof ROADS)[number];
}

function RoadStrip({ seg }: StripProps) {
  const { length, angle, midX, midY, midZ, width } = useMemo(() => {
    const dx = seg.to.x - seg.from.x;
    const dz = seg.to.z - seg.from.z;
    const len = Math.sqrt(dx * dx + dz * dz);
    const angle = Math.atan2(dx, dz);
    const midX = (seg.from.x + seg.to.x) / 2;
    const midZ = (seg.from.z + seg.to.z) / 2;
    const midY = heightAt(midX, midZ) + 0.06;
    return { length: len, angle, midX, midY, midZ, width: seg.width };
  }, [seg]);

  const edge = ROAD_EDGE[seg.type];
  const hasVerge = seg.type === "main" || seg.type === "plaza";

  return (
    <group position={[midX, midY, midZ]} rotation={[-Math.PI / 2, 0, 0]}>
      <group rotation={[0, 0, angle]}>
        {/* Road surface */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} material={ROAD_MATS[seg.type]} receiveShadow>
          <planeGeometry args={[length, width]} />
        </mesh>

        {/* Stone curbs on main/plaza/district */}
        {seg.type !== "dirt" && (
          <>
            <mesh position={[0, 0.07, width / 2 + 0.18]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow material={CURB_MAT}>
              <boxGeometry args={[length + 0.4, 0.36, 0.36]} />
            </mesh>
            <mesh position={[0, 0.07, -(width / 2 + 0.18)]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow material={CURB_MAT}>
              <boxGeometry args={[length + 0.4, 0.36, 0.36]} />
            </mesh>
          </>
        )}

        {/* Gold edging on main/plaza roads (inside curbs) */}
        {edge && (
          <>
            <mesh position={[0, 0.03, width / 2 - 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[length, 0.24]} />
              <meshStandardMaterial color={edge} emissive={edge} emissiveIntensity={0.25} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.03, -(width / 2 - 0.12)]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[length, 0.24]} />
              <meshStandardMaterial color={edge} emissive={edge} emissiveIntensity={0.25} roughness={0.7} />
            </mesh>
          </>
        )}

        {/* Grass verge outside curbs on main/plaza */}
        {hasVerge && (
          <>
            <mesh position={[0, 0.04, width / 2 + 0.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={VERGE_MAT}>
              <planeGeometry args={[length, 1.2]} />
            </mesh>
            <mesh position={[0, 0.04, -(width / 2 + 0.6)]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={VERGE_MAT}>
              <planeGeometry args={[length, 1.2]} />
            </mesh>
          </>
        )}
      </group>
    </group>
  );
}

/** Blended intersection roundels — prevents z-fighting at crossings, adds visual anchor. */
function IntersectionRoundels() {
  // Compute unique intersection points from road endpoints
  const points = useMemo(() => {
    const map = new Map<string, { x: number; z: number; count: number }>();
    ROADS.forEach((r) => {
      [r.from, r.to].forEach((pt) => {
        const key = `${Math.round(pt.x * 10) / 10},${Math.round(pt.z * 10) / 10}`;
        const existing = map.get(key);
        if (existing) existing.count++;
        else map.set(key, { x: pt.x, z: pt.z, count: 1 });
      });
    });
    return Array.from(map.values()).filter((p) => p.count > 1);
  }, []);

  return (
    <>
      {points.map((p, i) => {
        const y = heightAt(p.x, p.z) + 0.07;
        const radius = 6;
        return (
          <group key={`intersection-${i}`} position={[p.x, y, p.z]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={INTERSECTION_MAT}>
              <circleGeometry args={[radius, 32]} />
            </mesh>
            {/* Center compass marker */}
            <mesh position={[0, 0.03, 0]} castShadow>
              <circleGeometry args={[1.2, 8]} />
              <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.4} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}