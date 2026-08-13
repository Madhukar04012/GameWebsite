import { NPCProfession, NPCSocialClass } from "../types/npc";

export interface ProfessionDef {
  id: NPCProfession;
  name: string;
  socialClass: NPCSocialClass;
  compatibleHomeDistricts: string[];
  compatibleWorkDistricts: string[];
  scheduleType: "DAY_WORKER" | "NIGHT_WORKER" | "GUARD" | "NOBLE" | "TRAVELER";
}

// Map profession IDs to their definitions
export const PROFESSION_REGISTRY: Record<NPCProfession, ProfessionDef> = {
  Citizen: {
    id: "Citizen",
    name: "Citizen",
    socialClass: "COMMON",
    compatibleHomeDistricts: ["residential", "harbor", "market"],
    compatibleWorkDistricts: ["residential", "market", "harbor"],
    scheduleType: "DAY_WORKER",
  },
  Merchant: {
    id: "Merchant",
    name: "Merchant",
    socialClass: "MERCHANT",
    compatibleHomeDistricts: ["residential", "market"],
    compatibleWorkDistricts: ["market"],
    scheduleType: "DAY_WORKER",
  },
  Shopkeeper: {
    id: "Shopkeeper",
    name: "Shopkeeper",
    socialClass: "MERCHANT",
    compatibleHomeDistricts: ["market", "residential"],
    compatibleWorkDistricts: ["market"],
    scheduleType: "DAY_WORKER",
  },
  Blacksmith: {
    id: "Blacksmith",
    name: "Blacksmith",
    socialClass: "ARTISAN",
    compatibleHomeDistricts: ["blacksmith", "residential"],
    compatibleWorkDistricts: ["blacksmith"],
    scheduleType: "DAY_WORKER",
  },
  Carpenter: {
    id: "Carpenter",
    name: "Carpenter",
    socialClass: "ARTISAN",
    compatibleHomeDistricts: ["residential"],
    compatibleWorkDistricts: ["market", "harbor"],
    scheduleType: "DAY_WORKER",
  },
  Leatherworker: {
    id: "Leatherworker",
    name: "Leatherworker",
    socialClass: "ARTISAN",
    compatibleHomeDistricts: ["residential"],
    compatibleWorkDistricts: ["market"],
    scheduleType: "DAY_WORKER",
  },
  Alchemist: {
    id: "Alchemist",
    name: "Alchemist",
    socialClass: "ARTISAN",
    compatibleHomeDistricts: ["market", "guild_hall"],
    compatibleWorkDistricts: ["market", "guild_hall"],
    scheduleType: "DAY_WORKER",
  },
  Baker: {
    id: "Baker",
    name: "Baker",
    socialClass: "ARTISAN",
    compatibleHomeDistricts: ["residential", "market"],
    compatibleWorkDistricts: ["market"],
    scheduleType: "DAY_WORKER",
  },
  Farmer: {
    id: "Farmer",
    name: "Farmer",
    socialClass: "COMMON",
    compatibleHomeDistricts: ["residential"],
    compatibleWorkDistricts: ["market"], // Brings food to market
    scheduleType: "DAY_WORKER",
  },
  Guard: {
    id: "Guard",
    name: "Guard",
    socialClass: "MILITARY",
    compatibleHomeDistricts: ["training", "residential"],
    compatibleWorkDistricts: ["training", "castle", "central_plaza"],
    scheduleType: "GUARD",
  },
  Soldier: {
    id: "Soldier",
    name: "Soldier",
    socialClass: "MILITARY",
    compatibleHomeDistricts: ["training"],
    compatibleWorkDistricts: ["training", "castle"],
    scheduleType: "GUARD",
  },
  Officer: {
    id: "Officer",
    name: "Officer",
    socialClass: "MILITARY",
    compatibleHomeDistricts: ["training", "noble"],
    compatibleWorkDistricts: ["training", "castle"],
    scheduleType: "GUARD",
  },
  Noble: {
    id: "Noble",
    name: "Noble",
    socialClass: "NOBLE",
    compatibleHomeDistricts: ["noble", "castle"],
    compatibleWorkDistricts: ["noble", "castle", "central_plaza"],
    scheduleType: "NOBLE",
  },
  Servant: {
    id: "Servant",
    name: "Servant",
    socialClass: "COMMON",
    compatibleHomeDistricts: ["noble", "castle", "inn"],
    compatibleWorkDistricts: ["noble", "castle", "inn"],
    scheduleType: "DAY_WORKER",
  },
  Scholar: {
    id: "Scholar",
    name: "Scholar",
    socialClass: "NOBLE",
    compatibleHomeDistricts: ["guild_hall", "noble"],
    compatibleWorkDistricts: ["guild_hall", "castle"],
    scheduleType: "DAY_WORKER",
  },
  Priest: {
    id: "Priest",
    name: "Priest",
    socialClass: "CLERGY",
    compatibleHomeDistricts: ["castle", "noble"], // Ideally a temple district, but castle for now
    compatibleWorkDistricts: ["castle"],
    scheduleType: "DAY_WORKER",
  },
  Acolyte: {
    id: "Acolyte",
    name: "Acolyte",
    socialClass: "CLERGY",
    compatibleHomeDistricts: ["castle"],
    compatibleWorkDistricts: ["castle"],
    scheduleType: "DAY_WORKER",
  },
  Innkeeper: {
    id: "Innkeeper",
    name: "Innkeeper",
    socialClass: "MERCHANT",
    compatibleHomeDistricts: ["inn"],
    compatibleWorkDistricts: ["inn"],
    scheduleType: "DAY_WORKER",
  },
  DockWorker: {
    id: "DockWorker",
    name: "DockWorker",
    socialClass: "COMMON",
    compatibleHomeDistricts: ["harbor", "residential"],
    compatibleWorkDistricts: ["harbor"],
    scheduleType: "DAY_WORKER",
  },
  Fisherman: {
    id: "Fisherman",
    name: "Fisherman",
    socialClass: "COMMON",
    compatibleHomeDistricts: ["harbor", "residential"],
    compatibleWorkDistricts: ["harbor"],
    scheduleType: "DAY_WORKER",
  },
  Sailor: {
    id: "Sailor",
    name: "Sailor",
    socialClass: "COMMON",
    compatibleHomeDistricts: ["harbor", "inn"],
    compatibleWorkDistricts: ["harbor"],
    scheduleType: "TRAVELER",
  },
  Artisan: {
    id: "Artisan",
    name: "Artisan",
    socialClass: "ARTISAN",
    compatibleHomeDistricts: ["residential"],
    compatibleWorkDistricts: ["market"],
    scheduleType: "DAY_WORKER",
  },
  Laborer: {
    id: "Laborer",
    name: "Laborer",
    socialClass: "COMMON",
    compatibleHomeDistricts: ["residential", "harbor"],
    compatibleWorkDistricts: ["residential", "blacksmith", "harbor", "market"],
    scheduleType: "DAY_WORKER",
  },
  Traveler: {
    id: "Traveler",
    name: "Traveler",
    socialClass: "TRAVELER",
    compatibleHomeDistricts: ["inn"],
    compatibleWorkDistricts: ["market", "central_plaza"],
    scheduleType: "TRAVELER",
  },
  Royalty: {
    id: "Royalty",
    name: "Royalty",
    socialClass: "ROYAL",
    compatibleHomeDistricts: ["castle"],
    compatibleWorkDistricts: ["castle"],
    scheduleType: "NOBLE",
  }
};
