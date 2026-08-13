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

import type {
  RegionId,
  RegionGeographyDef,
  LandformDef,
  WaterSpringDef,
  RiverDrainageDef,
  TravelCorridorDef,
  MasterLandmarkDef,
  ElevationZone,
  GeographySample,
} from "./types";

/* ── 1. World Coordinate Contract ── */
export const WORLD_COORDINATE_CONTRACT = {
  origin: { x: 0, z: 0, description: "Central Royal Plaza Fountain of Capital Kingdom" },
  axes: {
    north: "+Z (Highlands, Frostpeak Ridge, Glaciers)",
    south: "-Z (Coastal Slopes, Emerald Coast, Ocean Basin, South Gate at z=-46)",
    east: "+X (Sunstone Plateau, Ashen Volcanic Crags, Desert)",
    west: "-X (Whistling Woods, Willow Glades, Gloomwood Marsh)",
    elevation: "+Y (Height above sea level in meters)",
  },
  worldDiameter: 400, // -200 to +200 in X and Z
  cityPerimeterRadius: 50, // Capital Kingdom flat defensible plateau
} as const;

/* ── 2. Macro Regions ── */
export const MASTER_REGIONS: Record<RegionId, RegionGeographyDef> = {
  capital_kingdom: {
    id: "capital_kingdom",
    name: "Capital Kingdom of Solaria",
    loreTitle: "The Sovereign Seat of Light",
    bounds: { minX: -50, maxX: 50, minZ: -50, maxZ: 50 },
    center: { x: 0, z: -4 },
    baseElevation: 0.0,
    climate: "temperate",
    moisture: 0.5,
    dominantGround: "stone",
    fogColor: "#8fbc8f",
    ambientColor: "#ffffff",
    skyTint: "#87ceeb",
    waterTint: "#00a8e8",
  },
  frostpeak_ridge: {
    id: "frostpeak_ridge",
    name: "Frostpeak Ridge",
    loreTitle: "The Glacial Crown of the North",
    bounds: { minX: -200, maxX: 200, minZ: 60, maxZ: 200 },
    center: { x: 0, z: 150 },
    baseElevation: 22.0,
    climate: "arctic",
    moisture: 0.7,
    dominantGround: "snow",
    fogColor: "#b0d0f0",
    ambientColor: "#c0e0ff",
    skyTint: "#a0c8f0",
    waterTint: "#70a8d0",
  },
  whistling_woods: {
    id: "whistling_woods",
    name: "Whistling Woods",
    loreTitle: "The Ancient Singing Forest",
    bounds: { minX: -200, maxX: -50, minZ: -100, maxZ: 80 },
    center: { x: -120, z: -10 },
    baseElevation: 6.0,
    climate: "temperate",
    moisture: 0.65,
    dominantGround: "grass",
    fogColor: "#2d5a2d",
    ambientColor: "#3d7a3d",
    skyTint: "#5a8a5a",
    waterTint: "#2d6a4d",
  },
  sunstone_highlands: {
    id: "sunstone_highlands",
    name: "Sunstone Highlands & Ashen Crags",
    loreTitle: "The Scorched Basalt Plateaus",
    bounds: { minX: 60, maxX: 200, minZ: -80, maxZ: 140 },
    center: { x: 130, z: 20 },
    baseElevation: 15.0,
    climate: "arid",
    moisture: 0.15,
    dominantGround: "sand",
    fogColor: "#d4b87a",
    ambientColor: "#c4a060",
    skyTint: "#f0d8a0",
    waterTint: "#c4a850",
  },
  gloomwood_basin: {
    id: "gloomwood_basin",
    name: "Gloomwood Basin & Mistmire",
    loreTitle: "The Sunken Weeping Marshlands",
    bounds: { minX: -200, maxX: -20, minZ: -200, maxZ: -80 },
    center: { x: -90, z: -140 },
    baseElevation: -0.8,
    climate: "humid_marsh",
    moisture: 0.95,
    dominantGround: "grass",
    fogColor: "#2a3a2a",
    ambientColor: "#3a5a3a",
    skyTint: "#4a5a4a",
    waterTint: "#1a3a2a",
  },
  emerald_coast: {
    id: "emerald_coast",
    name: "Emerald Coast & Harbor Delta",
    loreTitle: "The Southern Shimmering Sea Approaches",
    bounds: { minX: -20, maxX: 200, minZ: -200, maxZ: -80 },
    center: { x: 80, z: -140 },
    baseElevation: 1.2,
    climate: "oceanic",
    moisture: 0.8,
    dominantGround: "grass",
    fogColor: "#4ab8a0",
    ambientColor: "#6ac8b8",
    skyTint: "#6ad8e8",
    waterTint: "#0077b6",
  },
};

