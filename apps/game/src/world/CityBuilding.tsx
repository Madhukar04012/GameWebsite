import * as THREE from "three";
import { heightAt } from "@legend/engine";
import type { BuildingDef } from "@legend/shared";
import { GeometryBuilder } from "./GeometryBuilder";
import { INTERIOR_REGISTRY } from "./interiors/InteriorRegistry";
import { useWorldStore } from "../store/worldStore";
import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import { getAllDistrictMaterials } from "../materials/createDistrictMaterials";

export function buildCityBuildingGeometry(def: BuildingDef, builder: GeometryBuilder, district = "residential") {
  const { x, z, w, d, h, roof = "gable", floors = 2, family = "residential", isCorner = false, facadeType = "timber", hasBalcony = false, hasChimney = false, shopSign } = def;
  const roofH = Math.max(1.2, h * 0.32);

  let baseMat = "wall";
  let upperMat = "wall";
  if (facadeType === "plaster") { baseMat = "plaster"; upperMat = "plaster"; }
  else if (facadeType === "brick") { baseMat = "brick"; upperMat = "brick"; }
  else if (facadeType === "mixed") { baseMat = "wall"; upperMat = "plaster"; }
  else if (facadeType === "timber") { baseMat = "plaster"; upperMat = "plaster"; }

  const beamW = 0.18;
  const corners = [
    [-w / 2, -d / 2], [w / 2, -d / 2], [-w / 2, d / 2], [w / 2, d / 2],
  ];

  let maxH = -Infinity;
  let minH = Infinity;
  const pts = [[0, 0], ...corners];
  for (const [cx, cz] of pts) {
    const hh = heightAt(x + cx, z + cz);
    if (hh > maxH) maxH = hh;
    if (hh < minH) minH = hh;
  }
  const baseY = maxH + 0.1;
  const doorTerrainY = heightAt(x, z + d / 2);

  const fndHeight = baseY - minH + 1.2;
  const fndCenterY = 0.7 - fndHeight / 2;
  const storyH = h / floors;
  
  const stairDrop = baseY - doorTerrainY;
  const stairSteps = stairDrop > 0.2 ? Math.ceil(stairDrop / 0.2) : 0;

  const interiorDef = def.label ? INTERIOR_REGISTRY[def.label] : undefined;

  const buildingMat = new THREE.Matrix4().setPosition(x, baseY, z);
  builder.pushMatrix(buildingMat);

  // 1. Foundation
  builder.addBox(baseMat, w + 0.5, fndHeight, d + 0.5, [0, fndCenterY, 0]);
  builder.addBox("wood", w + 0.25, 0.12, d + 0.25, [0, 0.7, 0]);
  
  // Procedural Stairs
  if (stairSteps > 0) {
    for (let i = 0; i < stairSteps; i++) {
      const stepY = -0.1 - i * 0.2;
      const stepZ = d / 2 + 0.25 + i * 0.3;
      builder.addBox(baseMat, 1.8, 0.2, 0.3, [0, stepY, stepZ]);
    }
  }

  // 2. Main Wall
  if (interiorDef) {
    const wallMat = new THREE.Matrix4().setPosition(0, storyH / 2 + 0.3, 0);
    builder.pushMatrix(wallMat);
    builder.addBox(baseMat, w, storyH, 0.2, [0, 0, -d/2 + 0.1]);
    builder.addBox(baseMat, 0.2, storyH, d, [-w/2 + 0.1, 0, 0]);
    builder.addBox(baseMat, 0.2, storyH, d, [w/2 - 0.1, 0, 0]);
    builder.addBox(baseMat, w/2 - 0.6, storyH, 0.2, [-w/4 - 0.3, 0, d/2 - 0.1]);
    builder.addBox(baseMat, w/2 - 0.6, storyH, 0.2, [w/4 + 0.3, 0, d/2 - 0.1]);
    if (storyH > 2.4) {
      builder.addBox(baseMat, 1.2, storyH - 2.4, 0.2, [0, 1.2, d/2 - 0.1]);
    }
    builder.popMatrix();
  } else {
    builder.addBox(baseMat, w, storyH, d, [0, storyH / 2 + 0.3, 0]);
  }
  
  if (floors > 1) {
    builder.addBox(upperMat, w, h - storyH, d, [0, storyH + (h - storyH) / 2 + 0.3, 0]);
  }

  // 3. Timber Framing
  if (facadeType === "timber") {
    for (let i = 0; i < corners.length; i++) {
      const c = corners[i];
      builder.addBox("wood", beamW, h + 0.1, beamW, [c[0], h / 2 + 0.3, c[1]]);
    }
  }

  // 4. Jettying & Beams
  for (let f = 0; f < floors; f++) {
    const floorY = (f + 1) * storyH + 0.3;
    if (floorY >= h + 0.2) continue;
    
    const floorMat = new THREE.Matrix4().setPosition(0, floorY, 0);
    builder.pushMatrix(floorMat);
    builder.addBox("wood", w + 0.22, 0.2, d + 0.22);
    builder.addBox("wood", 0.2, 0.3, 0.25, [-w / 2 + 0.4, -0.15, d / 2 + 0.1]);
    builder.addBox("wood", 0.2, 0.3, 0.25, [w / 2 - 0.4, -0.15, d / 2 + 0.1]);
    builder.popMatrix();
  }

  builder.addBox("accent", w * 1.04, 0.16, d * 1.04, [0, h + 0.35, 0]);

  // Roof
  buildRoof(builder, roof, w, d, h + 0.35, roofH, isCorner);

  // Doors
  buildDoor(builder, family, w, d, storyH, !!interiorDef);

  // Windows
  buildWindows(builder, family, w, d, h, floors, storyH, isCorner);

  // Balconies
  if (hasBalcony && floors >= 2) {
    buildBalcony(builder, family, Math.min(3.2, w * 0.6), d, storyH + 0.4);
  }

  // Craft Props
  if (family === "craft") {
    buildCraftProps(builder, w, d);
  }

  // Chimney
  if (hasChimney) {
    buildChimney(builder, w, d, h + roofH * (roof === "flat" ? 0.2 : 0.8));
  }

  // Shop Sign
  if (shopSign) {
    buildShopSign(builder, d);
  }

  builder.popMatrix(); // buildingMat
  
  return { interiorDef, x, baseY, z, w, d, storyH };
}

