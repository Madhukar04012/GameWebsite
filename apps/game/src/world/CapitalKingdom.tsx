import { CITY_LAYOUT, WORLD_BOUNDS } from "@legend/shared";
import { CityDistrict } from "./CityDistrict";
import { Walls } from "./Walls";
import { Roads } from "./Roads";
import { Props } from "./Props";
import { CityLandmarks } from "./CityLandmarks";
import { createCobbleMaterial } from "../materials/createCobbleMaterial";

/**
 * Capital Kingdom — walled city blockout.
 *
 * Composes districts (CITY_LAYOUT), outer walls + South Gate (Walls), the road
 * network (Roads), and atmosphere Props. Terrain is rendered separately by
 * Scene so the city composes on top of its heightfield.
 */
// Dark cobblestone plaza across the walled area — procedural stones + gold grout.
const plazaMat = createCobbleMaterial({ kind: "plaza", scale: 2.0, seed: [7.7, 2.2] });

export function CapitalKingdom({ showLabels = false }: { showLabels?: boolean }) {
  return (
    <group>
      {/* City stone ground — grand dark cobble plaza across the walled area. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow material={plazaMat}>
        <planeGeometry args={[WORLD_BOUNDS.citySize, WORLD_BOUNDS.citySize]} />
      </mesh>

      <Roads />
      <Walls />

      {CITY_LAYOUT.map((district) => (
        <CityDistrict key={district.name} district={district} showLabel={showLabels} />
      ))}

      <Props />
      <CityLandmarks />
    </group>
  );
}
