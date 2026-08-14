/**
 * Graphics Scalability System — GPU-aware quality presets for LEGEND.
 *
 * Auto-detects hardware tier, provides reactive Zustand store, and exposes
 * selector hooks so components can adapt quality without prop-drilling.
 *
 * Tier detection uses WEBGL_debug_renderer_info (best-effort), falls back
 * on hardwareConcurrency + deviceMemory heuristics, then defaults to MEDIUM.
 *
 * Consumers:
 *   <Canvas>   → reads maxDpr / antialias / shadowMapType for gl props
 *   <Scene>    → feature-gates bloom, SSAO, vignette, fog, reflections
 *   <Terrain>  → segments prop adjusts geometry LOD
 *   <DustMotes> → particleScale controls count
 *   <FlowerFields> → maxMonsters caps spawns
 *   <Harbor>  → segments prop adjusts water subdivision
 */
import { create } from "zustand";
/* ─── Tiers ─────────────────────────────────────────────────────── */
export var GraphicsTier;
(function (GraphicsTier) {
    GraphicsTier[GraphicsTier["LOW"] = 0] = "LOW";
    GraphicsTier[GraphicsTier["MEDIUM"] = 1] = "MEDIUM";
    GraphicsTier[GraphicsTier["HIGH"] = 2] = "HIGH";
    GraphicsTier[GraphicsTier["ULTRA"] = 3] = "ULTRA";
})(GraphicsTier || (GraphicsTier = {}));
export const TIER_LABELS = {
    [GraphicsTier.LOW]: "Low",
    [GraphicsTier.MEDIUM]: "Medium",
    [GraphicsTier.HIGH]: "High",
    [GraphicsTier.ULTRA]: "Ultra",
};
/* ─── Presets ───────────────────────────────────────────────────── */
const TIER_SETTINGS = {
    [GraphicsTier.LOW]: {
        maxDpr: 1,
        shadowMapSize: 256,
        shadowMapType: "basic",
        postProcessing: false,
        ssao: false,
        bloom: false,
        vignette: false,
        multisampling: 0,
        particleScale: 0.25,
        geometrySegments: 8,
        maxMonsters: 2,
        fog: false,
        reflections: 0,
        emissiveGlow: false,
        dynamicShadows: false,
    },
    [GraphicsTier.MEDIUM]: {
        maxDpr: 1.5,
        shadowMapSize: 1024,
        shadowMapType: "pcfsoft",
        postProcessing: true,
        ssao: true,
        bloom: true,
        vignette: true,
        multisampling: 2,
        particleScale: 0.8,
        geometrySegments: 24,
        maxMonsters: 4,
        fog: true,
        reflections: 1,
        emissiveGlow: true,
        dynamicShadows: true,
    },
    [GraphicsTier.HIGH]: {
        maxDpr: 2,
        shadowMapSize: 1024,
        shadowMapType: "pcfsoft",
        postProcessing: true,
        ssao: true,
        bloom: true,
        vignette: true,
        multisampling: 4,
        particleScale: 1,
        geometrySegments: 32,
        maxMonsters: 6,
        fog: true,
        reflections: 2,
        emissiveGlow: true,
        dynamicShadows: true,
    },
    [GraphicsTier.ULTRA]: {
        maxDpr: 2,
        shadowMapSize: 2048,
        shadowMapType: "pcfsoft",
        postProcessing: true,
        ssao: true,
        bloom: true,
        vignette: true,
        multisampling: 4,
        particleScale: 1.5,
        geometrySegments: 48,
        maxMonsters: 10,
        fog: true,
        reflections: 2,
        emissiveGlow: true,
        dynamicShadows: true,
    },
};
function probeGPU() {
    try {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2");
        if (!gl)
            return null;
        const debugExt = gl.getExtension("WEBGL_debug_renderer_info");
        if (!debugExt)
            return null;
        return {
            vendor: gl.getParameter(debugExt.UNMASKED_VENDOR_WEBGL) || "",
            renderer: gl.getParameter(debugExt.UNMASKED_RENDERER_WEBGL) || "",
        };
    }
    catch {
        return null;
    }
}
function classifyTier(gpu) {
    if (!gpu)
        return GraphicsTier.MEDIUM;
    const r = gpu.renderer.toLowerCase();
    const v = gpu.vendor.toLowerCase();
    // Integrated Intel
    if (/intel|iris/.test(v) || /intel|iris/.test(r)) {
        if (/uhd\s*6[123]0/.test(r) || /hd\s*graphics/.test(r))
            return GraphicsTier.LOW;
        if (/iris\s*xe/.test(r) || /iris\s*plus/.test(r))
            return GraphicsTier.MEDIUM;
        return GraphicsTier.LOW;
    }
    // NVIDIA
    if (/nvidia/.test(v) || /nvidia/.test(r)) {
        if (/rtx/.test(r))
            return GraphicsTier.ULTRA;
        if (/gtx\s*1[06]|gtx\s*9|gtx\s*16/.test(r))
            return GraphicsTier.HIGH;
        if (/gtx/.test(r))
            return GraphicsTier.MEDIUM;
        return GraphicsTier.HIGH;
    }
    // AMD
    if (/amd|ati|radeon/.test(v) || /amd|ati|radeon/.test(r)) {
        if (/rx\s*[789]|rx\s*6[0-9]|rx\s*5[0-9]/.test(r))
            return GraphicsTier.ULTRA;
        return GraphicsTier.HIGH;
    }
    // Apple Silicon
    if (/apple/.test(v) || /apple\s*m[1-4]/.test(r))
        return GraphicsTier.HIGH;
    // Qualcomm / ARM
    if (/qualcomm|adreno/.test(v) || /adreno\s*[789]/.test(r))
        return GraphicsTier.MEDIUM;
    if (/arm|mali/.test(v) || /mali/.test(r))
        return GraphicsTier.LOW;
    return GraphicsTier.MEDIUM;
}
function refineTier(tier) {
    const cpus = navigator.hardwareConcurrency;
    const mem = navigator.deviceMemory;
    if (tier > GraphicsTier.MEDIUM && cpus <= 4)
        return GraphicsTier.MEDIUM;
    if (tier === GraphicsTier.ULTRA && mem !== undefined && mem < 6)
        return GraphicsTier.HIGH;
    if (tier === GraphicsTier.LOW && cpus >= 8 && (mem === undefined || mem >= 8))
        return GraphicsTier.MEDIUM;
    return tier;
}
function compute(tier) {
    return { activeTier: tier, settings: { ...TIER_SETTINGS[tier] } };
}
export const useGraphicsStore = create((set, get) => ({
    detectedTier: GraphicsTier.MEDIUM,
    overrideTier: null,
    activeTier: GraphicsTier.MEDIUM,
    settings: TIER_SETTINGS[GraphicsTier.MEDIUM],
    gpuInfo: null,
    initialized: false,
    setOverride: (tier) => {
        const effective = tier ?? get().detectedTier;
        set({ overrideTier: tier, ...compute(effective) });
    },
    increaseQuality: () => {
        const current = get().overrideTier ?? get().detectedTier;
        const next = Math.min(GraphicsTier.ULTRA, current + 1);
        get().setOverride(next);
    },
    decreaseQuality: () => {
        const current = get().overrideTier ?? get().detectedTier;
        const prev = Math.max(GraphicsTier.LOW, current - 1);
        get().setOverride(prev);
    },
    redetect: () => {
        const gpu = probeGPU();
        const tier = refineTier(classifyTier(gpu));
        const override = get().overrideTier;
        const effective = override ?? tier;
        set({
            gpuInfo: gpu,
            detectedTier: tier,
            activeTier: effective,
            settings: TIER_SETTINGS[effective],
            initialized: true,
        });
    },
    has: (feature) => {
        const s = get().settings;
        const val = s[feature];
        if (typeof val === "boolean")
            return val;
        if (typeof val === "number")
            return val > 0;
        return !!val;
    },
}));
/* ─── Boot ──────────────────────────────────────────────────────── */
let inited = false;
export function initGraphicsSystem() {
    if (inited)
        return;
    inited = true;
    useGraphicsStore.getState().redetect();
    const s = useGraphicsStore.getState();
    // log removed
}
/* ─── Non-React helpers (for init / setup code) ─────────────────── */
export function getCurrentSettings() {
    return useGraphicsStore.getState().settings;
}
export function getActiveTier() {
    return useGraphicsStore.getState().activeTier;
}
/* ─── React selector hooks ──────────────────────────────────────── */
export function useQualitySettings() {
    return useGraphicsStore((s) => s.settings);
}
export function useHasQualityFeature(feature) {
    return useGraphicsStore((s) => {
        const val = s.settings[feature];
        if (typeof val === "boolean")
            return val;
        if (typeof val === "number")
            return val > 0;
        return !!val;
    });
}
export function useTierLabel() {
    return useGraphicsStore((s) => TIER_LABELS[s.activeTier]);
}
/* ─── Shadow map type resolver ──────────────────────────────────── */
import { PCFSoftShadowMap, PCFShadowMap, BasicShadowMap } from "three";
const SHADOW_MAP_TYPES = {
    basic: BasicShadowMap,
    pcf: PCFShadowMap,
    pcfsoft: PCFSoftShadowMap,
};
export function resolveShadowMapType(name) {
    return SHADOW_MAP_TYPES[name] ?? PCFSoftShadowMap;
}
export { GraphicsTier as GraphicsTierEnum };
//# sourceMappingURL=GraphicsScalability.js.map