function buildRoof(builder: GeometryBuilder, kind: string, w: number, d: number, h: number, roofH: number, isCorner: boolean) {
  const m = new THREE.Matrix4();
  switch (kind) {
    case "flat":
      m.setPosition(0, h, 0);
      builder.pushMatrix(m);
      builder.addBox("roof", w * 1.02, 0.24, d * 1.02, [0, 0.12, 0]);
      builder.addBox("roof", w * 0.98, 0.5, 0.28, [0, 0.45, -d / 2]);
      builder.addBox("roof", w * 0.98, 0.5, 0.28, [0, 0.45, d / 2]);
      builder.addBox("roof", 0.28, 0.5, d * 0.98, [-w / 2, 0.45, 0]);
      builder.addBox("roof", 0.28, 0.5, d * 0.98, [w / 2, 0.45, 0]);
      builder.popMatrix();
      break;
    case "shallow":
      m.setPosition(0, h, 0);
      builder.pushMatrix(m);
      builder.addBox("roof", w * 1.1, 0.2, d * 1.1, [0, 0.2, 0], [0.1, 0, 0]);
      builder.popMatrix();
      break;
    case "hip":
      m.setPosition(0, h + roofH / 2, 0);
      builder.pushMatrix(m);
      builder.addCylinder("roof", 0, Math.max(w, d) * 0.8, roofH * 1.2, 4, undefined, [0, Math.PI / 4, 0]);
      builder.popMatrix();
      break;
    case "mansard":
      m.setPosition(0, h + roofH / 2, 0);
      builder.pushMatrix(m);
      builder.addCylinder("roof", Math.min(w, d) * 0.4, Math.min(w, d) * 0.6, roofH * 1.2, 4);
      builder.addBox("accent", Math.min(w, d) * 0.7, 0.2, Math.min(w, d) * 0.7, [0, roofH * 0.6 + 0.1, 0]);
      builder.popMatrix();
      break;
    case "double-gable":
      m.setPosition(0, h + roofH / 2, 0);
      builder.pushMatrix(m);
      builder.addCone("roof", Math.min(w, d) * 0.5, roofH * 1.4, 4, [-w * 0.25, 0, 0], [0, Math.PI / 4, 0]);
      builder.addCone("roof", Math.min(w, d) * 0.5, roofH * 1.4, 4, [w * 0.25, 0, 0], [0, Math.PI / 4, 0]);
      builder.popMatrix();
      break;
    case "tower":
      m.setPosition(0, h, 0);
      builder.pushMatrix(m);
      builder.addCylinder("roof", Math.min(w, d) * 0.72, Math.min(w, d) * 0.76, 0.4, 8, [0, 0.2, 0]);
      builder.addCone("roof", Math.min(w, d) * 0.7, roofH * 1.4, 8, [0, roofH * 0.7, 0]);
      builder.popMatrix();
      break;
    case "cone":
      m.setPosition(0, h, 0);
      builder.pushMatrix(m);
      builder.addCone("roof", Math.max(w, d) * 0.72, roofH * 1.3, 8, [0, roofH / 2, 0]);
      builder.popMatrix();
      break;
    case "dome":
      m.setPosition(0, h, 0);
      builder.pushMatrix(m);
      builder.addSphere("roof", Math.min(w, d) * 0.58, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2, [0, 0, 0]);
      builder.popMatrix();
      break;
    case "gable":
    default:
      m.setPosition(0, h + roofH / 2, 0);
      builder.pushMatrix(m);
      builder.addCone("roof", Math.max(w, d) * 1.06, roofH * 1.4, 4, undefined, [0, Math.PI / 4, 0]);
      if (w > 4 && d > 4 && !isCorner) {
        [-w * 0.25, w * 0.25].forEach((dx) => {
          const rm = new THREE.Matrix4().setPosition(dx, roofH * 0.1, d * 0.35);
          builder.pushMatrix(rm);
          builder.addBox("wood", 0.8, 1.2, 0.8);
          builder.addCone("roof", 0.8, 0.6, 4, [0, 0.7, 0], [0, Math.PI / 4, 0]);
          builder.popMatrix();
        });
      }
      builder.popMatrix();
      break;
  }
}

