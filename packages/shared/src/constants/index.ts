/* ── World ── */
export const TILE_SIZE = 1;
export const WORLD_SIZE = 400;
export const CHUNK_SIZE = 20;

/* ── World bounds (terrain + city) ── */
export const WORLD_BOUNDS = {
  terrainSize: 400,
  citySize: 92, // full diameter of walled city
  wallHeight: 9,
  towerHeight: 14,
} as const;

/* ── City bounds (Capital Kingdom) — scaled up for believable MMORPG feel ── */
export const CITY_BOUNDS = {
  minX: -46,
  maxX: 46,
  minZ: -46,
  maxZ: 46,
} as const;

/* ── Road network (segment endpoints in world space) ── */
export type RoadType = "main" | "plaza" | "district" | "dirt";

export interface RoadSegment {
  id: string;
  from: { x: number; z: number };
  to: { x: number; z: number };
  width: number;
  type: RoadType;
}

export const ROAD_WIDTH = { main: 8, plaza: 12, district: 6, dirt: 4 } as const;

export const ROADS: RoadSegment[] = [
  // 1. Imperial High Avenue (South Gate z=-46 -> Central Plaza z=-4 -> North Gate z=+46)
  { id: "main-south", from: { x: 0, z: -46 }, to: { x: 0, z: -4 }, width: ROAD_WIDTH.main, type: "main" },
  { id: "main-north", from: { x: 0, z: -4 }, to: { x: 0, z: 46 }, width: ROAD_WIDTH.main, type: "main" },

  // 2. East-West Trans-Plaza Boulevard (West Gate x=-44 -> Central Plaza x=0 -> East Gate x=+44)
  { id: "plaza-cross-w", from: { x: -44, z: -4 }, to: { x: 0, z: -4 }, width: ROAD_WIDTH.plaza, type: "plaza" },
  { id: "plaza-cross-e", from: { x: 0, z: -4 }, to: { x: 44, z: -4 }, width: ROAD_WIDTH.plaza, type: "plaza" },

  // 3. Northern Citadel Promenade (Connecting Noble District to Citadel and Cathedral)
  { id: "citadel-prom-w", from: { x: -28, z: -24 }, to: { x: 0, z: -24 }, width: ROAD_WIDTH.district, type: "district" },
  { id: "citadel-prom-e", from: { x: 0, z: -24 }, to: { x: 28, z: -24 }, width: ROAD_WIDTH.district, type: "district" },
  { id: "citadel-approach", from: { x: 0, z: -24 }, to: { x: 0, z: -36 }, width: ROAD_WIDTH.main, type: "main" },

  // 4. Market & Commercial Ring (East)
  { id: "market-avenue", from: { x: 6, z: -4 }, to: { x: 24, z: 6 }, width: ROAD_WIDTH.district, type: "district" },
  { id: "market-loop-n", from: { x: 24, z: 6 }, to: { x: 28, z: -16 }, width: ROAD_WIDTH.district, type: "district" },
  { id: "market-loop-s", from: { x: 24, z: 6 }, to: { x: 28, z: 18 }, width: ROAD_WIDTH.district, type: "district" },
  { id: "inn-access", from: { x: 24, z: 6 }, to: { x: 36, z: 8 }, width: ROAD_WIDTH.dirt, type: "dirt" },

  // 5. Southern Artisan & Residential Way (Connecting Guilds, Guard, Residential)
  { id: "artisan-way-w", from: { x: -36, z: 18 }, to: { x: 0, z: 18 }, width: ROAD_WIDTH.district, type: "district" },
  { id: "artisan-way-e", from: { x: 0, z: 18 }, to: { x: 36, z: 18 }, width: ROAD_WIDTH.district, type: "district" },

  // 6. Western Guild & Forge Arterials
  { id: "guild-quarter", from: { x: -6, z: -4 }, to: { x: -28, z: -12 }, width: ROAD_WIDTH.district, type: "district" },
  { id: "forge-lane", from: { x: -28, z: -4 }, to: { x: -36, z: 24 }, width: ROAD_WIDTH.district, type: "district" },
  { id: "training-access", from: { x: -6, z: 18 }, to: { x: -22, z: 22 }, width: ROAD_WIDTH.district, type: "district" },

  // 7. Harbor Canal Quay (North Wharf)
  { id: "harbor-quay-w", from: { x: -24, z: 38 }, to: { x: 0, z: 38 }, width: ROAD_WIDTH.district, type: "district" },
  { id: "harbor-quay-e", from: { x: 0, z: 38 }, to: { x: 24, z: 38 }, width: ROAD_WIDTH.district, type: "district" },
];

