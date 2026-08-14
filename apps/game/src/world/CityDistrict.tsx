import { useMemo } from "react";
import { Text } from "@react-three/drei";
import { buildCityBuildingGeometry } from "./CityBuilding";
import { GeometryBuilder } from "./GeometryBuilder";
import { CityBlock } from "./CityBlock";
import { getDistrictMaterials } from "../materials/createDistrictMaterials";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import * as THREE from "three";
import type { DistrictDef } from "@legend/shared";

const shopSignGoldMat = new THREE.MeshStandardMaterial({ color: "#d4af37", roughness: 0.4, metalness: 0.8 });

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

  const { geometries, interiors } = useMemo(() => {
    const builder = new GeometryBuilder();
    const interiors: any[] = [];
    if (district.buildings) {
      for (const b of district.buildings) {
        const res = buildCityBuildingGeometry(b, builder, district.name);
        if (res.interiorDef) {
          interiors.push(res);
        }
      }
    }
    
    const merged: Record<string, THREE.BufferGeometry> = {};
    for (const matKey in builder.geos) {
      if (builder.geos[matKey].length > 0) {
        merged[matKey] = BufferGeometryUtils.mergeGeometries(builder.geos[matKey]);
      }
    }
    return { geometries: merged, interiors };
  }, [district]);

  const mats = useMemo(() => getDistrictMaterials(district.name), [district.name]);

  return (
    <group>
      {/* Merged district loose buildings */}
      {Object.entries(geometries).map(([matKey, geo]) => {
         let mat;
         if (matKey === "wall") mat = mats.wall;
         else if (matKey === "plaster") mat = mats.plaster;
         else if (matKey === "brick") mat = mats.brick;
         else if (matKey === "wood") mat = mats.wood;
         else if (matKey === "glass") mat = mats.glass;
         else if (matKey === "metal") mat = mats.metal;
         else if (matKey === "accent") mat = mats.accent;
         else if (matKey === "banner") mat = mats.banner;
         else if (matKey === "roof") mat = mats.roof;
         else if (matKey === "shopSignGold") mat = shopSignGoldMat;
         
         return (
           <mesh key={`district-${district.name}-mat-${matKey}`} castShadow receiveShadow material={mat} geometry={geo} />
         );
      })}

      {interiors.map((res, i) => {
         const { interiorDef, x, baseY, z, w, d, storyH } = res;
         return (
           <group key={`district-interior-${i}`} position={[x, baseY, z]}>
             <group position={[0, 0.3, 0]}>
                <interiorDef.component w={w} d={d} storyH={storyH} />
             </group>
           </group>
         );
      })}

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
