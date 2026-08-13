import { CITY_LAYOUT, ROADS, RoadSegment, DistrictDef, BuildingDef } from "@legend/shared";
import { generateBlockLayout } from "./CityBlock";

export interface PropSpot {
  x: number;
  z: number;
  rot?: number;
}

export interface CityDressing {
  barrels: PropSpot[];
  crates: PropSpot[];
  streetLamps: PropSpot[];
  ornateLamps: PropSpot[];
  planters: PropSpot[];
  benches: PropSpot[];
  marketStalls: PropSpot[];
  anvils: PropSpot[];
  weaponRacks: PropSpot[];
  trainingDummies: PropSpot[];
  archeryTargets: PropSpot[];
  cargoPallets: PropSpot[];
  merchantCarts: PropSpot[];
  noticeBoards: PropSpot[];
  wishingWells: PropSpot[];
  flowerBoxes: PropSpot[];
  fountains: PropSpot[];
  statues: PropSpot[];
  hedges: PropSpot[];
  woodPiles: PropSpot[];
  laundry: PropSpot[];
}

function rand(seed: number): number {
  const s = Math.sin(seed * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

function getPointAlongLine(from: {x: number, z: number}, to: {x: number, z: number}, t: number) {
  return {
    x: from.x + (to.x - from.x) * t,
    z: from.z + (to.z - from.z) * t,
  };
}

export function generateCityDressing(): CityDressing {
  const dressing: CityDressing = {
    barrels: [],
    crates: [],
    streetLamps: [],
    ornateLamps: [],
    planters: [],
    benches: [],
    marketStalls: [],
    anvils: [],
    weaponRacks: [],
    trainingDummies: [],
    archeryTargets: [],
    cargoPallets: [],
    merchantCarts: [],
    noticeBoards: [],
    wishingWells: [],
    flowerBoxes: [],
    fountains: [],
    statues: [],
    hedges: [],
    woodPiles: [],
    laundry: [],
  };

  // 1. Street Hierarchy Dressing
  ROADS.forEach((road, i) => {
    const dx = road.to.x - road.from.x;
    const dz = road.to.z - road.from.z;
    const length = Math.sqrt(dx * dx + dz * dz);
    const angle = Math.atan2(dx, dz);
    const spacing = 12; // Every 12 units along the road

    for (let dist = spacing / 2; dist < length; dist += spacing) {
      const t = dist / length;
      const pt = getPointAlongLine(road.from, road.to, t);
      
      const nx = Math.cos(angle);
      const nz = -Math.sin(angle);
      
      const offset = road.width / 2 + 0.4;
      
      const leftSpot = { x: pt.x + nx * offset, z: pt.z + nz * offset, rot: angle };
      const rightSpot = { x: pt.x - nx * offset, z: pt.z - nz * offset, rot: angle + Math.PI };

      if (road.type === "main" || road.type === "plaza") {
        dressing.ornateLamps.push(leftSpot, rightSpot);
        if (rand(dist * i) > 0.5) {
          dressing.planters.push(
            { x: pt.x + nx * (offset + 1), z: pt.z + nz * (offset + 1), rot: angle },
            { x: pt.x - nx * (offset + 1), z: pt.z - nz * (offset + 1), rot: angle }
          );
        }
        if (rand(dist * i + 1) > 0.7) {
          dressing.benches.push(
            { x: pt.x + nx * (offset + 0.5), z: pt.z + nz * (offset + 0.5), rot: angle - Math.PI / 2 },
            { x: pt.x - nx * (offset + 0.5), z: pt.z - nz * (offset + 0.5), rot: angle + Math.PI / 2 }
          );
        }
      } else if (road.type === "district") {
        dressing.streetLamps.push(leftSpot, rightSpot);
        if (rand(dist * i) > 0.8) {
          dressing.benches.push(
            { x: pt.x + nx * offset, z: pt.z + nz * offset, rot: angle - Math.PI / 2 }
          );
        }
      } else {
        // Dirt / Alleys
        if (rand(dist * i) > 0.7) dressing.barrels.push(leftSpot);
        if (rand(dist * i + 1) > 0.7) dressing.crates.push(rightSpot);
      }
    }
  });

  // 2. Building Context Dressing
  CITY_LAYOUT.forEach(district => {
    // Process manually defined buildings
    district.buildings.forEach((bldg, i) => {
      processBuildingDressing(bldg, district, i, dressing);
    });

    // Process procedural blocks
    district.blocks?.forEach((block) => {
      const layout = generateBlockLayout(block, district.name);
      layout.bldgs.forEach((bldg, i) => {
        processBuildingDressing(bldg, district, block.seed + i, dressing);
      });
      // Courtyard props
      layout.props.forEach((prop, i) => {
        if (prop.type === "barrel") dressing.barrels.push({ x: prop.x, z: prop.z, rot: rand(block.seed + i) * Math.PI * 2 });
        else if (prop.type === "crate") dressing.crates.push({ x: prop.x, z: prop.z, rot: rand(block.seed + i) * Math.PI * 2 });
      });
    });
  });

  // Specific district dressing overrides
  CITY_LAYOUT.forEach(district => {
    if (district.name === "harbor") {
      for (let i = 0; i < 30; i++) {
        dressing.cargoPallets.push({
          x: district.center.x + (rand(i) - 0.5) * district.radius * 1.5,
          z: district.center.z + (rand(i + 100) - 0.5) * district.radius * 1.5,
          rot: rand(i + 200) * Math.PI * 2
        });
      }
    }
    if (district.name === "central_plaza") {
      dressing.fountains.push({ x: district.center.x, z: district.center.z, rot: 0 });
      dressing.noticeBoards.push({ x: district.center.x - 4, z: district.center.z - 4, rot: Math.PI / 4 });
    }
    if (district.name === "training") {
      for (let i = 0; i < 5; i++) {
        dressing.trainingDummies.push({ x: district.center.x - 4 + i * 2, z: district.center.z, rot: 0 });
        dressing.archeryTargets.push({ x: district.center.x + 4, z: district.center.z - 4 + i * 2, rot: Math.PI / 2 });
      }
    }
    if (district.name === "guild_hall") {
      dressing.noticeBoards.push({ x: district.center.x + 4, z: district.center.z, rot: -Math.PI / 4 });
    }
  });

  return dressing;
}

function processBuildingDressing(bldg: BuildingDef, district: DistrictDef, seed: number, dressing: CityDressing) {
  const rx = rand(seed);
  const frontX = bldg.x;
  const frontZ = bldg.z + bldg.d / 2 + 0.6; // Assuming door is at +z
  const frontRot = 0;

  // By Family
  if (bldg.family === "commercial") {
    if (rx > 0.4) dressing.marketStalls.push({ x: frontX, z: frontZ, rot: frontRot });
    if (rx > 0.8) dressing.merchantCarts.push({ x: frontX + 2, z: frontZ + 1, rot: frontRot + 0.2 });
    if (rx > 0.6) {
      dressing.crates.push({ x: frontX - 1.5, z: frontZ, rot: frontRot });
      dressing.barrels.push({ x: frontX - 1.5, z: frontZ + 0.8, rot: frontRot });
    }
  } 
  else if (bldg.family === "craft") {
    if (rx > 0.5) dressing.anvils.push({ x: frontX - 1.5, z: frontZ, rot: frontRot });
    if (rx > 0.3) dressing.woodPiles.push({ x: frontX + 1.5, z: frontZ, rot: frontRot });
    if (rx > 0.7) dressing.weaponRacks.push({ x: frontX, z: frontZ + 1, rot: frontRot });
  }
  else if (bldg.family === "noble" || bldg.family === "civic") {
    if (rx > 0.3) {
      dressing.planters.push({ x: frontX - 1.5, z: frontZ, rot: frontRot });
      dressing.planters.push({ x: frontX + 1.5, z: frontZ, rot: frontRot });
    }
    if (rx > 0.7) dressing.statues.push({ x: frontX, z: frontZ + 2, rot: frontRot });
    if (rx > 0.5) dressing.hedges.push({ x: frontX - 2.5, z: frontZ, rot: frontRot });
  }
  else { // residential
    if (rx > 0.5) dressing.flowerBoxes.push({ x: frontX, z: frontZ - 0.5, rot: frontRot });
    if (rx > 0.7) dressing.laundry.push({ x: bldg.x - bldg.w / 2 - 0.5, z: bldg.z, rot: Math.PI / 2 });
    if (rx > 0.8) dressing.wishingWells.push({ x: bldg.x + bldg.w / 2 + 1, z: bldg.z, rot: 0 });
    if (rx > 0.6) dressing.woodPiles.push({ x: frontX + 1, z: frontZ, rot: frontRot });
  }
}