/* ── Spawn Point ── */
export const PLAYER_SPAWN = { x: 0, z: -38 };

/* ── South Gate ── */
export const SOUTH_GATE_POSITION = { x: 0, z: -46 };

/* ── Player ── */
export const PLAYER = {
  walkSpeed: 4,
  runSpeed: 8,
  jumpForce: 5,
  maxHp: 100,
  baseHpRegen: 1,
} as const;

/* ── Combat ── */
export const COMBAT = {
  baseMeleeRange: 2,
  baseAttackSpeed: 1,
  baseDamage: 10,
} as const;

/* ── City Districts ── */
export type DistrictName =
  | "castle"
  | "noble"
  | "central_plaza"
  | "guild_hall"
  | "market"
  | "training"
  | "blacksmith"
  | "residential"
  | "inn"
  | "harbor";

export interface BuildingDef {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  color?: string;
  label?: string;
  /** Roof silhouette for blockout; dispatcher in CityBuilding. */
  roof?: "gable" | "flat" | "tower" | "cone" | "dome";
  /** Optional architectural metadata */
  floors?: number;
  hasBalcony?: boolean;
  hasChimney?: boolean;
  shopSign?: "potion" | "sword" | "tankard" | "anvil" | "shield" | "scroll";
}

export interface DistrictDef {
  name: DistrictName;
  label: string;
  color: string;
  center: { x: number; z: number };
  radius: number;
  buildings: BuildingDef[];
}

