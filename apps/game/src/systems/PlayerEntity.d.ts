import type { PlayerState } from "@legend/engine";
export interface PlayerAPI {
    position: PlayerState["position"];
    state: PlayerState;
    cameraYaw: number;
    setCameraYaw: (yaw: number) => void;
}
interface PlayerEntityProps {
    apiRef: React.RefObject<PlayerAPI | null>;
}
export declare function PlayerEntity({ apiRef }: PlayerEntityProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=PlayerEntity.d.ts.map