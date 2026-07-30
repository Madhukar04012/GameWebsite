/**
 * createWoodMaterial — patched MeshStandardMaterial for docks, boats, carts,
 * barrels, fences. Procedural wood grain: stretched fbm along one axis,
 * ring lines via ridged noise, warm light/dark plank variation.
 * Phase B: pass map/normalMap/roughnessMap for authored PBR.
 */

import * as THREE from "three";
import { createPatchedMaterial, type PatchedMaterialOptions } from "./patchStandard";

export interface WoodMaterialOptions extends PatchedMaterialOptions {
  woodColor?: THREE.ColorRepresentation;
}

const WOOD_BODY = /* glsl */ `
  // Grain runs along local Y by default; stretch noise in XZ for long fibers.
  vec2 g = vec2(vWorldPos.x + vWorldPos.z, vWorldPos.y * 1.5) + uSeed;
  float fibers = fbm(g * vec2(0.8, 3.0));
  float rings = ridged(g * vec2(0.4, 2.0));
  float fine = fbm(g * 2.5);

  vec3 c = diffuseColor.rgb;
  vec3 dark = c * 0.6;
  vec3 light = c * 1.25;
  vec3 albedo = mix(dark, light, fibers);
  // Dark plank seams / knots.
  albedo *= mix(1.0, 0.6, pow(1.0 - rings, 4.0));
  albedo *= 0.92 + 0.16 * fine;

  diffuseColor.rgb = albedo;
  roughnessFactor = clamp(0.8 + 0.2 * fine - 0.1 * float(uHasRoughnessMap), 0.55, 1.0);
`;

export function createWoodMaterial(opts: WoodMaterialOptions = {}): THREE.MeshStandardMaterial {
  const color = opts.woodColor ?? 0x6a4a2a;
  const { woodColor: _woodColor, ...rest } = opts;
  return createPatchedMaterial(
    {
      ...rest,
      color,
      roughness: opts.roughness ?? 0.85,
      metalness: opts.metalness ?? 0.05,
    },
    { fragmentBody: WOOD_BODY },
  );
}
