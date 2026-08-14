import { NPCData } from "@legend/shared";
interface NPCStoreState {
    npcs: NPCData[];
    mutableNPCs: Map<string, NPCData>;
    addNPC: (npc: NPCData) => void;
    setNPCs: (npcs: NPCData[]) => void;
    getNPC: (id: string) => NPCData | undefined;
    getNPCsByProfession: (profession: string) => NPCData[];
    getNPCsByDistrict: (district: string) => NPCData[];
    getNPCsByWorkplace: (workplaceDistrict: string) => NPCData[];
}
export declare const useNPCStore: import("zustand").UseBoundStore<import("zustand").StoreApi<NPCStoreState>>;
export {};
//# sourceMappingURL=npcStore.d.ts.map