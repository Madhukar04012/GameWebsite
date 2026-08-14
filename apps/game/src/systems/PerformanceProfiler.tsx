import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function PerformanceProfiler() {
  const { gl } = useThree();
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const [metrics, setMetrics] = useState({ fps: 0, calls: 0, triangles: 0, geometries: 0, textures: 0 });

  useFrame(() => {
    frameCount.current++;
    const now = performance.now();
    const elapsed = now - lastTime.current;

    if (elapsed >= 1000) {
      const fps = Math.round((frameCount.current * 1000) / elapsed);
      
      const calls = gl.info.render.calls;
      const triangles = gl.info.render.triangles;
      const geometries = gl.info.memory.geometries;
      const textures = gl.info.memory.textures;

      setMetrics({ fps, calls, triangles, geometries, textures });
      
      // Log to console so our Puppeteer script can capture it
      console.log(`[PROFILER] FPS:${fps} CALLS:${calls} TRIS:${triangles} GEOMS:${geometries} TEX:${textures}`);

      frameCount.current = 0;
      lastTime.current = now;
    }
  });

  return (
    <group>
      {/* Invisible component just to hook into useFrame */}
    </group>
  );
}
