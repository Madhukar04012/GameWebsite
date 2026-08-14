/**
 * graphicsStore — quality tier auto-detect + graphics settings.
 *
 * Probes devicePixelRatio, hardwareConcurrency, and WebGL max texture size
 * (via temp canvas) at store creation. Exposes per-tier configs consumed by
 * GameCanvas (dpr, shadow map) and Scene (shadow resolution, postprocessing).
 */
import { create } from "zustand";
/* ── Auto-detect ── */
function detectTier() {
    const dpr = globalThis.devicePixelRatio ?? 1;
    const cores = globalThis.navigator?.hardwareConcurrency ?? 2;
    let maxTexSize = 4096;
    try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl") ??
            canvas.getContext("webgl2");
        if (gl) {
            maxTexSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
            gl.getExtension("WEBGL_lose_context")
                ?.loseContext?.();
        }
    }
    catch {
        /* WebGL unavailable — keep fallback */
    }
    /* Score each tier — higher wins */
    let low = 0, medium = 0, high = 0, ultra = 0;
    /* devicePixelRatio */
    if (dpr >= 2) {
        ultra++;
        high++;
    }
    else if (dpr >= 1.5) {
        high++;
        medium++;
    }
    else if (dpr >= 1) {
        medium++;
    }
    else
        low++;
    /* hardwareConcurrency */
    if (cores >= 12) {
        ultra++;
        high++;
    }
    else if (cores >= 8) {
        high++;
        medium++;
    }
    else if (cores >= 4) {
        medium++;
        low++;
    }
    else
        low++;
    /* maxTextureSize */
    if (maxTexSize >= 16384) {
        ultra++;
        high++;
    }
    else if (maxTexSize >= 8192) {
        high++;
        medium++;
    }
    else if (maxTexSize >= 4096) {
        medium++;
    }
    else
        low++;
    const scores = [
        ["low", low],
        ["medium", medium],
        ["high", high],
        ["ultra", ultra],
    ];
    return scores.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
}
const TIER = {
    low: {
        dpr: [0.75, 1],
        shadowMapSize: 512,
        antialias: false,
        bloom: false,
        ssao: false,
        foliageDensity: 0.3,
        drawDistance: 50,
    },
    medium: {
        dpr: [1, 1.5],
        shadowMapSize: 1024,
        antialias: true,
        bloom: false,
        ssao: false,
        foliageDensity: 0.6,
        drawDistance: 100,
    },
    high: {
        dpr: [1, 2],
        shadowMapSize: 2048,
        antialias: true,
        bloom: true,
        ssao: false,
        foliageDensity: 0.8,
        drawDistance: 200,
    },
    ultra: {
        dpr: [1, 2],
        shadowMapSize: 4096,
        antialias: true,
        bloom: true,
        ssao: true,
        foliageDensity: 1.0,
        drawDistance: 300,
    },
};
function buildState(tier) {
    return { quality: tier, ...TIER[tier] };
}
/* ── Store ── */
export const useGraphicsStore = create((set) => ({
    ...buildState(detectTier()),
    setQuality: (tier) => set(buildState(tier)),
}));
//# sourceMappingURL=graphicsStore.js.map