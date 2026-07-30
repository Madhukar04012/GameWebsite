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
import {
  GLSL_NOISE_LIB,
  GLSL_GROUND_BLEND,
} from "../shaders/noise.glsl";

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
  uniforms?: { [name: string]: THREE.IUniform };
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

export function createPatchedMaterial(
  opts: PatchedMaterialOptions,
  ctx: PatchContext,
): THREE.MeshStandardMaterial {
  const mat = new THREE.MeshStandardMaterial({
    color: opts.color ?? 0xffffff,
    roughness: opts.roughness ?? 0.9,
    metalness: opts.metalness ?? 0.0,
    flatShading: opts.flatShading ?? false,
    transparent: opts.transparent ?? false,
    opacity: opts.opacity ?? 1.0,
    side: opts.side ?? THREE.FrontSide,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 0,
    envMapIntensity: opts.envMapIntensity ?? 1,
  } as THREE.MeshStandardMaterialParameters);

  if (opts.map) mat.map = opts.map;
  if (opts.normalMap) mat.normalMap = opts.normalMap;
  if (opts.roughnessMap) mat.roughnessMap = opts.roughnessMap;

  const uniforms: { [name: string]: THREE.IUniform } = {
    ...ctx.uniforms,
    uSeed: { value: opts.seed ?? [0, 0] },
    uHasMap: { value: opts.map ? 1 : 0 },
    uHasNormalMap: { value: opts.normalMap ? 1 : 0 },
    uHasRoughnessMap: { value: opts.roughnessMap ? 1 : 0 },
  };

  mat.onBeforeCompile = (shader) => {
    shader.uniforms = { ...shader.uniforms, ...uniforms };
    // Keep a stable handle the owning component uses to animate the custom
    // uniforms (e.g. uTime) post-compile. Each recompile (rare) refreshes
    // the map to the new shader.uniforms objects.
    mat.userData.__patchedUniforms = uniforms;
    mat.userData.__setUniform = (name: string, value: unknown) => {
      const u = uniforms[name];
      if (u) u.value = value;
    };

    // Vertex stage: declare varyings. We write them at `begin_vertex` time,
    // where both `transformed` (position) and `objectNormal` (normal) exist.
    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `#include <common>
          ${ctx.vertexBody ? GLSL_NOISE_LIB : ""}
          varying vec3 vWorldPos;
          varying vec3 vNormalW;
          ${ctx.vertexDeclarations ?? ""}`,
    );
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>
          vWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
          vNormalW = normalize(mat3(modelMatrix) * objectNormal);
          ${ctx.vertexBody ?? ""}`,
    );

    // Fragment stage: declare the same varyings + noise lib + our uniforms.
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
          ${GLSL_NOISE_LIB}
          ${GLSL_GROUND_BLEND}
          uniform vec2 uSeed;
          uniform int uHasMap;
          uniform int uHasNormalMap;
          uniform int uHasRoughnessMap;
          varying vec3 vWorldPos;
          varying vec3 vNormalW;
          ${ctx.declarations ?? ""}`,
      )
      .replace(
        "#include <metalnessmap_fragment>",
        `#include <metalnessmap_fragment>
          ${ctx.fragmentBody}`,
      );
  };

  return mat;
}
