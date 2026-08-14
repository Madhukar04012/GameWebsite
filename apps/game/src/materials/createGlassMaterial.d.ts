/**
 * createGlassMaterial — patched MeshStandardMaterial for windows, bottles, gems.
 *
 * Procedural glass with fresnel tint, slight distortion, and specular highlights.
 * Three presets: "clear" (window), "stained" (colored), "gem" (crystal).
 * Phase B: map/normalMap maps for patterns.
 */
import * as THREE from "three";
import { type PatchedMaterialOptions } from "./patchStandard";
export type GlassKind = "clear" | "stained" | "gem";
export interface GlassMaterialOptions extends PatchedMaterialOptions {
    kind?: GlassKind;
}
export declare function createGlassMaterial(opts?: GlassMaterialOptions): THREE.MeshStandardMaterial;
//# sourceMappingURL=createGlassMaterial.d.ts.map