function buildDoor(builder: GeometryBuilder, family: string, w: number, d: number, storyH: number, isOpen: boolean) {
  const m = new THREE.Matrix4().setPosition(0, 0, d / 2 + 0.02);
  builder.pushMatrix(m);
  if (family === "commercial") {
    builder.addBox("wood", 1.8, 2.6, 0.14, [0, 1.3, 0.02]);
    if (!isOpen) {
      builder.addBox("wood", 0.7, 2.3, 0.06, [-0.45, 1.25, 0.06]);
      builder.addBox("wood", 0.7, 2.3, 0.06, [0.45, 1.25, 0.06]);
      builder.addPlane("glass", 0.4, 0.8, [-0.45, 1.7, 0.1]);
      builder.addPlane("glass", 0.4, 0.8, [0.45, 1.7, 0.1]);
    }
  } else if (family === "craft") {
    builder.addBox("wood", 2.4, 2.6, 0.1, [0, 1.4, 0.06]);
    if (!isOpen) {
      builder.addBox("metal", 0.8, 0.1, 0.04, [-0.6, 1.4, 0.12]);
      builder.addBox("metal", 0.8, 0.1, 0.04, [0.6, 1.4, 0.12]);
    }
  } else if (family === "noble") {
    builder.addBox("wood", 1.6, 2.6, 0.4, [0, 1.4, 0.15]);
    if (!isOpen) {
      builder.addBox("wood", 1.2, 2.4, 0.1, [0, 1.3, 0.06]);
    }
  } else {
    builder.addBox("wood", 1.2, 2.3, 0.14, [0, 1.15, 0.02]);
    if (!isOpen) {
      builder.addBox("wood", 0.48, 2.0, 0.06, [-0.26, 1.1, 0.06]);
      builder.addBox("wood", 0.48, 2.0, 0.06, [0.26, 1.1, 0.06]);
    }
  }
  builder.popMatrix();
}

