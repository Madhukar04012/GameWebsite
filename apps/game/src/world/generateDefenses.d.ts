export type DefenseKind = "wall" | "foundation" | "merlon" | "tower_round" | "tower_square" | "gate" | "portcullis" | "door_left" | "door_right" | "torch" | "banner" | "stairs";
export interface DefenseItem {
    id: string;
    kind: DefenseKind;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    variant?: string;
}
export declare function generateDefenses(): DefenseItem[];
//# sourceMappingURL=generateDefenses.d.ts.map