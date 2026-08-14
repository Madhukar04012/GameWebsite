import type { MonsterData } from "@legend/engine";
interface MonsterEntityProps {
    data: MonsterData;
    onDeath?: (id: string) => void;
}
export declare function MonsterEntity({ data, onDeath }: MonsterEntityProps): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=MonsterEntity.d.ts.map