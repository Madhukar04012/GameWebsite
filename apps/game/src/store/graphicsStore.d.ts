/**
 * graphicsStore — quality tier auto-detect + graphics settings.
 *
 * Probes devicePixelRatio, hardwareConcurrency, and WebGL max texture size
 * (via temp canvas) at store creation. Exposes per-tier configs consumed by
 * GameCanvas (dpr, shadow map) and Scene (shadow resolution, postprocessing).
 */
export type QualityTier = "low" | "medium" | "high" | "ultra";
export interface GraphicsState {
    quality: QualityTier;
    dpr: [number, number];
    shadowMapSize: number;
    antialias: boolean;
    bloom: boolean;
    ssao: boolean;
    foliageDensity: number;
    drawDistance: number;
    setQuality: (tier: QualityTier) => void;
}
export declare const useGraphicsStore: import("zustand").UseBoundStore<import("zustand").StoreApi<GraphicsState>>;
//# sourceMappingURL=graphicsStore.d.ts.map