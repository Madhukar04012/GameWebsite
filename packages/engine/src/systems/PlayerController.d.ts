export interface InputState {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
    sprint: boolean;
}
export interface PlayerState {
    position: {
        x: number;
        y: number;
        z: number;
    };
    velocity: {
        x: number;
        y: number;
        z: number;
    };
    rotation: number;
    isGrounded: boolean;
    isMoving: boolean;
    isSprinting: boolean;
    wantsJump: boolean;
}
export declare function createInitialPlayerState(): PlayerState;
/**
 * Pure function: updates player state from input + delta time.
 * No side effects, no React dependency.
 */
export declare function updatePlayer(prev: PlayerState, input: InputState, dt: number, cameraYaw: number): PlayerState;
//# sourceMappingURL=PlayerController.d.ts.map