/**
 * createFoliageMaterial — patched MeshStandardMaterial for instanced trees,
 * bushes and grass. Procedural two-tone leaf color + wind sway bent in the
 * vertex shader from world position + time so the roots stay planted (the
 * bend is masked by local height).
 *
 * Instanced: works inside drei <Instances> because `transformed` already
 * includes the per-instance matrix when our vertex body runs.
 * Phase B: pass map/normalMap/roughnessMap for authored foliage.
 */
import * as THREE from "three";
import { type PatchedMaterialOptions } from "./patchStandard";
export type FoliageKind = "tree" | "bush" | "grass" | "flower";
export interface FoliageMaterialOptions extends PatchedMaterialOptions {
    kind?: FoliageKind;
}
export declare function createFoliageMaterial(opts?: FoliageMaterialOptions): THREE.MeshStandardMaterial;
//# sourceMappingURL=createFoliageMaterial.d.ts.map