import { useFrame } from "@react-three/fiber";
import { useNPCStore } from "../../store/npcStore";
import { useWorldStore } from "../../store/worldStore";
import * as THREE from "three";
import { heightAt } from "@legend/engine";
import { globalNavGraph, NavNode } from "@legend/shared";
import { useRef } from "react";

// Thresholds for tiers
const TIER_1_DIST = 100; // Within 100m = Tier 1 (lerping)
const TIER_0_DIST = 300; // > 300m = Tier 0 (low frequency update or culled)

// We'll update tier 0 NPCs less frequently
const TIER_0_UPDATE_INTERVAL = 0.5; // seconds

export function NPCSimulationManager() {
  const mutableNPCs = useNPCStore(s => s.mutableNPCs);
  const timeAccumulator = useRef(0);
  const npcLastHeightMap = useRef<Map<string, { x: number, z: number, y: number }>>(new Map());

  useFrame((state, delta) => {
    const timeOfDay = useWorldStore.getState().timeOfDay;
    const cameraPos = state.camera.position;
    const isAccelerated = useWorldStore.getState().timeScale > 1;

    timeAccumulator.current += delta;
    const doTier0Update = timeAccumulator.current >= TIER_0_UPDATE_INTERVAL;
    if (doTier0Update) {
      timeAccumulator.current = 0;
    }

    for (const [id, npc] of mutableNPCs.entries()) {
      // 1. Determine Tier based on distance
      const dx = cameraPos.x - npc.state.position.x;
      const dz = cameraPos.z - npc.state.position.z;
      const distSq = dx * dx + dz * dz;

      if (distSq < TIER_1_DIST * TIER_1_DIST) {
        npc.state.tier = 1;
      } else {
        npc.state.tier = 0;
      }

      // Skip frame for Tier 0 if not update tick
      if (npc.state.tier === 0 && !doTier0Update) {
        continue;
      }

      // Use effectively a larger delta for tier 0 since it updates less often
      const effectiveDelta = npc.state.tier === 0 ? TIER_0_UPDATE_INTERVAL : delta;

      // 2. Evaluate Schedule
      let currentBlock = npc.schedule[0];
      for (const block of npc.schedule) {
        if (timeOfDay >= block.startHour && timeOfDay < block.endHour) {
          currentBlock = block;
          break;
        }
      }

      if (currentBlock && npc.state.currentActivity !== currentBlock.activity) {
        npc.state.currentActivity = currentBlock.activity;
        npc.state.targetDestination = currentBlock.destination;
        
        const startNode = globalNavGraph.getClosestNode(npc.state.position.x, npc.state.position.z);
        const endNode = globalNavGraph.getClosestNode(currentBlock.destination.x, currentBlock.destination.z);
        if (startNode && endNode) {
          const path = globalNavGraph.findPath(startNode.id, endNode.id);
          npc.state.currentPath = path.map((n: NavNode) => ({ x: n.x, y: n.y, z: n.z }));
          npc.state.pathIndex = npc.state.currentPath.length > 1 ? 1 : 0;
        } else {
          npc.state.currentPath = undefined;
        }
      }

      // Helper to update height efficiently
      const updateHeight = () => {
        let last = npcLastHeightMap.current.get(id);
        const cx = npc.state.position.x;
        const cz = npc.state.position.z;
        
        if (!last || Math.abs(cx - last.x) > 1.0 || Math.abs(cz - last.z) > 1.0) {
           const y = heightAt(cx, cz);
           if (!last) {
             last = { x: cx, z: cz, y };
             npcLastHeightMap.current.set(id, last);
           } else {
             last.x = cx;
             last.z = cz;
             last.y = y;
           }
           npc.state.position.y = y;
        } else {
           npc.state.position.y = last.y;
        }
      };

      // 3. Movement
      if (npc.state.targetDestination) {
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
            npc.state.pathIndex++;
            if (npc.state.pathIndex >= npc.state.currentPath.length) {
              npc.state.targetDestination = null;
              npc.state.velocity = 0;
            }
          } else {
            npc.state.velocity = 2.0;
            const moveDist = npc.state.velocity * effectiveDelta * (npc.state.tier === 0 ? (isAccelerated ? 60 : 10) : 1); 
            
            if (moveDist >= distToTarget) {
              npc.state.position.x = tx;
              npc.state.position.z = tz;
            } else {
              npc.state.position.x += (diffX / distToTarget) * moveDist;
              npc.state.position.z += (diffZ / distToTarget) * moveDist;
            }
            updateHeight();
          }
        } else {
          // Fallback direct move
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
          } else {
            npc.state.velocity = 2.0;
            const moveDist = npc.state.velocity * effectiveDelta * (npc.state.tier === 0 ? (isAccelerated ? 60 : 10) : 1);
            if (moveDist >= distToTarget) {
              npc.state.position.x = tx;
              npc.state.position.z = tz;
            } else {
              npc.state.position.x += (diffX / distToTarget) * moveDist;
              npc.state.position.z += (diffZ / distToTarget) * moveDist;
            }
            updateHeight();
          }
        }
      }
    }
  });

  return null;
}
