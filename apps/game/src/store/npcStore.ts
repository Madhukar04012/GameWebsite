import { create } from "zustand";
import { NPCData } from "@legend/shared";

interface NPCStoreState {
  // A reactive list of all NPCs for React to mount/unmount components if needed,
  // though for high performance we might just use this for counting/UI.
  npcs: NPCData[];
  
  // Expose a mutable ref-like object for high frequency updates without triggering React renders.
  // The simulation loop mutates this directly. The renderer reads this directly.
  mutableNPCs: Map<string, NPCData>;

  addNPC: (npc: NPCData) => void;
  setNPCs: (npcs: NPCData[]) => void;
}

export const useNPCStore = create<NPCStoreState>((set) => ({
  npcs: [],
  mutableNPCs: new Map(),

  addNPC: (npc) => set((state) => {
    state.mutableNPCs.set(npc.id, npc);
    return { npcs: [...state.npcs, npc] };
  }),

  setNPCs: (npcs) => set((state) => {
    state.mutableNPCs.clear();
    npcs.forEach(n => state.mutableNPCs.set(n.id, n));
    return { npcs };
  }),
}));
