/**
 * createMetalMaterial — patched MeshStandardMaterial for metallic surfaces.
 *
 * Procedural PBR metals with anisotropic-like noise variation.
 * Three presets: "gold" (warm, emissive accent), "bronze" (dark aged),
 * "iron" (cool ferrous). Phase B: map/normalMap/roughnessMap for authored PBR.
 */

import * as THREE from "three";
import { createPatchedMaterial, type PatchedMaterialOptions } from "./patchStandard";

export type MetalKind = "gold" | "bronze" | "iron" | "silver";

export interface MetalMaterialOptions extends PatchedMaterialOptions {
  kind?: MetalKind;
}

const GOLD_BODY = /* glsl */ `
  float n = fbm(vWorldPos.xz * 0.6 + uSeed);
  float fine = fbm(vWorldPos.xz * 2.5 + uSeed);
  vec3 base = vec3(0.95, 0.78, 0.28);
  vec3 dark = vec3(0.75, 0.55, 0.12);
  vec3 albedo = mix(dark, base, 0.6 + 0.4 * n);
  albedo += vec3(0.04, 0.02, 0.0) * fine;
  // Slight green tarnish in crevices
  float tarnish = pow(fine, 3.0) * 0.15;
  albedo *= 1.0 - tarnish * vec3(0.2, 0.0, 0.4);
  diffuseColor.rgb = mix(albedo, diffuseColor.rgb * albedo, float(uHasMap));
  roughnessFactor = mix(0.25, 0.45, n) * (1.0 - 0.2 * float(uHasRoughnessMap));
  metalnessFactor = 1.0;
`;

const BRONZE_BODY = /* glsl */ `
  float n = fbm(vWorldPos.xz * 0.5 + uSeed);
  float patina = fbm(vWorldPos.xz * 0.8 + vec2(5.0, 9.0) + uSeed);
  vec3 base = vec3(0.62, 0.38, 0.18);
  vec3 dark = vec3(0.35, 0.22, 0.10);
  vec3 albedo = mix(dark, base, n);
  // Verdigris patina spots
  float pat = smoothstep(0.55, 0.8, patina);
  albedo = mix(albedo, vec3(0.22, 0.48, 0.32), pat * 0.3);
  diffuseColor.rgb = mix(albedo, diffuseColor.rgb * albedo, float(uHasMap));
  roughnessFactor = mix(0.35, 0.65, n) * (1.0 - 0.2 * float(uHasRoughnessMap));
  metalnessFactor = 1.0;
`;

const IRON_BODY = /* glsl */ `
  float n = fbm(vWorldPos.xz * 0.7 + uSeed);
  float rust = fbm(vWorldPos.xz * 0.4 + uSeed + 3.0);
  vec3 base = vec3(0.45, 0.48, 0.52);
  vec3 dark = vec3(0.22, 0.25, 0.28);
  vec3 albedo = mix(dark, base, n);
  // Light surface rust
  float r = smoothstep(0.6, 0.9, rust);
  albedo = mix(albedo, vec3(0.62, 0.35, 0.15), r * 0.25);
  diffuseColor.rgb = mix(albedo, diffuseColor.rgb * albedo, float(uHasMap));
  roughnessFactor = mix(0.4, 0.7, n) * (1.0 - 0.2 * float(uHasRoughnessMap));
  metalnessFactor = 0.95;
`;

const SILVER_BODY = /* glsl */ `
  float n = fbm(vWorldPos.xz * 0.6 + uSeed);
  float fine = fbm(vWorldPos.xz * 3.0 + uSeed);
  vec3 base = vec3(0.88, 0.90, 0.95);
  vec3 dark = vec3(0.55, 0.58, 0.65);
  vec3 albedo = mix(dark, base, n);
  albedo += vec3(0.02, 0.02, 0.03) * fine;
  diffuseColor.rgb = mix(albedo, diffuseColor.rgb * albedo, float(uHasMap));
  roughnessFactor = mix(0.15, 0.35, n) * (1.0 - 0.2 * float(uHasRoughnessMap));
  metalnessFactor = 1.0;
`;

const BODIES: Record<MetalKind, string> = {
  gold: GOLD_BODY,
  bronze: BRONZE_BODY,
  iron: IRON_BODY,
  silver: SILVER_BODY,
};

const BASE_COLORS: Record<MetalKind, number> = {
  gold: 0xd4af37,
  bronze: 0x8a5a2a,
  iron: 0x6a6e78,
  silver: 0xc0c8d0,
};

export function createMetalMaterial(opts: MetalMaterialOptions = {}): THREE.MeshStandardMaterial {
  const kind = opts.kind ?? "gold";
  const { kind: _kind, ...rest } = opts;
  return createPatchedMaterial(
    {
      color: opts.color ?? BASE_COLORS[kind],
      roughness: opts.roughness ?? 0.35,
      metalness: opts.metalness ?? 1.0,
      ...rest,
    },
    { fragmentBody: BODIES[kind] },
  );
}
