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
export declare function generateCityDressing(): CityDressing;
//# sourceMappingURL=generateCityDressing.d.ts.map