export const CITY_LAYOUT: DistrictDef[] = [
  {
    name: "castle",
    label: "Royal Citadel of Solaria",
    color: "#8a7a5a",
    center: { x: 0, z: -34 },
    radius: 20,
    buildings: [
      { x: 0, z: -36, w: 14, d: 12, h: 16, label: "Royal High Palace", roof: "dome", floors: 4, hasChimney: true },
      { x: -9, z: -42, w: 4.5, d: 4.5, h: 22, label: "Citadel West Spire", roof: "tower", floors: 5 },
      { x: 9, z: -42, w: 4.5, d: 4.5, h: 22, label: "Citadel East Spire", roof: "tower", floors: 5 },
      { x: 0, z: -44, w: 8, d: 4, h: 7, label: "Citadel North Barbican", roof: "flat", floors: 2 },
      { x: -12, z: -32, w: 5, d: 5, h: 12, label: "Royal Archives", roof: "gable", floors: 3, hasChimney: true },
      { x: 12, z: -32, w: 5, d: 5, h: 12, label: "Sovereign Guardhouse", roof: "gable", floors: 3, hasChimney: true },
      { x: -7, z: -27, w: 4, d: 4, h: 8, label: "High Chancellor's Office", roof: "gable", floors: 2 },
      { x: 7, z: -27, w: 4, d: 4, h: 8, label: "Royal Treasury", roof: "flat", floors: 2 },
    ],
  },
  {
    name: "central_plaza",
    label: "Central Royal Plaza",
    color: "#b8963e",
    center: { x: 0, z: -4 },
    radius: 16,
    buildings: [
      { x: 0, z: -4, w: 2.2, d: 2.2, h: 1.2, color: "#d4af37", label: "The Sunwell Fountain", roof: "flat" },
      { x: -10, z: -4, w: 0.6, d: 0.6, h: 2.2, color: "#d4af37", label: "West Grand Gaslight", roof: "flat" },
      { x: 10, z: -4, w: 0.6, d: 0.6, h: 2.2, color: "#d4af37", label: "East Grand Gaslight", roof: "flat" },
      { x: 0, z: -14, w: 0.6, d: 0.6, h: 2.2, color: "#d4af37", label: "North Grand Gaslight", roof: "flat" },
      { x: 0, z: 6, w: 0.6, d: 0.6, h: 2.2, color: "#d4af37", label: "South Grand Gaslight", roof: "flat" },
    ],
  },
  {
    name: "noble",
    label: "Noble District & Estates",
    color: "#c4a96a",
    center: { x: -26, z: -24 },
    radius: 16,
    buildings: [
      { x: -24, z: -22, w: 7, d: 6, h: 9, label: "Solaris Noble Manor", roof: "gable", floors: 3, hasBalcony: true, hasChimney: true },
      { x: -34, z: -20, w: 6, d: 6, h: 8.5, label: "Silvercrest Estate", roof: "gable", floors: 2, hasBalcony: true, hasChimney: true },
      { x: -22, z: -32, w: 6.5, d: 5.5, h: 9.5, label: "Grand Chancellor Manor", roof: "cone", floors: 3, hasBalcony: true },
      { x: -33, z: -30, w: 5, d: 5, h: 7.5, label: "Noble Carriage House", roof: "gable", floors: 2, hasChimney: true },
      { x: -18, z: -16, w: 4.5, d: 4.5, h: 6.5, label: "Noble Gate Lodge", roof: "flat", floors: 2 },
    ],
  },
  {
    name: "guild_hall",
    label: "Adventurer's Guild & Archives",
    color: "#7a6a4a",
    center: { x: -32, z: -10 },
    radius: 15,
    buildings: [
      { x: -30, z: -10, w: 8, d: 7, h: 10.5, label: "Grand Adventurer's Guildhall", roof: "gable", floors: 3, hasBalcony: true, hasChimney: true, shopSign: "sword" },
      { x: -39, z: -12, w: 5.5, d: 4.5, h: 7, label: "Guild Training Stables", roof: "gable", floors: 2 },
      { x: -28, z: -18, w: 4.5, d: 4.5, h: 14, label: "Arcane Observatory Tower", roof: "tower", floors: 4, shopSign: "scroll" },
      { x: -38, z: -4, w: 5, d: 5, h: 6.5, label: "Mercenary Bounty Office", roof: "gable", floors: 2, shopSign: "shield" },
    ],
  },
  {
    name: "market",
    label: "Grand Market Bazaar & Emporium",
    color: "#9a8a6a",
    center: { x: 24, z: 4 },
    radius: 18,
    buildings: [
      { x: 20, z: 0, w: 7.5, d: 6, h: 8, label: "Grand Market Hall", roof: "gable", floors: 2, hasBalcony: true, hasChimney: true },
      { x: 30, z: -2, w: 5.5, d: 4.5, h: 7, label: "Master Alchemist Apothecary", roof: "cone", floors: 2, hasChimney: true, shopSign: "potion" },
      { x: 18, z: 9, w: 5, d: 5, h: 7.5, label: "Arcane Enchantment Emporium", roof: "dome", floors: 2, hasBalcony: true, shopSign: "scroll" },
      { x: 28, z: 8, w: 5.5, d: 4.5, h: 6.5, label: "Solaria Merchant Guild", roof: "gable", floors: 2, hasChimney: true },
      { x: 36, z: 2, w: 4.5, d: 4.5, h: 6, label: "Master Jeweler & Gemcutter", roof: "flat", floors: 2 },
      { x: 22, z: 16, w: 5, d: 4.5, h: 6.5, label: "Royal Baker's Guild", roof: "gable", floors: 2, hasChimney: true },
      { x: 30, z: 15, w: 4.5, d: 4.5, h: 6, label: "Spice Merchant Vaults", roof: "flat", floors: 2 },
    ],
  },
  {
    name: "inn",
    label: "The Sleeping Giant Inn & Tavern",
    color: "#8a7a3a",
    center: { x: 36, z: 10 },
    radius: 12,
    buildings: [
      { x: 36, z: 10, w: 8, d: 6.5, h: 9.5, label: "The Sleeping Giant Inn", roof: "gable", floors: 3, hasBalcony: true, hasChimney: true, shopSign: "tankard" },
      { x: 41, z: 16, w: 4.5, d: 4, h: 5.5, label: "Wayfarer's Stable & Brewery", roof: "gable", floors: 1 },
    ],
  },
  {
    name: "training",
    label: "Knight Barracks & Sparring Yard",
    color: "#6a5a4a",
    center: { x: -22, z: 22 },
    radius: 14,
    buildings: [
      { x: -20, z: 20, w: 8, d: 6.5, h: 7.5, label: "Royal Knight Barracks", roof: "flat", floors: 2, hasChimney: true },
      { x: -28, z: 18, w: 5, d: 4.5, h: 6.5, label: "Armory & Weapon Storage", roof: "gable", floors: 2, shopSign: "shield" },
      { x: -18, z: 28, w: 6, d: 5, h: 4, label: "Archery Range Pavilion", roof: "flat", floors: 1 },
      { x: -26, z: 26, w: 4.5, d: 4.5, h: 5.5, label: "Guard Watchpost", roof: "tower", floors: 2 },
    ],
  },
  {
    name: "blacksmith",
    label: "Great Ironworks & Master Forge",
    color: "#5a3a2a",
    center: { x: -36, z: 26 },
    radius: 12,
    buildings: [
      { x: -36, z: 24, w: 7, d: 6, h: 8.5, label: "Great Ironworks Foundry", roof: "gable", floors: 2, hasChimney: true, shopSign: "anvil" },
      { x: -42, z: 28, w: 4.5, d: 4.5, h: 7, label: "Blast Furnace & Crucible", roof: "cone", floors: 1, hasChimney: true },
      { x: -34, z: 32, w: 5, d: 4.5, h: 6, label: "Armor Smithy & Anvil Bay", roof: "gable", floors: 1, shopSign: "sword" },
    ],
  },
  {
    name: "residential",
    label: "Residential Quarters & Townhouses",
    color: "#7a7a5a",
    center: { x: 26, z: 28 },
    radius: 16,
    buildings: [
      { x: 18, z: 24, w: 5, d: 4.5, h: 7.5, label: "Sunbeam Townhouse", roof: "gable", floors: 2, hasBalcony: true, hasChimney: true },
      { x: 26, z: 24, w: 4.5, d: 4.5, h: 7, label: "Cobblestone Haven", roof: "gable", floors: 2, hasChimney: true },
      { x: 33, z: 24, w: 5, d: 4, h: 6.5, label: "Weaver's Row Home", roof: "gable", floors: 2, hasChimney: true },
      { x: 20, z: 32, w: 5.5, d: 4.5, h: 8, label: "Highcrest Townhouse", roof: "gable", floors: 3, hasBalcony: true, hasChimney: true },
      { x: 28, z: 32, w: 4.5, d: 4.5, h: 6.5, label: "Artisan Quarter Home", roof: "gable", floors: 2, hasChimney: true },
      { x: 35, z: 31, w: 5, d: 4.5, h: 7, label: "Garden Lane Cottage", roof: "gable", floors: 2, hasChimney: true },
    ],
  },
  {
    name: "harbor",
    label: "Royal Canal Docks & Waterway",
    color: "#5a6a7a",
    center: { x: 0, z: 40 },
    radius: 15,
    buildings: [
      { x: 0, z: 38, w: 8, d: 5, h: 8, label: "Harbor Master's Citadel", roof: "flat", floors: 2, hasBalcony: true },
      { x: -8, z: 42, w: 5.5, d: 4, h: 6, label: "Royal Customs & Quarantine", roof: "gable", floors: 2 },
      { x: 8, z: 42, w: 5.5, d: 4, h: 6, label: "South Canal Warehouse", roof: "flat", floors: 2 },
      { x: -16, z: 40, w: 3.5, d: 3.5, h: 14, label: "North Canal Beacon Light", roof: "tower", floors: 4 },
      { x: 16, z: 40, w: 4.5, d: 4, h: 5.5, label: "Boatwright & Rigging Depot", roof: "gable", floors: 1 },
    ],
  },
];

