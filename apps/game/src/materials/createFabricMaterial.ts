/**
 * createFabricMaterial — patched MeshStandardMaterial for cloth, banners, tents.
 *
 * Procedural woven texture via crossed high-frequency noise bands.
 * Three presets: "banner" (heavy cloth), "tent" (canvas), "silk" (fine weave).
 * Phase B: map/normalMap/roughnessMap for authored PBR.
 */

import * as THREE from "three";
import { createPatchedMaterial, type PatchedMaterialOptions } from "./patchStandard";

export type FabricKind = "banner" | "tent" | "silk";

export interface FabricMaterialOptions extends PatchedMaterialOptions {
  kind?: FabricKind;
}

const FABRIC_BODY = /* glsl */ `
  vec2 wp = vWorldPos.xz + uSeed;
  // Crossed thread weave — bands along X and Z
  float warp = abs(sin(wp.x * 8.0));
  float weft = abs(sin(wp.y * 7.3));
  float weave = clamp(warp * weft * 2.0, 0.0, 1.0);
  float n = fbm(wp * 0.5);

  vec3 c = diffuseColor.rgb;
  vec3 dark = c * 0.7;
  vec3 light = c * 1.2;
  vec3 albedo = mix(dark, light, weave * 0.5 + n * 0.5);

  // Subtle fold shadows
  float folds = sin(wp.x * 0.3 + wp.y * 0.2) * 0.5 + 0.5;
  albedo *= 0.85 + 0.15 * folds;

  diffuseColor.rgb = mix(albedo, albedo * diffuseColor.rgb, float(uHasMap));
  roughnessFactor = clamp(0.85 + 0.15 * n - 0.15 * float(uHasRoughnessMap), 0.6, 1.0);
  metalnessFactor = 0.0;
`;

const SILK_BODY = /* glsl */ `
  vec2 wp = vWorldPos.xz + uSeed;
  float n = fbm(wp * 0.4);
  float sheen = fbm(wp * 1.5);

  vec3 c = diffuseColor.rgb;
  vec3 dark = c * 0.6;
  vec3 light = c * 1.4;
  vec3 albedo = mix(dark, light, n);
  // Iridescent shimmer
  albedo += vec3(0.02, 0.01, 0.04) * sheen;

  diffuseColor.rgb = mix(albedo, albedo * diffuseColor.rgb, float(uHasMap));
  roughnessFactor = mix(0.3, 0.5, n) * (1.0 - 0.2 * float(uHasRoughnessMap));
  metalnessFactor = 0.0;
`;

const BODIES: Record<FabricKind, string> = {
  banner: FABRIC_BODY,
  tent: FABRIC_BODY,
  silk: SILK_BODY,
};

export function createFabricMaterial(opts: FabricMaterialOptions = {}): THREE.MeshStandardMaterial {
  const kind = opts.kind ?? "banner";
  const { kind: _kind, ...rest } = opts;
  const roughness = kind === "silk" ? 0.4 : 0.9;
  return createPatchedMaterial(
    {
      color: opts.color ?? (kind === "tent" ? 0xc4a060 : kind === "silk" ? 0xd4af37 : 0x8a2a2a),
      roughness,
      metalness: 0,
      ...rest,
    },
    { fragmentBody: BODIES[kind] },
  );
}
