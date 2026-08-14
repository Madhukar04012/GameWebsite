import React, { useState, useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { globalNavGraph } from '@legend/shared';
import { useNPCStore } from '../store/npcStore';
import { useDebugStore } from '../store/debugStore';
import { CapitalProfilerHUD } from './CapitalProfilerHUD';

export function PerformanceHUD() {
  const { gl } = useThree();
  const npcs = useNPCStore(state => state.npcs);
  const debug = useDebugStore();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F8') {
        e.preventDefault();
        debug.toggle('devProfile');
      }
      if (e.key === 'F11') {
        e.preventDefault();
        debug.toggle('perfNpcs');
      }
      if (e.key === 'F9') {
        e.preventDefault();
        debug.toggle('perfPostFX');
      }
      if (e.key === 'F10') {
        e.preventDefault();
        debug.toggle('perfLights');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [debug]);

  const [metrics, setMetrics] = useState({
    fps: 0,
    frameTime: 0,
    drawCalls: 0,
    triangles: 0,
    geometries: 0,
    textures: 0,
    npcActive: 0,
    npcTotal: 0,
    npcTiers: { t0: 0, t1: 0, t2: 0, t3: 0 },
    aStarReqs: 0,
    aStarAvgTime: 0,
    aStarMaxTime: 0,
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
        state.current.aStarMaxTime = timeDiff; 
      }
    }

    if (elapsed >= 1000) {
      const fps = Math.round((state.current.frames * 1000) / elapsed);
      const frameTime = (elapsed / state.current.frames).toFixed(1);
      
      const aStarReqs = currentAStarCalls - state.current.lastAStarCalls;
      const aStarAvgTime = aStarReqs > 0 ? (timeDiff / aStarReqs).toFixed(2) : 0;
      const aStarMax = state.current.aStarMaxTime.toFixed(2);
      
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
        geometries: gl.info.memory.geometries,
        textures: gl.info.memory.textures,
        npcTotal: npcs.length,
        npcActive: t0 + t1, 
        npcTiers: { t0, t1, t2, t3 },
        aStarReqs,
        aStarAvgTime: Number(aStarAvgTime),
        aStarMaxTime: Number(aStarMax),
      });
      
      // Reset for next second
      state.current.frames = 0;
      state.current.lastTime = now;
      state.current.lastAStarCalls = currentAStarCalls;
      state.current.lastAStarTime = currentAStarTime;
      state.current.aStarMaxTime = 0;
    }
  });

  return (
    <>
    <Html center style={{ position: 'absolute', top: '-45vh', left: '-45vw', pointerEvents: 'none', width: '350px', zIndex: 9999 }}>
      <div style={{ background: 'rgba(0,0,0,0.85)', color: 'lime', padding: '15px', fontFamily: 'monospace', fontSize: '13px', borderRadius: '5px', whiteSpace: 'pre', userSelect: 'text', pointerEvents: 'auto' }}>
        <h3 style={{ margin: '0 0 10px 0', color: 'white' }}>PERF DIAGNOSTICS</h3>
        FPS: {metrics.fps} | Frame: {metrics.frameTime}ms<br/>
        Draw Calls: {metrics.drawCalls} | Tris: {(metrics.triangles / 1000000).toFixed(2)}M<br/>
        Geoms: {metrics.geometries} | Tex: {metrics.textures}<br/>
        <br/>
        <span style={{color: debug.perfNpcs ? 'lime' : 'red'}}>[F11] NPCs: {debug.perfNpcs ? 'ON' : 'OFF'}</span><br/>
        Total: {metrics.npcTotal} | Rendered(Active): {metrics.npcActive}<br/>
        Tier 0: {metrics.npcTiers.t0} | Tier 1: {metrics.npcTiers.t1}<br/>
        A* req/s: {metrics.aStarReqs} | Avg A*: {metrics.aStarAvgTime}ms<br/>
        <br/>
        <span style={{color: debug.perfPostFX ? 'lime' : 'red'}}>[F9] Post FX: {debug.perfPostFX ? 'ON' : 'OFF'}</span><br/>
        <span style={{color: debug.perfLights ? 'lime' : 'red'}}>[F10] Dynamic Lights: {debug.perfLights ? 'ON' : 'OFF'}</span><br/>
      </div>
    </Html>
    <CapitalProfilerHUD />
    </>
  );
}