/* ── Leveling ── */
export const XP_TABLE: Record<number, number> = {
  1: 100,
  2: 200,
  3: 400,
  4: 700,
  5: 1100,
  6: 1600,
  7: 2200,
  8: 2900,
  9: 3700,
  10: 4600,
};

/* ── Vegetation patches (world-space regions for instanced props) ── */
export type VegKind = "tree" | "bush" | "flower" | "grass" | "rock" | "log";

export interface VegPatch {
  id: string;
  kind: VegKind;
  /** Bounding box center + radius for scatter. */
  center: { x: number; z: number };
  radius: number;
  /** Approx instance count for the patch. */
  count: number;
}

/* Patches are deliberately outside the city walls + meadow near Flower Fields.
 * Generated/seeded in Vegetation.tsx from these definitions. */
export const VEGETATION_PATCHES: VegPatch[] = [
  { id: "trees-nw", kind: "tree", center: { x: -90, z: -60 }, radius: 40, count: 60 },
  { id: "trees-ne", kind: "tree", center: { x: 90, z: -60 }, radius: 40, count: 60 },
  { id: "trees-s", kind: "tree", center: { x: 0, z: -130 }, radius: 50, count: 80 },
  { id: "bushes-ring", kind: "bush", center: { x: -70, z: -30 }, radius: 30, count: 40 },
  { id: "flowers-meadow", kind: "flower", center: { x: 0, z: -150 }, radius: 40, count: 120 },
  { id: "grass-meadow", kind: "grass", center: { x: 0, z: -150 }, radius: 50, count: 200 },
  { id: "rocks-n", kind: "rock", center: { x: 60, z: -130 }, radius: 30, count: 30 },
  { id: "logs-nw", kind: "log", center: { x: -100, z: -70 }, radius: 25, count: 12 },
];

