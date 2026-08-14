/**
 * Shared GLSL noise — string chunks injected into patched MeshStandardMaterial
 * shaders via onBeforeCompile. Single source for all procedural materials.
 *
 * Value-noise + fBm (fast, deterministic, no textures). Ridged variant for
 * crack/vein lines. All world-space so UVs aren't needed for terrain/stone.
 */
/** Deterministic hash of a 2D point → [0,1). */
export const GLSL_HASH = /* glsl */ `
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
`;
/** Smooth value noise on a 2D grid (bilinear between hashed lattice points). */
export const GLSL_VALUE_NOISE = /* glsl */ `
float valueNoise2D(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  // Smoothstep fade for C0 continuity.
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
`;
/** fBm: summed octaves of value noise → roughness/marble/terrain detail. */
export const GLSL_FBM = /* glsl */ `
float fbm(vec2 p) {
  float total = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 5; i++) {
    total += valueNoise2D(p * freq) * amp;
    freq *= 2.0;
    amp *= 0.5;
  }
  return total; // ~[0,1]
}

float fbm6(vec2 p) {
  // Higher-octave variant for fine surface detail.
  float total = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 6; i++) {
    total += valueNoise2D(p * freq) * amp;
    freq *= 2.07;
    amp *= 0.5;
  }
  return total;
}
`;
/** Ridged noise: abs(0.5 - value) gives vein/crack lines. */
export const GLSL_RIDGED = /* glsl */ `
float ridged(vec2 p) {
  return 1.0 - abs(fbm(p) - 0.5) * 2.0; // [0,1], peaks at the veins
}
`;
/** Voronoi-ish cell id for cobblestone stones. Returns vec2(id, edge). */
export const GLSL_VORONOI = /* glsl */ `
vec2 voronoiCells(vec2 p, out vec2 cellUV) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float minDist = 8.0;
  vec2 closest = vec2(0.0);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 nb = vec2(float(x), float(y));
      vec2 cellPoint = nb + vec2(hash21(i + nb), hash21(i + nb + 17.0));
      vec2 diff = nb + cellPoint - f;
      float d = dot(diff, diff);
      if (d < minDist) {
        minDist = d;
        closest = i + nb;
      }
    }
  }
  cellUV = f;
  float edge = clamp(minDist * 8.0, 0.0, 1.0); // 0 at center, 1 at edge
  return closest; // the owning cell's integer id
}
`;
/** Full noise library, concatenated for easy injection. */
export const GLSL_NOISE_LIB = [
    GLSL_HASH,
    GLSL_VALUE_NOISE,
    GLSL_FBM,
    GLSL_RIDGED,
    GLSL_VORONOI,
].join("\n");
/**
 * Terrain-style palette helpers (mirrors groundTypeAt logic on GPU).
 * Returns a per-region albedo + roughness based on world height + slope +
 * noise. Used by the terrain material; kept here so stone props can reuse
 * the moss/slope tint.
 */
export const GLSL_GROUND_BLEND = /* glsl */ `
// World-space ground blend — stylized AAA fantasy grass / dirt / stone / sand / rock.
vec3 groundAlbedo(vec3 worldPos, vec3 geomNormal, float seed) {
  vec2 wp = worldPos.xz + seed;
  float h = worldPos.y;
  float slope = 1.0 - clamp(geomNormal.y, 0.0, 1.0); // 0 flat, 1 vertical
  float n = fbm(wp * 0.08);
  float detail = fbm(wp * 0.4);

  // Painterly stylized grass palette (lush emerald with warm golden highlights)
  vec3 grassDeep = vec3(0.16, 0.38, 0.14);
  vec3 grassMid  = vec3(0.26, 0.56, 0.20);
  vec3 grassSun  = vec3(0.38, 0.68, 0.24);
  vec3 grass = mix(grassDeep, grassMid, n);
  grass = mix(grass, grassSun, smoothstep(0.4, 0.8, detail));

  // Rich warm earth & trail loam
  vec3 dirt = mix(vec3(0.36, 0.24, 0.14), vec3(0.48, 0.34, 0.20), n);
  
  // Warm royal city paving stone
  vec3 stone = mix(vec3(0.58, 0.54, 0.48), vec3(0.70, 0.66, 0.60), n);

  // Soft golden coastal sand
  vec3 sand = mix(vec3(0.78, 0.68, 0.48), vec3(0.88, 0.78, 0.58), n);

  // Mountain cliff rock with mossy top-facing blending
  vec3 rockBase = mix(vec3(0.38, 0.40, 0.42), vec3(0.50, 0.52, 0.55), n);
  vec3 rockMoss = mix(rockBase, vec3(0.24, 0.42, 0.18), clamp((1.0 - slope * 1.5), 0.0, 0.5));
  vec3 rock = rockMoss;

  vec3 col = grass;
  // Dirt ring just past the city radius (~60..72)
  float cityR = 60.0;
  float distR = length(worldPos.xz);
  col = mix(col, dirt, smoothstep(cityR, cityR + 12.0, distR) * (0.6 + 0.4 * n));

  // City interior paving stone
  col = mix(col, stone, (1.0 - smoothstep(cityR - 6.0, cityR, distR)));

  // High ground & cliffs
  col = mix(col, rock, smoothstep(3.5, 6.0, h));
  col = mix(col, rock, smoothstep(0.32, 0.58, slope));

  // Far-south beach sand
  col = mix(col, sand, smoothstep(-150.0, -135.0, worldPos.z) * (1.0 - smoothstep(0.0, 1.5, abs(h))));

  // Subtle painterly micro-texture variation
  col *= 0.94 + 0.12 * fbm(wp * 0.8);
  return col;
}

float groundRoughness(vec3 worldPos, vec3 geomNormal) {
  float slope = 1.0 - clamp(geomNormal.y, 0.0, 1.0);
  float base = 0.90;
  base = mix(base, 0.72, smoothstep(0.32, 0.58, slope)); // rock faces catch specular sheen
  base += (fbm(worldPos.xz * 0.3) - 0.5) * 0.1;
  return clamp(base, 0.55, 1.0);
}
`;
//# sourceMappingURL=noise.glsl.js.map