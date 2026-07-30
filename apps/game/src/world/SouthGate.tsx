import { Text } from "@react-three/drei";
import { SOUTH_GATE_POSITION } from "@legend/shared";
import { createStoneMaterial } from "../materials/createStoneMaterial";

const gateStoneMat = createStoneMaterial({ stoneColor: 0xd8cab6, roughness: 0.92, seed: [9.1, 3.3] });

/**
 * South Gate — visual only, no physics.
 */
export function SouthGate() {
  return (
    <group position={[SOUTH_GATE_POSITION.x, 0, SOUTH_GATE_POSITION.z]}>
      <mesh position={[-1.5, 2.5, 0]} castShadow material={gateStoneMat}>
        <boxGeometry args={[0.6, 5, 0.6]} />
      </mesh>
      <mesh position={[1.5, 2.5, 0]} castShadow material={gateStoneMat}>
        <boxGeometry args={[0.6, 5, 0.6]} />
      </mesh>
      <mesh position={[0, 5, 0]} castShadow material={gateStoneMat}>
        <boxGeometry args={[3.6, 0.4, 0.6]} />
      </mesh>
      <mesh position={[0, 4.5, 0.4]}>
        <planeGeometry args={[1.5, 0.8]} />
        <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.4} />
      </mesh>
      <Text position={[0, 6, 0]} fontSize={0.6} color="#d4af37" anchorX="center" anchorY="middle">
        South Gate
      </Text>
    </group>
  );
}
