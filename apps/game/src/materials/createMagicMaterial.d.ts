/**
 * createMagicMaterial — patched MeshStandardMaterial for glowing magical surfaces.
 *
 * Procedural animated rune glow: pulsing emissive with noise-driven patterns.
 * Three presets: "rune" (glyph patterns), "shield" (barrier shimmer),
 * "portal" (swirling vortex). Phase B: map for authored rune textures.
 *
 * The owning component must animate uTime and uPulse each frame.
 */
import * as THREE from "three";
import { type PatchedMaterialOptions } from "./patchStandard";
export type MagicKind = "rune" | "shield" | "portal";
export interface MagicMaterialOptions extends PatchedMaterialOptions {
    kind?: MagicKind;
    glowColor?: THREE.ColorRepresentation;
}
export declare function createMagicMaterial(opts?: MagicMaterialOptions): THREE.MeshStandardMaterial;
//# sourceMappingURL=createMagicMaterial.d.ts.map