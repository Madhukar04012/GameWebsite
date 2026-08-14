/**
 * worldStore — environment state (day/night, weather) separate from game logic.
 *
 * Keeps rendering-parameter state out of the game state machine; consumed by
 * DayNightCycle, WeatherController, and Scene.tsx.
 */
import { create } from "zustand";
import { computeCelestialState } from "@legend/engine";
import { createWeatherState } from "@legend/engine";
export const useWorldStore = create((set, get) => ({
    timeOfDay: 8, // start at 8 AM (pleasant golden morning)
    celestial: computeCelestialState(8),
    weather: createWeatherState("clear"),
    timeScale: 60, // one real minute advances one in-game hour
    weatherTarget: null,
    windAmplitude: 0,
    advanceTime: (dt) => {
        const { timeOfDay, timeScale } = get();
        if (timeScale === 0)
            return; // time frozen
        const newTime = (timeOfDay + (dt * timeScale) / 3600) % 24;
        const celestial = computeCelestialState(newTime);
        set({ timeOfDay: newTime, celestial });
    },
    setWeather: (preset) => {
        const weather = createWeatherState(preset);
        set({ weather, weatherTarget: null });
    },
    setTimeScale: (scale) => set({ timeScale: scale }),
}));
//# sourceMappingURL=worldStore.js.map