/* ── 3. Major Landforms ── */
export const MASTER_LANDFORMS: LandformDef[] = [
  {
    id: "frostpeak_crest",
    name: "Frostpeak Alpine Crest",
    kind: "alpine_ridge",
    regionId: "frostpeak_ridge",
    center: { x: 0, z: 165 },
    radius: 70,
    peakElevation: 36.0,
    profile: "ridge",
  },
  {
    id: "silvercrest_peak",
    name: "Mount Silvercrest Summit",
    kind: "mountain_peak",
    regionId: "frostpeak_ridge",
    center: { x: 55, z: 175 },
    radius: 40,
    peakElevation: 38.5,
    profile: "dome",
  },
  {
    id: "ashen_volcanic_crag",
    name: "Ashen Basalt Ridge",
    kind: "plateau_mesa",
    regionId: "sunstone_highlands",
    center: { x: 140, z: 25 },
    radius: 55,
    peakElevation: 22.0,
    profile: "plateau",
  },
  {
    id: "sunstone_mesa_spires",
    name: "Sunstone Mesa Formations",
    kind: "plateau_mesa",
    regionId: "sunstone_highlands",
    center: { x: 120, z: -40 },
    radius: 45,
    peakElevation: 18.0,
    profile: "plateau",
  },
  {
    id: "royal_river_gorge",
    name: "Royal Torrent River Canyon",
    kind: "river_canyon",
    regionId: "whistling_woods",
    center: { x: -40, z: -20 },
    radius: 120,
    peakElevation: -3.5, // Depression depth
    profile: "canyon",
  },
  {
    id: "whistling_valley",
    name: "Whistling Forest Valley Basin",
    kind: "alluvial_valley",
    regionId: "whistling_woods",
    center: { x: -110, z: -10 },
    radius: 65,
    peakElevation: 6.5,
    profile: "dome",
  },
  {
    id: "gloomwood_delta_basin",
    name: "Gloomwood Lowland Delta",
    kind: "wetland_delta",
    regionId: "gloomwood_basin",
    center: { x: -80, z: -130 },
    radius: 60,
    peakElevation: -1.2,
    profile: "trough",
  },
];

/* ── 4. Hydrology & Natural Drainage ── */
export const MASTER_SPRINGS: WaterSpringDef[] = [
  { id: "glacier_spring_1", name: "Glacial Tear Spring", source: { x: -25, z: 175 }, elevation: 34.0, flowRate: 85 },
  { id: "glacier_spring_2", name: "Frostfall Headwaters", source: { x: 30, z: 165 }, elevation: 32.0, flowRate: 65 },
];

export const MASTER_DRAINAGE: RiverDrainageDef[] = [
  {
    id: "royal_torrent_river",
    name: "The Royal Torrent River",
    originRegion: "frostpeak_ridge",
    destinationRegion: "emerald_coast",
    waypoints: [
      { x: 0, z: 180, width: 4.5, depth: 1.8 },
      { x: -15, z: 120, width: 6.0, depth: 2.2 },
      { x: -35, z: 60, width: 8.0, depth: 2.8 },
      { x: -42, z: 0, width: 10.0, depth: 3.5 },
      { x: -38, z: -60, width: 12.0, depth: 3.2 },
      { x: -20, z: -120, width: 16.0, depth: 2.8 },
      { x: 0, z: -180, width: 28.0, depth: 2.0 },
    ],
  },
];

