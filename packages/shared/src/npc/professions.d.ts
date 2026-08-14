import { NPCProfession, NPCSocialClass } from "../types/npc";
export interface ProfessionDef {
    id: NPCProfession;
    name: string;
    socialClass: NPCSocialClass;
    compatibleHomeDistricts: string[];
    compatibleWorkDistricts: string[];
    scheduleType: "DAY_WORKER" | "NIGHT_WORKER" | "GUARD" | "NOBLE" | "TRAVELER";
}
export declare const PROFESSION_REGISTRY: Record<NPCProfession, ProfessionDef>;
//# sourceMappingURL=professions.d.ts.map