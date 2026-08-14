import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import { PerformanceProfiler } from "../systems/PerformanceProfiler";
/**
 * Capital Kingdom — walled city blockout.
 *
 * Composes districts (CITY_LAYOUT), outer walls + South Gate (Walls), the road
 * network (Roads), and atmosphere Props. Terrain is rendered separately by
 * Scene so the city composes on top of its heightfield.
 */
// Dark cobblestone plaza across the walled area — procedural stones + gold grout.
const plazaMat = createCobbleMaterial({ kind: "plaza", scale: 2.0, seed: [7.7, 2.2] });
export function CapitalKingdom({ showLabels = false }) {
    useEffect(() => {
        // Seed test NPCs for Milestone 5.3.2 deterministic population
        const store = useNPCStore.getState();
        if (store.npcs.length > 0)
            return; // already seeded
        // Initialize Navigation Graph using physical world data
        buildCityNavGraph(globalNavGraph, heightAt);
        console.log(`[NavGraph] Built with ${globalNavGraph.nodes.size} nodes.`);
        // Generate the deterministic population for Solaria
        // Using a fixed world seed so population is reproducible
        const solariaSeed = "SOLARIA_WORLD_SEED_01";
        const population = generateCapitalPopulation(solariaSeed);
        // Log debug counts to console
        console.log(`[NPC] Generated Abstract Population: ${population.length} citizens.`);
        const districtCounts = {};
        population.forEach(npc => {
            districtCounts[npc.homeDistrict] = (districtCounts[npc.homeDistrict] || 0) + 1;
        });
        console.table(districtCounts);
        store.setNPCs(population);
    }, []);
    return (_jsxs("group", { children: [_jsx("mesh", { rotation: [-Math.PI / 2, 0, 0], position: [0, 0.02, 0], receiveShadow: true, material: plazaMat, children: _jsx("planeGeometry", { args: [WORLD_BOUNDS.citySize, WORLD_BOUNDS.citySize] }) }), _jsx(NightLightingUpdater, {}), _jsx(Roads, {}), _jsx(Walls, {}), CITY_LAYOUT.map((district) => (_jsx(CityDistrict, { district: district, showLabel: showLabels }, district.name))), _jsx(Props, {}), _jsx(CityLandmarks, {}), _jsx(CapitalDetails, {}), _jsx(NPCSimulationManager, {}), _jsx(NPCRenderer, {}), _jsx(NavGraphDebug, { visible: showLabels }), _jsx(PerformanceProfiler, {})] }));
}
//# sourceMappingURL=CapitalKingdom.js.map