import { CITY_LAYOUT, ROADS, DistrictName } from "../constants";
import { NavGraph } from "./NavGraph";
import { NavNode, NavNodeType } from "./types";

export function buildCityNavGraph(graph: NavGraph, heightAt: (x: number, z: number) => number) {
  // Clear existing
  graph.nodes.clear();
  graph.edges.clear();

  let nodeIdCounter = 0;
  const generateId = (prefix: string) => `${prefix}_${nodeIdCounter++}`;

  // Helper to safely determine the district a point belongs to
  const getDistrict = (x: number, z: number): DistrictName => {
    let closestDistSq = Infinity;
    let closestName: DistrictName = "residential";
    for (const d of CITY_LAYOUT) {
      const dx = d.center.x - x;
      const dz = d.center.z - z;
      const distSq = dx * dx + dz * dz;
      if (distSq < closestDistSq) {
        closestDistSq = distSq;
        closestName = d.name;
      }
    }
    return closestName;
  };

  // 1. Process Roads
  const roadNodes: NavNode[] = [];
  const ROAD_SEGMENT_LENGTH = 6.0; // Place a node every 6 meters along roads

  ROADS.forEach(road => {
    const dx = road.to.x - road.from.x;
    const dz = road.to.z - road.from.z;
    const length = Math.sqrt(dx * dx + dz * dz);
    const steps = Math.max(1, Math.ceil(length / ROAD_SEGMENT_LENGTH));

    let prevNodeId: string | null = null;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = road.from.x + dx * t;
      const z = road.from.z + dz * t;
      const y = heightAt(x, z);

      const isIntersection = (i === 0 || i === steps);
      const type: NavNodeType = isIntersection ? "INTERSECTION" : "ROAD";
      const region = getDistrict(x, z);

      // Check if there is an existing intersection very close to avoid duplicate nodes at road joins
      let node: NavNode | null = null;
      if (isIntersection) {
        const existing = graph.getClosestNode(x, z, "INTERSECTION");
        if (existing) {
          const edx = existing.x - x;
          const edz = existing.z - z;
          if (edx * edx + edz * edz < 0.1) {
            node = existing;
          }
        }
      }

      if (!node) {
        const id = generateId(`road_${road.id}`);
        node = { id, x, y, z, region, type };
        graph.addNode(node);
        roadNodes.push(node);
      }

      if (prevNodeId) {
        graph.addBidirectionalEdge(prevNodeId, node.id, "WALK");
      }
      prevNodeId = node.id;
    }
  });

  // 2. Process Buildings (Doors)
  CITY_LAYOUT.forEach(district => {
    if (!district.buildings) return;
    
    district.buildings.forEach(b => {
      // Find door position (we'll just use the building center + small offset towards closest road, 
      // or simply place the node just outside the center towards the road)
      
      // First find nearest road node to building center
      let closestRoadNode: NavNode | null = null;
      let minDistSq = Infinity;
      
      for (const rn of roadNodes) {
        const dx = rn.x - b.x;
        const dz = rn.z - b.z;
        const distSq = dx * dx + dz * dz;
        if (distSq < minDistSq) {
          minDistSq = distSq;
          closestRoadNode = rn;
        }
      }

      if (closestRoadNode) {
        // Place door node halfway between center and edge, slightly towards road
        const dirX = closestRoadNode.x - b.x;
        const dirZ = closestRoadNode.z - b.z;
        const len = Math.sqrt(dirX * dirX + dirZ * dirZ);
        
        // Approximate building radius (half max dimension)
        const bRadius = Math.max(b.w, b.d) / 2;
        const offsetDist = bRadius + 1.0; // 1 meter outside the building
        
        let doorX = b.x;
        let doorZ = b.z;
        
        if (len > 0) {
          doorX += (dirX / len) * offsetDist;
          doorZ += (dirZ / len) * offsetDist;
        }

        const doorY = heightAt(doorX, doorZ);
        
        const doorId = generateId(`door_${district.name}`);
        const doorNode: NavNode = {
          id: doorId,
          x: doorX,
          y: doorY,
          z: doorZ,
          region: district.name,
          type: "DOOR"
        };
        
        graph.addNode(doorNode);
        
        // Link door to the road node
        graph.addBidirectionalEdge(doorId, closestRoadNode.id, "WALK");
      }
    });
  });
}
