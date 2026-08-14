/**
 * Animation state machine for player character.
 *
 * Determines which animation to play based on movement state.
 */
export type AnimationState = "idle" | "walk" | "run" | "jump" | "fall";
export interface AnimationContext {
    isMoving: boolean;
    isSprinting: boolean;
    isGrounded: boolean;
    wantsJump: boolean;
}
export declare function resolveAnimation(ctx: AnimationContext): AnimationState;
//# sourceMappingURL=AnimationFSM.d.ts.map