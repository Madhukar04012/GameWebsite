export type TraversalType = "WALK" | "STAIRS" | "RAMP" | "GATE" | "BRIDGE";
export type NavNodeType = "ROAD" | "DOOR" | "INTERSECTION";

export interface NavNode {
  id: string;
  x: number;
  y: number;
  z: number;
  region: string; // e.g. DistrictName or "world"
  type: NavNodeType;
}

export interface NavEdge {
  fromId: string;
  toId: string;
  cost: number;
  traversalType: TraversalType;
}

export interface NavGraphData {
  nodes: Map<string, NavNode>;
  edges: Map<string, NavEdge[]>;
}
