import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from "react";
import * as THREE from "three";
import { globalNavGraph } from "@legend/shared";
/**
 * Debug component to visualize the NavGraph as red lines connecting nodes.
 * Use for manual visual QA to ensure NPCs are sticking to roads/paths.
 */
export function NavGraphDebug({ visible = true }) {
    const lineGeometry = useMemo(() => {
        const points = [];
        for (const [nodeId, edges] of globalNavGraph.edges.entries()) {
            const startNode = globalNavGraph.nodes.get(nodeId);
            if (!startNode)
                continue;
            for (const edge of edges) {
                const endNode = globalNavGraph.nodes.get(edge.toId);
                if (endNode) {
                    // Add line segment
                    points.push(new THREE.Vector3(startNode.x, startNode.y + 0.1, startNode.z));
                    points.push(new THREE.Vector3(endNode.x, endNode.y + 0.1, endNode.z));
                }
            }
        }
        const geom = new THREE.BufferGeometry().setFromPoints(points);
        return geom;
    }, [globalNavGraph.edges.size]);
    if (!visible || lineGeometry.attributes.position.count === 0)
        return null;
    return (_jsx("lineSegments", { geometry: lineGeometry, children: _jsx("lineBasicMaterial", { color: "red", depthTest: false, opacity: 0.5, transparent: true }) }));
}
//# sourceMappingURL=NavGraphDebug.js.map