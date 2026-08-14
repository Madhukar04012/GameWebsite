/**
 * WeatherController — animated weather effects: rain, fog, lightning, wind.
 *
 * Consumes worldStore.weather each frame and renders visual effects:
 *   - Rain particle system (GPU particles, no per-frame CPU update)
 *   - Lightning flashes (brief emissive burst)
 *   - Fog density driven by weather state
 *   - Wind affects foliage materials via shared uniform
 *
 * Performance: rain uses a single Points mesh with pre-baked positions in a
 * large volume, recycled each frame via shader offset (no geometry mutation).
 */
interface WeatherControllerProps {
    /** Optional: seed for deterministic rain layout. */
    seed?: number;
}
export declare function WeatherController({ seed }: WeatherControllerProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=WeatherController.d.ts.map