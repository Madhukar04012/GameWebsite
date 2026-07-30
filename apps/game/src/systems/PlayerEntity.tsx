
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { useInputManager } from "./InputManager";
import {
  createInitialPlayerState,
  updatePlayer,
  createDefaultCamera,
  heightAt,
} from "@legend/engine";
import type { PlayerState } from "@legend/engine";
import { playerPos } from "../store/playerPosStore";
import { getSocket } from "./NetworkClient";

const NET_TICK = 0.05; // 20 Hz movement sync

export interface PlayerAPI {
  position: PlayerState["position"];
  state: PlayerState;
  cameraYaw: number;
  setCameraYaw: (yaw: number) => void;
}

interface PlayerEntityProps {
  apiRef: React.RefObject<PlayerAPI | null>;
}

export function PlayerEntity({ apiRef }: PlayerEntityProps) {
  const meshRef = useRef<Mesh>(null);
  const stateRef = useRef(createInitialPlayerState());
  const inputRef = useInputManager();
  const cameraRef = useRef(createDefaultCamera());
  const playerPosRef = useRef({ x: 0, y: 0, z: 0 });
  const netAcc = useRef(0);

  // Expose API for camera to consume
  useEffect(() => {
    if (apiRef) {
      apiRef.current = {
        get position() { return playerPosRef.current; },
        get state() { return stateRef.current; },
        get cameraYaw() { return cameraRef.current.yaw; },
        setCameraYaw(yaw: number) { cameraRef.current.yaw = yaw; },
      };
    }
  }, [apiRef]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const state = updatePlayer(stateRef.current, inputRef.current, dt, cameraRef.current.yaw);
    // Ground clamp: rest player y on the terrain height (no physics system yet).
    const groundY = heightAt(state.position.x, state.position.z);
    state.position.y = state.position.y < groundY ? groundY : state.position.y;
    if (state.position.y === groundY) state.isGrounded = true;
    stateRef.current = state;
    playerPosRef.current = state.position;

    // Publish position for monsters/AI
    playerPos.set({ x: state.position.x, z: state.position.z });

    // Sync movement to server at NET_TICK interval
    netAcc.current += dt;
    if (netAcc.current >= NET_TICK) {
      netAcc.current = 0;
      const socket = getSocket();
      if (socket?.connected) {
        socket.emit("player:move", {
          position: state.position,
          rotation: state.rotation,
        });
      }
    }

    if (meshRef.current) {
      meshRef.current.position.set(state.position.x, state.position.y + 0.5, state.position.z);
      meshRef.current.rotation.y = state.rotation;
    }
  });

  return (
    <group>
      {/* Player capsule — worn gold armor with glowing rune accents */}
      <mesh ref={meshRef} castShadow>
        <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
        <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.4} emissive="#f3c649" emissiveIntensity={0.3} />
      </mesh>
      {/* Shadow circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.4, 16]} />
        <meshStandardMaterial color="#333" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
