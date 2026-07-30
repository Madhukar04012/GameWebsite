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
  musicVolume: number;   // 0..1
  sfxVolume: number;     // 0..1
  mouseSensitivity: number;
  graphics: "low" | "medium" | "high";
}

export interface SaveData {
  schemaVersion: number;
  playerId: string | null;
  playerName: string;
  position: { x: number; y: number; z: number };
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
  lastSaved: number; // epoch ms
}

export const SAVE_KEY = "legend:save:v1";
export const SAVE_SCHEMA_VERSION = 1;

/**
 * Storage accessors are synthesized rather than referencing `localStorage`
 * directly so this module typechecks under a non-DOM library config. The real
 * implementation uses the global `localStorage` at runtime (guarded by typeof).
 */
interface WebStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

function storageGet(key: string): string | null {
  try {
    const g = globalThis as unknown as { localStorage?: WebStorage };
    return g.localStorage?.getItem(key) ?? null;
  } catch {
    return null;
  }
}
function storageSet(key: string, value: string): void {
  try {
    const g = globalThis as unknown as { localStorage?: WebStorage };
    g.localStorage?.setItem(key, value);
  } catch {
    /* ignore quota / privacy errors */
  }
}
function storageRemove(key: string): void {
  try {
    const g = globalThis as unknown as { localStorage?: WebStorage };
    g.localStorage?.removeItem(key);
  } catch {
    /* ignore */
  }
}

export function createDefaultSave(name = "Hero"): SaveData {
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
export function migrateSave(raw: unknown): SaveData {
  const base = createDefaultSave();
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<SaveData>;
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
export function loadSave(): SaveData {
  const raw = storageGet(SAVE_KEY);
  if (!raw) return createDefaultSave();
  try {
    return migrateSave(JSON.parse(raw));
  } catch {
    return createDefaultSave();
  }
}

/** Persist save to localStorage. */
export function writeSave(data: SaveData): void {
  storageSet(SAVE_KEY, JSON.stringify({
    ...data,
    lastSaved: Date.now(),
  }));
}

/** Clear the save. */
export function clearSave(): void {
  storageRemove(SAVE_KEY);
}
