/**
 * EffectSystem — pure-logic particle effect definitions.
 *
 * Defines effect types, spawn patterns, and lifetime parameters.
 * No Three.js dependency — pure data for the R3F renderer.
 */

export type EffectKind =
  | "spark"
  | "magicBurst"
  | "hitSpark"
  | "footstep"
  | "healGlow"
  | "deathPoof"
  | "torchEmber"
  | "weatherRain"
  | "weatherSnow"
  | "portalRift";

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

/* ── Factory helpers ── */

let _nextId = 0;

export function createEffect(
  kind: EffectKind,
  x: number,
  y: number,
  z: number,
  duration: number = 1000,
  intensity: number = 1.0,
): ParticleSpawn {
  return {
    kind,
    x, y, z,
    spawnTime: performance.now(),
    duration,
    intensity,
    id: `fx-${kind}-${++_nextId}`,
  };
}

export function createHitSpark(
  x: number, y: number, z: number,
  targetX?: number, targetZ?: number,
): ParticleSpawn {
  return createEffect("hitSpark", x, y, z, 400, 1.0);
}

export function createMagicBurst(
  x: number, y: number, z: number,
): ParticleSpawn {
  return createEffect("magicBurst", x, y, z, 800, 1.2);
}

export function createFootstep(
  x: number, y: number, z: number,
): ParticleSpawn {
  return createEffect("footstep", x, y, z, 500, 1.0);
}

/** Remove expired effects. */
export function pruneEffects(
  effects: ParticleSpawn[],
  now: number,
): ParticleSpawn[] {
  return effects.filter((e) => e.duration === 0 || (now - e.spawnTime) < e.duration);
}
