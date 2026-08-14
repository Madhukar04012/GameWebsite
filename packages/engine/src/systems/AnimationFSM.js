/**
 * Animation state machine for player character.
 *
 * Determines which animation to play based on movement state.
 */
export function resolveAnimation(ctx) {
    if (!ctx.isGrounded) {
        return ctx.wantsJump ? "jump" : "fall";
    }
    if (!ctx.isMoving)
        return "idle";
    return ctx.isSprinting ? "run" : "walk";
}
//# sourceMappingURL=AnimationFSM.js.map