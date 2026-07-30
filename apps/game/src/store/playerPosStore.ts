/**
 * Lightweight player position store — lets monsters/systems read
 * player pos without coupling to R3F context or game store.
 */

export type Pos2D = { x: number; z: number };

let current: Pos2D = { x: 0, z: 3 };
const listeners = new Set<(pos: Pos2D) => void>();

export const playerPos = {
  get(): Pos2D { return current; },
  set(pos: Pos2D) {
    current = pos;
    listeners.forEach((fn) => fn(pos));
  },
  subscribe(fn: (pos: Pos2D) => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
