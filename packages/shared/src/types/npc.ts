export type NPCSocialClass = "COMMON" | "ARTISAN" | "MERCHANT" | "MILITARY" | "NOBLE" | "CLERGY" | "ROYAL" | "TRAVELER";

export type NPCProfession = 
  | "Citizen" | "Merchant" | "Shopkeeper" | "Blacksmith" | "Carpenter" 
  | "Leatherworker" | "Alchemist" | "Baker" | "Farmer" | "Guard" 
  | "Soldier" | "Officer" | "Noble" | "Servant" | "Scholar" 
  | "Priest" | "Acolyte" | "Innkeeper" | "DockWorker" | "Fisherman" 
  | "Sailor" | "Artisan" | "Laborer" | "Traveler" | "Royalty";

export type NPCActivity = "Idle" | "Walking" | "Working" | "Sleeping" | "Eating" | "Praying" | "Patrolling" | "Shopping";
export type NPCSimTier = 0 | 1 | 2 | 3;

export interface NPCScheduleBlock {
  startHour: number; // 0-24
  endHour: number; // 0-24
  activity: NPCActivity;
  destination: { x: number; z: number };
}

export interface NPCSimState {
  currentActivity: NPCActivity;
  tier: NPCSimTier;
  position: { x: number; y: number; z: number };
  targetDestination: { x: number; z: number } | null;
  velocity: number;
  currentPath?: { x: number; y: number; z: number }[];
  pathIndex?: number;
}

export interface Household {
  id: string;
  homeDistrict: string;
  homeCoords: { x: number; z: number };
  members: string[]; // NPC IDs
}

export interface NPCData {
  id: string;
  name: string;
  profession: NPCProfession;
  socialClass: NPCSocialClass;
  householdId: string;
  homeDistrict: string;
  workplaceDistrict: string;
  homeCoords: { x: number; z: number };
  workplaceCoords: { x: number; z: number };
  schedule: NPCScheduleBlock[];
  state: NPCSimState;
}
