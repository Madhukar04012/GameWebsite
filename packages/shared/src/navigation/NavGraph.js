import { PriorityQueue } from "./PriorityQueue";
export class NavGraph {
    constructor() {
        this.nodes = new Map();
        this.edges = new Map();
    }
    addNode(node) {
        this.nodes.set(node.id, node);
        if (!this.edges.has(node.id)) {
            this.edges.set(node.id, []);
        }
    }
    addEdge(fromId, toId, cost, traversalType = "WALK") {
        if (this.nodes.has(fromId) && this.nodes.has(toId)) {
            this.edges.get(fromId).push({ fromId, toId, cost, traversalType });
        }
    }
    addBidirectionalEdge(id1, id2, traversalType = "WALK") {
        const node1 = this.nodes.get(id1);
        const node2 = this.nodes.get(id2);
        if (!node1 || !node2)
            return;
        const dx = node1.x - node2.x;
        const dy = node1.y - node2.y;
        const dz = node1.z - node2.z;
        const cost = Math.sqrt(dx * dx + dy * dy + dz * dz);
        this.addEdge(id1, id2, cost, traversalType);
        this.addEdge(id2, id1, cost, traversalType);
    }
    getClosestNode(x, z, typeFilter) {
        let closest = null;
        let minDist = Infinity;
        for (const node of this.nodes.values()) {
            if (typeFilter && node.type !== typeFilter)
                continue;
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
    findPath(startId, targetId) {
        const startNode = this.nodes.get(startId);
        const targetNode = this.nodes.get(targetId);
        if (!startNode || !targetNode)
            return [];
        const openSet = new PriorityQueue();
        openSet.enqueue(startId, 0);
        const cameFrom = new Map();
        const gScore = new Map();
        gScore.set(startId, 0);
        const fScore = new Map();
        fScore.set(startId, this.heuristic(startNode, targetNode));
        while (!openSet.isEmpty()) {
            const currentId = openSet.dequeue();
            if (currentId === targetId) {
                return this.reconstructPath(cameFrom, currentId);
            }
            const currentScore = gScore.get(currentId) || Infinity;
            const neighbors = this.edges.get(currentId) || [];
            for (const edge of neighbors) {
                const tentativeGScore = currentScore + edge.cost;
                const neighborScore = gScore.get(edge.toId) ?? Infinity;
                if (tentativeGScore < neighborScore) {
                    cameFrom.set(edge.toId, currentId);
                    gScore.set(edge.toId, tentativeGScore);
                    const neighborNode = this.nodes.get(edge.toId);
                    const h = this.heuristic(neighborNode, targetNode);
                    const f = tentativeGScore + h;
                    fScore.set(edge.toId, f);
                    // PriorityQueue doesn't have an 'update' method, so we just enqueue again.
                    // The algorithm will just skip the old entries since we check if tentativeGScore is strictly better.
                    openSet.enqueue(edge.toId, f);
                }
            }
        }
        return []; // No path found
    }
    heuristic(a, b) {
        // Manhattan or Euclidean distance as heuristic. Euclidean here.
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    reconstructPath(cameFrom, currentId) {
        const path = [this.nodes.get(currentId)];
        let curr = currentId;
        while (cameFrom.has(curr)) {
            curr = cameFrom.get(curr);
            path.unshift(this.nodes.get(curr));
        }
        return path;
    }
}
// Global instance for the client/server to use
export const globalNavGraph = new NavGraph();
//# sourceMappingURL=NavGraph.js.map