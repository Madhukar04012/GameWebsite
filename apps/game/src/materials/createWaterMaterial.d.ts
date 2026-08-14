/**
 * createWaterMaterial — raw ShaderMaterial for the harbor water plane.
 *
 * Replaces the CPU per-vertex sine animation (+ per-frame computeVertexNormals)
 * with GPU vertex waves + a procedural fragment: fresnel sky reflection,
 * sun specular highlight, animated ripple normals, shoreline foam. Fully
 * procedural, no textures, no network.
 *
 * Fog: manual FogExp2 blend with uFogColor/uFogDensity (the scene fog is
 * FogExp2 — Scene.tsx). Doing it by hand avoids the three fog-chunk
 * include/define plumbing a raw ShaderMaterial requires.
 */
import * as THREE from "three";
export interface WaterMaterialOptions {
    /** Deep water color. */
    deepColor?: THREE.ColorRepresentation;
    /** Shallow / sky reflection color. */
    skyColor?: THREE.ColorRepresentation;
    /** Sun direction for specular highlight (matches the key light). */
    sunDirection?: [number, number, number];
    sunColor?: THREE.ColorRepresentation;
    /** World Z of the shoreline (where foam appears). */
    shoreZ?: number;
    /** Shore normal direction (perpendicular to shoreline line).
     *  When set, enables foam along a line defined by normal & center offset
     *  instead of the default Z-only band. Backward compatible: omit for Z-mode. */
    shoreNormal?: [number, number];
    /** Half-width of water body for perpendicular foam mode. Only used with shoreNormal. */
    waterHalfWidth?: number;
    foamColor?: THREE.ColorRepresentation;
    fogColor?: THREE.ColorRepresentation;
    fogDensity?: number;
}
export declare function createWaterMaterial(opts?: WaterMaterialOptions): THREE.ShaderMaterial;
//# sourceMappingURL=createWaterMaterial.d.ts.map