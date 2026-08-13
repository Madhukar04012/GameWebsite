export type NPCProfession = "Citizen" | "Guard" | "Merchant" | "Noble" | "Worker" | "Priest" | "Sailor";
export type NPCActivity = "Idle" | "Walking" | "Working" | "Sleeping" | "Eating" | "Praying";
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
}

export interface NPCData {
  id: string;
  name: string;
  profession: NPCProfession;
  homeDistrict: string;
  homeCoords: { x: number; z: number };
  workplaceCoords: { x: number; z: number };
  schedule: NPCScheduleBlock[];
  state: NPCSimState;
}
