import { PLAYER_SPAWN, SOUTH_GATE_POSITION } from "@legend/shared";

/**
 * PlayerSpawn — debug marker showing the player spawn point and the gate exit.
 * Renders a glowing ring at the spawn location and a cone at the gate.
 */
export function PlayerSpawn() {
  return (
    <group>
      {/* Spawn ring */}
      <mesh position={[PLAYER_SPAWN.x, 0.1, PLAYER_SPAWN.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.9, 24]} />
        <meshBasicMaterial color="#6a9a4a" transparent opacity={0.9} />
      </mesh>
      <mesh position={[PLAYER_SPAWN.x, 3, PLAYER_SPAWN.z]}>
        <coneGeometry args={[0.3, 6, 4]} />
        <meshBasicMaterial color="#6a9a4a" wireframe />
      </mesh>

      {/* South gate exit marker */}
      <mesh
        position={[SOUTH_GATE_POSITION.x, heightZero(), SOUTH_GATE_POSITION.z + 4]}
      >
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshBasicMaterial color="#d4af37" wireframe />
      </mesh>
    </group>
  );
}

function heightZero() {
  return 0.1;
}
