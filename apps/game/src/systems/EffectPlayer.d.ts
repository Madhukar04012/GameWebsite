/**
 * EffectPlayer — renders pooled particle effects (sparks, magic, hits, heals).
 *
 * Each effect kind shares a single Points mesh with instanced uniforms per
 * burst. Effects self-terminate after their duration. Designed to be driven by
 * the engine EffectSystem or called imperatively.
 *
 * Performance: one draw call per active effect kind. Bursts recycle into a
 * fixed pool (no allocations after warm-up).
 */
import type { EffectKind } from "@legend/engine";
import type { ParticleSpawn } from "@legend/engine";
export interface EffectHandle {
    spawn: (kind: EffectKind, x: number, y: number, z: number) => void;
}
/**
 * Hook to spawn effects imperatively (e.g., from combat or footstep callbacks).
 */
export declare function useEffects(): EffectHandle;
/**
 * EffectPlayer — renders all active particle effects.
 * Mount once in the scene. Consumes effects from a queue.
 */
export declare function EffectPlayer({ effectQueue }: {
    effectQueue?: {
        current: ParticleSpawn[];
    };
}): import("react").JSX.Element;
//# sourceMappingURL=EffectPlayer.d.ts.map