/**
 * SaveSystem — persistent player data schema + localStorage persistence.
 *
 * Phase 2 establishes the schema even where fields are placeholders.
 * All save logic is pure/serializable — no React or DOM coupling beyond
 * localStorage usage, which can be swapped for a remote save backend later.
 */
export interface InventoryItem {
    id: string;
    name: string;
    qty: number;
}
export interface EquipmentSlot {
    slot: "head" | "chest" | "legs" | "weapon" | "offhand";
    itemId: string | null;
}
export interface Settings {
    musicVolume: number;
    sfxVolume: number;
    mouseSensitivity: number;
    graphics: "low" | "medium" | "high";
}
export interface SaveData {
    schemaVersion: number;
    playerId: string | null;
    playerName: string;
    position: {
        x: number;
        y: number;
        z: number;
    };
    rotation: number;
    level: number;
    xp: number;
    gold: number;
    hp: number;
    maxHp: number;
    inventory: InventoryItem[];
    equipment: EquipmentSlot[];
    settings: Settings;
    achievements: string[];
    lastSaved: number;
}
export declare const SAVE_KEY = "legend:save:v1";
export declare const SAVE_SCHEMA_VERSION = 1;
export declare function createDefaultSave(name?: string): SaveData;
/** Migrate older saves forward to current schema. */
export declare function migrateSave(raw: unknown): SaveData;
/** Load from localStorage, migrating as needed. */
export declare function loadSave(): SaveData;
/** Persist save to localStorage. */
export declare function writeSave(data: SaveData): void;
/** Clear the save. */
export declare function clearSave(): void;
//# sourceMappingURL=SaveSystem.d.ts.map