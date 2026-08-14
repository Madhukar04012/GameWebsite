/**
 * Master World Geography — authoritative dataset and pure calculation engine
 * defining the macroscopic geography of LEGEND.
 *
 * Single source of truth consumed by:
 * - Engine TerrainSystem (Height, slope, drainage, surface classification)
 * - Engine WeatherSystem (Biome microclimates & wind fields)
 * - Game World Layers (Vegetation, Biomes, Landmarks, Roads, River)
 * - UI Systems (Debug World Map, MiniMap, Fast Travel)
 */
import type { RegionId, SubregionId, RegionGeographyDef, SubregionDef, LandformDef, WaterSpringDef, RiverDrainageDef, TravelCorridorDef, MasterLandmarkDef, GeographySample } from "./types";
export declare const WORLD_COORDINATE_CONTRACT: {
    readonly origin: {
        readonly x: 0;
        readonly z: 0;
        readonly description: "Central Royal Plaza Fountain of Capital Kingdom";
    };
    readonly axes: {
        readonly north: "+Z (Highlands, Frostpeak Ridge, Glaciers)";
        readonly south: "-Z (Coastal Slopes, Emerald Coast, Ocean Basin, South Gate at z=-46)";
        readonly east: "+X (Sunstone Highlands, Ashen Volcanic Crags, Desert)";
        readonly west: "-X (Whistling Woods, Willow Glades, Gloomwood Marsh)";
        readonly elevation: "+Y (Height above sea level in meters)";
    };
    readonly worldDiameter: 400;
    readonly cityPerimeterRadius: 50;
};
export declare const MASTER_REGIONS: Record<RegionId, RegionGeographyDef>;
export declare const MASTER_SUBREGIONS: Record<SubregionId, SubregionDef>;
export declare const MASTER_LANDFORMS: LandformDef[];
export declare const MASTER_SPRINGS: WaterSpringDef[];
export declare const MASTER_DRAINAGE: RiverDrainageDef[];
export declare const MASTER_TRAVEL_CORRIDORS: TravelCorridorDef[];
export declare const MASTER_LANDMARKS: MasterLandmarkDef[];
/**
 * Calculates continuous weight [0.0 to 1.0] of each region at world (x, z).
 * Guarantees smooth continuous transitions without harsh bounding box pops.
 * Mathematical property: sum of all weights strictly equals 1.0.
 */
export declare function getRegionWeightsAt(x: number, z: number): Record<RegionId, number>;
/**
 * Returns the dominant region at world (x, z).
 */
export declare function getDominantRegionAt(x: number, z: number): RegionGeographyDef;
/**
 * Returns the nearest dominant subregion at world (x, z).
 */
export declare function getDominantSubregionAt(x: number, z: number, dominantRegionId: RegionId): SubregionDef;
/**
 * Evaluates the River Path centerline X for a given Z coordinate.
 * Matches natural hydrological gorge meander.
 */
export declare function getRiverCenterlineX(z: number): number;
/**
 * Evaluates the distance from world (x, z) to the primary river centerline.
 */
export declare function getDistanceToRiver(x: number, z: number): number;
/**
 * Evaluates the Macro Landform Elevation at world (x, z) before micro FBM erosion.
 * Deterministic pure mathematical function.
 */
export declare function getMacroLandformElevation(x: number, z: number): number;
/** Top-level alias for getMacroLandformElevation */
export declare const macroElevation: typeof getMacroLandformElevation;
/**
 * Complete geography evaluation at world (x, z).
 * Deterministic pure calculation.
 */
export declare function sampleGeography(x: number, z: number): GeographySample;
/** Top-level alias for sampleGeography */
export declare const geographyAt: typeof sampleGeography;
//# sourceMappingURL=masterWorldGeography.d.ts.map