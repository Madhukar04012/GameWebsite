import { CITY_LAYOUT, WORLD_BOUNDS } from "@legend/shared";
import { CityDistrict } from "./CityDistrict";
import { Walls } from "./Walls";
import { Roads } from "./Roads";
import { Props } from "./Props";
import { CityLandmarks } from "./CityLandmarks";
import { CapitalDetails } from "./CapitalDetails";
import { createCobbleMaterial } from "../materials/createCobbleMaterial";
import { NightLightingUpdater } from "./CityBuilding";
import { NPCSimulationManager } from "../systems/npc/NPCSimulationManager";
import { NPCRenderer } from "../systems/npc/NPCRenderer";
import { useEffect } from "react";
import { useNPCStore } from "../store/npcStore";
import { NPCData, NPCProfession } from "@legend/shared";
import { MathUtils } from "three";

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
  useEffect(() => {
    // Seed test NPCs for Milestone 5.3.1 foundation
    const store = useNPCStore.getState();
    if (store.npcs.length > 0) return; // already seeded

    const testNPCs: NPCData[] = [];
    const professions: NPCProfession[] = ["Citizen", "Guard", "Merchant", "Noble", "Worker"];
    
    for (let i = 0; i < 50; i++) {
      const prof = professions[Math.floor(Math.random() * professions.length)];
      
      // Random start pos in city (city size is ~1200x1200, walled area is roughly -400 to 400)
      const startX = MathUtils.randFloatSpread(600);
      const startZ = MathUtils.randFloatSpread(600);
      
      const destX = MathUtils.randFloatSpread(600);
      const destZ = MathUtils.randFloatSpread(600);

      testNPCs.push({
        id: `npc-${i}`,
        name: `${prof} ${i}`,
        profession: prof,
        homeDistrict: "Residential",
        homeCoords: { x: startX, z: startZ },
        workplaceCoords: { x: destX, z: destZ },
        schedule: [
          { startHour: 0, endHour: 8, activity: "Sleeping", destination: { x: startX, z: startZ } },
          { startHour: 8, endHour: 18, activity: "Working", destination: { x: destX, z: destZ } },
          { startHour: 18, endHour: 24, activity: "Idle", destination: { x: startX, z: startZ } }
        ],
        state: {
          currentActivity: "Idle",
          tier: 0,
          position: { x: startX, y: 0, z: startZ },
          targetDestination: null,
          velocity: 0
        }
      });
    }
    
    store.setNPCs(testNPCs);
  }, []);

  return (
    <group>
      {/* City stone ground — grand dark cobble plaza across the walled area. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow material={plazaMat}>
        <planeGeometry args={[WORLD_BOUNDS.citySize, WORLD_BOUNDS.citySize]} />
      </mesh>

      <NightLightingUpdater />
      <Roads />
      <Walls />

      {CITY_LAYOUT.map((district) => (
        <CityDistrict key={district.name} district={district} showLabel={showLabels} />
      ))}

      <Props />
      <CityLandmarks />
      <CapitalDetails />
      <NPCSimulationManager />
      <NPCRenderer />
    </group>
  );
}
