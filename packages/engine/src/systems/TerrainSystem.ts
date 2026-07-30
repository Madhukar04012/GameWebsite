/**
 * TerrainSystem — pure-logic terrain height + ground-type sampling.
 *
 * No Three.js / React dependency. Height is a deterministic value-noise-ish
 * function of world XZ — rolling hills with flattening near the city so roads
 * and buildings sit on near-level ground. Designed so additional regions can
 * be streamed in later by delegating `heightAt` / `groundTypeAt` to a
 * region registry (future hook).
 */

export type GroundType = "grass" | "dirt" | "stone" | "sand" | "rock";

/* City flat zone radius — terrain eases to ~0 inside this to keep the
 * walled city level. Matches CITY_BOUNDS (±46) plus a little margin. */
const CITY_FLAT_RADIUS = 60;
const HILL_AMPLITUDE = 6; // max height variation
const HILL_FREQUENCY = 0.015; // spatial frequency of rolling hills

/**
 * Smooth interpolation: 0 inside flat radius, ramping to 1 outside.
 * Keeps the city perfectly flat while letting hills rise in the wilderness.
 */
function cityBlend(x: number, z: number): number {
  const dist = Math.sqrt(x * x + z * z);
  if (dist <= CITY_FLAT_RADIUS) return 0;
  const ramp = (dist - CITY_FLAT_RADIUS) / 30;
  return ramp >= 1 ? 1 : ramp * ramp * (3 - 2 * ramp); // smoothstep
}

/* Cheap value-noise from a hashed sin — deterministic across reloads. */
function valueNoise(x: number, z: number): number {
  const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
  return s - Math.floor(s); // 0..1
}

function smoothNoise(x: number, z: number): number {
  // bilinear interpolation of valueNoise on the integer lattice
  const xi = Math.floor(x);
  const zi = Math.floor(z);
  const xf = x - xi;
  const zf = z - zi;
  const fx = xf * xf * (3 - 2 * xf);
  const fz = zf * zf * (3 - 2 * zf);
  const a = valueNoise(xi, zi);
  const b = valueNoise(xi + 1, zi);
  const c = valueNoise(xi, zi + 1);
  const d = valueNoise(xi + 1, zi + 1);
  return (1 - fz) * ((1 - fx) * a + fx * b) + fz * ((1 - fx) * c + fx * d);
}

/**
 * World-space terrain height at (x, z).
 * Returns ~0 inside the city, rolling hills (±HILL_AMPLITUDE) outside.
 */
export function heightAt(x: number, z: number): number {
  const blend = cityBlend(x, z);
  if (blend === 0) return 0;
  // Two-octave fBm for gentle hills
  const n1 = smoothNoise(x * HILL_FREQUENCY, z * HILL_FREQUENCY) * 2 - 1;
  const n2 = smoothNoise(x * HILL_FREQUENCY * 2, z * HILL_FREQUENCY * 2) * 2 - 1;
  const hills = (n1 * 0.7 + n2 * 0.3) * HILL_AMPLITUDE;
  return hills * blend;
}

/**
 * Surface normal at (x, z) via finite differences. Used for lighting / camera.
 */
export function normalAt(x: number, z: number): { x: number; y: number; z: number } {
  const e = 1;
  const hL = heightAt(x - e, z);
  const hR = heightAt(x + e, z);
  const hD = heightAt(x, z - e);
  const hU = heightAt(x, z + e);
  const nx = hL - hR;
  const nz = hD - hU;
  const ny = 2 * e;
  const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
  return { x: nx / len, y: ny / len, z: nz / len };
}

/**
 * Ground material type at (x, z) — drives material/texture per region.
 * Roads are handled separately; this returns the baseline ground.
 */
export function groundTypeAt(x: number, z: number): GroundType {
  const h = heightAt(x, z);
  const dist = Math.sqrt(x * x + z * z);
  // Steep/high outer rock bands
  if (h > 4) return "rock";
  // Beach sand near far south (Flower Fields frontier)
  if (z < -140 && Math.abs(h) < 1.5) return "sand";
  // Dirt ring just outside the city
  if (dist > CITY_FLAT_RADIUS && dist < CITY_FLAT_RADIUS + 12) return "dirt";
  // City interior stone
  if (dist <= CITY_FLAT_RADIUS) return "stone";
  return "grass";
}

/**
 * Region streaming hook (future). For now a single global region.
 * Future: registry of regions each owning their own height/type fn.
 */
export interface RegionDef {
  id: string;
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  heightFn: (x: number, z: number) => number;
}
