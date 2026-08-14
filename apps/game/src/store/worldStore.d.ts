/**
 * worldStore — environment state (day/night, weather) separate from game logic.
 *
 * Keeps rendering-parameter state out of the game state machine; consumed by
 * DayNightCycle, WeatherController, and Scene.tsx.
 */
import type { CelestialState } from "@legend/engine";
import type { WeatherState } from "@legend/engine";
interface WorldState {
    /** In-game hours (0..24, loops). */
    timeOfDay: number;
    /** Computed celestial state (derived from timeOfDay). */
    celestial: CelestialState;
    /** Current weather. */
    weather: WeatherState;
    /** Time speed multiplier (1 = real-time, 60 = 1 minute = 1 hour in-game). */
    timeScale: number;
    /** Weather target preset (null = stay current). */
    weatherTarget: WeatherState["preset"] | null;
    /** Wind amplitude for foliage (0..1). */
    windAmplitude: number;
    advanceTime: (dt: number) => void;
    setWeather: (preset: WeatherState["preset"]) => void;
    setTimeScale: (scale: number) => void;
}
export declare const useWorldStore: import("zustand").UseBoundStore<import("zustand").StoreApi<WorldState>>;
export {};
//# sourceMappingURL=worldStore.d.ts.map