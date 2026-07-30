/**
 * CombatController — pure combat math.
 *
 * Damage calculation, hit detection, level scaling.
 * No React/Three.js dependency.
 */

export interface WeaponStats {
  minDamage: number;
  maxDamage: number;
  range: number;
  attackSpeed: number; // seconds between attacks
}

export const DEFAULT_WEAPON: WeaponStats = {
  minDamage: 5,
  maxDamage: 12,
  range: 2.5,
  attackSpeed: 0.8,
};

export function rollDamage(weapon: WeaponStats): number {
  return Math.floor(
    weapon.minDamage + Math.random() * (weapon.maxDamage - weapon.minDamage),
  );
}

export function inRange(
  ax: number, az: number,
  bx: number, bz: number,
  range: number,
): boolean {
  const dx = bx - ax;
  const dz = bz - az;
  return dx * dx + dz * dz <= range * range;
}
