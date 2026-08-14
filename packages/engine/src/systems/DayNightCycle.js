/**
 * DayNightCycle — pure-logic sun position, color, and sky parameters.
 *
 * Computes sun position on a hemispherical dome from a time value (0..24 hours).
 * No React/Three.js dependency — returns plain numbers for the R3F component
 * to apply to lighting, fog, sky, and post-processing.
 */
/* ── Color palettes ── */
const COLORS = {
    // Dawn: cool blue → warm gold
    dawnSky: 0x7ec8e3,
    dawnHorizon: 0xf4a460,
    dawnSun: 0xffcc66,
    dawnFog: 0xc4b8a0,
    // Noon: clear blue
    noonSky: 0x87ceeb,
    noonHorizon: 0xadd8e6,
    noonSun: 0xfff5e0,
    noonFog: 0x87ceeb,
    // Dusk: warm gold → purple
    duskSky: 0x6b5b8a,
    duskHorizon: 0xe8a87c,
    duskSun: 0xff9944,
    duskFog: 0x8a7a8a,
    // Night: deep indigo
    nightSky: 0x0a0a2e,
    nightHorizon: 0x1a1a3e,
    nightSun: 0x446688,
    nightFog: 0x0a0a2e,
};
/** Interpolate between two hex colors. */
function lerpColor(a, b, t) {
    const ar = (a >> 16) & 0xff, ag = (a >> 8) & 0xff, ab = a & 0xff;
    const br = (b >> 16) & 0xff, bg = (b >> 8) & 0xff, bb = b & 0xff;
    const r = Math.round(ar + (br - ar) * t);
    const g = Math.round(ag + (bg - ag) * t);
    const b_ = Math.round(ab + (bb - ab) * t);
    return (r << 16) | (g << 8) | b_;
}
/** Hermite smoothstep for natural-looking transitions. */
function smoothstep(edge0, edge1, x) {
    const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
    return t * t * (3 - 2 * t);
}
/**
 * Compute celestial state from time of day (0..24).
 */
export function computeCelestialState(hours) {
    const t = hours / 24; // 0..1
    // Altitude: sun follows a sine arc peaking at noon (t=0.5).
    // Max altitude ~70 deg (1.22 rad), min ~-60 deg (-1.05 rad) for night.
    const altitude = Math.sin((t - 0.25) * Math.PI * 2) * 1.1;
    // Clamp to [-PI/2, PI/2]
    const alt = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, altitude));
    // Azimuth: full rotation over 24h.
    const azimuth = t * Math.PI * 2;
    // Time-of-day phases (t in 0..1)
    const isNight = alt < -0.1;
    const isTwilight = alt >= -0.1 && alt < 0.1;
    const isDay = alt >= 0.1;
    // Normalize altitude to [0,1] for color blending
    const dayAmount = Math.max(0, Math.min(1, (alt + 0.2) / 1.3));
    // Dawn/dusk transition windows
    const dawnAmount = smoothstep(-0.05, 0.15, alt) * (1 - smoothstep(0.15, 0.35, alt));
    const duskAmount = smoothstep(-0.05, 0.15, alt) * (1 - smoothstep(0.15, 0.35, alt));
    // Sun color: white at noon, warm at dawn/dusk, cool-blue moonlight at night
    let sunColor;
    if (isNight) {
        sunColor = lerpColor(0x446688, 0x6688aa, (Math.sin(t * Math.PI * 2) * 0.5 + 0.5));
    }
    else if (dawnAmount > 0.1) {
        sunColor = lerpColor(COLORS.dawnSun, COLORS.noonSun, 1 - dawnAmount);
    }
    else if (duskAmount > 0.1) {
        sunColor = lerpColor(COLORS.noonSun, COLORS.duskSun, duskAmount);
    }
    else {
        sunColor = COLORS.noonSun;
    }
    // Sky color: blend between night/dusk/dawn/noon
    let skyColor;
    let horizonColor;
    let fogColor;
    let ambientIntensity;
    let sunIntensity;
    let starVisibility;
    if (isNight) {
        const nightPhase = (Math.sin(t * Math.PI * 2) * 0.5 + 0.5);
        skyColor = lerpColor(0x0a0a2e, 0x1a1a3e, nightPhase);
        horizonColor = lerpColor(0x1a1a3e, 0x2a2a4e, nightPhase);
        fogColor = 0x0a0a2e;
        ambientIntensity = 0.08;
        sunIntensity = 0.15;
        starVisibility = 0.8 + nightPhase * 0.2;
    }
    else if (isTwilight) {
        // Blend between night and day based on altitude
        const tw = (alt + 0.1) / 0.2; // 0..1
        if (alt < 0) {
            // Dawn/dusk transition up
            skyColor = lerpColor(COLORS.nightSky, COLORS.dawnSky, tw);
            horizonColor = lerpColor(COLORS.nightHorizon, COLORS.dawnHorizon, tw);
            fogColor = lerpColor(COLORS.nightFog, COLORS.dawnFog, tw);
        }
        else {
            skyColor = lerpColor(COLORS.dawnSky, COLORS.noonSky, tw);
            horizonColor = lerpColor(COLORS.dawnHorizon, COLORS.noonHorizon, tw);
            fogColor = lerpColor(COLORS.dawnFog, COLORS.noonFog, tw);
        }
        ambientIntensity = lerp(0.08, 0.4, tw);
        sunIntensity = lerp(0.15, 1.0, tw);
        starVisibility = 1 - tw;
    }
    else {
        // Day
        skyColor = COLORS.noonSky;
        horizonColor = COLORS.noonHorizon;
        fogColor = COLORS.noonFog;
        ambientIntensity = 0.4;
        sunIntensity = 1.0;
        starVisibility = 0;
    }
    return {
        azimuth,
        altitude: alt,
        timeOfDay: t,
        sunColor,
        skyColor,
        horizonColor,
        ambientIntensity,
        sunIntensity,
        fogColor,
        shadowDarkness: isNight ? 0.95 : isTwilight ? lerp(0.95, 0.5, (alt + 0.1) / 0.2) : 0.5,
        starVisibility,
        moonPhase: (t * 29.5) % 1.0, // ~monthly cycle
    };
}
function lerp(a, b, t) {
    return a + (b - a) * t;
}
//# sourceMappingURL=DayNightCycle.js.map