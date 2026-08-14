/**
 * createFabricMaterial — patched MeshStandardMaterial for cloth, banners, tents.
 *
 * Procedural woven texture via crossed high-frequency noise bands.
 * Three presets: "banner" (heavy cloth), "tent" (canvas), "silk" (fine weave).
 * Phase B: map/normalMap/roughnessMap for authored PBR.
 */
import * as THREE from "three";
import { type PatchedMaterialOptions } from "./patchStandard";
export type FabricKind = "banner" | "tent" | "silk";
export interface FabricMaterialOptions extends PatchedMaterialOptions {
    kind?: FabricKind;
}
export declare function createFabricMaterial(opts?: FabricMaterialOptions): THREE.MeshStandardMaterial;
//# sourceMappingURL=createFabricMaterial.d.ts.map