/**
 * createTerrainMaterial — patched MeshStandardMaterial that derives a
 * grass/dirt/stone/sand/rock albedo from world position + slope + fbm noise
 * (mirrors packages/engine TerrainSystem groundTypeAt), plus procedural
 * roughness variation. Extended with biome variants for the four surrounding
 * regions outside Capital Kingdom.
 *
 * Phase B: pass `map`/`normalMap`/`roughnessMap` to multiply in authored PBR.
 */
import * as THREE from "three";
import { type PatchedMaterialOptions } from "./patchStandard";
export type TerrainVariant = "world" | "grove" | "ashen" | "bog" | "desert" | "frost";
export interface TerrainMaterialOptions extends PatchedMaterialOptions {
    variant?: TerrainVariant;
}
export declare function createTerrainMaterial(opts?: TerrainMaterialOptions): THREE.MeshStandardMaterial;
//# sourceMappingURL=createTerrainMaterial.d.ts.map