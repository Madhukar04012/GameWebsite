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

export const ROAD_WIDTH = { main: 8, plaza: 12, district: 5, dirt: 3 } as const;

export const ROADS: RoadSegment[] = [
  // South Gate -> Central Plaza (main road)
  { id: "main-south", from: { x: 0, z: -46 }, to: { x: 0, z: -4 }, width: ROAD_WIDTH.main, type: "main" },
  // Central Plaza -> Castle (main road, north)
  { id: "main-castle", from: { x: 0, z: -4 }, to: { x: 0, z: -26 }, width: ROAD_WIDTH.main, type: "main" },
  // Plaza ring
  { id: "plaza-ring-w", from: { x: -10, z: -4 }, to: { x: 10, z: -4 }, width: ROAD_WIDTH.plaza, type: "plaza" },
  // Market streets (east)
  { id: "market-h", from: { x: 8, z: -4 }, to: { x: 30, z: -2 }, width: ROAD_WIDTH.district, type: "district" },
  // Residential streets (NE)
  { id: "residential-h", from: { x: 8, z: -4 }, to: { x: 30, z: 14 }, width: ROAD_WIDTH.district, type: "district" },
  // Guild district (west)
  { id: "guild-h", from: { x: -10, z: -4 }, to: { x: -30, z: -6 }, width: ROAD_WIDTH.district, type: "district" },
  // Training grounds (NW)
  { id: "training-h", from: { x: -10, z: -4 }, to: { x: -22, z: 18 }, width: ROAD_WIDTH.district, type: "district" },
  // Harbor (north)
  { id: "harbor-n", from: { x: 0, z: -26 }, to: { x: 0, z: 40 }, width: ROAD_WIDTH.district, type: "district" },
  // Blacksmith spur
  { id: "blacksmith-h", from: { x: -22, z: 18 }, to: { x: -34, z: 24 }, width: ROAD_WIDTH.district, type: "district" },
  // Inn spur
  { id: "inn-h", from: { x: 30, z: 14 }, to: { x: 36, z: 6 }, width: ROAD_WIDTH.dirt, type: "dirt" },
];

/* ── Spawn Point ── */
export const PLAYER_SPAWN = { x: 0, z: -35 };

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
}

export interface DistrictDef {
  name: DistrictName;
  label: string;
  color: string;
  /** District center in world space — group offset for spacing. */
  center: { x: number; z: number };
  /** Approx radius for spacing label placement + future streaming. */
  radius: number;
  buildings: BuildingDef[];
}

/* District centers placed around an expanded central plaza (scale ×1.5).
 * Building coords are already relative to the world origin; the `center`
 * field is metadata for labels/streaming, group offset is large-arena feel
 * via the building coordinates themselves. */
