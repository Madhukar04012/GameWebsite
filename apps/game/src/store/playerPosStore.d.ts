/**
 * Lightweight player position store — lets monsters/systems read
 * player pos without coupling to R3F context or game store.
 */
export type Pos2D = {
    x: number;
    z: number;
};
export declare const playerPos: {
    get(): Pos2D;
    set(pos: Pos2D): void;
    subscribe(fn: (pos: Pos2D) => void): () => boolean;
};
//# sourceMappingURL=playerPosStore.d.ts.map