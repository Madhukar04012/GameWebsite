export declare class PRNG {
    private seed;
    constructor(seed: number | string);
    private hashString;
    next(): number;
    nextInt(min: number, max: number): number;
    pick<T>(array: T[]): T;
}
export declare function generateDeterministicName(seedStr: string): string;
//# sourceMappingURL=nameGenerator.d.ts.map