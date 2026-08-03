/**
 * createGlassMaterial — patched MeshStandardMaterial for windows, bottles, gems.
 *
 * Procedural glass with fresnel tint, slight distortion, and specular highlights.
 * Three presets: "clear" (window), "stained" (colored), "gem" (crystal).
 * Phase B: map/normalMap maps for patterns.
 */

import * as THREE from "three";
import { createPatchedMaterial, type PatchedMaterialOptions } from "./patchStandard";

export type GlassKind = "clear" | "stained" | "gem";

export interface GlassMaterialOptions extends PatchedMaterialOptions {
  kind?: GlassKind;
}

const CLEAR_BODY = /* glsl */ `
  float n = fbm(vWorldPos.xz * 0.5 + uSeed);
  float distortion = n * 0.03;
  vec3 albedo = diffuseColor.rgb;
  // Subtle blue-green tint
  albedo = mix(albedo, vec3(0.85, 0.95, 1.0), 0.15);
  // Edge darkening via fresnel approximation
  float fres = 1.0 - abs(dot(normalize(vNormalW), normalize(cameraPosition - vWorldPos)));
  albedo *= 0.8 + 0.4 * pow(fres, 2.0);
  diffuseColor.rgb = mix(albedo, albedo * diffuseColor.rgb, float(uHasMap));
  roughnessFactor = mix(0.05, 0.15, n) * (1.0 - 0.1 * float(uHasRoughnessMap));
  metalnessFactor = 0.0;
`;

const STAINED_BODY = /* glsl */ `
  float n = fbm(vWorldPos.xz * 0.3 + uSeed);
  float pattern = fbm(vWorldPos.xz * 1.5 + uSeed);
  vec3 albedo = diffuseColor.rgb;
  // Color shifted by noise pattern
  float hue = pattern * 0.5 + 0.5;
  vec3 tint = vec3(
    0.7 + 0.3 * sin(hue * 6.28),
    0.5 + 0.5 * cos(hue * 6.28 + 2.09),
    0.6 + 0.4 * sin(hue * 6.28 + 4.19)
  );
  albedo *= tint;
  diffuseColor.rgb = mix(albedo, albedo * diffuseColor.rgb, float(uHasMap));
  roughnessFactor = mix(0.1, 0.3, n) * (1.0 - 0.1 * float(uHasRoughnessMap));
  metalnessFactor = 0.0;
  float alpha = 0.6 + 0.4 * pattern;
  gl_FragColor.a = alpha;
`;

const GEM_BODY = /* glsl */ `
  vec3 V = normalize(cameraPosition - vWorldPos);
  float n = fbm(vWorldPos.xz * 0.8 + uSeed);
  float facets = fbm(vWorldPos.xz * 3.0 + uSeed);

  vec3 base = diffuseColor.rgb;
  // Sparkle from specular
  float spec = pow(max(dot(reflect(-V, normalize(vNormalW)), V), 0.0), 64.0);
  vec3 albedo = base * (0.6 + 0.4 * n);
  albedo += vec3(1.0) * spec * 0.8;
  // Chromatic shift on facets
  vec3 chroma = vec3(
    facets * 0.15,
    facets * 0.10,
    facets * 0.20
  );
  albedo += chroma;
  diffuseColor.rgb = mix(albedo, albedo * diffuseColor.rgb, float(uHasMap));
  roughnessFactor = mix(0.0, 0.1, n) * (1.0 - 0.1 * float(uHasRoughnessMap));
  metalnessFactor = 0.0;
`;

const BODIES: Record<GlassKind, string> = {
  clear: CLEAR_BODY,
  stained: STAINED_BODY,
  gem: GEM_BODY,
};

const OPTS: Record<GlassKind, { color: number; transparent: boolean; opacity: number; roughness: number }> = {
  clear: { color: 0xb8d4e8, transparent: true, opacity: 0.35, roughness: 0.1 },
  stained: { color: 0x8844aa, transparent: true, opacity: 0.75, roughness: 0.2 },
  gem: { color: 0x44aaff, transparent: true, opacity: 0.85, roughness: 0.05 },
};

export function createGlassMaterial(opts: GlassMaterialOptions = {}): THREE.MeshStandardMaterial {
  const kind = opts.kind ?? "clear";
  const base = OPTS[kind];
  const { kind: _kind, ...rest } = opts;
  return createPatchedMaterial(
    {
      ...base,
      ...rest,
      side: THREE.DoubleSide,
      envMapIntensity: opts.envMapIntensity ?? (kind === "gem" ? 2.0 : 1.0),
    },
    {
      fragmentBody: BODIES[kind],
    },
  );
}
