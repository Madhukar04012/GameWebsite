import { useMemo } from "react";
import { ROADS, ROAD_WIDTH, type RoadType } from "@legend/shared";
import { heightAt } from "@legend/engine";
import { createCobbleMaterial } from "../materials/createCobbleMaterial";

/**
 * Roads — road network rendered as flat strips atop the terrain.
 *
 * Each segment is a thin plane rotated to lie along the segment vector, width
 * sampled from ROAD_WIDTH by type. Roads sit at `heightAt` so they hug the
 * terrain. Segments are independent meshes → the road network is modular;
 * a future region can add its own ROADS entries. Materials are procedural
 * cobblestone/dirt (see createCobbleMaterial); gold edging retained.
 */
// One procedural cobble material per road type (reused across all strips).
const ROAD_MATS: Record<RoadType, import("three").MeshStandardMaterial> = {
  main: createCobbleMaterial({ kind: "main" }),
  plaza: createCobbleMaterial({ kind: "plaza" }),
  district: createCobbleMaterial({ kind: "district" }),
  dirt: createCobbleMaterial({ kind: "dirt" }),
};

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
    const angle = Math.atan2(dx, dz); // rotate plane so its length spans XZ
    const midX = (seg.from.x + seg.to.x) / 2;
    const midZ = (seg.from.z + seg.to.z) / 2;
    const midY = heightAt(midX, midZ) + 0.06;
    return { length: len, angle, midX, midY, midZ, width: seg.width };
  }, [seg]);

  const edge = ROAD_EDGE[seg.type];

  return (
    <group position={[midX, midY, midZ]} rotation={[-Math.PI / 2, 0, 0]} rotation-y={0}>
      {/* Strip body. Combine the geometry rotation: build on XZ via nested group. */}
      <group rotation={[0, 0, angle]}>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} material={ROAD_MATS[seg.type]} receiveShadow>
          <planeGeometry args={[length, width]} />
        </mesh>
        {/* Gold edging on main/plaza roads */}
        {edge && (
          <>
            <mesh position={[0, 0.02, width / 2 - 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[length, 0.24]} />
              <meshStandardMaterial color={edge} emissive={edge} emissiveIntensity={0.25} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.02, -(width / 2 - 0.12)]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[length, 0.24]} />
              <meshStandardMaterial color={edge} emissive={edge} emissiveIntensity={0.25} roughness={0.7} />
            </mesh>
          </>
        )}
      </group>
    </group>
  );
}
