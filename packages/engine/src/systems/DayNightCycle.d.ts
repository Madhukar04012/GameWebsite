/**
 * DayNightCycle — pure-logic sun position, color, and sky parameters.
 *
 * Computes sun position on a hemispherical dome from a time value (0..24 hours).
 * No React/Three.js dependency — returns plain numbers for the R3F component
 * to apply to lighting, fog, sky, and post-processing.
 */
export interface CelestialState {
    /** Sun azimuth in radians (0 = north). */
    azimuth: number;
    /** Sun altitude in radians (-PI/2..PI/2). Negative = below horizon (night). */
    altitude: number;
    /** Normalized 0..1 time of day (0 = midnight, 0.5 = noon). */
    timeOfDay: number;
    /** Sun color as hex number (changes from warm golden to cool white). */
    sunColor: number;
    /** Sky color (zenith) as hex number. */
    skyColor: number;
    /** Horizon color as hex number. */
    horizonColor: number;
    /** Ambient light intensity 0..1. */
    ambientIntensity: number;
    /** Fog color as hex number. */
    fogColor: number;
    /** Sun intensity multiplier. */
    sunIntensity: number;
    /** Shadow darkness 0..1 (1 = full shadow). */
    shadowDarkness: number;
    /** Star visibility 0..1. */
    starVisibility: number;
    /** Moon phase 0..1 (0 = new, 0.5 = full). */
    moonPhase: number;
}
/**
 * Compute celestial state from time of day (0..24).
 */
export declare function computeCelestialState(hours: number): CelestialState;
//# sourceMappingURL=DayNightCycle.d.ts.map