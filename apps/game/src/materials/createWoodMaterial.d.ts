/**
 * createWoodMaterial — patched MeshStandardMaterial for docks, boats, carts,
 * barrels, fences. Procedural wood grain: stretched fbm along one axis,
 * ring lines via ridged noise, warm light/dark plank variation.
 * Phase B: pass map/normalMap/roughnessMap for authored PBR.
 */
import * as THREE from "three";
import { type PatchedMaterialOptions } from "./patchStandard";
export interface WoodMaterialOptions extends PatchedMaterialOptions {
    woodColor?: THREE.ColorRepresentation;
}
export declare function createWoodMaterial(opts?: WoodMaterialOptions): THREE.MeshStandardMaterial;
//# sourceMappingURL=createWoodMaterial.d.ts.map