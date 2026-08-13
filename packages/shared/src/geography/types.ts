/**
 * Master World Geography Types — single source of truth for all spatial,
 * geological, hydrological, climatic, travel, and landmark systems across LEGEND.
 *
 * PURE DATA + PURE MATH (No DOM / Three.js / React dependencies).
 */

export type RegionId =
  | "capital_kingdom"
  | "frostpeak_ridge"
  | "whistling_woods"
  | "sunstone_highlands"
  | "gloomwood_basin"
  | "emerald_coast";

export type SubregionId =
  | "frostpeak_foothills"
  | "alpine_slopes"
  | "glacier_zone"
  | "mountain_valleys"
  | "ancient_canopy"
  | "forest_valley"
  | "western_woodland"
  | "river_forest"
  | "sandstone_plateau"
  | "basalt_crags"
  | "dry_basin"
  | "desert_approach"
  | "mistmire_marsh"
  | "swamp_forest"
  | "emerald_basin"
  | "southern_estuary"
  | "royal_palace_terrace"
  | "city_plateau"
  | "river_approach"
  | "sunblossom_meadows";

export type LandformKind =
  | "alpine_ridge"
  | "mountain_peak"
  | "plateau_mesa"
  | "river_canyon"
  | "alluvial_valley"
  | "coastal_basin"
  | "wetland_delta";

export type ElevationZone =
  | "subsea"        // < -0.5m
  | "lowland_marsh" // -0.5m to +2m
  | "river_valley"  // +0m to +6m
  | "plateau"       // +6m to +16m
  | "highland"      // +16m to +26m
  | "alpine_crest";  // > +26m

export interface BoundingBox2D {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface RegionGeographyDef {
  id: RegionId;
  name: string;
  loreTitle: string;
  bounds: BoundingBox2D;
  center: { x: number; z: number };
  baseElevation: number; // in meters
  climate: "arctic" | "temperate" | "arid" | "humid_marsh" | "oceanic";
  moisture: number; // 0.0 (desert) to 1.0 (swamp)
  temperature: number; // in Celsius
  dominantGround: string;
  fogColor: string;
  ambientColor: string;
  skyTint: string;
  waterTint: string;
}

export interface SubregionDef {
  id: SubregionId;
  name: string;
  regionId: RegionId;
  description: string;
  center: { x: number; z: number };
  radius: number;
  elevationTarget: number;
}

export interface LandformDef {
  id: string;
  name: string;
  kind: LandformKind;
  regionId: RegionId;
  center: { x: number; z: number };
  radius: number;
  peakElevation: number;
  profile: "ridge" | "dome" | "trough" | "plateau" | "canyon";
}

export interface WaterSpringDef {
  id: string;
  name: string;
  source: { x: number; z: number };
  elevation: number;
  flowRate: number; // m3/s arbitrary scale
}

export interface RiverDrainageNode {
  x: number;
  z: number;
  width: number;
  depth: number;
  elevation: number;
}

export interface RiverDrainageDef {
  id: string;
  name: string;
  originRegion: RegionId;
  destinationRegion: RegionId;
  waypoints: RiverDrainageNode[];
}

export interface TravelCorridorDef {
  id: string;
  name: string;
  connects: [RegionId, RegionId];
  difficulty: "safe" | "moderate" | "dangerous" | "perilous";
  pathNodes: { x: number; z: number }[];
  approxWidth: number;
  terrainPreference: "cobblestone" | "dirt_trail" | "rocky_switchback" | "sand_highway";
  description: string;
}

export type LandmarkCategory =
  | "citadel"
  | "ancient_ruin"
  | "natural_wonder"
  | "temple"
  | "bridge"
  | "outpost"
  | "sanctuary";

export interface MasterLandmarkDef {
  id: string;
  name: string;
  region: RegionId;
  category: LandmarkCategory;
  position: { x: number; z: number };
  elevation: number;
  visibilityRadius: number;
  importance: "major" | "regional" | "minor";
  loreDescription: string;
}

/** Complete evaluation of any point (x, z) on the world grid */
export interface GeographySample {
  region: RegionGeographyDef;
  subregion: SubregionDef;
  landform?: LandformDef;
  elevationZone: ElevationZone;
  macroElevation: number;
  moisture: number;
  temperature: number;
  distToRiver: number;
  isCityPlateau: boolean;
  nearestLandmark?: MasterLandmarkDef;
  transitionWeights: Record<RegionId, number>;
}
