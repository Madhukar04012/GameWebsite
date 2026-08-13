import { create } from "zustand";
import { NPCData, Household } from "@legend/shared";

interface NPCStoreState {
  // A reactive list of all NPCs for React to mount/unmount components if needed,
  // though for high performance we might just use this for counting/UI.
  npcs: NPCData[];
  
  // Expose a mutable ref-like object for high frequency updates without triggering React renders.
  // The simulation loop mutates this directly. The renderer reads this directly.
  mutableNPCs: Map<string, NPCData>;

  addNPC: (npc: NPCData) => void;
  setNPCs: (npcs: NPCData[]) => void;

  // Registry APIs
  getNPC: (id: string) => NPCData | undefined;
  getNPCsByProfession: (profession: string) => NPCData[];
  getNPCsByDistrict: (district: string) => NPCData[];
  getNPCsByWorkplace: (workplaceDistrict: string) => NPCData[];
}

export const useNPCStore = create<NPCStoreState>((set, get) => ({
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

  getNPC: (id) => get().mutableNPCs.get(id),
  getNPCsByProfession: (profession) => get().npcs.filter(n => n.profession === profession),
  getNPCsByDistrict: (district) => get().npcs.filter(n => n.homeDistrict === district),
  getNPCsByWorkplace: (workplaceDistrict) => get().npcs.filter(n => n.workplaceDistrict === workplaceDistrict),
}));
