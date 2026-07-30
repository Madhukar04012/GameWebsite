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

export function resolveAnimation(ctx: AnimationContext): AnimationState {
  if (!ctx.isGrounded) {
    return ctx.wantsJump ? "jump" : "fall";
  }
  if (!ctx.isMoving) return "idle";
  return ctx.isSprinting ? "run" : "walk";
}