/* ── Surrounding biomes ── */
export type BiomeKind =
  | "plains"
  | "royal_plains"
  | "ancient_forest"
  | "mistwood"
  | "crystal_highlands"
  | "frost_peaks"
  | "ashen_mountains"
  | "golden_desert"
  | "emerald_coast"
  | "shadow_marsh"
  | "ancient_ruins";

export interface BiomeDef {
  id: BiomeKind;
  label: string;
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  groundVariant: string;
  fogColor: string;
  ambientColor: string;
  skyTint?: string;
  waterTint?: string;
  vegetationTint?: string;
}

export const BIOME_DEFS: BiomeDef[] = [
  // Core / Capital region
  { id: "royal_plains", label: "Royal Plains", bounds: { minX: -200, maxX: 200, minZ: -200, maxZ: -50 }, groundVariant: "world", fogColor: "#8fbc8f", ambientColor: "#a8d0a8", skyTint: "#87ceeb", waterTint: "#4a90d9", vegetationTint: "#6ab04c" },

  // West biomes
  { id: "ancient_forest", label: "Ancient Forest", bounds: { minX: -200, maxX: -50, minZ: -200, maxZ: 50 }, groundVariant: "grove", fogColor: "#2d5a2d", ambientColor: "#3d7a3d", skyTint: "#5a8a5a", waterTint: "#2d6a4d", vegetationTint: "#4a8a3a" },
  { id: "mistwood", label: "Mistwood", bounds: { minX: -200, maxX: -50, minZ: 50, maxZ: 200 }, groundVariant: "bog", fogColor: "#5a5a7a", ambientColor: "#6a6a9a", skyTint: "#7a7a9a", waterTint: "#4a4a6a", vegetationTint: "#5a7a5a" },

  // North biomes
  { id: "crystal_highlands", label: "Crystal Highlands", bounds: { minX: -50, maxX: 50, minZ: 50, maxZ: 200 }, groundVariant: "frost", fogColor: "#b0d0f0", ambientColor: "#c0e0ff", skyTint: "#a0c8f0", waterTint: "#80b8f0", vegetationTint: "#90c0d0" },
  { id: "frost_peaks", label: "Frost Peaks", bounds: { minX: -150, maxX: 150, minZ: 150, maxZ: 300 }, groundVariant: "frost", fogColor: "#a8c8e0", ambientColor: "#b0d0f0", skyTint: "#90b8e0", waterTint: "#70a8d0", vegetationTint: "#80a8c0" },

  // East biomes
  { id: "ashen_mountains", label: "Ashen Mountains", bounds: { minX: 80, maxX: 250, minZ: -100, maxZ: 100 }, groundVariant: "ashen", fogColor: "#4a3730", ambientColor: "#8a5a3a", skyTint: "#8a4a3a", waterTint: "#6a3a2a", vegetationTint: "#5a3a2a" },
  { id: "golden_desert", label: "Golden Desert", bounds: { minX: 100, maxX: 300, minZ: -150, maxZ: 50 }, groundVariant: "desert", fogColor: "#d4b87a", ambientColor: "#c4a060", skyTint: "#f0d8a0", waterTint: "#c4a850", vegetationTint: "#b49040" },

  // South biomes
  { id: "emerald_coast", label: "Emerald Coast", bounds: { minX: -200, maxX: 200, minZ: -300, maxZ: -200 }, groundVariant: "world", fogColor: "#4ab8a0", ambientColor: "#6ac8b8", skyTint: "#6ad8e8", waterTint: "#2aa8a8", vegetationTint: "#4ab88a" },
  { id: "shadow_marsh", label: "Shadow Marsh", bounds: { minX: -200, maxX: 0, minZ: -300, maxZ: -150 }, groundVariant: "bog", fogColor: "#2a3a2a", ambientColor: "#3a5a3a", skyTint: "#4a5a4a", waterTint: "#1a3a2a", vegetationTint: "#3a5a2a" },

  // Central special
  { id: "ancient_ruins", label: "Ancient Ruins", bounds: { minX: -100, maxX: 100, minZ: 50, maxZ: 150 }, groundVariant: "world", fogColor: "#7a6a5a", ambientColor: "#8a7a6a", skyTint: "#9a8a7a", waterTint: "#5a4a3a", vegetationTint: "#6a5a4a" },
];

