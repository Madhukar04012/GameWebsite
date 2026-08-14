import React, { useState, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { globalNavGraph } from '@legend/shared';
import { useNPCStore } from '../store/npcStore';
import * as THREE from 'three';

export function PerformanceHUD() {
  const { gl, scene } = useThree();
  const npcs = useNPCStore(state => state.npcs);
  
  const [metrics, setMetrics] = useState({
    fps: 0,
    frameTime: 0,
    drawCalls: 0,
    triangles: 0,
    activeLights: 0,
    pointLights: 0,
    spotLights: 0,
    dirLights: 0,
    npcActive: 0,
    npcTotal: 0,
    npcTiers: { t0: 0, t1: 0, t2: 0, t3: 0 },
    aStarReqs: 0,
    aStarAvgTime: 0,
    aStarMaxTime: 0,
    navNodes: 0,
    navEdges: 0
  });

  const state = useRef({
    frames: 0,
    lastTime: performance.now(),
    lastAStarCalls: 0,
    lastAStarTime: 0,
    aStarMaxTime: 0
  });

  useFrame(() => {
    state.current.frames++;
    const now = performance.now();
    const elapsed = now - state.current.lastTime;
    
    // Update max A* time incrementally
    const currentAStarCalls = globalNavGraph.pathfindingStats.calls;
    const currentAStarTime = globalNavGraph.pathfindingStats.timeMs;
    const timeDiff = currentAStarTime - state.current.lastAStarTime;
    if (currentAStarCalls > state.current.lastAStarCalls) {
      if (timeDiff > state.current.aStarMaxTime) {
        state.current.aStarMaxTime = timeDiff; // Rough max approximation
      }
    }

    if (elapsed >= 1000) {
      // Calculate FPS
      const fps = Math.round((state.current.frames * 1000) / elapsed);
      const frameTime = (elapsed / state.current.frames).toFixed(1);
      
      const aStarReqs = currentAStarCalls - state.current.lastAStarCalls;
      const aStarAvgTime = aStarReqs > 0 ? (timeDiff / aStarReqs).toFixed(2) : 0;
      const aStarMax = state.current.aStarMaxTime.toFixed(2);
      
      // Count Lights
      let point = 0, spot = 0, dir = 0;
      scene.traverse((obj) => {
        if ((obj as THREE.PointLight).isPointLight) point++;
        if ((obj as THREE.SpotLight).isSpotLight) spot++;
        if ((obj as THREE.DirectionalLight).isDirectionalLight) dir++;
      });
      
      // Count NPC tiers
      let t0 = 0, t1 = 0, t2 = 0, t3 = 0;
      npcs.forEach(n => {
        if (n.state.tier === 0) t0++;
        else if (n.state.tier === 1) t1++;
        else if (n.state.tier === 2) t2++;
        else if (n.state.tier === 3) t3++;
      });
      
      // Update Metrics
      setMetrics({
        fps,
        frameTime: Number(frameTime),
        drawCalls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        activeLights: point + spot + dir,
        pointLights: point,
        spotLights: spot,
        dirLights: dir,
        npcTotal: npcs.length,
        npcActive: t0 + t1, // Usually tier 0/1 are simulated closely/rendered
        npcTiers: { t0, t1, t2, t3 },
        aStarReqs,
        aStarAvgTime: Number(aStarAvgTime),
        aStarMaxTime: Number(aStarMax),
        navNodes: globalNavGraph.nodes.size,
        navEdges: Array.from(globalNavGraph.edges.values()).reduce((sum, edges) => sum + edges.length, 0)
      });
      
      // Reset for next second
      state.current.frames = 0;
      state.current.lastTime = now;
      state.current.lastAStarCalls = currentAStarCalls;
      state.current.lastAStarTime = currentAStarTime;
      state.current.aStarMaxTime = 0; // reset max tracking per second
    }
  });

  return (
    <Html center style={{ position: 'absolute', top: '-45vh', left: '-45vw', pointerEvents: 'none', width: '300px', zIndex: 9999 }}>
      <div style={{ background: 'rgba(0,0,0,0.85)', color: 'lime', padding: '15px', fontFamily: 'monospace', fontSize: '14px', borderRadius: '5px', whiteSpace: 'pre', userSelect: 'text', pointerEvents: 'auto' }}>
        <h3 style={{ margin: '0 0 10px 0', color: 'white' }}>PERF BASELINE</h3>
        FPS: {metrics.fps}<br/>
        Frame: {metrics.frameTime}ms<br/>
        Draw Calls: {metrics.drawCalls}<br/>
        Triangles: {(metrics.triangles / 1000000).toFixed(2)}M<br/>
        <br/>
        Total NPCs: {metrics.npcTotal}<br/>
        Tier 0: {metrics.npcTiers.t0}<br/>
        Tier 1: {metrics.npcTiers.t1}<br/>
        Tier 2: {metrics.npcTiers.t2}<br/>
        Tier 3: {metrics.npcTiers.t3}<br/>
        <br/>
        Navigation Nodes: {metrics.navNodes}<br/>
        Navigation Edges: {metrics.navEdges}<br/>
        <br/>
        A* req/s: {metrics.aStarReqs}<br/>
        Average A*: {metrics.aStarAvgTime}ms<br/>
        Maximum A*: {metrics.aStarMaxTime}ms<br/>
        <br/>
        Active PointLights: {metrics.pointLights}<br/>
        Active SpotLights: {metrics.spotLights}<br/>
        DirectionalLights: {metrics.dirLights}<br/>
      </div>
    </Html>
  );
}
