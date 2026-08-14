/**
 * createDistrictMaterials — per-district building material palette.
 *
 * Each district gets a distinct architectural identity using the existing
 * patched material system. Reuses createStoneMaterial, createMetalMaterial,
 * createWoodMaterial, createGlassMaterial, createFabricMaterial.
 * No new shader code — only parameter bundles over proven primitives.
 */
import * as THREE from "three";
/** Complete material set for a district. */
export interface DistrictMaterialSet {
    /** Main wall material. */
    wall: THREE.MeshStandardMaterial;
    /** Plaster wall material for facades. */
    plaster: THREE.MeshStandardMaterial;
    /** Brick material for industrial/craft/accents. */
    brick: THREE.MeshStandardMaterial;
    /** Roof material. */
    roof: THREE.MeshStandardMaterial;
    /** Accent wood (beams, doors, shutters). */
    wood: THREE.MeshStandardMaterial;
    /** Window glass. */
    glass: THREE.MeshStandardMaterial;
    /** Banner/cloth accents. */
    banner: THREE.MeshStandardMaterial;
    /** Metal accents (hinges, fixtures, grilles). */
    metal: THREE.MeshStandardMaterial;
    /** Optional secondary accent for variety. */
    accent?: THREE.MeshStandardMaterial;
}
/**
 * Returns a memo-stable material set for a district.
 * Keyed by district name — same parameters = same materials = GPU reuse.
 */
export declare function getDistrictMaterials(districtName: string): DistrictMaterialSet;
export declare function getAllDistrictMaterials(): DistrictMaterialSet[];
//# sourceMappingURL=createDistrictMaterials.d.ts.map