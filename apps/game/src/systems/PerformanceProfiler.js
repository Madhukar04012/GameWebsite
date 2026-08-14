import { useThree, useFrame } from "@react-three/fiber";
import { useRef } from "react";
export function PerformanceProfiler() {
    const { gl, scene } = useThree();
    const frameCount = useRef(0);
    const lastTime = useRef(performance.now());
    const reportDone = useRef(false);
    useFrame(() => {
        frameCount.current++;
        if (!reportDone.current && frameCount.current > 600) { // wait ~10 seconds
            reportDone.current = true;
            const now = performance.now();
            const elapsed = (now - lastTime.current) / 1000;
            const fps = frameCount.current / elapsed;
            const info = gl.info;
            // Calculate total meshes and lights in scene
            let meshCount = 0;
            let lightCount = 0;
            let instancedMeshCount = 0;
            scene.traverse((obj) => {
                if (obj.isMesh) {
                    meshCount++;
                    if (obj.isInstancedMesh) {
                        instancedMeshCount++;
                    }
                }
                if (obj.isLight) {
                    lightCount++;
                }
            });
            console.log("==========================================");
            console.log("🔥 PERFORMANCE PROFILE REPORT 🔥");
            console.log("==========================================");
            console.log(`FPS:                 ${Math.round(fps)}`);
            console.log(`Draw Calls:          ${info.render.calls}`);
            console.log(`Triangles:           ${info.render.triangles}`);
            console.log(`Points:              ${info.render.points}`);
            console.log(`Lines:               ${info.render.lines}`);
            console.log(`Geometries in Mem:   ${info.memory.geometries}`);
            console.log(`Textures in Mem:     ${info.memory.textures}`);
            console.log(`Active Meshes:       ${meshCount} (Instanced: ${instancedMeshCount})`);
            console.log(`Active Lights:       ${lightCount}`);
            console.log("==========================================");
            // Store in window for easy extraction
            window.__PROFILE_REPORT__ = {
                fps: Math.round(fps),
                calls: info.render.calls,
                triangles: info.render.triangles,
                geometries: info.memory.geometries,
                textures: info.memory.textures,
                meshes: meshCount,
                instanced: instancedMeshCount,
                lights: lightCount
            };
        }
    });
    return null;
}
//# sourceMappingURL=PerformanceProfiler.js.map