export const CITY_LAYOUT: DistrictDef[] = [
  {
    name: "castle",
    label: "Royal Castle",
    color: "#8a7a5a",
    center: { x: 0, z: -32 },
    radius: 18,
    buildings: [
      { x: 0, z: -32, w: 9, d: 9, h: 12, label: "Royal Castle", roof: "dome" },
      { x: -6, z: -38, w: 3, d: 3, h: 16, label: "Castle Tower", roof: "tower" },
      { x: 6, z: -38, w: 3, d: 3, h: 16, label: "Castle Tower", roof: "tower" },
      { x: 0, z: -42, w: 6, d: 3, h: 4, label: "Castle Gate", roof: "flat" },
      { x: -8, z: -30, w: 3, d: 3, h: 10, label: "Bastion", roof: "tower" },
      { x: 8, z: -30, w: 3, d: 3, h: 10, label: "Bastion", roof: "tower" },
    ],
  },
  {
    name: "central_plaza",
    label: "Central Plaza",
    color: "#b8963e",
    center: { x: 0, z: -4 },
    radius: 14,
    buildings: [
      { x: 0, z: -4, w: 1.5, d: 1.5, h: 0.8, color: "#d4af37", label: "Fountain", roof: "flat" },
      { x: -6, z: -4, w: 0.5, d: 0.5, h: 1, color: "#d4af37", label: "Lamp", roof: "flat" },
      { x: 6, z: -4, w: 0.5, d: 0.5, h: 1, color: "#d4af37", label: "Lamp", roof: "flat" },
    ],
  },
  {
    name: "noble",
    label: "Noble District",
    color: "#c4a96a",
    center: { x: -24, z: 12 },
    radius: 14,
    buildings: [
      { x: -24, z: 12, w: 4, d: 4, h: 4, label: "Noble Estate", roof: "gable" },
      { x: -30, z: 8, w: 3.5, d: 3.5, h: 3.5, label: "Noble Estate", roof: "gable" },
      { x: -22, z: 18, w: 3.5, d: 3.5, h: 4.5, label: "Noble Manor", roof: "cone" },
      { x: -28, z: 18, w: 2.5, d: 2.5, h: 3, label: "Guard Post", roof: "flat" },
    ],
  },
  {
    name: "guild_hall",
    label: "Guild District",
    color: "#7a6a4a",
    center: { x: -32, z: -10 },
    radius: 14,
    buildings: [
      { x: -32, z: -10, w: 6, d: 5, h: 6, label: "Adventurer's Guild", roof: "gable" },
      { x: -38, z: -12, w: 3.5, d: 3.5, h: 3.5, label: "Guild Stable", roof: "gable" },
      { x: -30, z: -16, w: 3, d: 3, h: 5, label: "Guild Tower", roof: "tower" },
    ],
  },
  {
    name: "market",
    label: "Market District",
    color: "#9a8a6a",
    center: { x: 22, z: 6 },
    radius: 16,
    buildings: [
      { x: 22, z: 6, w: 5, d: 4, h: 3.5, label: "Market Hall", roof: "gable" },
      { x: 28, z: 4, w: 3.5, d: 3.5, h: 2.8, label: "Trader Post", roof: "flat" },
      { x: 20, z: 12, w: 3.5, d: 3, h: 3, label: "Alchemist", roof: "cone" },
      { x: 28, z: 12, w: 2.8, d: 2.8, h: 2.4, label: "Food Stall", roof: "flat" },
      { x: 16, z: 10, w: 3.5, d: 3.5, h: 3.6, label: "Magic Shop", roof: "dome" },
    ],
  },
  {
    name: "training",
    label: "Training Grounds",
    color: "#6a5a4a",
    center: { x: -22, z: 18 },
    radius: 12,
    buildings: [
      { x: -22, z: 18, w: 6, d: 5, h: 2.5, color: "#5a4a3a", label: "Training Arena", roof: "flat" },
      { x: -18, z: 22, w: 2.5, d: 2.5, h: 1.8, color: "#4a3a2a", label: "Dummy Yard", roof: "flat" },
      { x: -26, z: 22, w: 2, d: 2, h: 2, color: "#5a4a3a", label: "Armory", roof: "gable" },
    ],
  },
  {
    name: "blacksmith",
    label: "Blacksmith",
    color: "#5a3a2a",
    center: { x: -34, z: 24 },
    radius: 8,
    buildings: [
      { x: -34, z: 24, w: 4, d: 4, h: 4, label: "Blacksmith Forge", roof: "gable" },
      { x: -38, z: 26, w: 2.5, d: 2.5, h: 2, color: "#7a4a2a", label: "Smelter", roof: "cone" },
    ],
  },
  {
    name: "residential",
    label: "Residential District",
    color: "#7a7a5a",
    center: { x: 26, z: 18 },
    radius: 14,
    buildings: [
      { x: 22, z: 18, w: 3.5, d: 3.5, h: 3, label: "Home", roof: "gable" },
      { x: 28, z: 16, w: 3.5, d: 3.5, h: 2.8, label: "Home", roof: "gable" },
      { x: 24, z: 24, w: 4, d: 3.5, h: 3.4, label: "Home", roof: "gable" },
      { x: 30, z: 24, w: 3, d: 3, h: 2.6, label: "Home", roof: "gable" },
      { x: 20, z: 24, w: 3.5, d: 3, h: 2.8, label: "Home", roof: "gable" },
      { x: 32, z: 18, w: 3, d: 3, h: 2.6, label: "Home", roof: "gable" },
    ],
  },
  {
    name: "inn",
    label: "Inn",
    color: "#8a7a3a",
    center: { x: 36, z: 6 },
    radius: 8,
    buildings: [
      { x: 36, z: 6, w: 5, d: 4, h: 4.5, label: "The Sleeping Giant Inn", roof: "gable" },
    ],
  },
  {
    name: "harbor",
    label: "Harbor",
    color: "#5a6a7a",
    center: { x: 0, z: 40 },
    radius: 12,
    buildings: [
      { x: 0, z: 38, w: 6, d: 3, h: 4, label: "Harbor Master", roof: "flat" },
      { x: -5, z: 42, w: 3.5, d: 2.5, h: 2.4, label: "Dock Office", roof: "gable" },
      { x: 6, z: 42, w: 3.5, d: 2.5, h: 2.4, label: "Warehouse", roof: "flat" },
      { x: -3, z: 46, w: 2, d: 2, h: 2, color: "#6a7a8a", label: "Lighthouse", roof: "tower" },
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
