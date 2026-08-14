/**
 * createTerrainMaterial — patched MeshStandardMaterial that derives a
 * grass/dirt/stone/sand/rock albedo from world position + slope + fbm noise
 * (mirrors packages/engine TerrainSystem groundTypeAt), plus procedural
 * roughness variation. Extended with biome variants for the four surrounding
 * regions outside Capital Kingdom.
 *
 * Phase B: pass `map`/`normalMap`/`roughnessMap` to multiply in authored PBR.
 */
import { createPatchedMaterial } from "./patchStandard";
const TERRAIN_BODY_WORLD = /* glsl */ `
  vec3 wpos = vWorldPos + vec3(uSeed, 0.0);
  vec3 albedo = groundAlbedo(wpos, normalize(vNormalW), 0.0);
  float mapAmt = float(uHasMap);
  albedo = mix(albedo, albedo * diffuseColor.rgb, mapAmt);
  diffuseColor.rgb = albedo;
  roughnessFactor = groundRoughness(wpos, normalize(vNormalW));
  roughnessFactor *= (1.0 - 0.3 * float(uHasRoughnessMap));
`;
const TERRAIN_BODY_GROVE = /* glsl */ `
  vec3 wpos = vWorldPos + vec3(uSeed, 0.0);
  float n = fbm(wpos.xz * 0.18);
  float grain = fbm(wpos.xz * 0.9);
  vec3 deep = mix(vec3(0.025, 0.09, 0.085), vec3(0.05, 0.16, 0.14), n);
  vec3 albedo = deep * (0.85 + 0.3 * grain);
  diffuseColor.rgb = mix(albedo, albedo * diffuseColor.rgb, float(uHasMap));
  roughnessFactor = 0.92;
`;
const TERRAIN_BODY_ASHEN = /* glsl */ `
  // Ashen Barrens — volcanic ash and cinder waste.
  vec3 wpos = vWorldPos + vec3(uSeed, 0.0);
  float n = fbm(wpos.xz * 0.15);
  float grain = fbm(wpos.xz * 0.7);
  vec3 ash = mix(vec3(0.20, 0.14, 0.10), vec3(0.30, 0.18, 0.12), n);
  vec3 ember = vec3(0.45, 0.18, 0.05);
  float emberMask = smoothstep(0.4, 0.7, grain);
  vec3 albedo = mix(ash, ember, emberMask * 0.15);
  diffuseColor.rgb = mix(albedo, albedo * diffuseColor.rgb, float(uHasMap));
  roughnessFactor = 0.85 + 0.12 * (1.0 - n);
`;
const TERRAIN_BODY_BOG = /* glsl */ `
  // Mistmire Bog — dark peat moss with murky water pools.
  vec3 wpos = vWorldPos + vec3(uSeed, 0.0);
  float n = fbm(wpos.xz * 0.12);
  float pool = fbm(wpos.xz * 0.3 + 1.5);
  vec3 peat = mix(vec3(0.08, 0.12, 0.06), vec3(0.12, 0.18, 0.08), n);
  vec3 water = vec3(0.03, 0.06, 0.05);
  float waterMask = smoothstep(0.35, 0.55, pool);
  vec3 albedo = mix(peat, water, waterMask * 0.25);
  diffuseColor.rgb = mix(albedo, albedo * diffuseColor.rgb, float(uHasMap));
  roughnessFactor = mix(0.92, 0.5, waterMask * 0.2);
`;
const TERRAIN_BODY_DESERT = /* glsl */ `
  // Sunstone Desert — golden sand baked by twin suns.
  vec3 wpos = vWorldPos + vec3(uSeed, 0.0);
  float n = fbm(wpos.xz * 0.1);
  float dune = fbm(wpos.xz * 0.04);
  vec3 sand = mix(vec3(0.76, 0.62, 0.38), vec3(0.86, 0.72, 0.48), n);
  vec3 stone = vec3(0.65, 0.50, 0.30);
  float stoneMask = smoothstep(0.55, 0.7, n);
  vec3 albedo = mix(sand, stone, stoneMask * 0.2);
  // Warm dune highlights
  albedo += vec3(0.04, 0.02, 0.0) * (1.0 - dune);
  diffuseColor.rgb = mix(albedo, albedo * diffuseColor.rgb, float(uHasMap));
  roughnessFactor = 0.75 + 0.2 * (1.0 - n);
`;
const TERRAIN_BODY_FROST = /* glsl */ `
  // Frostfang Ridge — permafrost, packed snow, blue-ice veins.
  vec3 wpos = vWorldPos + vec3(uSeed, 0.0);
  float n = fbm(wpos.xz * 0.14);
  float ice = fbm(wpos.xz * 0.3 + 3.0);
  vec3 snow = mix(vec3(0.82, 0.86, 0.90), vec3(0.70, 0.78, 0.88), n);
  vec3 iceBlue = vec3(0.40, 0.60, 0.80);
  float iceMask = smoothstep(0.5, 0.75, ice);
  vec3 albedo = mix(snow, iceBlue, iceMask * 0.2);
  diffuseColor.rgb = mix(albedo, albedo * diffuseColor.rgb, float(uHasMap));
  roughnessFactor = 0.65 + 0.3 * n;
`;
export function createTerrainMaterial(opts = {}) {
    const variant = opts.variant ?? "world";
    const bodyMap = {
        world: TERRAIN_BODY_WORLD,
        grove: TERRAIN_BODY_GROVE,
        ashen: TERRAIN_BODY_ASHEN,
        bog: TERRAIN_BODY_BOG,
        desert: TERRAIN_BODY_DESERT,
        frost: TERRAIN_BODY_FROST,
    };
    const body = bodyMap[variant] ?? TERRAIN_BODY_WORLD;
    return createPatchedMaterial({ color: 0xffffff, roughness: 0.95, metalness: 0.0, ...opts }, { fragmentBody: body });
}
//# sourceMappingURL=createTerrainMaterial.js.map