export const BIOME_ATMOSPHERE: Record<BiomeKind, { dustMotes: boolean; sparkleCount: number; fogDensity: number; windStrength: number }> = {
  plains: { dustMotes: true, sparkleCount: 0, fogDensity: 0.0065, windStrength: 0.5 },
  royal_plains: { dustMotes: true, sparkleCount: 0, fogDensity: 0.005, windStrength: 0.4 },
  ancient_forest: { dustMotes: false, sparkleCount: 30, fogDensity: 0.015, windStrength: 0.3 },
  mistwood: { dustMotes: false, sparkleCount: 50, fogDensity: 0.025, windStrength: 0.2 },
  crystal_highlands: { dustMotes: true, sparkleCount: 60, fogDensity: 0.012, windStrength: 0.6 },
  frost_peaks: { dustMotes: true, sparkleCount: 40, fogDensity: 0.018, windStrength: 0.8 },
  ashen_mountains: { dustMotes: true, sparkleCount: 20, fogDensity: 0.015, windStrength: 0.7 },
  golden_desert: { dustMotes: true, sparkleCount: 0, fogDensity: 0.006, windStrength: 0.6 },
  emerald_coast: { dustMotes: true, sparkleCount: 25, fogDensity: 0.01, windStrength: 0.5 },
  shadow_marsh: { dustMotes: false, sparkleCount: 40, fogDensity: 0.022, windStrength: 0.3 },
  ancient_ruins: { dustMotes: true, sparkleCount: 35, fogDensity: 0.01, windStrength: 0.4 },
};

export function biomeAt(x: number, z: number): BiomeKind {
  for (const def of BIOME_DEFS) if (x >= def.bounds.minX && x <= def.bounds.maxX && z >= def.bounds.minZ && z <= def.bounds.maxZ) return def.id;
  return "plains";
}
