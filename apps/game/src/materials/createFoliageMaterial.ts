/**
 * createFoliageMaterial — patched MeshStandardMaterial for instanced trees,
 * bushes and grass. Procedural two-tone leaf color + wind sway bent in the
 * vertex shader from world position + time so the roots stay planted (the
 * bend is masked by local height).
 *
 * Instanced: works inside drei <Instances> because `transformed` already
 * includes the per-instance matrix when our vertex body runs.
 * Phase B: pass map/normalMap/roughnessMap for authored foliage.
 */

import * as THREE from "three";
import { createPatchedMaterial, type PatchedMaterialOptions } from "./patchStandard";

export type FoliageKind = "tree" | "bush" | "grass" | "flower";

export interface FoliageMaterialOptions extends PatchedMaterialOptions {
  kind?: FoliageKind;
}

// Vertex: bend the top of the foliage with a sine of world XZ + time.
const VERTEX_BODY = /* glsl */ `
  float bend = 0.0;
  float topMask = clamp((transformed.y - 0.3) * 1.5, 0.0, 1.0);
  float phase = uTime * 1.2 + vWorldPos.x * 0.6 + vWorldPos.z * 0.4;
  bend = (sin(phase) * 0.5 + 0.5) * 0.12 * uWindAmt;
  transformed.x += sin(phase) * 0.10 * topMask * uWindAmt;
  transformed.z += cos(phase * 1.07) * 0.08 * topMask * uWindAmt;
`;

const FRAGMENT_BODY = /* glsl */ `
  vec3 lit = diffuseColor.rgb;
  vec3 dark = lit * 0.65;
  float n = fbm(vWorldPos.xz * 1.5 + uSeed);
  // Two-tone: lighter tips, darker recesses.
  diffuseColor.rgb = mix(dark, lit, 0.55 + 0.45 * n);
  // Backface subsurface warmth so foliage catches sun through the crown.
  float back = smoothstep(0.0, -0.4, vNormalW.y - abs(vNormalW.x));
  diffuseColor.rgb += vec3(0.05, 0.04, 0.0) * back;
  roughnessFactor = clamp(0.95 - 0.1 * n, 0.7, 1.0);
`;

export function createFoliageMaterial(opts: FoliageMaterialOptions = {}): THREE.MeshStandardMaterial {
  const kind = opts.kind ?? "tree";
  const uWindAmt = kind === "grass" ? 0.7 : kind === "bush" ? 0.4 : 0.55;
  return createPatchedMaterial(
    {
      color: opts.color ??
        (kind === "grass" ? 0x7bdc55 :
          kind === "flower" ? 0xffd700 :
          kind === "bush" ? 0x48b848 : 0x48b848),
      roughness: 0.95,
      metalness: 0.0,
      flatShading: true,
      side: THREE.DoubleSide,
      ...opts,
    },
    {
      declarations: "uniform float uTime; uniform float uWindAmt;",
      vertexDeclarations: "uniform float uTime; uniform float uWindAmt;",
      uniforms: {
        uTime: { value: 0 },
        uWindAmt: { value: uWindAmt },
      },
      vertexBody: VERTEX_BODY,
      fragmentBody: FRAGMENT_BODY,
    },
  );
}
