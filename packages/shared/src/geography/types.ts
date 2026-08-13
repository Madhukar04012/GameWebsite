/**
 * Master World Geography Types — single source of truth for all spatial,
 * geological, hydrological, climatic, and landmark systems across LEGEND.
 */

export type RegionId =
  | "capital_kingdom"
  | "frostpeak_ridge"
  | "whistling_woods"
  | "sunstone_highlands"
  | "gloomwood_basin"
  | "emerald_coast";

export type SubregionId =
  | "royal_palace_terrace"
  | "capital_districts"
  | "sunwell_basin"
  | "frostpeak_glacier"
  | "silverpine_pass"
  | "whistling_canopy"
  | "willow_brook"
  | "sunstone_mesas"
  | "ashen_crags"
  | "gloomwood_delta"
  | "mistmire_fen"
  | "emerald_harbor";

export type LandformKind =
  | "alpine_ridge"
  | "mountain_peak"
  | "plateau_mesa"
  | "river_canyon"
  | "alluvial_valley"
  | "coastal_basin"
  | "wetland_delta";

export type ElevationZone =
  | "subsea"        // < -1m
  | "lowland_marsh" // -1m to +2m
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
  dominantGround: string;
  fogColor: string;
  ambientColor: string;
  skyTint: string;
  waterTint: string;
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

export interface BiomeTransitionZone {
  fromRegion: RegionId;
  toRegion: RegionId;
  boundaryAxis: "x" | "z" | "radial";
  center: number;
  transitionWidth: number;
}

/** Result of sampling the master geography model at any world (x, z) */
export interface GeographySample {
  region: RegionGeographyDef;
  elevationZone: ElevationZone;
  macroElevation: number;
  moisture: number;
  distToRiver: number;
  isCityPlateau: boolean;
  nearestLandmark?: MasterLandmarkDef;
  transitionWeights: Record<RegionId, number>;
}
