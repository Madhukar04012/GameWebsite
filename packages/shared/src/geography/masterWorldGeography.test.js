/**
 * Unit Test Suite for Master World Geography.
 *
 * Validates:
 * 1. World Coordinate Contract
 * 2. Determinism of geographyAt(x, z) and macroElevation(x, z)
 * 3. Region and Subregion classification
 * 4. Biome transition weights summing to 1.0
 * 5. Downhill hydrological river drainage flow
 * 6. Landmark positions within world bounds
 * 7. Travel corridor integrity
 * 8. Defensible Capital Kingdom plateau flattening
 */
import { WORLD_COORDINATE_CONTRACT, MASTER_REGIONS, MASTER_SUBREGIONS, MASTER_LANDFORMS, MASTER_LANDMARKS, MASTER_DRAINAGE, MASTER_TRAVEL_CORRIDORS, geographyAt, macroElevation, getRegionWeightsAt, } from "./masterWorldGeography";
function assert(condition, msg) {
    if (!condition) {
        throw new Error(`FAIL: ${msg}`);
    }
}
export function runGeographyUnitTests() {
    console.log("▶ Running Master World Geography Unit Tests...");
    // Test 1: Coordinate Contract
    assert(WORLD_COORDINATE_CONTRACT.worldDiameter === 400, "World diameter must be 400m");
    assert(WORLD_COORDINATE_CONTRACT.cityPerimeterRadius === 50, "City perimeter radius must be 50m");
    // Test 2: Determinism of geographyAt & macroElevation
    const testCoords = [
        { x: 0, z: 0 },
        { x: 0, z: 150 },
        { x: -120, z: -20 },
        { x: 130, z: 20 },
        { x: -90, z: -140 },
        { x: 80, z: -140 },
        { x: 45.5, z: -88.2 },
        { x: -175.3, z: 165.8 },
    ];
    for (const c of testCoords) {
        const s1 = geographyAt(c.x, c.z);
        const s2 = geographyAt(c.x, c.z);
        const e1 = macroElevation(c.x, c.z);
        const e2 = macroElevation(c.x, c.z);
        assert(e1 === e2, `macroElevation must be deterministic at (${c.x}, ${c.z})`);
        assert(s1.region.id === s2.region.id, `Region ID must be deterministic at (${c.x}, ${c.z})`);
        assert(s1.subregion.id === s2.subregion.id, `Subregion ID must be deterministic at (${c.x}, ${c.z})`);
        assert(s1.macroElevation === s2.macroElevation, `Sample macroElevation must be deterministic at (${c.x}, ${c.z})`);
        assert(s1.moisture === s2.moisture, `Moisture must be deterministic at (${c.x}, ${c.z})`);
        assert(s1.temperature === s2.temperature, `Temperature must be deterministic at (${c.x}, ${c.z})`);
    }
    // Test 3: Capital Plateau Flattening
    for (let r = 0; r <= 50; r += 5) {
        for (let ang = 0; ang < Math.PI * 2; ang += Math.PI / 4) {
            const x = Math.cos(ang) * r;
            const z = Math.sin(ang) * r;
            const h = macroElevation(x, z);
            assert(h === 0.0, `Capital Kingdom must be flat (0.0m) at (${x.toFixed(1)}, ${z.toFixed(1)})`);
            const sample = geographyAt(x, z);
            assert(sample.isCityPlateau === true, `isCityPlateau must be true within 50m of origin`);
        }
    }
    // Test 4: Biome Transition Weights Sum to 1.0
    for (let x = -190; x <= 190; x += 30) {
        for (let z = -190; z <= 190; z += 30) {
            const weights = getRegionWeightsAt(x, z);
            const sum = Object.values(weights).reduce((a, b) => a + b, 0);
            assert(Math.abs(sum - 1.0) < 0.001, `Biome weights must sum to 1.0 at (${x}, ${z}), got ${sum}`);
            for (const w of Object.values(weights)) {
                assert(w >= 0 && w <= 1.0, `Biome weight must be between 0 and 1, got ${w}`);
            }
        }
    }
    // Test 5: Hydrological Drainage Downhill Flow
    for (const river of MASTER_DRAINAGE) {
        assert(river.waypoints.length >= 3, `River ${river.id} must have at least 3 waypoints`);
        for (let i = 1; i < river.waypoints.length; i++) {
            const prev = river.waypoints[i - 1];
            const curr = river.waypoints[i];
            // River should flow north (+Z) to south (-Z)
            assert(curr.z <= prev.z, `River waypoints must proceed from North to South (${prev.z} -> ${curr.z})`);
            // Elevation must strictly drop or level out (downhill flow)
            assert(curr.elevation <= prev.elevation, `River must flow downhill: node ${i - 1} (${prev.elevation}m) -> node ${i} (${curr.elevation}m)`);
        }
    }
    // Test 6: All Landmarks Within World Bounds
    assert(MASTER_LANDMARKS.length >= 10, `Must have at least 10 authoritative landmarks, found ${MASTER_LANDMARKS.length}`);
    for (const lm of MASTER_LANDMARKS) {
        assert(Math.abs(lm.position.x) <= 200, `Landmark ${lm.name} X (${lm.position.x}) must be within world bounds [-200, 200]`);
        assert(Math.abs(lm.position.z) <= 200, `Landmark ${lm.name} Z (${lm.position.z}) must be within world bounds [-200, 200]`);
        assert(MASTER_REGIONS[lm.region] !== undefined, `Landmark ${lm.name} has invalid region: ${lm.region}`);
        assert(lm.visibilityRadius > 0, `Landmark ${lm.name} must have positive visibility radius`);
    }
    // Test 7: Travel Corridors Integrity
    assert(MASTER_TRAVEL_CORRIDORS.length === 4, `Must have exactly 4 master travel corridors, found ${MASTER_TRAVEL_CORRIDORS.length}`);
    for (const corridor of MASTER_TRAVEL_CORRIDORS) {
        assert(corridor.pathNodes.length >= 3, `Corridor ${corridor.name} must have at least 3 path nodes`);
        for (const node of corridor.pathNodes) {
            assert(Math.abs(node.x) <= 200, `Corridor node (${node.x}, ${node.z}) out of world bounds`);
            assert(Math.abs(node.z) <= 200, `Corridor node (${node.x}, ${node.z}) out of world bounds`);
        }
        assert(MASTER_REGIONS[corridor.connects[0]] !== undefined, `Invalid origin region ${corridor.connects[0]}`);
        assert(MASTER_REGIONS[corridor.connects[1]] !== undefined, `Invalid destination region ${corridor.connects[1]}`);
    }
    // Test 8: Subregions Completeness
    for (const sub of Object.values(MASTER_SUBREGIONS)) {
        assert(MASTER_REGIONS[sub.regionId] !== undefined, `Subregion ${sub.name} references invalid region ${sub.regionId}`);
        assert(Math.abs(sub.center.x) <= 200, `Subregion ${sub.name} center X out of bounds`);
        assert(Math.abs(sub.center.z) <= 200, `Subregion ${sub.name} center Z out of bounds`);
        assert(sub.radius > 0, `Subregion ${sub.name} must have positive radius`);
    }
    // Test 9: Major Landforms Integrity
    for (const lf of MASTER_LANDFORMS) {
        assert(MASTER_REGIONS[lf.regionId] !== undefined, `Landform ${lf.name} references invalid region ${lf.regionId}`);
        assert(lf.radius > 0, `Landform ${lf.name} must have positive radius`);
    }
    console.log("✔ All Master World Geography unit tests passed successfully!");
}
// Run immediately if executed directly in Node
if (typeof process !== "undefined" && process.argv && process.argv[1]?.includes("masterWorldGeography.test")) {
    runGeographyUnitTests();
}
//# sourceMappingURL=masterWorldGeography.test.js.map