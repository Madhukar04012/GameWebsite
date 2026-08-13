import { useMemo } from "react";
import { ROADS, ROAD_WIDTH, type RoadType } from "@legend/shared";
import { heightAt } from "@legend/engine";
import { createCobbleMaterial } from "../materials/createCobbleMaterial";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createTerrainMaterial } from "../materials/createTerrainMaterial";

/**
 * Roads — AAA city road network with granite curbs, gold inlays, grass verges,
 * and blended intersection roundels.
 */
const ROAD_MATS: Record<RoadType, import("three").MeshStandardMaterial> = {
  main: createCobbleMaterial({ kind: "main" }),
  plaza: createCobbleMaterial({ kind: "plaza" }),
  district: createCobbleMaterial({ kind: "district" }),
  dirt: createCobbleMaterial({ kind: "dirt" }),
};

const CURB_MAT = createStoneMaterial({ stoneColor: "#524e42", roughness: 0.88, metalness: 0.02, seed: [50, 1] });
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
    const midY = heightAt(midX, midZ) + 0.04;
    return { length: len, angle, midX, midY, midZ, width: seg.width };
  }, [seg]);

  const edge = ROAD_EDGE[seg.type];
  const hasVerge = seg.type === "main" || seg.type === "plaza";

  return (
    <group position={[midX, midY, midZ]} rotation={[0, angle, 0]}>
      {/* Road surface plane lying flat on ground */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} material={ROAD_MATS[seg.type]} receiveShadow>
        <planeGeometry args={[width, length]} />
      </mesh>

      {/* Granite curbs flanking the road */}
      {seg.type !== "dirt" && (
        <>
          <mesh position={[-width / 2 - 0.16, 0.08, 0]} castShadow receiveShadow material={CURB_MAT}>
            <boxGeometry args={[0.32, 0.18, length + 0.4]} />
          </mesh>
          <mesh position={[width / 2 + 0.16, 0.08, 0]} castShadow receiveShadow material={CURB_MAT}>
            <boxGeometry args={[0.32, 0.18, length + 0.4]} />
          </mesh>
        </>
      )}

      {/* Gold edging inside curbs on royal avenues */}
      {edge && (
        <>
          <mesh position={[-width / 2 + 0.12, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.24, length]} />
            <meshStandardMaterial color={edge} emissive={edge} emissiveIntensity={0.3} roughness={0.6} />
          </mesh>
          <mesh position={[width / 2 - 0.12, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.24, length]} />
            <meshStandardMaterial color={edge} emissive={edge} emissiveIntensity={0.3} roughness={0.6} />
          </mesh>
        </>
      )}

      {/* Paved Sidewalks outside curbs */}
      {seg.type !== "dirt" && (
        <>
          <mesh position={[-width / 2 - 1.2, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={ROAD_MATS.district}>
            <planeGeometry args={[2.0, length]} />
          </mesh>
          <mesh position={[width / 2 + 1.2, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={ROAD_MATS.district}>
            <planeGeometry args={[2.0, length]} />
          </mesh>
        </>
      )}

      {/* Grass verge outside sidewalks */}
      {hasVerge && (
        <>
          <mesh position={[-width / 2 - 2.8, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={VERGE_MAT}>
            <planeGeometry args={[1.2, length]} />
          </mesh>
          <mesh position={[width / 2 + 2.8, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={VERGE_MAT}>
            <planeGeometry args={[1.2, length]} />
          </mesh>
        </>
      )}
    </group>
  );
}

/** Blended intersection roundels */
function IntersectionRoundels() {
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
        const y = heightAt(p.x, p.z) + 0.05;
        const radius = 6.5;
        return (
          <group key={`intersection-${i}`} position={[p.x, y, p.z]}>
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={INTERSECTION_MAT}>
              <circleGeometry args={[radius, 32]} />
            </mesh>
            {/* Center gilded compass star marker */}
            <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <circleGeometry args={[1.4, 8]} />
              <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.5} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}