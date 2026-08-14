/**
 * TerrainSystem — layered Master Geography / Meso / Micro procedural terrain engine.
 *
 * Deterministic pure-logic heightfield & surface classification:
 * 1. Macro Landform Elevation: Directly driven by Master Geography Model
 *    (Alpine Crests, Volcanic Mesas, River Gorge, Valleys, Coastal Basins).
 * 2. Meso Geological Formations: Sharp mountain ridge folds & rolling hills (FBM).
 * 3. Micro Terrain Detail: Fine soil and stone erosion (FBM).
 * 4. Capital Plateau: Flawless defensible flattening within city bounds.
 */
import { sampleGeography, getMacroLandformElevation, } from "@legend/shared";
/* City flat zone radius — terrain eases to city elevation inside this */
const CITY_FLAT_RADIUS = 50;
/** Smooth cubic interpolation */
function smoothStep(edge0, edge1, t) {
    const v = Math.max(0, Math.min(1, (t - edge0) / (edge1 - edge0)));
    return v * v * (3 - 2 * v);
}
/**
 * City Elevation Tiers (Verticality)
 * Citadel (+8m), Noble Terraces (+4m), Central (0m), Docks (-2m).
 * Smooth slopes allow roads to act as natural ramps.
 */
function getCityElevation(x, z) {
    let h = 0;
    if (z < -10) {
        // Ramp up to Noble (+4m) between z = -10 and z = -22
        h += 4 * smoothStep(-10, -22, z);
        // Ramp up to Citadel (+8m total) between z = -24 and z = -34
        if (z < -24) {
            h += 4 * smoothStep(-24, -34, z);
        }
    }
    else if (z > 28) {
        // Ramp down to Docks (-2m) between z = 28 and z = 38
        h -= 2 * smoothStep(28, 38, z);
    }
    return h;
}
/**
 * Smooth interpolation: 0 inside flat radius, ramping to 1 outside.
 */
function cityBlend(x, z) {
    const dist = Math.sqrt(x * x + z * z);
    if (dist <= CITY_FLAT_RADIUS)
        return 0;
    const ramp = (dist - CITY_FLAT_RADIUS) / 25;
    return ramp >= 1 ? 1 : smoothStep(0, 1, ramp);
}
/* Deterministic hashed value-noise */
function valueNoise(x, z) {
    const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453;
    return s - Math.floor(s);
}
function smoothNoise(x, z) {
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
function fbm(x, z, octaves = 4) {
    let val = 0;
    let amp = 0.5;
    let freq = 1.0;
    let max = 0;
    for (let i = 0; i < octaves; i++) {
        val += smoothNoise(x * freq, z * freq) * amp;
        max += amp;
        amp *= 0.5;
        freq *= 2.0;
    }
    return val / max;
}
/**
 * World-space terrain height at (x, z).
 * Layered generation:
 * 1. Master Geography Macro Landforms (Highland ridges, mesas, valleys, river gorge).
 * 2. Meso Geological Formations (Mountains & Valleys).
 * 3. Micro Terrain & Soil Erosion.
 */
export function heightAt(x, z) {
    const blend = cityBlend(x, z);
    const cityH = getCityElevation(x, z);
    // Inside the city, just return the city elevation tier height
    if (blend === 0)
        return cityH;
    // 1. Master Geography Macro Landforms
    const macroElevation = getMacroLandformElevation(x, z);
    // 2. Meso Geological Formations (Mountains & Valleys)
    const mesoNoise = fbm(x * 0.008, z * 0.008, 4);
    const ridges = Math.abs(mesoNoise - 0.5) * 2.0; // Sharp ridge creases
    const mesoHills = (mesoNoise * 6.0) + (ridges * 4.5);
    // 3. Micro Terrain Detail
    const microNoise = fbm(x * 0.04, z * 0.04, 3) * 1.5;
    const totalWildernessHeight = macroElevation + mesoHills + microNoise;
    // Blend smoothly from city elevation to wilderness elevation at the border
    return cityH * (1 - blend) + totalWildernessHeight * blend;
}
/**
 * Surface normal at (x, z) via finite differences.
 */
export function normalAt(x, z) {
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
 * Ground material type at (x, z) — driven by Master Geography & Elevation Zones.
 */
export function groundTypeAt(x, z) {
    const h = heightAt(x, z);
    const dist = Math.sqrt(x * x + z * z);
    // City interior stone
    if (dist <= CITY_FLAT_RADIUS)
        return "stone";
    // Dirt perimeter ring just outside the city walls
    if (dist <= CITY_FLAT_RADIUS + 14)
        return "dirt";
    // Snowy alpine mountain caps & Frostpeaks
    if (h > 18 || (z > 70 && h > 8))
        return "snow";
    // Steep/high outer rock bands
    if (h > 8)
        return "rock";
    // Beach sand near coastal areas or Sunstone Desert
    if ((z < -130 && h < 1.5) || (x > 70 && h < 12))
        return "sand";
    return "grass";
}
/**
 * High-level geography inspector hooks for engine and client systems.
 */
export function getTerrainGeography(x, z) {
    return sampleGeography(x, z);
}
export const geographyAt = sampleGeography;
export const macroElevation = getMacroLandformElevation;
//# sourceMappingURL=TerrainSystem.js.map