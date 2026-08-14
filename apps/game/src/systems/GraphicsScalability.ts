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

export enum GraphicsTier {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
  ULTRA = 3,
}

export const TIER_LABELS: Record<GraphicsTier, string> = {
  [GraphicsTier.LOW]: "Low",
  [GraphicsTier.MEDIUM]: "Medium",
  [GraphicsTier.HIGH]: "High",
  [GraphicsTier.ULTRA]: "Ultra",
};

/* ─── Settings shape ────────────────────────────────────────────── */

export interface QualitySettings {
  maxDpr: number;
  shadowMapSize: number;
  shadowMapType: "basic" | "pcf" | "pcfsoft";
  postProcessing: boolean;
  ssao: boolean;
  bloom: boolean;
  vignette: boolean;
  multisampling: number;
  particleScale: number;      // 0-1 multiplier on particle counts
  geometrySegments: number;   // terrain / water subdivision
  maxMonsters: number;        // cap on monster spawn instances
  fog: boolean;
  reflections: 0 | 1 | 2;    // 0=off, 1=cheap, 2=full PMREM
  emissiveGlow: boolean;
  dynamicShadows: boolean;
}

export type ShadowMapTypeName = QualitySettings["shadowMapType"];

/* ─── Presets ───────────────────────────────────────────────────── */

const TIER_SETTINGS: Record<GraphicsTier, QualitySettings> = {
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
    maxDpr: 1,
    shadowMapSize: 1024,
    shadowMapType: "pcfsoft",
    postProcessing: true,
    ssao: true,
    bloom: true,
    vignette: true,
    multisampling: 0,
    particleScale: 0.8,
    geometrySegments: 24,
    maxMonsters: 4,
    fog: true,
    reflections: 1,
    emissiveGlow: true,
    dynamicShadows: true,
  },
  [GraphicsTier.HIGH]: {
    maxDpr: 1,
    shadowMapSize: 1024,
    shadowMapType: "pcfsoft",
    postProcessing: true,
    ssao: true,
    bloom: true,
    vignette: true,
    multisampling: 0,
    particleScale: 1,
    geometrySegments: 32,
    maxMonsters: 6,
    fog: true,
    reflections: 2,
    emissiveGlow: true,
    dynamicShadows: true,
  },
  [GraphicsTier.ULTRA]: {
    maxDpr: 1.5,
    shadowMapSize: 2048,
    shadowMapType: "pcfsoft",
    postProcessing: true,
    ssao: true,
    bloom: true,
    vignette: true,
    multisampling: 0,
    particleScale: 1.5,
    geometrySegments: 48,
    maxMonsters: 10,
    fog: true,
    reflections: 2,
    emissiveGlow: true,
    dynamicShadows: true,
  },
};

/* ─── GPU probe ─────────────────────────────────────────────────── */

interface GPUInfo {
  vendor: string;
  renderer: string;
}

function probeGPU(): GPUInfo | null {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") as WebGLRenderingContext | null;
    if (!gl) return null;
    const debugExt = gl.getExtension("WEBGL_debug_renderer_info");
    if (!debugExt) return null;
    return {
      vendor: gl.getParameter(debugExt.UNMASKED_VENDOR_WEBGL) || "",
      renderer: gl.getParameter(debugExt.UNMASKED_RENDERER_WEBGL) || "",
    };
  } catch {
    return null;
  }
}

function classifyTier(gpu: GPUInfo | null): GraphicsTier {
  if (!gpu) return GraphicsTier.MEDIUM;
  const r = gpu.renderer.toLowerCase();
  const v = gpu.vendor.toLowerCase();

  // Integrated Intel
  if (/intel|iris/.test(v) || /intel|iris/.test(r)) {
    if (/uhd\s*6[123]0/.test(r) || /hd\s*graphics/.test(r)) return GraphicsTier.LOW;
    if (/iris\s*xe/.test(r) || /iris\s*plus/.test(r)) return GraphicsTier.MEDIUM;
    return GraphicsTier.LOW;
  }

  // NVIDIA
  if (/nvidia/.test(v) || /nvidia/.test(r)) {
    if (/rtx\s*4090|rtx\s*4080|rtx\s*3090/.test(r)) return GraphicsTier.ULTRA;
    if (/rtx/.test(r)) return GraphicsTier.HIGH;
    if (/gtx\s*1[06]|gtx\s*9|gtx\s*16/.test(r)) return GraphicsTier.HIGH;
    if (/gtx/.test(r)) return GraphicsTier.MEDIUM;
    return GraphicsTier.HIGH;
  }

  // AMD
  if (/amd|ati|radeon/.test(v) || /amd|ati|radeon/.test(r)) {
    if (/rx\s*[789]|rx\s*6[0-9]|rx\s*5[0-9]/.test(r)) return GraphicsTier.ULTRA;
    return GraphicsTier.HIGH;
  }

  // Apple Silicon
  if (/apple/.test(v) || /apple\s*m[1-4]/.test(r)) return GraphicsTier.HIGH;

  // Qualcomm / ARM
  if (/qualcomm|adreno/.test(v) || /adreno\s*[789]/.test(r)) return GraphicsTier.MEDIUM;
  if (/arm|mali/.test(v) || /mali/.test(r)) return GraphicsTier.LOW;

  return GraphicsTier.MEDIUM;
}

