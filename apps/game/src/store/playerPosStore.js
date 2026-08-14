/**
 * Lightweight player position store — lets monsters/systems read
 * player pos without coupling to R3F context or game store.
 */
let current = { x: 0, z: 3 };
const listeners = new Set();
export const playerPos = {
    get() { return current; },
    set(pos) {
        current = pos;
        listeners.forEach((fn) => fn(pos));
    },
    subscribe(fn) {
        listeners.add(fn);
        return () => listeners.delete(fn);
    },
};
//# sourceMappingURL=playerPosStore.js.map