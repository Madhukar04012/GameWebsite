/**
 * SaveSystem — persistent player data schema + localStorage persistence.
 *
 * Phase 2 establishes the schema even where fields are placeholders.
 * All save logic is pure/serializable — no React or DOM coupling beyond
 * localStorage usage, which can be swapped for a remote save backend later.
 */
export const SAVE_KEY = "legend:save:v1";
export const SAVE_SCHEMA_VERSION = 1;
function storageGet(key) {
    try {
        const g = globalThis;
        return g.localStorage?.getItem(key) ?? null;
    }
    catch {
        return null;
    }
}
function storageSet(key, value) {
    try {
        const g = globalThis;
        g.localStorage?.setItem(key, value);
    }
    catch {
        /* ignore quota / privacy errors */
    }
}
function storageRemove(key) {
    try {
        const g = globalThis;
        g.localStorage?.removeItem(key);
    }
    catch {
        /* ignore */
    }
}
export function createDefaultSave(name = "Hero") {
    return {
        schemaVersion: SAVE_SCHEMA_VERSION,
        playerId: null,
        playerName: name,
        position: { x: 0, y: 0, z: 3 },
        rotation: 0,
        level: 1,
        xp: 0,
        gold: 0,
        hp: 100,
        maxHp: 100,
        inventory: [],
        equipment: [
            { slot: "head", itemId: null },
            { slot: "chest", itemId: null },
            { slot: "legs", itemId: null },
            { slot: "weapon", itemId: null },
            { slot: "offhand", itemId: null },
        ],
        settings: {
            musicVolume: 0.6,
            sfxVolume: 0.8,
            mouseSensitivity: 0.003,
            graphics: "high",
        },
        achievements: [],
        lastSaved: 0,
    };
}
/** Migrate older saves forward to current schema. */
export function migrateSave(raw) {
    const base = createDefaultSave();
    if (!raw || typeof raw !== "object")
        return base;
    const r = raw;
    // Anything missing picks the default; invalid fields discarded.
    return {
        ...base,
        ...r,
        position: { ...base.position, ...(r.position ?? {}) },
        settings: { ...base.settings, ...(r.settings ?? {}) },
        inventory: Array.isArray(r.inventory) ? r.inventory : [],
        equipment: Array.isArray(r.equipment) && r.equipment.length === 5
            ? r.equipment
            : base.equipment,
        achievements: Array.isArray(r.achievements) ? r.achievements : [],
        schemaVersion: SAVE_SCHEMA_VERSION,
    };
}
/** Load from localStorage, migrating as needed. */
export function loadSave() {
    const raw = storageGet(SAVE_KEY);
    if (!raw)
        return createDefaultSave();
    try {
        return migrateSave(JSON.parse(raw));
    }
    catch {
        return createDefaultSave();
    }
}
/** Persist save to localStorage. */
export function writeSave(data) {
    storageSet(SAVE_KEY, JSON.stringify({
        ...data,
        lastSaved: Date.now(),
    }));
}
/** Clear the save. */
export function clearSave() {
    storageRemove(SAVE_KEY);
}
//# sourceMappingURL=SaveSystem.js.map