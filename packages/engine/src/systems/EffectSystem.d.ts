/**
 * EffectSystem — pure-logic particle effect definitions.
 *
 * Defines effect types, spawn patterns, and lifetime parameters.
 * No Three.js dependency — pure data for the R3F renderer.
 */
export type EffectKind = "spark" | "magicBurst" | "hitSpark" | "footstep" | "healGlow" | "deathPoof" | "torchEmber" | "weatherRain" | "weatherSnow" | "portalRift";
export interface ParticleSpawn {
    kind: EffectKind;
    /** World position. */
    x: number;
    y: number;
    z: number;
    /** Spawn time (game time in ms) for lifecycle. */
    spawnTime: number;
    /** Duration in ms (0 = infinite/ambient). */
    duration: number;
    /** Optional target position (for directional effects). */
    targetX?: number;
    targetY?: number;
    targetZ?: number;
    /** Intensity scale 0..1. */
    intensity: number;
    /** Unique id. */
    id: string;
}
export interface EffectConfig {
    /** Max concurrent particles per effect kind. */
    maxPerKind: number;
    /** Global intensity multiplier. */
    intensityScale: number;
}
export declare function createEffect(kind: EffectKind, x: number, y: number, z: number, duration?: number, intensity?: number): ParticleSpawn;
export declare function createHitSpark(x: number, y: number, z: number, targetX?: number, targetZ?: number): ParticleSpawn;
export declare function createMagicBurst(x: number, y: number, z: number): ParticleSpawn;
export declare function createFootstep(x: number, y: number, z: number): ParticleSpawn;
/** Remove expired effects. */
export declare function pruneEffects(effects: ParticleSpawn[], now: number): ParticleSpawn[];
//# sourceMappingURL=EffectSystem.d.ts.map