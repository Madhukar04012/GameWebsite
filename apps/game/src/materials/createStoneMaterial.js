/**
 * createStoneMaterial — patched MeshStandardMaterial for castle walls,
 * towers, building bases and stone props. Procedural:
 *   - base stone color varied by fbm
 *   - crack veins via ridged noise
 *   - moss tint on up-facing normals (soft top growth)
 *   - edge wear darkening
 * Phase B: pass map/normalMap/roughnessMap to sample authored PBR.
 */
import { createPatchedMaterial } from "./patchStandard";
const STONE_BODY = /* glsl */ `
  vec2 wuv = vWorldPos.xz + vWorldPos.y * 0.3 + uSeed;
  float baseN = fbm(wuv * 0.15);
  float fineN = fbm(wuv * 1.2);
  float cracks = ridged(wuv * 0.6);

  vec3 c = diffuseColor.rgb;
  vec3 dark = c * 0.55;
  vec3 light = c * 1.15;
  vec3 albedo = mix(dark, light, baseN);
  albedo *= 0.9 + 0.2 * fineN;
  // Darken crack veins.
  albedo *= mix(1.0, 0.35, pow(1.0 - cracks, 6.0));

  // Moss on up-facing surfaces — soft green tint growing from the top.
  float up = clamp(vNormalW.y, 0.0, 1.0);
  float moss = smoothstep(0.55, 0.95, up) * fbm(wuv * 0.4);
  albedo = mix(albedo, albedo * vec3(0.55, 0.75, 0.45) + vec3(0.02, 0.05, 0.02), moss * 0.8);

  diffuseColor.rgb = albedo;
  roughnessFactor = clamp(0.85 + 0.25 * fineN - 0.15 * float(uHasRoughnessMap), 0.5, 1.0);
`;
export function createStoneMaterial(opts = {}) {
    const color = opts.stoneColor ?? (opts.cobble ? 0x4d4d59 : opts.roof ? 0xa65330 : 0xe0d6c8);
    const { stoneColor: _stoneColor, ...rest } = opts;
    return createPatchedMaterial({
        ...rest,
        color,
        roughness: opts.roughness ?? (opts.roof ? 0.7 : 0.9),
        metalness: opts.metalness ?? (opts.roof ? 0.35 : 0.0),
    }, { fragmentBody: STONE_BODY });
}
//# sourceMappingURL=createStoneMaterial.js.map