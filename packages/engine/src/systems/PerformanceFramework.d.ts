/**
 * PerformanceFramework -- quality-level scaling and budget tracking.
 *
 * Defines quality tiers, per-tier budgets, and a running performance
 * snapshot for the rendering pipeline to adapt render distance,
 * shadow resolution, particle counts, and other GPU/CPU knobs.
 * No React/Three.js dependency -- consumed by the R3F store.
 */
export type QualityLevel = "low" | "medium" | "high" | "ultra";
export interface PerformanceMetrics {
    /** Rolling average FPS over the last N frames. */
    fps: number;
    /** Frame time in ms (average). */
    frameTime: number;
    /** Estimated draw-call count. */
    drawCalls: number;
    /** Triangle count (thousands). */
    triCountK: number;
    /** GPU memory estimate in MB. */
    gpuMemMB: number;
}
export interface PerformanceBudget {
    /** Target FPS floor. */
    targetFps: number;
    /** Max frame time in ms. */
    maxFrameTime: number;
    /** Max draw calls. */
    maxDrawCalls: number;
    /** Max triangles (thousands). */
    maxTriCountK: number;
    /** Max GPU memory in MB. */
    maxGpuMemMB: number;
    /** Shadow map resolution (pixels per side). */
    shadowRes: number;
    /** View distance in world units. */
    viewDistance: number;
    /** LOD bias (negative = sharper, positive = more aggressive). */
    lodBias: number;
}
/** Ordered index of a quality level (0 = low). */
export declare function qualityIndex(level: QualityLevel): number;
/** Clamp a quality level to a maximum cap (for device capability). */
export declare function clampQuality(requested: QualityLevel, max: QualityLevel): QualityLevel;
/** Suggest a quality level from measured FPS vs target budgets. */
export declare function suggestQuality(metrics: PerformanceMetrics, current: QualityLevel): QualityLevel;
/** Get budget for a quality level. */
export declare function budgetFor(level: QualityLevel): PerformanceBudget;
export interface FrameSample {
    frameTime: number;
    drawCalls: number;
    triCountK: number;
}
/**
 * Accumulate frame samples and produce a rolling-average snapshot.
 * Call once per frame.
 */
export declare function accumulateFrame(samples: FrameSample[], sample: FrameSample): {
    samples: FrameSample[];
    metrics: PerformanceMetrics;
};
export declare const QUALITY_LABELS: Record<QualityLevel, string>;
//# sourceMappingURL=PerformanceFramework.d.ts.map