import { CITY_BOUNDS, WORLD_BOUNDS } from "@legend/shared";
import { heightAt } from "@legend/engine";
export function generateDefenses() {
    const items = [];
    const minX = CITY_BOUNDS.minX;
    const maxX = CITY_BOUNDS.maxX;
    const minZ = CITY_BOUNDS.minZ;
    const maxZ = CITY_BOUNDS.maxZ;
    const WALL_H = WORLD_BOUNDS.wallHeight; // 9
    const WALL_T = 1.6;
    // Track gate locations to avoid rendering walls over them
    const gateZones = [];
    const addTower = (x, z, h, rotY, kind, variant = "") => {
        const y = heightAt(x, z);
        items.push({
            id: `tower-${x}-${z}`,
            kind,
            position: [x, y + h / 2, z],
            rotation: [0, rotY, 0],
            scale: [kind === "tower_round" ? 3.5 : 4, h, kind === "tower_round" ? 3.5 : 4],
            variant,
        });
        // Foundation
        items.push({
            id: `tower-fnd-${x}-${z}`,
            kind: "foundation",
            position: [x, y - 2, z],
            rotation: [0, rotY, 0],
            scale: [kind === "tower_round" ? 4 : 4.5, 6, kind === "tower_round" ? 4 : 4.5],
            variant: "dark",
        });
        // Roof/top (could be a variant)
    };
    const addGate = (x, z, dir, isMain = false) => {
        const y = heightAt(x, z);
        const rotY = dir === "N" || dir === "S" ? 0 : Math.PI / 2;
        const gap = isMain ? 10 : 8;
        const h = isMain ? 20 : 16;
        const towerH = isMain ? 24 : 20;
        gateZones.push({ x, z, radius: gap / 2 + 3 });
        // Main Gatehouse Body
        items.push({
            id: `gate-${x}-${z}`,
            kind: "gate",
            position: [x, y + h / 2, z],
            rotation: [0, rotY, 0],
            scale: [gap + 4, h, 8],
            variant: dir,
        });
        // Foundation for Gatehouse
        items.push({
            id: `gate-fnd-${x}-${z}`,
            kind: "foundation",
            position: [x, y - 2, z],
            rotation: [0, rotY, 0],
            scale: [gap + 4.2, 6, 8.2],
            variant: "dark",
        });
        // Flanking towers
        const dx = dir === "N" || dir === "S" ? gap / 2 + 2 : 0;
        const dz = dir === "E" || dir === "W" ? gap / 2 + 2 : 0;
        addTower(x - dx, z - dz, towerH, rotY, isMain ? "tower_square" : "tower_round", "gate");
        addTower(x + dx, z + dz, towerH, rotY, isMain ? "tower_square" : "tower_round", "gate");
        // Portcullis
        items.push({
            id: `portcullis-${x}-${z}`,
            kind: "portcullis",
            position: [x, y + gap / 2, z],
            rotation: [0, rotY, 0],
            scale: [gap, gap, 0.2],
        });
        // Doors
        const doorW = gap / 2;
        const ddx = dir === "N" || dir === "S" ? doorW / 2 : 0;
        const ddz = dir === "E" || dir === "W" ? doorW / 2 : 0;
        items.push({
            id: `door-L-${x}-${z}`,
            kind: "door_left",
            position: [x - ddx, y + gap / 2, z - ddz],
            rotation: [0, rotY, 0],
            scale: [doorW, gap, 0.4],
        });
        items.push({
            id: `door-R-${x}-${z}`,
            kind: "door_right",
            position: [x + ddx, y + gap / 2, z + ddz],
            rotation: [0, rotY, 0],
            scale: [doorW, gap, 0.4],
        });
        // Torches
        const tdx = dir === "N" || dir === "S" ? gap / 2 + 1 : 0;
        const tdz = dir === "E" || dir === "W" ? gap / 2 + 1 : 0;
        const zoff = dir === "N" || dir === "S" ? 4.2 : 4.2;
        // Front torches
        items.push({
            id: `torch-L1-${x}-${z}`,
            kind: "torch",
            position: [x - tdx, y + 4, dir === "S" ? z - zoff : z + (dir === "N" ? zoff : 0)],
            rotation: [0, rotY, 0],
            scale: [1, 1, 1],
        });
        items.push({
            id: `torch-R1-${x}-${z}`,
            kind: "torch",
            position: [x + tdx, y + 4, dir === "S" ? z - zoff : z + (dir === "N" ? zoff : 0)],
            rotation: [0, rotY, 0],
            scale: [1, 1, 1],
        });
    };
    // 1. Place Gates
    addGate(0, minZ, "N"); // North Gate (actually -46 is North in game coordinates if z=-46 is North, wait let's check ROADS)
    // According to ROADS: "South Gate z=-46 -> North Gate z=46". Wait! South is z=-46? Usually +z is South in Three.js.
    // In `constants/index.ts`: "Imperial High Avenue (South Gate z=-46 -> North Gate z=+46)". Okay, South is -z, North is +z.
    addGate(0, minZ, "S", true); // South Gate (Main)
    addGate(0, maxZ, "N"); // North Gate
    addGate(maxX, -4, "E"); // East Gate
    addGate(minX, -4, "W"); // West Gate
    // 2. Place Corner Towers
    addTower(minX, minZ, 22, 0, "tower_round", "corner");
    addTower(maxX, minZ, 22, 0, "tower_round", "corner");
    addTower(minX, maxZ, 22, 0, "tower_round", "corner");
    addTower(maxX, maxZ, 22, 0, "tower_round", "corner");
    // 3. Build Walls
    const buildWallSegment = (sx, sz, ex, ez) => {
        const dx = ex - sx;
        const dz = ez - sz;
        const dist = Math.hypot(dx, dz);
        const segLen = 4; // 4m segments to adapt to terrain
        const numSegs = Math.ceil(dist / segLen);
        for (let i = 0; i < numSegs; i++) {
            const t0 = i / numSegs;
            const t1 = (i + 1) / numSegs;
            const cx = sx + dx * (t0 + t1) / 2;
            const cz = sz + dz * (t0 + t1) / 2;
            const actLen = dist / numSegs;
            // Check if near gates or corner towers to leave gaps
            let skip = false;
            for (const gz of gateZones) {
                if (Math.hypot(cx - gz.x, cz - gz.z) < gz.radius)
                    skip = true;
            }
            // Corner tower gaps
            if (Math.hypot(cx - minX, cz - minZ) < 3)
                skip = true;
            if (Math.hypot(cx - maxX, cz - minZ) < 3)
                skip = true;
            if (Math.hypot(cx - minX, cz - maxZ) < 3)
                skip = true;
            if (Math.hypot(cx - maxX, cz - maxZ) < 3)
                skip = true;
            if (!skip) {
                const cy = heightAt(cx, cz);
                const rotY = Math.atan2(dx, dz) + Math.PI / 2;
                // Wall body
                items.push({
                    id: `wall-${cx.toFixed(1)}-${cz.toFixed(1)}`,
                    kind: "wall",
                    position: [cx, cy + WALL_H / 2, cz],
                    rotation: [0, rotY, 0],
                    scale: [actLen + 0.1, WALL_H, WALL_T],
                });
                // Foundation
                items.push({
                    id: `wall-fnd-${cx.toFixed(1)}-${cz.toFixed(1)}`,
                    kind: "foundation",
                    position: [cx, cy - 2, cz],
                    rotation: [0, rotY, 0],
                    scale: [actLen + 0.1, 4.5, WALL_T + 0.6],
                });
                // Merlons
                items.push({
                    id: `merlon1-${cx.toFixed(1)}-${cz.toFixed(1)}`,
                    kind: "merlon",
                    position: [
                        cx + (dx / dist) * actLen * 0.25,
                        cy + WALL_H + 0.5,
                        cz + (dz / dist) * actLen * 0.25,
                    ],
                    rotation: [0, rotY, 0],
                    scale: [actLen * 0.4, 1.2, WALL_T + 0.2],
                });
                items.push({
                    id: `merlon2-${cx.toFixed(1)}-${cz.toFixed(1)}`,
                    kind: "merlon",
                    position: [
                        cx - (dx / dist) * actLen * 0.25,
                        cy + WALL_H + 0.5,
                        cz - (dz / dist) * actLen * 0.25,
                    ],
                    rotation: [0, rotY, 0],
                    scale: [actLen * 0.4, 1.2, WALL_T + 0.2],
                });
                // Add occasional intermediate watchtower
                // (If it's the middle of a long segment, roughly every 24m)
                if (i % 6 === 3 && actLen * 6 > 20) {
                    addTower(cx, cz, WALL_H + 6, rotY, "tower_square", "watch");
                }
            }
        }
    };
    buildWallSegment(minX, minZ, maxX, minZ); // North edge
    buildWallSegment(maxX, minZ, maxX, maxZ); // East edge
    buildWallSegment(maxX, maxZ, minX, maxZ); // South edge
    buildWallSegment(minX, maxZ, minX, minZ); // West edge
    return items;
}
//# sourceMappingURL=generateDefenses.js.map