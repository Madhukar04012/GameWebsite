/**
 * patchStandard — the base for every procedural material in this pass.
 *
 * We patch MeshStandardMaterial via onBeforeCompile so the world keeps full
 * PBR lighting, shadows, fog, envMap and tone-mapping from the scene for
 * free. Each material factory supplies a `fragmentBody` snippet that runs
 * after the standard material sets `diffuseColor`; it can rewrite
 * `diffuseColor.rgb` and tweak `roughnessFactor` / `metalnessFactor`.
 *
 * Texture-slot hook (Phase B): uniforms map/normalMap/roughnessMap exist on
 * every patched material, empty by default. The procedural body multiplies
 * its albedo by the sampled map when bound — drop real textures later and
 * the same shader upgrades to authored PBR with zero code changes elsewhere.
 *
 * In scope at the injection point (`#include <color_fragment>`):
 *   vec4 diffuseColor    — albedo * vertexColor; .rgb is what we tint
 *   float roughnessFactor — set from material.roughness
 *   float metalnessFactor — set from material.metalness
 *   three also has vWorldPosition via the worldpos include (guarded by
 *   WORLDPOS) — but it's conditional, so we expose our own vWorldPos/vNormalW.
 */
import * as THREE from "three";
export interface PatchedMaterialOptions {
    /** Base albedo tint mixed into the procedural result. */
    color?: THREE.ColorRepresentation;
    roughness?: number;
    metalness?: number;
    flatShading?: boolean;
    /** Phase B: authored PBR textures. When set, sampled and multiplied in. */
    map?: THREE.Texture | null;
    normalMap?: THREE.Texture | null;
    roughnessMap?: THREE.Texture | null;
    /** Seed offset to desync noise per-instance group (vec2 baked). */
    seed?: [number, number];
    transparent?: boolean;
    opacity?: number;
    side?: THREE.Side;
    emissive?: THREE.ColorRepresentation;
    emissiveIntensity?: number;
    envMapIntensity?: number;
}
export interface PatchContext {
    /** GLSL injected after `#include <common>` — declare helpers/ uniforms here. */
    declarations?: string;
    /**
     * Custom uniforms (beyond the base uSeed/uHas* set). Merged into the
     * shader's uniforms and declared via `declarations`.
     */
    uniforms?: {
        [name: string]: THREE.IUniform;
    };
    /**
     * GLSL run right after `#include <color_fragment>`. Mutate `diffuseColor.rgb`,
     * `roughnessFactor`, `metalnessFactor`. `vWorldPos` and `vNormalW` are available.
     */
    fragmentBody: string;
    /** Optional GLSL injected into the vertex main (wind sway / waves). */
    vertexBody?: string;
    /** Optional GLSL injected outside main for vertex shader (uniforms/varyings). */
    vertexDeclarations?: string;
}
export declare function createPatchedMaterial(opts: PatchedMaterialOptions, ctx: PatchContext): THREE.MeshStandardMaterial;
//# sourceMappingURL=patchStandard.d.ts.map