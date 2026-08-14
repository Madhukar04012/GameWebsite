import { useFrame } from "@react-three/fiber";
import { useNPCStore } from "../../store/npcStore";
import { useWorldStore } from "../../store/worldStore";
import { heightAt } from "@legend/engine";
import { globalNavGraph } from "@legend/shared";
// Thresholds for tiers
const TIER_1_DIST = 100; // Within 100m = Tier 1 (lerping)
const TIER_0_DIST = 300; // > 300m = Tier 0 (low frequency update or culled)
export function NPCSimulationManager() {
    const mutableNPCs = useNPCStore(s => s.mutableNPCs);
    useFrame((state, delta) => {
        const timeOfDay = useWorldStore.getState().timeOfDay;
        const cameraPos = state.camera.position;
        const isAccelerated = useWorldStore.getState().timeScale > 1; // if we want to run fast
        for (const [id, npc] of mutableNPCs.entries()) {
            // 1. Determine Tier based on distance
            const dx = cameraPos.x - npc.state.position.x;
            const dz = cameraPos.z - npc.state.position.z;
            const distSq = dx * dx + dz * dz;
            if (distSq < TIER_1_DIST * TIER_1_DIST) {
                npc.state.tier = 1;
            }
            else {
                npc.state.tier = 0;
            }
            // 2. Evaluate Schedule
            let currentBlock = npc.schedule[0];
            for (const block of npc.schedule) {
                // Simple time block check (doesn't wrap around midnight well, but good enough for foundation)
                if (timeOfDay >= block.startHour && timeOfDay < block.endHour) {
                    currentBlock = block;
                    break;
                }
            }
            if (currentBlock && npc.state.currentActivity !== currentBlock.activity) {
                npc.state.currentActivity = currentBlock.activity;
                npc.state.targetDestination = currentBlock.destination;
                // Compute new path when destination changes
                const startNode = globalNavGraph.getClosestNode(npc.state.position.x, npc.state.position.z);
                const endNode = globalNavGraph.getClosestNode(currentBlock.destination.x, currentBlock.destination.z);
                if (startNode && endNode) {
                    const path = globalNavGraph.findPath(startNode.id, endNode.id);
                    npc.state.currentPath = path.map((n) => ({ x: n.x, y: n.y, z: n.z }));
                    // Optimization: if the start node is very close, we can jump to index 1 to avoid backtracking
                    npc.state.pathIndex = npc.state.currentPath.length > 1 ? 1 : 0;
                }
                else {
                    npc.state.currentPath = undefined;
                }
            }
            // 3. Movement
            if (npc.state.targetDestination) {
                // If we have a path, move along it
                if (npc.state.currentPath && npc.state.pathIndex !== undefined && npc.state.pathIndex < npc.state.currentPath.length) {
                    const targetWaypoint = npc.state.currentPath[npc.state.pathIndex];
                    const tx = targetWaypoint.x;
                    const tz = targetWaypoint.z;
                    const cx = npc.state.position.x;
                    const cz = npc.state.position.z;
                    const diffX = tx - cx;
                    const diffZ = tz - cz;
                    const distToTarget = Math.sqrt(diffX * diffX + diffZ * diffZ);
                    if (distToTarget < 0.5) {
                        // Reached waypoint, move to next
                        npc.state.pathIndex++;
                        if (npc.state.pathIndex >= npc.state.currentPath.length) {
                            npc.state.targetDestination = null;
                            npc.state.velocity = 0;
                        }
                    }
                    else {
                        npc.state.velocity = 2.0; // 2 m/s basic speed
                        // For Tier 0, we could teleport or move fast.
                        // For now, let's process movement the same but scaled by time, 
                        // since pathing nodes might be spaced 6m apart.
                        const moveDist = npc.state.velocity * delta * (npc.state.tier === 0 ? (isAccelerated ? 60 : 10) : 1);
                        if (moveDist >= distToTarget) {
                            npc.state.position.x = tx;
                            npc.state.position.z = tz;
                        }
                        else {
                            npc.state.position.x += (diffX / distToTarget) * moveDist;
                            npc.state.position.z += (diffZ / distToTarget) * moveDist;
                        }
                        npc.state.position.y = heightAt(npc.state.position.x, npc.state.position.z);
                    }
                }
                else {
                    // Fallback direct move if no path or reached end
                    const tx = npc.state.targetDestination.x;
                    const tz = npc.state.targetDestination.z;
                    const cx = npc.state.position.x;
                    const cz = npc.state.position.z;
                    const diffX = tx - cx;
                    const diffZ = tz - cz;
                    const distToTarget = Math.sqrt(diffX * diffX + diffZ * diffZ);
                    if (distToTarget < 1.0) {
                        npc.state.targetDestination = null;
                        npc.state.velocity = 0;
                    }
                    else {
                        npc.state.velocity = 2.0;
                        const moveDist = npc.state.velocity * delta * (npc.state.tier === 0 ? (isAccelerated ? 60 : 10) : 1);
                        if (moveDist >= distToTarget) {
                            npc.state.position.x = tx;
                            npc.state.position.z = tz;
                        }
                        else {
                            npc.state.position.x += (diffX / distToTarget) * moveDist;
                            npc.state.position.z += (diffZ / distToTarget) * moveDist;
                        }
                        npc.state.position.y = heightAt(npc.state.position.x, npc.state.position.z);
                    }
                }
            }
        }
    });
    return null; // Logic only
}
//# sourceMappingURL=NPCSimulationManager.js.map