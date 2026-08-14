/**
 * createFireMaterial — ShaderMaterial for animated torch/fire/magic flame.
 *
 * Full custom shader (not patched Standard) because flame needs additive
 * blending, vertex displacement, and emissive-only rendering. Three presets:
 * "torch" (warm flame), "magic" (cool ethereal), "ember" (glowing cinders).
 *
 * Uses a time uniform animated each frame by the owning component.
 */
import * as THREE from "three";
export type FireKind = "torch" | "magic" | "ember";
export interface FireMaterialOptions {
    kind?: FireKind;
    color?: THREE.ColorRepresentation;
    intensity?: number;
}
export declare function createFireMaterial(opts?: FireMaterialOptions): THREE.ShaderMaterial;
//# sourceMappingURL=createFireMaterial.d.ts.map