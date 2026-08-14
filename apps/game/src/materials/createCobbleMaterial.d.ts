/**
 * createCobbleMaterial — patched MeshStandardMaterial for roads + plaza.
 * Procedural cobblestone: voronoi cell ids give per-stone color variation,
 * stone edges darken into mortar gaps, a thin gold grout accent on main/plaza,
 * and a noise-driven dirt edge blend. Phase B: swap authored maps in.
 */
import * as THREE from "three";
import { type PatchedMaterialOptions } from "./patchStandard";
export type CobbleKind = "main" | "plaza" | "district" | "dirt";
export interface CobbleMaterialOptions extends PatchedMaterialOptions {
    kind?: CobbleKind;
    /** Scale of the cobble cells in world units. */
    scale?: number;
}
export declare function createCobbleMaterial(opts?: CobbleMaterialOptions): THREE.MeshStandardMaterial;
//# sourceMappingURL=createCobbleMaterial.d.ts.map