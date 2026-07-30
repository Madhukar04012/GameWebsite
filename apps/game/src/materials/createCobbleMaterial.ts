/**
 * createCobbleMaterial — patched MeshStandardMaterial for roads + plaza.
 * Procedural cobblestone: voronoi cell ids give per-stone color variation,
 * stone edges darken into mortar gaps, a thin gold grout accent on main/plaza,
 * and a noise-driven dirt edge blend. Phase B: swap authored maps in.
 */

import * as THREE from "three";
import { createPatchedMaterial, type PatchedMaterialOptions } from "./patchStandard";

export type CobbleKind = "main" | "plaza" | "district" | "dirt";

export interface CobbleMaterialOptions extends PatchedMaterialOptions {
  kind?: CobbleKind;
  /** Scale of the cobble cells in world units. */
  scale?: number;
}

const COBBLE_BODY = /* glsl */ `
  vec2 cellPos;
  vec2 cellUV;
  float scl = uScale;
  vec2 cellId = voronoiCells(vWorldPos.xz * scl + uSeed, cellUV);
  float stoneN = hash21(cellId);
  float edgeN = fbm(cellUV * 6.0);

  vec3 base = diffuseColor.rgb;
  vec3 stone = mix(base * 0.7, base * 1.15, stoneN);
  vec3 mortar = base * 0.35 + vec3(0.02, 0.02, 0.015);
  // cellUV distance to edge ~0 at seam; sharpen.
  float seam = smoothstep(0.35, 0.5, length(cellUV - 0.5));
  vec3 albedo = mix(stone, mortar, 1.0 - seam);
  albedo *= 0.9 + 0.2 * edgeN;

  // Gold grout accent speckle on main/plaza — tiny emissive specks along seams.
  float goldSpeck = smoothstep(0.78, 0.95, 1.0 - seam) * stoneN;
  vec3 gold = vec3(0.83, 0.69, 0.27);
  albedo += gold * goldSpeck * uGoldAmt;

  // Dirt edge: noise alpha darkens toward patches.
  float dirt = fbm(vWorldPos.xz * 0.5);
  albedo = mix(albedo, albedo * vec3(0.5, 0.4, 0.28), smoothstep(0.6, 0.85, dirt) * uDirtAmt);

  diffuseColor.rgb = albedo;
  roughnessFactor = clamp(0.75 + 0.2 * edgeN, 0.6, 1.0);
`;

export function createCobbleMaterial(opts: CobbleMaterialOptions = {}): THREE.MeshStandardMaterial {
  const kind = opts.kind ?? "district";
  const color =
    kind === "dirt" ? 0x6a5a3a :
    kind === "plaza" ? 0x3a3a36 :
    kind === "main" ? 0x4a463a :
    0x4a463a;
  const scale = opts.scale ?? (kind === "plaza" ? 2.5 : kind === "main" ? 2.0 : 1.8);
  const uGoldAmt = kind === "main" || kind === "plaza" ? 0.15 : 0.0;
  const uDirtAmt = kind === "dirt" ? 1.0 : 0.35;

  const { kind: _kind, scale: _scale, ...rest } = opts;
  return createPatchedMaterial(
    {
      ...rest,
      color,
      roughness: opts.roughness ?? 0.85,
      metalness: opts.metalness ?? 0.05,
    },
    {
      declarations: `uniform float uScale; uniform float uGoldAmt; uniform float uDirtAmt;`,
      uniforms: {
        uScale: { value: scale },
        uGoldAmt: { value: uGoldAmt },
        uDirtAmt: { value: uDirtAmt },
      },
      fragmentBody: COBBLE_BODY,
    },
  );
}
