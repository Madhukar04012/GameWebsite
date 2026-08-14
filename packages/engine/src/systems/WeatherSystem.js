/**
 * WeatherSystem — pure-logic weather state, wind field, and transitions.
 *
 * Defines weather presets and a state machine for transitioning between them.
 * No React/Three.js dependency — pure deterministic math for wind gusts.
 */
/* ── Preset definitions ── */
const PRESETS = {
    clear: {
        cloudCover: 0.1,
        fogDensity: 0.0,
        rainIntensity: 0.0,
        wind: "calm",
        ambientBrightness: 1.0,
    },
    cloudy: {
        cloudCover: 0.7,
        fogDensity: 0.05,
        rainIntensity: 0.0,
        wind: "breeze",
        ambientBrightness: 0.85,
    },
    foggy: {
        cloudCover: 0.5,
        fogDensity: 0.8,
        rainIntensity: 0.0,
        wind: "calm",
        ambientBrightness: 0.7,
    },
    rainy: {
        cloudCover: 0.9,
        fogDensity: 0.2,
        rainIntensity: 0.6,
        wind: "gusty",
        ambientBrightness: 0.6,
    },
    storm: {
        cloudCover: 1.0,
        fogDensity: 0.4,
        rainIntensity: 1.0,
        wind: "gale",
        ambientBrightness: 0.35,
    },
    snow: {
        cloudCover: 0.8,
        fogDensity: 0.3,
        rainIntensity: 0.0,
        wind: "breeze",
        ambientBrightness: 0.8,
    },
    sandstorm: {
        cloudCover: 0.6,
        fogDensity: 0.65,
        rainIntensity: 0.0,
        wind: "gale",
        ambientBrightness: 0.5,
    },
};
/* ── Wind helpers ── */
const WIND_AMPLITUDE = {
    calm: 0.0,
    breeze: 0.3,
    gusty: 0.7,
    gale: 1.0,
};
/** Map wind strength to foliage sway amplitude multiplier. */
export function windAmplitude(wind) {
    return WIND_AMPLITUDE[wind];
}
/** Get 2D wind direction vector (x, z) scaled by wind strength. */
export function getWindVector(state) {
    const amp = windAmplitude(state.wind) * (1.0 + state.gustFactor * 0.5);
    return {
        x: Math.cos(state.windDirection) * amp,
        z: Math.sin(state.windDirection) * amp,
        strength: amp,
    };
}
/* ── Factory ── */
export function createWeatherState(preset = "clear") {
    const base = PRESETS[preset];
    return {
        preset,
        transition: 1.0,
        ...base,
        windDirection: Math.random() * Math.PI * 2,
        gustFactor: 0,
        lightningFreq: preset === "storm" ? 6 : preset === "rainy" ? 1 : 0,
    };
}
/**
 * Update weather state each frame.
 * @param dt  delta time in seconds
 * @param target  optional target preset to transition toward (null = stay current)
 * @param config  transition config
 * @returns  updated WeatherState
 */
export function updateWeather(state, dt, target, config = { transitionDuration: 120 }) {
    let t = state.transition;
    let preset = state.preset;
    if (target && target !== preset) {
        // Transition toward target
        t += dt / config.transitionDuration;
        if (t >= 1.0) {
            t = 1.0;
            preset = target;
        }
    }
    const fromPreset = PRESETS[preset];
    const toPreset = target && target !== preset ? PRESETS[target] : fromPreset;
    // Lerp between from/to based on t
    const cloudCover = lerp(fromPreset.cloudCover, toPreset.cloudCover, t);
    const fogDensity = lerp(fromPreset.fogDensity, toPreset.fogDensity, t);
    const rainIntensity = lerp(fromPreset.rainIntensity, toPreset.rainIntensity, t);
    // Wind changes gradually
    const fromWind = WIND_AMPLITUDE[preset === state.preset ? state.wind : fromPreset.wind];
    const toWind = target ? WIND_AMPLITUDE[PRESETS[target].wind] : fromWind;
    const windMag = lerp(fromWind, toWind, t);
    // Resolve wind strength from magnitude
    let wind = "calm";
    if (windMag > 0.75)
        wind = "gale";
    else if (windMag > 0.4)
        wind = "gusty";
    else if (windMag > 0.1)
        wind = "breeze";
    // Gust factor: sinusoidal gust oscillation
    const gustFactor = windMag > 0.1
        ? (Math.sin(state.windDirection * 10 + performance.now() * 0.0008) * 0.5 + 0.5) * windMag
        : 0;
    // Lightning freq derived from rain
    const lightningFreq = target === "storm" ? 6 : target === "rainy" ? 1 : 0;
    return {
        preset: target && t >= 1.0 ? target : state.preset,
        transition: Math.min(1.0, t),
        cloudCover,
        fogDensity,
        rainIntensity,
        wind,
        windDirection: state.windDirection,
        gustFactor,
        lightningFreq,
        ambientBrightness: lerp(fromPreset.ambientBrightness, toPreset.ambientBrightness, t),
    };
}
function lerp(a, b, t) {
    return a + (b - a) * t;
}
//# sourceMappingURL=WeatherSystem.js.map