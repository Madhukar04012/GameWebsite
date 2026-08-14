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
    attackSpeed: number;
}
export declare const DEFAULT_WEAPON: WeaponStats;
export declare function rollDamage(weapon: WeaponStats): number;
export declare function inRange(ax: number, az: number, bx: number, bz: number, range: number): boolean;
//# sourceMappingURL=CombatController.d.ts.map