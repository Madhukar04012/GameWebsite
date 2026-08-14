import { PLAYER } from "@legend/shared";
export function createInitialPlayerState() {
    return {
        position: { x: 0, y: 0, z: 0 },
        velocity: { x: 0, y: 0, z: 0 },
        rotation: 0,
        isGrounded: true,
        isMoving: false,
        isSprinting: false,
        wantsJump: false,
    };
}
/**
 * Pure function: updates player state from input + delta time.
 * No side effects, no React dependency.
 */
export function updatePlayer(prev, input, dt, cameraYaw) {
    const speed = input.sprint ? PLAYER.runSpeed : PLAYER.walkSpeed;
    const isMoving = input.forward || input.backward || input.left || input.right;
    // Movement direction relative to camera
    const moveDir = getMoveDirection(input, cameraYaw);
    // Horizontal velocity
    const vx = moveDir.x * speed;
    const vz = moveDir.z * speed;
    // Gravity
    let vy = prev.velocity.y;
    if (!prev.isGrounded) {
        vy -= 9.81 * dt; // gravity
    }
    // Jump
    let wantsJump = false;
    if (input.jump && prev.isGrounded) {
        vy = PLAYER.jumpForce;
        wantsJump = true;
    }
    // Ground clamp
    const newY = prev.position.y + vy * dt;
    const isGrounded = newY <= 0 && vy <= 0;
    const clampedY = isGrounded ? 0 : newY;
    if (isGrounded && vy < 0)
        vy = 0;
    // Update position
    const position = {
        x: prev.position.x + vx * dt,
        y: clampedY,
        z: prev.position.z + vz * dt,
    };
    // Rotation: face movement direction
    let rotation = prev.rotation;
    if (isMoving) {
        rotation = Math.atan2(vx, vz);
    }
    return {
        position,
        velocity: { x: vx, y: vy, z: vz },
        rotation,
        isGrounded,
        isMoving,
        isSprinting: input.sprint && isMoving,
        wantsJump,
    };
}
/**
 * Convert WASD input + camera yaw into world-space movement direction.
 *
 * Camera sits behind the player at yaw angle. The camera-to-player vector
 * points toward -sin(yaw), -cos(yaw) on the XZ plane, so "forward" (W)
 * moves the player *away* from the camera — into the scene.
 */
function getMoveDirection(input, cameraYaw) {
    let forward = 0;
    let right = 0;
    if (input.forward)
        forward += 1;
    if (input.backward)
        forward -= 1;
    if (input.right)
        right += 1;
    if (input.left)
        right -= 1;
    // Normalize diagonal
    const len = Math.sqrt(forward * forward + right * right);
    if (len > 0) {
        forward /= len;
        right /= len;
    }
    // Camera forward (into scene) = away from camera = -sin(yaw), -cos(yaw).
    // Camera right = perpendicular: cos(yaw), -sin(yaw).
    const sin = Math.sin(cameraYaw);
    const cos = Math.cos(cameraYaw);
    return {
        x: right * cos - forward * sin,
        z: -right * sin - forward * cos,
    };
}
//# sourceMappingURL=PlayerController.js.map