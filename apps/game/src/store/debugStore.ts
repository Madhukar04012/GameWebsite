import { create } from "zustand";

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
  physics: boolean; // placeholder hook; no physics system yet
  set: (key: keyof DebugState, value: boolean) => void;
  toggle: (key: keyof DebugState) => void;
}

export const useDebugStore = create<DebugState>((set, get) => ({
  grid: import.meta.env.DEV ?? false,
  labels: false,
  spawnPoints: false,
  lighting: true,
  roads: true,
  physics: false,
  set: (key, value) => set({ [key]: value } as Partial<DebugState>),
  toggle: (key) => set({ [key]: !get()[key] } as Partial<DebugState>),
}));
