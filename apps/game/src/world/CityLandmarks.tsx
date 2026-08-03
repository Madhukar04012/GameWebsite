import { useMemo, useRef } from "react";
import { Instances, Instance, Sparkles, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group, Mesh, Vector3 } from "three";
import { heightAt } from "@legend/engine";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createWoodMaterial } from "../materials/createWoodMaterial";

const stone = createStoneMaterial({ stoneColor: "#d8cab6", roughness: 0.86, seed: [12, 4] });
const darkStone = createStoneMaterial({ stoneColor: "#4a4652", roughness: 0.92, seed: [2, 9] });
const wood = createWoodMaterial({ woodColor: "#4a2e1c", roughness: 0.9 });

/**
 * CityLandmarks gives Capital Kingdom screenshot-recognizable silhouettes:
 * Sunwell fountain, Oathkeeper statue, Heartwood tree, Guild monument and
 * gold-banner watchtowers. These are intentional points of interest, not props.
 */
export function CityLandmarks() {
  return (
    <group>
      <SunwellFountain position={[0, heightAt(0, -4), -4]} />
      <OathkeeperStatue position={[0, heightAt(0, -22), -22]} />
      <HeartwoodTree position={[-25, heightAt(-25, 12), 12]} />
      <GuildMonument position={[-32, heightAt(-32, -4), -4]} />
      <Watchtowers />
    </group>
  );
}

function SunwellFountain({ position }: { position: [number, number, number] }) {
  const water = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (water.current) water.current.rotation.y = clock.elapsedTime * 0.3;
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow material={stone}>
        <cylinderGeometry args={[4.2, 4.6, 0.5, 32]} />
      </mesh>
      <mesh position={[0, 0.54, 0]} ref={water}>
        <cylinderGeometry args={[3.65, 3.65, 0.07, 32]} />
        <meshStandardMaterial color="#257da7" emissive="#5daeff" emissiveIntensity={0.35} metalness={0.55} roughness={0.18} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow material={stone}>
        <cylinderGeometry args={[0.7, 1.05, 2.1, 12]} />
      </mesh>
      <mesh position={[0, 2.8, 0]} castShadow>
        <sphereGeometry args={[0.48, 12, 12]} />
        <meshStandardMaterial color="#d4af37" metalness={0.75} roughness={0.25} emissive="#d4af37" emissiveIntensity={0.6} />
      </mesh>
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((r) => (
        <mesh key={r} position={[Math.sin(r) * 1.6, 2.1, Math.cos(r) * 1.6]} rotation={[0, r, 0]}>
          <coneGeometry args={[0.1, 1.8, 6]} />
          <meshBasicMaterial color="#8ed8ff" transparent opacity={0.55} />
        </mesh>
      ))}
      <Sparkles count={24} scale={[7, 4, 7]} size={3} speed={0.45} color="#d4af37" />
      <Text position={[0, 4.2, 0]} fontSize={0.42} color="#d4af37" anchorX="center">THE SUNWELL</Text>
    </group>
  );
}

function OathkeeperStatue({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]} castShadow material={darkStone}><cylinderGeometry args={[1.6, 2, 1.2, 8]} /></mesh>
      <mesh position={[0, 3.1, 0]} castShadow material={stone}><cylinderGeometry args={[0.7, 0.9, 4, 8]} /></mesh>
      <mesh position={[0, 5.35, 0]} castShadow material={stone}><sphereGeometry args={[0.85, 12, 8]} /></mesh>
      <mesh position={[0.8, 3.8, 0]} rotation={[0, 0, -0.25]} castShadow material={stone}><boxGeometry args={[0.35, 3.8, 0.35]} /></mesh>
      <mesh position={[1.3, 5.55, 0]} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[1.5, 0.12, 0.12]} /><meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.8} /></mesh>
    </group>
  );
}

function HeartwoodTree({ position }: { position: [number, number, number] }) {
  const leaves = useMemo(() => Array.from({ length: 34 }, (_, i) => {
    const angle = i * 2.399;
    const radius = 1.2 + (i % 5) * 0.35;
    return { x: Math.cos(angle) * radius, y: 4.5 + (i % 6) * 0.45, z: Math.sin(angle) * radius, s: 0.7 + (i % 3) * 0.22 };
  }), []);
  return (
    <group position={position}>
      <mesh position={[0, 3, 0]} castShadow material={wood}><cylinderGeometry args={[0.5, 0.78, 6, 8]} /></mesh>
      {leaves.map((leaf, i) => <mesh key={i} position={[leaf.x, leaf.y, leaf.z]} scale={leaf.s} castShadow><dodecahedronGeometry args={[1, 0]} /><meshStandardMaterial color="#4d7e45" emissive="#234d35" emissiveIntensity={0.25} flatShading /></mesh>)}
      <Sparkles count={18} scale={[6, 8, 6]} size={2.5} speed={0.25} color="#d4af37" />
    </group>
  );
}

function GuildMonument({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow material={darkStone}><cylinderGeometry args={[1.8, 2.2, 1, 6]} /></mesh>
      <mesh position={[0, 3, 0]} castShadow material={stone}><boxGeometry args={[1.25, 4.2, 1.25]} /></mesh>
      <mesh position={[0, 3.2, 0.66]}><circleGeometry args={[0.45, 16]} /><meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={1.2} /></mesh>
    </group>
  );
}

function Watchtowers() {
  const towers: [number, number][] = [[-42, -42], [42, -42], [-42, 42], [42, 42]];
  return <>{towers.map(([x, z]) => <Watchtower key={`${x}-${z}`} position={[x, heightAt(x, z), z]} />)}</>;
}

function Watchtower({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 7, 0]} castShadow receiveShadow material={darkStone}><cylinderGeometry args={[2.5, 3, 14, 8]} /></mesh>
      <mesh position={[0, 14.8, 0]} castShadow><coneGeometry args={[3.4, 3.2, 8]} /><meshStandardMaterial color="#7c3030" roughness={0.7} /></mesh>
      <Banner position={[0, 11, 2.55]} />
    </group>
  );
}

function Banner({ position }: { position: [number, number, number] }) {
  return <mesh position={position}><planeGeometry args={[2.2, 3]} /><meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.25} side={2} /></mesh>;
}