function buildWindows(builder: GeometryBuilder, family: string, w: number, d: number, h: number, floors: number, storyH: number, isCorner: boolean) {
  const colsX = Math.max(1, Math.floor(w / 2.2));
  const spacingX = w / (colsX + 1);

  if (family === "commercial") {
    builder.addBox("banner", w * 0.9, 0.05, 1.2, [0, storyH * 0.9, d / 2 + 0.4], [-0.4, 0, 0]);
  }

  for (let f = 1; f <= floors; f++) {
    const wy = (f - 0.45) * storyH;
    for (let col = 1; col <= colsX; col++) {
      if (f === 1 && colsX > 1 && col === Math.ceil(colsX / 2)) continue;
      if (f === 1 && family === "commercial") continue;
      if (f === 1 && family === "craft") continue;
      const wx = -w / 2 + col * spacingX;
      
      const p1 = new THREE.Matrix4().setPosition(wx, wy, d / 2 + 0.04);
      builder.pushMatrix(p1);
      buildWindowStyle(builder, family);
      builder.popMatrix();

      if (!isCorner) {
        const p2 = new THREE.Matrix4().makeRotationY(Math.PI);
        p2.setPosition(wx, wy, -d / 2 - 0.04);
        builder.pushMatrix(p2);
        buildWindowStyle(builder, family);
        builder.popMatrix();
      }
    }
    if (d >= 4) {
      const colsZ = Math.max(1, Math.floor(d / 2.2));
      const spacingZ = d / (colsZ + 1);
      for (let col = 1; col <= colsZ; col++) {
        const wz = -d / 2 + col * spacingZ;
        
        const p1 = new THREE.Matrix4().makeRotationY(-Math.PI / 2);
        p1.setPosition(-w / 2 - 0.04, wy, wz);
        builder.pushMatrix(p1);
        buildWindowStyle(builder, family);
        builder.popMatrix();
        
        if (!isCorner) {
          const p2 = new THREE.Matrix4().makeRotationY(Math.PI / 2);
          p2.setPosition(w / 2 + 0.04, wy, wz);
          builder.pushMatrix(p2);
          buildWindowStyle(builder, family);
          builder.popMatrix();
        }
      }
    }
  }
}

function buildWindowStyle(builder: GeometryBuilder, family: string) {
  if (family === "noble") {
    builder.addBox("wood", 0.8, 1.4, 0.08, [0, 0.2, 0]);
    builder.addPlane("glass", 0.65, 1.2, [0, 0.2, 0.02]);
  } else if (family === "craft") {
    builder.addBox("wood", 0.6, 0.5, 0.08);
    builder.addPlane("glass", 0.4, 0.3, [0, 0, 0.02]);
  } else {
    builder.addBox("wood", 0.7, 0.85, 0.08);
    builder.addPlane("glass", 0.55, 0.7, [0, 0, 0.02]);
    builder.addBox("wood", 0.26, 0.75, 0.03, [-0.42, 0, 0.03], [0, 0.35, 0]);
    builder.addBox("wood", 0.26, 0.75, 0.03, [0.42, 0, 0.03], [0, -0.35, 0]);
  }
}