/* ── 5. World Travel Corridors & Highways ── */
export const MASTER_TRAVEL_CORRIDORS: TravelCorridorDef[] = [
  {
    id: "corridor_north_pass",
    name: "Northern Mountain Pass (Highland Switchback)",
    connects: ["capital_kingdom", "frostpeak_ridge"],
    difficulty: "dangerous",
    pathNodes: [
      { x: 0, z: 40 },
      { x: 5, z: 75 },
      { x: -15, z: 110 },
      { x: -30, z: 145 },
      { x: 0, z: 180 },
    ],
    description: "Carved through the icy rock cliffs, this switchback route connects the Capital North Gate to the Frostpeak Citadel.",
  },
  {
    id: "corridor_west_forest",
    name: "Great Western Forest Highway",
    connects: ["capital_kingdom", "whistling_woods"],
    difficulty: "safe",
    pathNodes: [
      { x: -46, z: -4 },
      { x: -75, z: -10 },
      { x: -110, z: -25 },
      { x: -140, z: -30 },
    ],
    description: "Wide cobblestone merchant road shaded by ancient willows leading to the Heartwood Arch-Tree and Guild camps.",
  },
  {
    id: "corridor_east_silkway",
    name: "Eastern Sunstone Silkway",
    connects: ["capital_kingdom", "sunstone_highlands"],
    difficulty: "moderate",
    pathNodes: [
      { x: 46, z: -4 },
      { x: 80, z: 5 },
      { x: 120, z: 20 },
      { x: 155, z: 35 },
    ],
    description: "A windswept sandstone route climbing into the basalt plateaus and merchant bazaars of the Sunstone Highlands.",
  },
  {
    id: "corridor_south_kings_highway",
    name: "Southern King's Highway",
    connects: ["capital_kingdom", "emerald_coast"],
    difficulty: "safe",
    pathNodes: [
      { x: 0, z: -46 },
      { x: 0, z: -80 },
      { x: 15, z: -120 },
      { x: 35, z: -160 },
    ],
    description: "The primary royal artery exiting the South Gate towards the Sunblossom meadows and Emerald Coast harbor.",
  },
];

/* ── 6. Master Landmark Registry ── */
export const MASTER_LANDMARKS: MasterLandmarkDef[] = [
  {
    id: "landmark_royal_palace",
    name: "Royal High Palace of Solaria",
    region: "capital_kingdom",
    category: "citadel",
    position: { x: 0, z: -26 },
    elevation: 2.0,
    visibilityRadius: 150,
    importance: "major",
    loreDescription: "Towering seat of the Solar King with soaring spires, gold dome, and rose window overlooking the realm.",
  },
  {
    id: "landmark_grand_cathedral",
    name: "Grand Cathedral of Light",
    region: "capital_kingdom",
    category: "temple",
    position: { x: -28, z: -4 },
    elevation: 0.0,
    visibilityRadius: 120,
    importance: "major",
    loreDescription: "Monumental stone cathedral with twin bell towers, flying buttresses, and glowing stained glass sanctum.",
  },
  {
    id: "landmark_heartwood_tree",
    name: "Heartwood Arch-Tree",
    region: "whistling_woods",
    category: "natural_wonder",
    position: { x: -95, z: -25 },
    elevation: 6.0,
    visibilityRadius: 140,
    importance: "major",
    loreDescription: "An ancient 28-meter titan tree with bioluminescent foliage illuminating the surrounding forest canopy.",
  },
  {
    id: "landmark_floating_sky_temple",
    name: "Floating Sky Temple of Aether",
    region: "sunstone_highlands",
    category: "temple",
    position: { x: 110, z: 40 },
    elevation: 32.0,
    visibilityRadius: 180,
    importance: "major",
    loreDescription: "Ancient levitating island with glowing runic pillars and an unceasing elemental power core.",
  },
  {
    id: "landmark_wyrms_rest",
    name: "Wyrm's Rest Dragon Skeleton",
    region: "sunstone_highlands",
    category: "ancient_ruin",
    position: { x: 75, z: -35 },
    elevation: 14.0,
    visibilityRadius: 100,
    importance: "regional",
    loreDescription: "Colossal ribcage and skull of an ancient mythical dragon half-buried in the sunlit sands.",
  },
  {
    id: "landmark_frostpeak_citadel",
    name: "Frostpeak Alpine Citadel",
    region: "frostpeak_ridge",
    category: "citadel",
    position: { x: -30, z: 145 },
    elevation: 30.0,
    visibilityRadius: 160,
    importance: "major",
    loreDescription: "Impenetrable fortress battlement guarding the northern mountain passes amidst icy snow flurries.",
  },
  {
    id: "landmark_sunken_cathedral",
    name: "Sunken Cathedral of Mist",
    region: "gloomwood_basin",
    category: "ancient_ruin",
    position: { x: -75, z: -85 },
    elevation: -0.5,
    visibilityRadius: 90,
    importance: "regional",
    loreDescription: "Submerged ruins of an age-old sanctuary surrounded by glowing marsh mushrooms and weeping willows.",
  },
  {
    id: "landmark_ancient_arch_bridge",
    name: "Ancient Royal Arch Bridge",
    region: "capital_kingdom",
    category: "bridge",
    position: { x: 45, z: -48 },
    elevation: 1.5,
    visibilityRadius: 80,
    importance: "minor",
    loreDescription: "Stepped stone triple-arch bridge spanning the eastern river tributaries towards the highlands.",
  },
  {
    id: "landmark_sunwell_basin",
    name: "Sunwell Plaza Fountain",
    region: "capital_kingdom",
    category: "sanctuary",
    position: { x: 0, z: -4 },
    elevation: 0.0,
    visibilityRadius: 60,
    importance: "minor",
    loreDescription: "Gilded stepped fountain in the heart of Solaria housing schools of synchronized koi fish.",
  },
  {
    id: "landmark_waterfall_sanctuary",
    name: "Glacier Tear Waterfall & Grotto",
    region: "whistling_woods",
    category: "natural_wonder",
    position: { x: -38, z: 25 },
    elevation: 10.0,
    visibilityRadius: 110,
    importance: "regional",
    loreDescription: "Roaring double-cascade waterfall carving into the stone gorge with mist and glowing spray basin.",
  },
];

