import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Mesh, Group } from "three";
import { useGameStore } from "../store/gameStore";
import type { RemotePlayerData } from "@legend/engine";

/**
 * RemotePlayers — renders all other connected players from the network store.
 * Positions are updated server-side and lerped for smooth interpolation.
 */
export function RemotePlayers() {
  const remotePlayers = useGameStore((s) => s.remotePlayers);
  const list = useMemo(() => Object.values(remotePlayers), [remotePlayers]);

  return (
    <group>
      {list.map((p) => (
        <RemotePlayer key={p.id} player={p} />
      ))}
    </group>
  );
}

function RemotePlayer({ player }: { player: RemotePlayerData }) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const target = useRef(player.position);

  // Keep target in sync when server sends new position
  target.current = player.position;

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    // Lerp toward latest server position
    const lerp = 0.15;
    g.position.x += (target.current.x - g.position.x) * lerp;
    g.position.z += (target.current.z - g.position.z) * lerp;
    g.rotation.y = player.rotation;
  });

  return (
    <group ref={groupRef} position={[player.position.x, 0, player.position.z]}>
      {/* Capsule */}
      <mesh ref={meshRef} position={[0, 0.5, 0]} castShadow>
        <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
        <meshStandardMaterial color="#4a6a8a" />
      </mesh>

      {/* Nameplate */}
      <Html position={[0, 1.6, 0]} center distanceFactor={10} occlude>
        <div style={{
          background: "rgba(5,5,5,0.7)",
          color: "#d4af37",
          padding: "2px 8px",
          borderRadius: 4,
          fontSize: 12,
          fontFamily: "Inter, sans-serif",
          whiteSpace: "nowrap",
          border: "1px solid rgba(212,175,55,0.3)",
          pointerEvents: "none",
          userSelect: "none",
        }}>
          {player.name}
        </div>
      </Html>
    </group>
  );
}

/** Re-export for scene composition. */
