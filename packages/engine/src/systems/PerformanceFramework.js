/**
 * PerformanceFramework -- quality-level scaling and budget tracking.
 *
 * Defines quality tiers, per-tier budgets, and a running performance
 * snapshot for the rendering pipeline to adapt render distance,
 * shadow resolution, particle counts, and other GPU/CPU knobs.
 * No React/Three.js dependency -- consumed by the R3F store.
 */
/* ── Per-quality budgets ── */
const BUDGETS = {
    low: {
        targetFps: 30,
        maxFrameTime: 33,
        maxDrawCalls: 500,
        maxTriCountK: 200,
        maxGpuMemMB: 512,
        shadowRes: 512,
        viewDistance: 80,
        lodBias: 2,
    },
    medium: {
        targetFps: 60,
        maxFrameTime: 16,
        maxDrawCalls: 1500,
        maxTriCountK: 500,
        maxGpuMemMB: 1024,
        shadowRes: 1024,
        viewDistance: 150,
        lodBias: 1,
    },
    high: {
        targetFps: 60,
        maxFrameTime: 16,
        maxDrawCalls: 3000,
        maxTriCountK: 1000,
        maxGpuMemMB: 2048,
        shadowRes: 2048,
        viewDistance: 250,
        lodBias: 0,
    },
    ultra: {
        targetFps: 120,
        maxFrameTime: 8,
        maxDrawCalls: 5000,
        maxTriCountK: 2000,
        maxGpuMemMB: 4096,
        shadowRes: 4096,
        viewDistance: 400,
        lodBias: -1,
    },
};
/* ── Quality-level helpers ── */
const ORDER = ["low", "medium", "high", "ultra"];
/** Ordered index of a quality level (0 = low). */
export function qualityIndex(level) {
    return ORDER.indexOf(level);
}
/** Clamp a quality level to a maximum cap (for device capability). */
export function clampQuality(requested, max) {
    const ri = qualityIndex(requested);
    const mi = qualityIndex(max);
    return ri <= mi ? requested : max;
}
/** Suggest a quality level from measured FPS vs target budgets. */
export function suggestQuality(metrics, current) {
    const idx = qualityIndex(current);
    const margin = 0.85; // 15% headroom
    // Too slow -- drop a tier
    if (metrics.frameTime > BUDGETS[current].maxFrameTime * (1 / margin)) {
        const next = Math.max(0, idx - 1);
        return ORDER[next];
    }
    // Lots of headroom -- try a tier up
    if (metrics.frameTime < BUDGETS[current].maxFrameTime * margin &&
        metrics.fps > BUDGETS[current].targetFps * (1 + margin)) {
        const next = Math.min(ORDER.length - 1, idx + 1);
        return ORDER[next];
    }
    return current;
}
/** Get budget for a quality level. */
export function budgetFor(level) {
    return BUDGETS[level];
}
const SAMPLE_WINDOW = 60;
/**
 * Accumulate frame samples and produce a rolling-average snapshot.
 * Call once per frame.
 */
export function accumulateFrame(samples, sample) {
    const next = [...samples, sample].slice(-SAMPLE_WINDOW);
    const len = next.length;
    const avg = (field) => next.reduce((s, f) => s + f[field], 0) / len;
    const frameTime = avg("frameTime");
    const fps = frameTime > 0 ? 1000 / frameTime : 0;
    const drawCalls = Math.round(avg("drawCalls"));
    const triCountK = Math.round(avg("triCountK"));
    return {
        samples: next,
        metrics: { fps, frameTime, drawCalls, triCountK, gpuMemMB: 0 },
    };
}
/* ── Human-readable labels ── */
export const QUALITY_LABELS = {
    low: "Low",
    medium: "Medium",
    high: "High",
    ultra: "Ultra",
};
//# sourceMappingURL=PerformanceFramework.js.map