/* ── 7. Pure Mathematical Geography Sampling Engine ── */

/**
 * Calculates continuous weight [0.0 to 1.0] of each region at world (x, z).
 * Guarantees smooth continuous transitions without harsh bounding box pops.
 */
export function getRegionWeightsAt(x: number, z: number): Record<RegionId, number> {
  const distCapital = Math.sqrt(x * x + (z + 4) * (z + 4));
  const weights: Record<RegionId, number> = {
    capital_kingdom: 0,
    frostpeak_ridge: 0,
    whistling_woods: 0,
    sunstone_highlands: 0,
    gloomwood_basin: 0,
    emerald_coast: 0,
  };

  // Capital core weight
  if (distCapital <= 50) {
    weights.capital_kingdom = 1.0;
    return weights;
  }
  const capRamp = Math.max(0, 1.0 - (distCapital - 50) / 25);
  weights.capital_kingdom = capRamp;

  // Wilderness radial & quadrant weights
  const remaining = 1.0 - capRamp;

  // North -> Frostpeaks
  const northScore = Math.max(0, (z - 20) / 120);
  // West -> Whistling Woods / Gloomwood
  const westScore = Math.max(0, (-x - 20) / 120);
  // East -> Sunstone
  const eastScore = Math.max(0, (x - 20) / 120);
  // South -> Emerald Coast / Gloomwood
  const southScore = Math.max(0, (-z - 20) / 120);

  const rawFrost = northScore * (1.0 + Math.max(0, z / 100));
  const rawSunstone = eastScore * (1.0 + Math.max(0, x / 100));
  const rawWhistling = westScore * (1.0 - southScore * 0.5);
  const rawGloomwood = southScore * westScore * 2.0;
  const rawEmerald = southScore * (1.0 - westScore * 0.5);

  const totalRaw = rawFrost + rawSunstone + rawWhistling + rawGloomwood + rawEmerald || 1;

  weights.frostpeak_ridge = (rawFrost / totalRaw) * remaining;
  weights.sunstone_highlands = (rawSunstone / totalRaw) * remaining;
  weights.whistling_woods = (rawWhistling / totalRaw) * remaining;
  weights.gloomwood_basin = (rawGloomwood / totalRaw) * remaining;
  weights.emerald_coast = (rawEmerald / totalRaw) * remaining;

  return weights;
}

