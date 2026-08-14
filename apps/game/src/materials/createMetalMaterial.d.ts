/**
 * createMetalMaterial — patched MeshStandardMaterial for metallic surfaces.
 *
 * Procedural PBR metals with anisotropic-like noise variation.
 * Three presets: "gold" (warm, emissive accent), "bronze" (dark aged),
 * "iron" (cool ferrous). Phase B: map/normalMap/roughnessMap for authored PBR.
 */
import * as THREE from "three";
import { type PatchedMaterialOptions } from "./patchStandard";
export type MetalKind = "gold" | "bronze" | "iron" | "silver";
export interface MetalMaterialOptions extends PatchedMaterialOptions {
    kind?: MetalKind;
}
export declare function createMetalMaterial(opts?: MetalMaterialOptions): THREE.MeshStandardMaterial;
//# sourceMappingURL=createMetalMaterial.d.ts.map