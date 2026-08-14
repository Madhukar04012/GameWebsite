/**
 * CombatController — pure combat math.
 *
 * Damage calculation, hit detection, level scaling.
 * No React/Three.js dependency.
 */
export const DEFAULT_WEAPON = {
    minDamage: 5,
    maxDamage: 12,
    range: 2.5,
    attackSpeed: 0.8,
};
export function rollDamage(weapon) {
    return Math.floor(weapon.minDamage + Math.random() * (weapon.maxDamage - weapon.minDamage));
}
export function inRange(ax, az, bx, bz, range) {
    const dx = bx - ax;
    const dz = bz - az;
    return dx * dx + dz * dz <= range * range;
}
//# sourceMappingURL=CombatController.js.map