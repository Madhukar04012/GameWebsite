import { NavNode, NavEdge, NavGraphData, TraversalType, NavNodeType } from "./types";
import { PriorityQueue } from "./PriorityQueue";

export class NavGraph {
  public nodes: Map<string, NavNode> = new Map();
  public edges: Map<string, NavEdge[]> = new Map();

  addNode(node: NavNode) {
    this.nodes.set(node.id, node);
    if (!this.edges.has(node.id)) {
      this.edges.set(node.id, []);
    }
  }

  addEdge(fromId: string, toId: string, cost: number, traversalType: TraversalType = "WALK") {
    if (this.nodes.has(fromId) && this.nodes.has(toId)) {
      this.edges.get(fromId)!.push({ fromId, toId, cost, traversalType });
    }
  }

  addBidirectionalEdge(id1: string, id2: string, traversalType: TraversalType = "WALK") {
    const node1 = this.nodes.get(id1);
    const node2 = this.nodes.get(id2);
    if (!node1 || !node2) return;

    const dx = node1.x - node2.x;
    const dy = node1.y - node2.y;
    const dz = node1.z - node2.z;
    const cost = Math.sqrt(dx * dx + dy * dy + dz * dz);

    this.addEdge(id1, id2, cost, traversalType);
    this.addEdge(id2, id1, cost, traversalType);
  }

  public pathfindingStats = { calls: 0, timeMs: 0 };

  getClosestNode(x: number, z: number, typeFilter?: NavNodeType): NavNode | null {
    let closest: NavNode | null = null;
    let minDist = Infinity;
    
    for (const node of this.nodes.values()) {
      if (typeFilter && node.type !== typeFilter) continue;
      
      const dx = node.x - x;
      const dz = node.z - z;
      const distSq = dx * dx + dz * dz;
      if (distSq < minDist) {
        minDist = distSq;
        closest = node;
      }
    }
    
    return closest;
  }

  findPath(startId: string, targetId: string): NavNode[] {
    const t0 = performance.now();
    const startNode = this.nodes.get(startId);
    const targetNode = this.nodes.get(targetId);
    
    if (!startNode || !targetNode) {
      this.pathfindingStats.calls++;
      this.pathfindingStats.timeMs += (performance.now() - t0);
      return [];
    }

    const openSet = new PriorityQueue<string>();
    openSet.enqueue(startId, 0);

    const cameFrom = new Map<string, string>();
    const gScore = new Map<string, number>();
    gScore.set(startId, 0);

    const fScore = new Map<string, number>();
    fScore.set(startId, this.heuristic(startNode, targetNode));

    while (!openSet.isEmpty()) {
      const currentId = openSet.dequeue()!;
      
      if (currentId === targetId) {
        const path = this.reconstructPath(cameFrom, currentId);
        this.pathfindingStats.calls++;
        this.pathfindingStats.timeMs += (performance.now() - t0);
        return path;
      }

      const currentScore = gScore.get(currentId) || Infinity;
      const neighbors = this.edges.get(currentId) || [];

      for (const edge of neighbors) {
        const tentativeGScore = currentScore + edge.cost;
        const neighborScore = gScore.get(edge.toId) ?? Infinity;

        if (tentativeGScore < neighborScore) {
          cameFrom.set(edge.toId, currentId);
          gScore.set(edge.toId, tentativeGScore);
          
          const neighborNode = this.nodes.get(edge.toId)!;
          const h = this.heuristic(neighborNode, targetNode);
          const f = tentativeGScore + h;
          fScore.set(edge.toId, f);
          
          // PriorityQueue doesn't have an 'update' method, so we just enqueue again.
          // The algorithm will just skip the old entries since we check if tentativeGScore is strictly better.
          openSet.enqueue(edge.toId, f);
        }
      }
    }

    this.pathfindingStats.calls++;
    this.pathfindingStats.timeMs += (performance.now() - t0);
    return []; // No path found
  }

  private heuristic(a: NavNode, b: NavNode): number {
    // Manhattan or Euclidean distance as heuristic. Euclidean here.
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  private reconstructPath(cameFrom: Map<string, string>, currentId: string): NavNode[] {
    const path: NavNode[] = [this.nodes.get(currentId)!];
    let curr = currentId;
    while (cameFrom.has(curr)) {
      curr = cameFrom.get(curr)!;
      path.unshift(this.nodes.get(curr)!);
    }
    return path;
  }
}

// Global instance for the client/server to use
export const globalNavGraph = new NavGraph();
