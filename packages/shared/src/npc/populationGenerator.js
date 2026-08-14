import { CITY_LAYOUT } from "../constants";
import { PRNG, generateDeterministicName } from "./nameGenerator";
import { PROFESSION_REGISTRY } from "./professions";
// Capacity definition conceptual categories
const DISTRICT_CAPACITY = {
    residential: 300,
    market: 200,
    harbor: 150,
    guild_hall: 100,
    noble: 80,
    training: 100,
    blacksmith: 100,
    inn: 50,
    castle: 50,
    central_plaza: 20, // mostly travelers/guards, low home capacity
};
// Generate schedule blocks deterministically
function generateSchedule(prng, prof, home, work) {
    // Simplistic schedule generator for the foundation
    if (prof.scheduleType === "DAY_WORKER") {
        const startWork = prng.nextInt(6, 9);
        const endWork = prng.nextInt(17, 20);
        return [
            { startHour: 0, endHour: startWork, activity: "Sleeping", destination: home },
            { startHour: startWork, endHour: endWork, activity: "Working", destination: work },
            { startHour: endWork, endHour: 24, activity: "Idle", destination: home }
        ];
    }
    else if (prof.scheduleType === "GUARD") {
        const shift = prng.nextInt(0, 2); // 3 shifts
        const startWork = shift * 8;
        const endWork = (shift + 1) * 8;
        return [
            { startHour: 0, endHour: startWork, activity: "Idle", destination: home },
            { startHour: startWork, endHour: endWork, activity: "Patrolling", destination: work },
            { startHour: endWork, endHour: 24, activity: "Sleeping", destination: home }
        ];
    }
    else if (prof.scheduleType === "NOBLE") {
        return [
            { startHour: 0, endHour: 9, activity: "Sleeping", destination: home },
            { startHour: 9, endHour: 15, activity: "Idle", destination: work }, // visiting castle/plaza
            { startHour: 15, endHour: 24, activity: "Idle", destination: home }
        ];
    }
    // Default fallback
    return [
        { startHour: 0, endHour: 8, activity: "Sleeping", destination: home },
        { startHour: 8, endHour: 18, activity: "Working", destination: work },
        { startHour: 18, endHour: 24, activity: "Idle", destination: home }
    ];
}
export function generateCapitalPopulation(seed) {
    const prng = new PRNG(seed);
    const npcs = [];
    // Pre-filter professions by home districts
    const professionsList = Object.values(PROFESSION_REGISTRY);
    for (const district of CITY_LAYOUT) {
        const capacity = DISTRICT_CAPACITY[district.name] || 50;
        // Valid professions for this district
        const validProfs = professionsList.filter(p => p.compatibleHomeDistricts.includes(district.name));
        if (validProfs.length === 0)
            continue;
        // Pick buildings in this district to act as homes
        const buildings = district.buildings || [];
        if (buildings.length === 0) {
            // Fallback to district center if no explicit buildings
            buildings.push({ x: district.center.x, z: district.center.z, w: 5, d: 5, h: 5, label: "Generic" });
        }
        // Determine how many NPCs to spawn in this district (Abstract Population count)
        // We will generate a fraction of the capacity for testing to keep numbers reasonable during dev
        // e.g., 20% of capacity
        const targetPopulation = Math.max(5, Math.floor(capacity * 0.2));
        for (let i = 0; i < targetPopulation; i++) {
            const id = `npc_${district.name}_${i}`;
            const name = generateDeterministicName(seed + id);
            const prof = prng.pick(validProfs);
            const homeBuilding = prng.pick(buildings);
            const homeCoords = { x: homeBuilding.x, z: homeBuilding.z };
            // Find a workplace
            // Find districts compatible with this profession's workplace
            const workDistrictNames = prof.compatibleWorkDistricts;
            const workDistrictName = prng.pick(workDistrictNames) || district.name;
            const workDistrict = CITY_LAYOUT.find(d => d.name === workDistrictName) || district;
            const workBuildings = workDistrict.buildings && workDistrict.buildings.length > 0
                ? workDistrict.buildings
                : [{ x: workDistrict.center.x, z: workDistrict.center.z }];
            const workBuilding = prng.pick(workBuildings);
            const workplaceCoords = { x: workBuilding.x, z: workBuilding.z };
            const schedule = generateSchedule(prng, prof, homeCoords, workplaceCoords);
            npcs.push({
                id,
                name,
                profession: prof.id,
                socialClass: prof.socialClass,
                householdId: `hh_${district.name}_${homeBuilding.x}_${homeBuilding.z}`,
                homeDistrict: district.name,
                workplaceDistrict: workDistrict.name,
                homeCoords,
                workplaceCoords,
                schedule,
                state: {
                    currentActivity: "Idle",
                    tier: 0,
                    position: { x: homeCoords.x, y: 0, z: homeCoords.z },
                    targetDestination: null,
                    velocity: 0
                }
            });
        }
    }
    return npcs;
}
//# sourceMappingURL=populationGenerator.js.map