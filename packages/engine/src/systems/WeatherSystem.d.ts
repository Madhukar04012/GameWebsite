/**
 * WeatherSystem — pure-logic weather state, wind field, and transitions.
 *
 * Defines weather presets and a state machine for transitioning between them.
 * No React/Three.js dependency — pure deterministic math for wind gusts.
 */
export type WeatherPreset = "clear" | "cloudy" | "foggy" | "rainy" | "storm" | "snow" | "sandstorm";
export type WindStrength = "calm" | "breeze" | "gusty" | "gale";
export interface WeatherState {
    preset: WeatherPreset;
    /** 0..1 transition progress when changing weather (0 = fully old, 1 = fully new). */
    transition: number;
    /** Cloud cover 0..1 (0 = clear, 1 = overcast). */
    cloudCover: number;
    /** Fog density 0..1 (scaled by scene fog density). */
    fogDensity: number;
    /** Rain intensity 0..1. */
    rainIntensity: number;
    /** Wind strength. */
    wind: WindStrength;
    /** Wind direction in radians. */
    windDirection: number;
    /** Gust factor 0..1 (multiplied into wind amplitude for foliage sway). */
    gustFactor: number;
    /** Lightning flash frequency (flashes per minute, 0 = none). */
    lightningFreq: number;
    /** Ambient brightness multiplier 0..1 (darkens during storms). */
    ambientBrightness: number;
}
export interface WeatherConfig {
    /** Duration in seconds for a full transition between weather presets. */
    transitionDuration: number;
}
/** Map wind strength to foliage sway amplitude multiplier. */
export declare function windAmplitude(wind: WindStrength): number;
/** Get 2D wind direction vector (x, z) scaled by wind strength. */
export declare function getWindVector(state: WeatherState): {
    x: number;
    z: number;
    strength: number;
};
export declare function createWeatherState(preset?: WeatherPreset): WeatherState;
/**
 * Update weather state each frame.
 * @param dt  delta time in seconds
 * @param target  optional target preset to transition toward (null = stay current)
 * @param config  transition config
 * @returns  updated WeatherState
 */
export declare function updateWeather(state: WeatherState, dt: number, target: WeatherPreset | null, config?: WeatherConfig): WeatherState;
//# sourceMappingURL=WeatherSystem.d.ts.map