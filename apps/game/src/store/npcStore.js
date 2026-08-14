import { create } from "zustand";
export const useNPCStore = create((set, get) => ({
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
//# sourceMappingURL=npcStore.js.map