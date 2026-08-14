/**
 * EffectSystem — pure-logic particle effect definitions.
 *
 * Defines effect types, spawn patterns, and lifetime parameters.
 * No Three.js dependency — pure data for the R3F renderer.
 */
/* ── Factory helpers ── */
let _nextId = 0;
export function createEffect(kind, x, y, z, duration = 1000, intensity = 1.0) {
    return {
        kind,
        x, y, z,
        spawnTime: performance.now(),
        duration,
        intensity,
        id: `fx-${kind}-${++_nextId}`,
    };
}
export function createHitSpark(x, y, z, targetX, targetZ) {
    return createEffect("hitSpark", x, y, z, 400, 1.0);
}
export function createMagicBurst(x, y, z) {
    return createEffect("magicBurst", x, y, z, 800, 1.2);
}
export function createFootstep(x, y, z) {
    return createEffect("footstep", x, y, z, 500, 1.0);
}
/** Remove expired effects. */
export function pruneEffects(effects, now) {
    return effects.filter((e) => e.duration === 0 || (now - e.spawnTime) < e.duration);
}
//# sourceMappingURL=EffectSystem.js.map