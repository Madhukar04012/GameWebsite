import { useMemo } from "react";
import type { CityBlockDef, DistrictName } from "@legend/shared";
import { CityBuilding } from "./CityBuilding";

interface CityBlockProps {
  block: CityBlockDef;
  district: DistrictName;
  color: string;
}

/** PRNG for deterministic layout */
function seededRandom(seed: number) {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

export function CityBlock({ block, district, color }: CityBlockProps) {
  // Deterministically subdivide the block into smaller buildings
  const buildings = useMemo(() => {
    const rnd = seededRandom(block.seed);
    const bldgs = [];

    // Grid subdivision
    const cols = Math.floor(block.w / 4);
    const rows = Math.floor(block.d / 4);

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const bx = block.x - block.w / 2 + c * (block.w / cols) + (block.w / cols) / 2;
        const bz = block.z - block.d / 2 + r * (block.d / rows) + (block.d / rows) / 2;

        // Leave some cells empty for alleys / courtyards
        if (rnd() > 0.8) {
          // Add some street props (crates, barrels) in empty spaces
          if (rnd() > 0.5) {
            bldgs.push({
              isProp: true,
              type: rnd() > 0.5 ? "crate" : "barrel",
              x: bx,
              z: bz,
              w: 0.8,
              d: 0.8,
              h: 0.8,
              floors: 1,
              roof: "flat" as const,
              hasChimney: false,
              hasBalcony: false,
            });
          }
          continue;
        }

        // Base properties
        let w = 3.5 + rnd() * 1.5;
        let d = 3.5 + rnd() * 1.5;
        
        // Height variation based on district
        let minH = 4;
        let maxH = 7;
        let floors = 2;
        if (district === "noble" || district === "guild_hall") {
          minH = 6;
          maxH = 9;
          floors = Math.floor(2 + rnd() * 2);
        } else if (district === "market") {
          minH = 5;
          maxH = 8;
          floors = 2;
        } else if (district === "residential") {
          minH = 4;
          maxH = 6.5;
          floors = Math.floor(1 + rnd() * 2);
        }

        const h = minH + rnd() * (maxH - minH);

        const roofs: ("gable" | "flat" | "cone")[] = ["gable", "gable", "flat"];
        if (rnd() > 0.9) roofs.push("cone");

        bldgs.push({
          x: bx,
          z: bz,
          w,
          d,
          h,
          floors,
          roof: roofs[Math.floor(rnd() * roofs.length)],
          hasChimney: rnd() > 0.3,
          hasBalcony: rnd() > 0.7,
        });
      }
    }
    return bldgs;
  }, [block, district]);

  return (
    <group>
      {/* Optional: Add a base courtyard mesh or cobblestone plane for the block */}
      <mesh position={[block.x, 0.015, block.z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[block.w - 0.2, block.d - 0.2]} />
        <meshStandardMaterial color="#3a3832" roughness={0.9} />
      </mesh>

      {buildings.map((b, i) => {
        if ((b as any).isProp) {
          const type = (b as any).type;
          return (
            <mesh key={`block-${block.seed}-prop-${i}`} position={[b.x, 0.4, b.z]} castShadow receiveShadow>
              {type === "barrel" ? <cylinderGeometry args={[0.3, 0.3, 0.8, 8]} /> : <boxGeometry args={[0.8, 0.8, 0.8]} />}
              <meshStandardMaterial color="#8b5a2b" roughness={0.9} />
            </mesh>
          );
        }
        return (
          <CityBuilding
            key={`block-${block.seed}-bldg-${i}`}
            def={b}
            color={color}
            district={district}
          />
        );
      })}
    </group>
  );
}
