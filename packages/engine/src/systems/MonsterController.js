/**
 * MonsterController — pure-logic monster AI.
 *
 * States: IDLE → PATROL → CHASE → ATTACK → DEATH
 * No React/Three.js dependency.
 */
export function createSlime(id, x, z) {
    return {
        id,
        name: "Slime",
        kind: "slime",
        state: "idle",
        position: { x, y: 0, z },
        targetPos: { x, y: 0, z },
        hp: 20,
        maxHp: 20,
        speed: 2,
        damage: 5,
        attackRange: 1.5,
        aggroRange: 12,
        patrolCenter: { x, z },
        patrolRadius: 4,
    };
}
/** Riftborn wraith — fragile but fast, ethereal void creature. */
export function createWraith(id, x, z) {
    return {
        id,
        name: "Rift Wraith",
        kind: "wraith",
        state: "idle",
        position: { x, y: 0, z },
        targetPos: { x, y: 0, z },
        hp: 12,
        maxHp: 12,
        speed: 4.5,
        damage: 8,
        attackRange: 2,
        aggroRange: 16,
        patrolCenter: { x, z },
        patrolRadius: 6,
    };
}
/** Ancient stone rune-golem — slow tanky bruiser. */
export function createGolem(id, x, z) {
    return {
        id,
        name: "Rune Golem",
        kind: "golem",
        state: "idle",
        position: { x, y: 0, z },
        targetPos: { x, y: 0, z },
        hp: 60,
        maxHp: 60,
        speed: 1.2,
        damage: 14,
        attackRange: 2.2,
        aggroRange: 10,
        patrolCenter: { x, z },
        patrolRadius: 3,
    };
}
export function updateMonster(m, playerPos, dt) {
    const dx = playerPos.x - m.position.x;
    const dz = playerPos.z - m.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    // State transitions
    let state = m.state;
    if (state === "death")
        return m;
    if (dist < m.aggroRange && m.hp > 0) {
        state = dist < m.attackRange ? "attack" : "chase";
    }
    else if (state === "chase" && dist > m.aggroRange * 1.5) {
        state = "patrol";
    }
    else if (state === "patrol" && dist <= m.patrolRadius + 0.1) {
        state = "patrol";
    }
    else if (state === "attack") {
        state = "patrol";
    }
    // Movement
    let pos = { ...m.position };
    let targetPos = m.targetPos;
    let hp = m.hp;
    if (state === "chase") {
        const speed = m.speed * dt;
        const angle = Math.atan2(dz, dx);
        pos = {
            x: m.position.x + Math.cos(angle) * speed,
            y: 0,
            z: m.position.z + Math.sin(angle) * speed,
        };
    }
    else if (state === "patrol") {
        // Simple patrol: move toward target, pick new target when close
        const tdx = m.targetPos.x - m.position.x;
        const tdz = m.targetPos.z - m.position.z;
        const tdist = Math.sqrt(tdx * tdx + tdz * tdz);
        if (tdist < 0.5) {
            // Pick new random patrol point
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * m.patrolRadius;
            targetPos = {
                x: m.patrolCenter.x + Math.cos(angle) * radius,
                y: 0,
                z: m.patrolCenter.z + Math.sin(angle) * radius,
            };
        }
        else {
            const speed = m.speed * 0.4 * dt;
            const angle = Math.atan2(tdz, tdx);
            pos = {
                x: m.position.x + Math.cos(angle) * speed,
                y: 0,
                z: m.position.z + Math.sin(angle) * speed,
            };
        }
    }
    // Regen out of combat (idle/patrol regen)
    if (state === "idle" || state === "patrol") {
        hp = Math.min(m.maxHp, m.hp + 1 * dt);
    }
    return { ...m, state, position: pos, targetPos, hp };
}
//# sourceMappingURL=MonsterController.js.map