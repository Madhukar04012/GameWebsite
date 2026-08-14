import { create } from "zustand";
export const useDebugStore = create((set, get) => ({
    grid: import.meta.env.DEV ?? false,
    labels: false,
    spawnPoints: false,
    lighting: true,
    roads: true,
    physics: false,
    worldMap: false,
    set: (key, value) => set({ [key]: value }),
    toggle: (key) => set({ [key]: !get()[key] }),
}));
//# sourceMappingURL=debugStore.js.map