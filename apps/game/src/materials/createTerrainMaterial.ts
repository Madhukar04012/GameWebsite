/**
 * createTerrainMaterial — patched MeshStandardMaterial that derives a
 * grass/dirt/stone/sand/rock albedo from world position + slope + fbm noise
 * (mirrors packages/engine TerrainSystem groundTypeAt), plus procedural
 * roughness variation. No texture files; full PBR lighting/shadows preserved.
 *
 * Phase B: pass `map`/`normalMap`/`roughnessMap` to multiply in authored PBR.
 */

import * as THREE from "three";
import { createPatchedMaterial, type PatchedMaterialOptions } from "./patchStandard";

export type TerrainVariant = "world" | "grove";

export interface TerrainMaterialOptions extends PatchedMaterialOptions {
  /** Groove variant overrides grass to a deep blue-green for FlowerFields. */
  variant?: TerrainVariant;
}

const TERRAIN_BODY_WORLD = /* glsl */ `
  vec3 wpos = vWorldPos + vec3(uSeed, 0.0);
  vec3 albedo = groundAlbedo(wpos, normalize(vNormalW), 0.0);
  // Phase B: modulate by authored map if bound (already in diffuseColor from
  // three's map handling), then overlay our geographic blend on top.
  float mapAmt = float(uHasMap);
  albedo = mix(albedo, albedo * diffuseColor.rgb, mapAmt);
  diffuseColor.rgb = albedo;
  roughnessFactor = groundRoughness(wpos, normalize(vNormalW));
  // authored roughness map multiplies in when present
  roughnessFactor *= (1.0 - 0.3 * float(uHasRoughnessMap));
`;

const TERRAIN_BODY_GROVE = /* glsl */ `
  // Deep blue-green bioluminescent grove ground for FlowerFields.
  vec3 wpos = vWorldPos + vec3(uSeed, 0.0);
  float n = fbm(wpos.xz * 0.18);
  float grain = fbm(wpos.xz * 0.9);
  vec3 deep = mix(vec3(0.025, 0.09, 0.085), vec3(0.05, 0.16, 0.14), n);
  vec3 albedo = deep * (0.85 + 0.3 * grain);
  diffuseColor.rgb = mix(albedo, albedo * diffuseColor.rgb, float(uHasMap));
  roughnessFactor = 0.92;
`;

export function createTerrainMaterial(opts: TerrainMaterialOptions = {}): THREE.MeshStandardMaterial {
  const variant = opts.variant ?? "world";
  const body = variant === "grove" ? TERRAIN_BODY_GROVE : TERRAIN_BODY_WORLD;
  return createPatchedMaterial(
    { color: 0xffffff, roughness: 0.95, metalness: 0.0, ...opts },
    { fragmentBody: body },
  );
}
