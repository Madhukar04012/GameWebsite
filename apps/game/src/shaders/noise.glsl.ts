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
// World-space ground blend — grass / dirt / stone / sand / rock.
// Heights mirror packages/engine TerrainSystem: city flat zone ~0, hills >4 rock.
vec3 groundAlbedo(vec3 worldPos, vec3 geomNormal, float seed) {
  vec2 wp = worldPos.xz + seed;
  float h = worldPos.y;
  float slope = 1.0 - clamp(geomNormal.y, 0.0, 1.0); // 0 flat, 1 vertical
  float n = fbm(wp * 0.08);

  vec3 grass = mix(vec3(0.45, 0.80, 0.20), vec3(0.65, 0.95, 0.25), n);
  vec3 dirt  = mix(vec3(0.75, 0.50, 0.25), vec3(0.85, 0.65, 0.35), n);
  vec3 stone = mix(vec3(0.75, 0.75, 0.78), vec3(0.90, 0.90, 0.92), n);
  vec3 sand  = mix(vec3(0.95, 0.90, 0.65), vec3(1.00, 0.95, 0.80), n);
  vec3 rock  = mix(vec3(0.55, 0.60, 0.65), vec3(0.65, 0.70, 0.75), n);

  vec3 col = grass;
  // Dirt ring just past the city radius (~60..72), plus noise feather.
  float cityR = 60.0;
  float distR = length(worldPos.xz);
  col = mix(col, dirt, smoothstep(cityR, cityR + 12.0, distR) * (0.6 + 0.4 * n));
  // City interior stone.
  col = mix(col, stone, (1.0 - smoothstep(cityR - 6.0, cityR, distR)));
  // High ground → rock.
  col = mix(col, rock, smoothstep(3.0, 5.0, h));
  // Steep slopes → bare rock regardless of height.
  col = mix(col, rock, smoothstep(0.35, 0.6, slope));
  // Far-south low beach sand.
  col = mix(col, sand, smoothstep(-150.0, -135.0, worldPos.z) * (1.0 - smoothstep(0.0, 1.5, abs(h))));
  // Micro variation for grain.
  col *= 0.92 + 0.16 * fbm(wp * 0.9);
  return col;
}

float groundRoughness(vec3 worldPos, vec3 geomNormal) {
  float slope = 1.0 - clamp(geomNormal.y, 0.0, 1.0);
  float base = 0.92;
  base = mix(base, 0.78, smoothstep(0.35, 0.6, slope)); // rock faces a touch glossier
  base += (fbm(worldPos.xz * 0.3) - 0.5) * 0.1;
  return clamp(base, 0.6, 1.0);
}
`;
