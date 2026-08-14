import { NavNode, NavEdge, TraversalType, NavNodeType } from "./types";
export declare class NavGraph {
    nodes: Map<string, NavNode>;
    edges: Map<string, NavEdge[]>;
    addNode(node: NavNode): void;
    addEdge(fromId: string, toId: string, cost: number, traversalType?: TraversalType): void;
    addBidirectionalEdge(id1: string, id2: string, traversalType?: TraversalType): void;
    getClosestNode(x: number, z: number, typeFilter?: NavNodeType): NavNode | null;
    findPath(startId: string, targetId: string): NavNode[];
    private heuristic;
    private reconstructPath;
}
export declare const globalNavGraph: NavGraph;
//# sourceMappingURL=NavGraph.d.ts.map