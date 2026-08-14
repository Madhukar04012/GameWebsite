export declare const TILE_SIZE = 1;
export declare const WORLD_SIZE = 400;
export declare const CHUNK_SIZE = 20;
export declare const WORLD_BOUNDS: {
    readonly terrainSize: 400;
    readonly citySize: 92;
    readonly wallHeight: 9;
    readonly towerHeight: 14;
};
export declare const CITY_BOUNDS: {
    readonly minX: -46;
    readonly maxX: 46;
    readonly minZ: -46;
    readonly maxZ: 46;
};
export type RoadType = "main" | "plaza" | "district" | "dirt";
export interface RoadSegment {
    id: string;
    from: {
        x: number;
        z: number;
    };
    to: {
        x: number;
        z: number;
    };
    width: number;
    type: RoadType;
}
export declare const ROAD_WIDTH: {
    readonly main: 8;
    readonly plaza: 12;
    readonly district: 6;
    readonly dirt: 4;
};
export declare const ROADS: RoadSegment[];
export declare const PLAYER_SPAWN: {
    x: number;
    z: number;
};
export declare const SOUTH_GATE_POSITION: {
    x: number;
    z: number;
};
export declare const PLAYER: {
    readonly walkSpeed: 4;
    readonly runSpeed: 8;
    readonly jumpForce: 5;
    readonly maxHp: 100;
    readonly baseHpRegen: 1;
};
export declare const COMBAT: {
    readonly baseMeleeRange: 2;
    readonly baseAttackSpeed: 1;
    readonly baseDamage: 10;
};
export type DistrictName = "castle" | "noble" | "central_plaza" | "guild_hall" | "market" | "training" | "blacksmith" | "residential" | "inn" | "harbor";
export type ArchFamily = "residential" | "commercial" | "craft" | "noble" | "civic";
export interface BuildingDef {
    x: number;
    z: number;
    w: number;
    d: number;
    h: number;
    color?: string;
    label?: string;
    family?: ArchFamily;
    subStyle?: string;
    isCorner?: boolean;
    facadeType?: "timber" | "plaster" | "stone" | "brick" | "mixed";
    /** Roof silhouette for blockout; dispatcher in CityBuilding. */
    roof?: "gable" | "flat" | "tower" | "cone" | "dome" | "double-gable" | "hip" | "mansard" | "shallow";
    /** Optional architectural metadata */
    floors?: number;
    hasBalcony?: boolean;
    hasChimney?: boolean;
    shopSign?: "potion" | "sword" | "tankard" | "anvil" | "shield" | "scroll";
}
export interface CityBlockDef {
    x: number;
    z: number;
    w: number;
    d: number;
    /** Seed for deterministic procedural generation of the block's buildings */
    seed: number;
}
export interface DistrictDef {
    name: DistrictName;
    label: string;
    color: string;
    center: {
        x: number;
        z: number;
    };
    radius: number;
    buildings: BuildingDef[];
    blocks?: CityBlockDef[];
}
export declare const CITY_LAYOUT: DistrictDef[];
export declare const XP_TABLE: Record<number, number>;
export type VegKind = "tree" | "bush" | "flower" | "grass" | "rock" | "log";
export interface VegPatch {
    id: string;
    kind: VegKind;
    /** Bounding box center + radius for scatter. */
    center: {
        x: number;
        z: number;
    };
    radius: number;
    /** Approx instance count for the patch. */
    count: number;
}
export declare const VEGETATION_PATCHES: VegPatch[];
export type BiomeKind = "plains" | "royal_plains" | "ancient_forest" | "mistwood" | "crystal_highlands" | "frost_peaks" | "ashen_mountains" | "golden_desert" | "emerald_coast" | "shadow_marsh" | "ancient_ruins";
export interface BiomeDef {
    id: BiomeKind;
    label: string;
    bounds: {
        minX: number;
        maxX: number;
        minZ: number;
        maxZ: number;
    };
    groundVariant: string;
    fogColor: string;
    ambientColor: string;
    skyTint?: string;
    waterTint?: string;
    vegetationTint?: string;
}
export declare const BIOME_DEFS: BiomeDef[];
export declare const BIOME_ATMOSPHERE: Record<BiomeKind, {
    dustMotes: boolean;
    sparkleCount: number;
    fogDensity: number;
    windStrength: number;
}>;
export declare function biomeAt(x: number, z: number): BiomeKind;
//# sourceMappingURL=index.d.ts.map