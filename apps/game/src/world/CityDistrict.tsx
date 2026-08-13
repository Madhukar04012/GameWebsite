import { Text } from "@react-three/drei";
import { CityBuilding } from "./CityBuilding";
import { CityBlock } from "./CityBlock";
import type { DistrictDef } from "@legend/shared";

interface CityDistrictProps {
  district: DistrictDef;
  /** Show the floating district label (debug toggle). */
  showLabel?: boolean;
}

/** Renders a city district with all its buildings (+ optional label). */
export function CityDistrict({ district, showLabel = false }: CityDistrictProps) {
  const labelPos = {
    x: district.center.x,
    z: district.center.z,
  };
  return (
    <group>
      {/* Buildings */}
      {district.buildings.map((b, i) => (
        <CityBuilding key={`${district.name}-bldg-${i}`} def={b} color={b.color ?? district.color} district={district.name} />
      ))}

      {/* Procedural Urban Blocks */}
      {district.blocks?.map((block, i) => (
        <CityBlock key={`${district.name}-block-${i}`} block={block} district={district.name} color={district.color} />
      ))}

      {/* District label (floating text — debug) */}
      {showLabel && (
        <Text
          position={[labelPos.x, 8, labelPos.z]}
          fontSize={1.2}
          color="#d4af37"
          outlineWidth={0.04}
          outlineColor="#000"
          anchorX="center"
          anchorY="middle"
        >
          {district.label}
        </Text>
      )}
    </group>
  );
}
