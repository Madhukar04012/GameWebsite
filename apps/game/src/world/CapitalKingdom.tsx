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
import { generateCapitalPopulation, globalNavGraph, buildCityNavGraph } from "@legend/shared";
import { heightAt } from "@legend/engine";

import { NavGraphDebug } from "../systems/npc/NavGraphDebug";

/**
 * Capital Kingdom — walled city blockout.
 *
 * Composes districts (CITY_LAYOUT), outer walls + South Gate (Walls), the road
 * network (Roads), and atmosphere Props. Terrain is rendered separately by
 * Scene so the city composes on top of its heightfield.
 */
// Dark cobblestone plaza across the walled area — procedural stones + gold grout.
const plazaMat = createCobbleMaterial({ kind: "plaza", scale: 2.0, seed: [7.7, 2.2] });

import { useDebugStore } from "../store/debugStore";

export function CapitalKingdom({ showLabels = false }: { showLabels?: boolean }) {
  const debug = useDebugStore();

  useEffect(() => {
    // Seed test NPCs for Milestone 5.3.2 deterministic population
    const store = useNPCStore.getState();
    if (store.npcs.length > 0) return; // already seeded

    // Initialize Navigation Graph using physical world data
    buildCityNavGraph(globalNavGraph, heightAt);
    console.log(`[NavGraph] Built with ${globalNavGraph.nodes.size} nodes.`);

    // Generate the deterministic population for Solaria
    // Using a fixed world seed so population is reproducible
    const solariaSeed = "SOLARIA_WORLD_SEED_01";
    const population = generateCapitalPopulation(solariaSeed);
    
    // Log debug counts to console
    console.log(`[NPC] Generated Abstract Population: ${population.length} citizens.`);
    const districtCounts: Record<string, number> = {};
    population.forEach(npc => {
      districtCounts[npc.homeDistrict] = (districtCounts[npc.homeDistrict] || 0) + 1;
    });
    console.table(districtCounts);
    
    store.setNPCs(population);
  }, []);

  return (
    <group name="CapitalKingdom">
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
      {debug.perfNpcs && (
        <>
          <NPCSimulationManager />
          <NPCRenderer />
        </>
      )}
      <NavGraphDebug visible={showLabels} />
    </group>
  );
}
