/**
 * TerrainSystem — layered Master Geography / Meso / Micro procedural terrain engine.
 *
 * Deterministic pure-logic heightfield & surface classification:
 * 1. Macro Landform Elevation: Directly driven by Master Geography Model
 *    (Alpine Crests, Volcanic Mesas, River Gorge, Valleys, Coastal Basins).
 * 2. Meso Geological Formations: Sharp mountain ridge folds & rolling hills (FBM).
 * 3. Micro Terrain Detail: Fine soil and stone erosion (FBM).
 * 4. Capital Plateau: Flawless defensible flattening within city bounds.
 */
import { sampleGeography, getMacroLandformElevation, type GeographySample } from "@legend/shared";
export type GroundType = "grass" | "dirt" | "stone" | "sand" | "rock" | "snow";
/**
 * World-space terrain height at (x, z).
 * Layered generation:
 * 1. Master Geography Macro Landforms (Highland ridges, mesas, valleys, river gorge).
 * 2. Meso Geological Formations (Mountains & Valleys).
 * 3. Micro Terrain & Soil Erosion.
 */
export declare function heightAt(x: number, z: number): number;
/**
 * Surface normal at (x, z) via finite differences.
 */
export declare function normalAt(x: number, z: number): {
    x: number;
    y: number;
    z: number;
};
/**
 * Ground material type at (x, z) — driven by Master Geography & Elevation Zones.
 */
export declare function groundTypeAt(x: number, z: number): GroundType;
/**
 * High-level geography inspector hooks for engine and client systems.
 */
export declare function getTerrainGeography(x: number, z: number): GeographySample;
export declare const geographyAt: typeof sampleGeography;
export declare const macroElevation: typeof getMacroLandformElevation;
/**
 * Region definition hook for streaming systems.
 */
export interface RegionDef {
    id: string;
    bounds: {
        minX: number;
        maxX: number;
        minZ: number;
        maxZ: number;
    };
    heightFn: (x: number, z: number) => number;
}
//# sourceMappingURL=TerrainSystem.d.ts.map