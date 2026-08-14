/**
 * Biomes — four distinctive surrounding regions outside Capital Kingdom.
 *
 * Each biome component self-contains: procedural ground material, instanced
 * vegetation / props, fog color override, and atmospheric particle effects.
 *
 * Biomes are positioned compass-anchored around the city:
 *   Ashen Barrens   — East  (+x, volcanic/ash wasteland)
 *   Mistmire Bog     — West  (-x, swamp/marsh)
 *   Sunstone Desert  — SE   (+x,+z, golden desert)
 *   Frostfang Ridge  — North (+z, snowy highlands)
 *
 * Each uses a unique createTerrainMaterial variant + local atmospheric helpers
 * (dust motes, fog, sparkles) so the player feels a visual transition.
 *
 * Performance: each biome is a single <group> with instanced meshes, no
 * per-frame CPU work beyond optional uniform animations.
 */
declare function AshenBarrens(): import("react").JSX.Element;
declare function MistmireBog(): import("react").JSX.Element;
declare function SunstoneDesert(): import("react").JSX.Element;
declare function FrostfangRidge(): import("react").JSX.Element;
export declare const BIOME_WORLD_COMPONENTS: {
    readonly ashen_mountains: typeof AshenBarrens;
    readonly mistwood: typeof MistmireBog;
    readonly golden_desert: typeof SunstoneDesert;
    readonly frost_peaks: typeof FrostfangRidge;
};
export declare function Biomes(): import("react").JSX.Element;
export {};
//# sourceMappingURL=Biomes.d.ts.map