function refineTier(tier: GraphicsTier): GraphicsTier {
  const cpus = navigator.hardwareConcurrency;
  const mem = (navigator as any).deviceMemory as number | undefined;
  if (tier > GraphicsTier.MEDIUM && cpus <= 4) return GraphicsTier.MEDIUM;
  if (tier === GraphicsTier.ULTRA && mem !== undefined && mem < 6) return GraphicsTier.HIGH;
  if (tier === GraphicsTier.LOW && cpus >= 8 && (mem === undefined || mem >= 8)) return GraphicsTier.MEDIUM;
  return tier;
}

/* ─── Store ─────────────────────────────────────────────────────── */

interface GraphicsStore {
  detectedTier: GraphicsTier;
  overrideTier: GraphicsTier | null;
  activeTier: GraphicsTier;
  settings: QualitySettings;
  gpuInfo: GPUInfo | null;
  initialized: boolean;

  setOverride: (tier: GraphicsTier | null) => void;
  increaseQuality: () => void;
  decreaseQuality: () => void;
  redetect: () => void;
  has: (feature: keyof QualitySettings & string) => boolean;
}

function compute(tier: GraphicsTier) {
  return { activeTier: tier, settings: { ...TIER_SETTINGS[tier] } };
}

export const useGraphicsStore = create<GraphicsStore>((set, get) => ({
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
    const next = Math.min(GraphicsTier.ULTRA, current + 1) as GraphicsTier;
    get().setOverride(next);
  },

  decreaseQuality: () => {
    const current = get().overrideTier ?? get().detectedTier;
    const prev = Math.max(GraphicsTier.LOW, current - 1) as GraphicsTier;
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
    const val = s[feature as keyof QualitySettings];
    if (typeof val === "boolean") return val;
    if (typeof val === "number") return val > 0;
    return !!val;
  },
}));

/* ─── Boot ──────────────────────────────────────────────────────── */

let inited = false;

export function initGraphicsSystem(): void {
  if (inited) return;
  inited = true;
  useGraphicsStore.getState().redetect();
  const s = useGraphicsStore.getState();
  // log removed
}

/* ─── Non-React helpers (for init / setup code) ─────────────────── */

export function getCurrentSettings(): QualitySettings {
  return useGraphicsStore.getState().settings;
}

export function getActiveTier(): GraphicsTier {
  return useGraphicsStore.getState().activeTier;
}

/* ─── React selector hooks ──────────────────────────────────────── */

export function useQualitySettings(): QualitySettings {
  return useGraphicsStore((s) => s.settings);
}

export function useHasQualityFeature(feature: keyof QualitySettings): boolean {
  return useGraphicsStore((s) => {
    const val = s.settings[feature];
    if (typeof val === "boolean") return val;
    if (typeof val === "number") return val > 0;
    return !!val;
  });
}

export function useTierLabel(): string {
  return useGraphicsStore((s) => TIER_LABELS[s.activeTier]);
}

/* ─── Shadow map type resolver ──────────────────────────────────── */

import { PCFSoftShadowMap, PCFShadowMap, BasicShadowMap, type ShadowMapType } from "three";

const SHADOW_MAP_TYPES: Record<ShadowMapTypeName, ShadowMapType> = {
  basic: BasicShadowMap,
  pcf: PCFShadowMap,
  pcfsoft: PCFSoftShadowMap,
};

export function resolveShadowMapType(name: ShadowMapTypeName): ShadowMapType {
  return SHADOW_MAP_TYPES[name] ?? PCFSoftShadowMap;
}

export { GraphicsTier as GraphicsTierEnum };