function buildBalcony(builder: GeometryBuilder, family: string, w: number, d: number, floorY: number) {
  const m = new THREE.Matrix4().setPosition(0, floorY, d / 2 + 0.5);
  builder.pushMatrix(m);
  if (family === "noble") {
    builder.addBox("wall", w, 0.2, 1.2); // mapped to "wall" because stoneMat was "wall"
    builder.addBox("wall", w, 0.15, 0.15, [0, 0.45, 0.55]);
    [-w/2+0.1, 0, w/2-0.1].forEach(x => {
      builder.addCylinder("wall", 0.05, 0.05, 0.4, 8, [x, 0.25, 0.55]);
    });
  } else {
    builder.addBox("wood", w, 0.12, 1.0);
    builder.addBox("wood", 0.12, 0.8, 0.12, [-w / 2 + 0.3, -0.4, -0.2], [0.45, 0, 0]);
    builder.addBox("wood", 0.12, 0.8, 0.12, [w / 2 - 0.3, -0.4, -0.2], [0.45, 0, 0]);
    builder.addBox("wood", w, 0.08, 0.08, [0, 0.45, 0.45]);
  }
  builder.popMatrix();
}

function buildCraftProps(builder: GeometryBuilder, w: number, d: number) {
  const m = new THREE.Matrix4().setPosition(-w / 2 - 0.4, 0.4, 0);
  builder.pushMatrix(m);
  builder.addBox("wood", 0.8, 0.8, 0.8);
  builder.addCylinder("metal", 0.2, 0.2, 0.4, 8, [0, 0.6, 0]);
  builder.popMatrix();
}

function buildChimney(builder: GeometryBuilder, w: number, d: number, totalH: number) {
  const m = new THREE.Matrix4().setPosition(-w * 0.32, totalH * 0.6, d * 0.28);
  builder.pushMatrix(m);
  builder.addBox("brick", 0.7, totalH * 0.8, 0.7);
  builder.addBox("brick", 0.9, 0.15, 0.9, [0, totalH * 0.4 + 0.1, 0]);
  builder.addCylinder("brick", 0.18, 0.22, 0.35, 8, [0, totalH * 0.4 + 0.3, 0]);
  builder.popMatrix();
}

function buildShopSign(builder: GeometryBuilder, d: number) {
  const m = new THREE.Matrix4().setPosition(1.4, 2.2, d / 2 + 0.05);
  builder.pushMatrix(m);
  builder.addBox("metal", 0.05, 0.05, 0.7, [0, 0, 0.35]);
  builder.addBox("metal", 0.04, 0.5, 0.04, [0, -0.2, 0.2], [0.6, 0, 0]);
  builder.addBox("wood", 0.06, 0.5, 0.5, [0, -0.3, 0.55]);
  builder.addCylinder("shopSignGold", 0.16, 0.16, 0.02, 8, [0.04, -0.3, 0.55], [0, 0, Math.PI / 2]); 
  builder.popMatrix();
}

export function NightLightingUpdater() {
  const timeOfDay = useWorldStore(s => s.timeOfDay);
  const isNight = timeOfDay >= 18 || timeOfDay <= 6;
  const cachedMats = useMemo(() => getAllDistrictMaterials(), []);
  useFrame(() => {
    const target = isNight ? 1 : 0;
    for (const mat of cachedMats) {
      if (mat.glass) {
        if (!mat.glass.userData.baseEmissive) {
           mat.glass.userData.baseEmissive = mat.glass.color.clone();
        }
        mat.glass.emissive.copy(mat.glass.userData.baseEmissive).multiplyScalar(0.8);
        mat.glass.emissiveIntensity = THREE.MathUtils.lerp(
          mat.glass.emissiveIntensity,
          target,
          0.05
        );
      }
    }
  });
  return null;
}
