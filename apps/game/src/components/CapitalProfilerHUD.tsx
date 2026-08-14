import React, { useState, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useDebugStore } from '../store/debugStore';

export function CapitalProfilerHUD() {
  const { scene, camera, gl } = useThree();
  const debug = useDebugStore();
  
  const [metrics, setMetrics] = useState({
    fps: 0,
    frameTime: 0,
    drawCalls: 0,
    triangles: 0,
    totalObjects: 0,
    totalMeshes: 0,
    geometries: 0,
    materials: 0,
    shadowCasters: 0,
    buildings: 0,
    buildingSubMeshes: 0,
    props: 0,
    landmarks: 0,
    instancedMeshes: 0,
    visibleObjects: 0,
    culledObjects: 0,
    distances: {
      near: 0, // 0-35m
      mid: 0,  // 35-100m
      far: 0,  // 100-200m
      horizon: 0, // 200m+
    }
  });

  const state = useRef({
    frames: 0,
    lastTime: performance.now(),
  });

  const frustum = new THREE.Frustum();
  const projScreenMatrix = new THREE.Matrix4();
  const box = new THREE.Box3();
  const sphere = new THREE.Sphere();

  useFrame(() => {
    state.current.frames++;
    const now = performance.now();
    const elapsed = now - state.current.lastTime;

    if (elapsed >= 1000) {
      const fps = Math.round((state.current.frames * 1000) / elapsed);
      const frameTime = (elapsed / state.current.frames).toFixed(1);
      
      let totalObjects = 0;
      let totalMeshes = 0;
      let shadowCas = 0;
      let buildings = 0;
      let buildingSub = 0;
      let props = 0;
      let landmarks = 0;
      let instanced = 0;
      let visibleCount = 0;
      let culledCount = 0;
      
      let near = 0;
      let mid = 0;
      let far = 0;
      let horizon = 0;

      const geoms = new Set<string>();
      const mats = new Set<string>();

      // Update frustum
      camera.updateMatrixWorld();
      projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      frustum.setFromProjectionMatrix(projScreenMatrix);

      const capital = scene.getObjectByName("CapitalKingdom");

      if (capital) {
        capital.traverse((child) => {
          totalObjects++;

          // Check categories based on userData
          if (child.userData?.isBuilding) buildings++;
          if (child.userData?.isProp) props++;
          if (child.userData?.isLandmark) landmarks++;

          if (child instanceof THREE.Mesh || child instanceof THREE.InstancedMesh) {
            totalMeshes++;
            if (child.castShadow) shadowCas++;
            if (child instanceof THREE.InstancedMesh) {
              instanced++;
            }

            // Is it a sub-mesh of a building?
            // Traverse upwards to see if any parent is a building
            let p = child.parent;
            let isBuildingSubMesh = false;
            while (p && p !== capital) {
              if (p.userData?.isBuilding) {
                isBuildingSubMesh = true;
                break;
              }
              p = p.parent;
            }
            if (isBuildingSubMesh) buildingSub++;

            // Track unique geometries & materials
            if (child.geometry) {
              geoms.add(child.geometry.uuid);
            }
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(m => mats.add(m.uuid));
              } else {
                mats.add(child.material.uuid);
              }
            }

            // Visibility / Culling Check
            // Rough bounding sphere check
            let isVisible = false;
            if (child.geometry && child.geometry.boundingSphere === null) {
              child.geometry.computeBoundingSphere();
            }
            
            if (child.geometry && child.geometry.boundingSphere) {
              sphere.copy(child.geometry.boundingSphere);
              sphere.applyMatrix4(child.matrixWorld);
              isVisible = frustum.intersectsSphere(sphere);
            } else {
               // fallback to simple point check
               isVisible = frustum.containsPoint(child.getWorldPosition(new THREE.Vector3()));
            }

            if (isVisible) {
              visibleCount++;
              
              // Distance bucket
              const dist = child.getWorldPosition(new THREE.Vector3()).distanceTo(camera.position);
              if (dist <= 35) near++;
              else if (dist <= 100) mid++;
              else if (dist <= 200) far++;
              else horizon++;

            } else {
              culledCount++;
            }
          }
        });
      }

      setMetrics({
        fps,
        frameTime: Number(frameTime),
        drawCalls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        totalObjects,
        totalMeshes,
        geometries: geoms.size,
        materials: mats.size,
        shadowCasters: shadowCas,
        buildings,
        buildingSubMeshes: buildingSub,
        props,
        landmarks,
        instancedMeshes: instanced,
        visibleObjects: visibleCount,
        culledObjects: culledCount,
        distances: { near, mid, far, horizon },
      });

      state.current.frames = 0;
      state.current.lastTime = now;
    }
  });

  if (!debug.devProfile) return null;

  return (
    <Html center style={{ position: 'absolute', top: '-45vh', left: '-45vw', pointerEvents: 'none', width: '380px', zIndex: 9999 }}>
      <div style={{ background: 'rgba(0,0,0,0.85)', color: '#ffd166', padding: '15px', fontFamily: 'monospace', fontSize: '13px', borderRadius: '5px', whiteSpace: 'pre', userSelect: 'text', pointerEvents: 'auto', border: '1px solid #f4a261' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#f4a261' }}>CAPITAL RENDER PROFILER</h3>
        <span style={{color: 'white'}}>FPS:</span> {metrics.fps} | <span style={{color: 'white'}}>Frame:</span> {metrics.frameTime}ms
        <span style={{color: 'white'}}>Global Draw Calls:</span> {metrics.drawCalls}
        <span style={{color: 'white'}}>Global Triangles:</span> {(metrics.triangles / 1000000).toFixed(2)}M

        <hr style={{ borderColor: '#555', margin: '8px 0' }}/>
        <span style={{color: '#90e0ef'}}>--- CAPITAL INVENTORY ---</span>
        <span style={{color: 'white'}}>Total Object3Ds:</span> {metrics.totalObjects}
        <span style={{color: 'white'}}>Total Meshes:</span>    {metrics.totalMeshes}
        <span style={{color: 'white'}}>Unique Geoms:</span>    {metrics.geometries}
        <span style={{color: 'white'}}>Unique Mats:</span>     {metrics.materials}
        <span style={{color: 'white'}}>Shadow Casters:</span>  {metrics.shadowCasters}
        <span style={{color: 'white'}}>Instanced Meshes:</span>{metrics.instancedMeshes}
        
        <br/>
        <span style={{color: '#90e0ef'}}>--- CAPITAL COMPONENTS ---</span>
        <span style={{color: 'white'}}>Buildings:</span>       {metrics.buildings}
        <span style={{color: 'white'}}>Sub-meshes:</span>      {metrics.buildingSubMeshes}
        <span style={{color: 'white'}}>Props (Groups):</span>  {metrics.props}
        <span style={{color: 'white'}}>Landmarks:</span>       {metrics.landmarks}
        
        <hr style={{ borderColor: '#555', margin: '8px 0' }}/>
        <span style={{color: '#06d6a0'}}>--- VISIBILITY & CULLING ---</span>
        <span style={{color: 'white'}}>Visible Meshes:</span>  {metrics.visibleObjects}
        <span style={{color: 'white'}}>Frustum Culled:</span>  {metrics.culledObjects}
        
        <br/>
        <span style={{color: '#06d6a0'}}>--- DISTANCE BUCKETS ---</span>
        <span style={{color: 'white'}}>0-35m   (Near):</span> {metrics.distances.near}
        <span style={{color: 'white'}}>35-100m (Mid):</span>  {metrics.distances.mid}
        <span style={{color: 'white'}}>100-200m(Far):</span>  {metrics.distances.far}
        <span style={{color: 'white'}}>200m+ (Horizon):</span>{metrics.distances.horizon}
        
        <hr style={{ borderColor: '#555', margin: '8px 0' }}/>
        <span style={{color: '#ef476f'}}>[F8] DEV PROFILE : ON</span>
      </div>
    </Html>
  );
}
