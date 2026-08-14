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
export declare enum GraphicsTier {
    LOW = 0,
    MEDIUM = 1,
    HIGH = 2,
    ULTRA = 3
}
export declare const TIER_LABELS: Record<GraphicsTier, string>;
export interface QualitySettings {
    maxDpr: number;
    shadowMapSize: number;
    shadowMapType: "basic" | "pcf" | "pcfsoft";
    postProcessing: boolean;
    ssao: boolean;
    bloom: boolean;
    vignette: boolean;
    multisampling: number;
    particleScale: number;
    geometrySegments: number;
    maxMonsters: number;
    fog: boolean;
    reflections: 0 | 1 | 2;
    emissiveGlow: boolean;
    dynamicShadows: boolean;
}
export type ShadowMapTypeName = QualitySettings["shadowMapType"];
interface GPUInfo {
    vendor: string;
    renderer: string;
}
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
export declare const useGraphicsStore: import("zustand").UseBoundStore<import("zustand").StoreApi<GraphicsStore>>;
export declare function initGraphicsSystem(): void;
export declare function getCurrentSettings(): QualitySettings;
export declare function getActiveTier(): GraphicsTier;
export declare function useQualitySettings(): QualitySettings;
export declare function useHasQualityFeature(feature: keyof QualitySettings): boolean;
export declare function useTierLabel(): string;
import { type ShadowMapType } from "three";
export declare function resolveShadowMapType(name: ShadowMapTypeName): ShadowMapType;
export { GraphicsTier as GraphicsTierEnum };
//# sourceMappingURL=GraphicsScalability.d.ts.map