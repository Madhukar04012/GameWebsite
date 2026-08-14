/**
 * MonsterController — pure-logic monster AI.
 *
 * States: IDLE → PATROL → CHASE → ATTACK → DEATH
 * No React/Three.js dependency.
 */
export type MonsterState = "idle" | "patrol" | "chase" | "attack" | "hurt" | "death";
/** Art-bible monster archetypes — each with distinct visual + combat profile. */
export type MonsterKind = "slime" | "wraith" | "golem";
export interface MonsterData {
    id: string;
    name: string;
    kind: MonsterKind;
    state: MonsterState;
    position: {
        x: number;
        y: number;
        z: number;
    };
    targetPos: {
        x: number;
        y: number;
        z: number;
    };
    hp: number;
    maxHp: number;
    speed: number;
    damage: number;
    attackRange: number;
    aggroRange: number;
    patrolCenter: {
        x: number;
        z: number;
    };
    patrolRadius: number;
}
export declare function createSlime(id: string, x: number, z: number): MonsterData;
/** Riftborn wraith — fragile but fast, ethereal void creature. */
export declare function createWraith(id: string, x: number, z: number): MonsterData;
/** Ancient stone rune-golem — slow tanky bruiser. */
export declare function createGolem(id: string, x: number, z: number): MonsterData;
export declare function updateMonster(m: MonsterData, playerPos: {
    x: number;
    z: number;
}, dt: number): MonsterData;
//# sourceMappingURL=MonsterController.d.ts.map