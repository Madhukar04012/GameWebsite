/**
 * Debug visibility toggles. Only the DebugTools panel writes these; world
 * components read them. Kept separate from gameStore so gameplay state stays
 * clean.
 */
declare global {
    interface ImportMetaEnv {
        DEV?: boolean;
    }
    interface ImportMeta {
        env: ImportMetaEnv;
    }
}
export interface DebugState {
    grid: boolean;
    labels: boolean;
    spawnPoints: boolean;
    lighting: boolean;
    roads: boolean;
    physics: boolean;
    worldMap: boolean;
    set: (key: keyof DebugState, value: boolean) => void;
    toggle: (key: keyof DebugState) => void;
}
export declare const useDebugStore: import("zustand").UseBoundStore<import("zustand").StoreApi<DebugState>>;
//# sourceMappingURL=debugStore.d.ts.map