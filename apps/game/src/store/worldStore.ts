/**
 * worldStore — environment state (day/night, weather) separate from game logic.
 *
 * Keeps rendering-parameter state out of the game state machine; consumed by
 * DayNightCycle, WeatherController, and Scene.tsx.
 */

import { create } from "zustand";
import type { CelestialState } from "@legend/engine";
import { computeCelestialState } from "@legend/engine";
import type { WeatherState } from "@legend/engine";
import { createWeatherState } from "@legend/engine";

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

  /* ── Actions ── */
  advanceTime: (dt: number) => void;
  setWeather: (preset: WeatherState["preset"]) => void;
  setTimeScale: (scale: number) => void;
}

export const useWorldStore = create<WorldState>((set, get) => ({
  timeOfDay: 8, // start at 8 AM (pleasant golden morning)
  celestial: computeCelestialState(8),
  weather: createWeatherState("clear"),
  timeScale: 60, // one real minute advances one in-game hour
  weatherTarget: null,
  windAmplitude: 0,

  advanceTime: (dt: number) => {
    const { timeOfDay, timeScale } = get();
    if (timeScale === 0) return; // time frozen
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
