/**
 * createStoneMaterial — patched MeshStandardMaterial for castle walls,
 * towers, building bases and stone props. Procedural:
 *   - base stone color varied by fbm
 *   - crack veins via ridged noise
 *   - moss tint on up-facing normals (soft top growth)
 *   - edge wear darkening
 * Phase B: pass map/normalMap/roughnessMap to sample authored PBR.
 */
import * as THREE from "three";
import { type PatchedMaterialOptions } from "./patchStandard";
export interface StoneMaterialOptions extends PatchedMaterialOptions {
    /** Base stone hue (tinted by noise toward two variants). */
    stoneColor?: THREE.ColorRepresentation;
    /** Roof/that variant: warmer, lower moss, more tile-like. */
    roof?: boolean;
    /** Dark cobblestone plaza variant. */
    cobble?: boolean;
}
export declare function createStoneMaterial(opts?: StoneMaterialOptions): THREE.MeshStandardMaterial;
//# sourceMappingURL=createStoneMaterial.d.ts.map