/**
 * Returns the dominant region at world (x, z).
 */
export function getDominantRegionAt(x: number, z: number): RegionGeographyDef {
  const weights = getRegionWeightsAt(x, z);
  let bestId: RegionId = "capital_kingdom";
  let maxW = -1;
  for (const [id, w] of Object.entries(weights) as [RegionId, number][]) {
    if (w > maxW) {
      maxW = w;
      bestId = id;
    }
  }
  return MASTER_REGIONS[bestId];
}

/**
 * Evaluates the River Path centerline X for a given Z coordinate.
 * Matches natural hydrological gorge meander.
 */
export function getRiverCenterlineX(z: number): number {
  return -40 + Math.sin(z * 0.02) * 18 + Math.cos(z * 0.05) * 8;
}

/**
 * Evaluates the distance from world (x, z) to the primary river centerline.
 */
export function getDistanceToRiver(x: number, z: number): number {
  const rx = getRiverCenterlineX(z);
  return Math.abs(x - rx);
}

/**
 * Evaluates the Macro Landform Elevation at world (x, z) before micro FBM erosion.
 */
export function getMacroLandformElevation(x: number, z: number): number {
  const distCity = Math.sqrt(x * x + z * z);
  if (distCity <= 50) return 0.0; // Defensible flat city plateau

  const weights = getRegionWeightsAt(x, z);

  // Regional baseline elevation
  const baseElev =
    weights.frostpeak_ridge * MASTER_REGIONS.frostpeak_ridge.baseElevation +
    weights.sunstone_highlands * MASTER_REGIONS.sunstone_highlands.baseElevation +
    weights.whistling_woods * MASTER_REGIONS.whistling_woods.baseElevation +
    weights.gloomwood_basin * MASTER_REGIONS.gloomwood_basin.baseElevation +
    weights.emerald_coast * MASTER_REGIONS.emerald_coast.baseElevation;

  // Mountain Spine & Crest Influence
  let mountainSpine = 0;
  if (z > 40) {
    const northDist = (z - 40) / 140;
    // Alpine crest ridge profile
    const ridgeNoise = Math.sin(x * 0.03) * 6.0 + Math.cos(z * 0.02) * 4.0;
    mountainSpine = northDist * (14.0 + ridgeNoise);
  }

  // River Gorge Drainage Carve
  const distRiver = getDistanceToRiver(x, z);
  const riverCarve = distRiver < 18 ? (1.0 - distRiver / 18) * 4.0 : 0.0;

  const easeFromCity = Math.min(1.0, (distCity - 50) / 25);
  return (baseElev + mountainSpine - riverCarve) * easeFromCity;
}

/**
 * Complete geography evaluation at world (x, z).
 */
export function sampleGeography(x: number, z: number): GeographySample {
  const region = getDominantRegionAt(x, z);
  const weights = getRegionWeightsAt(x, z);
  const macroElevation = getMacroLandformElevation(x, z);
  const distToRiver = getDistanceToRiver(x, z);
  const isCityPlateau = Math.sqrt(x * x + z * z) <= 50;

  // Compute elevation zone
  let elevationZone: ElevationZone = "river_valley";
  if (macroElevation < -0.5) elevationZone = "lowland_marsh";
  else if (macroElevation <= 6.0) elevationZone = "river_valley";
  else if (macroElevation <= 16.0) elevationZone = "plateau";
  else if (macroElevation <= 26.0) elevationZone = "highland";
  else elevationZone = "alpine_crest";

  // Find nearest landmark
  let nearestLandmark: MasterLandmarkDef | undefined;
  let minLandmarkDist = Infinity;
  for (const lm of MASTER_LANDMARKS) {
    const dx = lm.position.x - x;
    const dz = lm.position.z - z;
    const d = Math.sqrt(dx * dx + dz * dz);
    if (d < minLandmarkDist) {
      minLandmarkDist = d;
      nearestLandmark = lm;
    }
  }

  return {
    region,
    elevationZone,
    macroElevation,
    moisture: region.moisture,
    distToRiver,
    isCityPlateau,
    nearestLandmark,
    transitionWeights: weights,
  };
}
