import { useMemo, useRef } from "react";
import { Instances, Instance, Sparkles, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group, Mesh, Vector3 } from "three";
import { heightAt } from "@legend/engine";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createWoodMaterial } from "../materials/createWoodMaterial";
import { createMetalMaterial } from "../materials/createMetalMaterial";
import { createGlassMaterial } from "../materials/createGlassMaterial";
import { createFabricMaterial } from "../materials/createFabricMaterial";

const stone = createStoneMaterial({ stoneColor: "#d8cab6", roughness: 0.86, seed: [12, 4] });
const darkStone = createStoneMaterial({ stoneColor: "#4a4652", roughness: 0.92, seed: [2, 9] });
const wood = createWoodMaterial({ woodColor: "#4a2e1c", roughness: 0.9 });
const gold = createMetalMaterial({ kind: "gold", seed: [90, 1] });
const silver = createMetalMaterial({ kind: "silver", seed: [90, 2] });
const stainedGlass = createGlassMaterial({ kind: "stained", color: 0x8844aa, opacity: 0.8, seed: [90, 3] });
const bannerCloth = createFabricMaterial({ kind: "banner", color: "#d4af37", seed: [90, 4] });

/**
 * CityLandmarks — hero silhouettes for screenshot recognition.
 * Sunwell fountain, Oathkeeper statue, Heartwood tree, Guild monument,
 * Royal arch, and gold-banner watchtowers.
 */
export function CityLandmarks() {
  return (
    <group>
      <SunwellFountain position={[0, heightAt(0, -4), -4]} />
      <OathkeeperStatue position={[0, heightAt(0, -22), -22]} />
      <HeartwoodTree position={[-25, heightAt(-25, 12), 12]} />
      <GuildMonument position={[-32, heightAt(-32, -4), -4]} />
      <RoyalArch position={[0, heightAt(0, -18), -18]} />
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
      {/* Basin */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow material={stone}>
        <cylinderGeometry args={[4.2, 4.6, 0.5, 32]} />
      </mesh>
      {/* Water surface — animated rotation */}
      <mesh position={[0, 0.54, 0]} ref={water}>
        <cylinderGeometry args={[3.65, 3.65, 0.07, 32]} />
        <meshStandardMaterial color="#257da7" emissive="#5daeff" emissiveIntensity={0.35} metalness={0.55} roughness={0.18} />
      </mesh>
      {/* Central column */}
      <mesh position={[0, 1.5, 0]} castShadow material={stone}>
        <cylinderGeometry args={[0.7, 1.05, 2.1, 12]} />
      </mesh>
      {/* Golden orb */}
      <mesh position={[0, 2.8, 0]} castShadow>
        <sphereGeometry args={[0.48, 12, 12]} />
        <meshStandardMaterial color="#d4af37" metalness={0.75} roughness={0.25} emissive="#d4af37" emissiveIntensity={0.6} />
      </mesh>
      {/* Water jets */}
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
      {/* Pedestal */}
      <mesh position={[0, 0.6, 0]} castShadow material={darkStone}><cylinderGeometry args={[2, 2.5, 1.5, 12]} /></mesh>
      <mesh position={[0, 1.5, 0]} castShadow material={stone}><cylinderGeometry args={[1.8, 2, 0.5, 12]} /></mesh>
      {/* Figure body */}
      <mesh position={[0, 3.2, 0]} castShadow material={stone}><cylinderGeometry args={[0.8, 1.1, 4.5, 12]} /></mesh>
      {/* Head */}
      <mesh position={[0, 5.7, 0]} castShadow material={stone}><sphereGeometry args={[0.9, 16, 10]} /></mesh>
      {/* Sword */}
      <mesh position={[1.0, 3.8, 0]} rotation={[0, 0, -0.25]} castShadow material={darkStone}><boxGeometry args={[0.4, 4.5, 0.4]} /></mesh>
      {/* Shield on back */}
      <mesh position={[-0.8, 4.5, -0.5]} rotation={[0, 0, 0.15]} castShadow material={gold}><boxGeometry args={[1.6, 2.2, 0.15]} /></mesh>
      {/* Gold sword tip */}
      <mesh position={[1.3, 6.0, 0]} rotation={[0, 0, Math.PI / 4]} castShadow><boxGeometry args={[1.5, 0.12, 0.12]} /><meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.8} /></mesh>
      {/* Inscription plaque */}
      <mesh position={[0, 0.9, 2.55]} rotation={[-0.2, 0, 0]}>
        <planeGeometry args={[1.5, 0.4]} />
        <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.4} side={2} />
      </mesh>
    </group>
  );
}

function HeartwoodTree({ position }: { position: [number, number, number] }) {
  const leaves = useMemo(() => Array.from({ length: 48 }, (_, i) => {
    const angle = i * 2.399;
    const radius = 1.5 + (i % 5) * 0.4;
    return { x: Math.cos(angle) * radius, y: 5.5 + (i % 7) * 0.5, z: Math.sin(angle) * radius, s: 0.8 + (i % 3) * 0.25 };
  }), []);
  return (
    <group position={position}>
      {/* Trunk with buttress roots */}
      <mesh position={[0, 0.6, 0]} castShadow material={wood}><cylinderGeometry args={[1.2, 1.6, 1.2, 10]} /></mesh>
      <mesh position={[0, 3.2, 0]} castShadow material={wood}><cylinderGeometry args={[0.6, 0.9, 5.5, 10]} /></mesh>
      {/* Root buttresses */}
      {[0, Math.PI/2, Math.PI, 3*Math.PI/2].map((r) => (
        <mesh key={r} position={[Math.cos(r)*0.8, 0.3, Math.sin(r)*0.8]} rotation={[0, r, 0]} castShadow material={wood}>
          <boxGeometry args={[0.8, 0.6, 0.25]} />
        </mesh>
      ))}
      {/* Canopy layers */}
      {leaves.map((leaf, i) => <mesh key={i} position={[leaf.x, leaf.y, leaf.z]} scale={leaf.s} castShadow><icosahedronGeometry args={[1.1, 1]} /><meshStandardMaterial color="#3d7e45" emissive="#1a4d25" emissiveIntensity={0.2} flatShading /></mesh>)}
      {/* Golden fruit/flowers */}
      <Sparkles count={24} scale={[7, 9, 7]} size={2.8} speed={0.22} color="#d4af37" />
    </group>
  );
}

function GuildMonument({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Stepped base */}
      <mesh position={[0, 0.5, 0]} castShadow material={darkStone}><cylinderGeometry args={[2.2, 2.8, 1.2, 8]} /></mesh>
      <mesh position={[0, 1.2, 0]} castShadow material={stone}><cylinderGeometry args={[1.8, 2.2, 0.6, 8]} /></mesh>
      {/* Obelisk shaft */}
      <mesh position={[0, 3.5, 0]} castShadow material={stone}><boxGeometry args={[1.4, 5, 1.4]} /></mesh>
      {/* Gold capstone */}
      <mesh position={[0, 6.2, 0]} castShadow material={gold}><coneGeometry args={[1.1, 1.2, 4]} /></mesh>
      {/* Guild sigil */}
      <mesh position={[0, 3.8, 0.72]}><circleGeometry args={[0.55, 16]} /><meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={1.4} /></mesh>
      {/* Bronze plaques on sides */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.72, 3.5, 0]}>
          <planeGeometry args={[0.8, 1.2]} />
          <meshStandardMaterial color="#8a5a2a" emissive="#8a5a2a" emissiveIntensity={0.2} side={2} />
        </mesh>
      ))}
    </group>
  );
}

function RoyalArch({ position }: { position: [number, number, number] }) {
  const archR = 5.5;
  const archH = 8;
  return (
    <group position={position}>
      {/* Arch piers */}
      <mesh position={[-archR, archH / 2, 0]} castShadow receiveShadow material={stone}>
        <boxGeometry args={[1.2, archH, 1.5]} />
      </mesh>
      <mesh position={[archR, archH / 2, 0]} castShadow receiveShadow material={stone}>
        <boxGeometry args={[1.2, archH, 1.5]} />
      </mesh>
      {/* Arch voussoirs — segmented arc */}
      {Array.from({ length: 11 }, (_, i) => {
        const angle = -Math.PI / 2 + (i / 10) * Math.PI;
        const x = Math.sin(angle) * archR;
        const y = archH + Math.cos(angle) * archR;
        return (
          <mesh key={i} position={[x, y, 0]} rotation={[0, 0, -angle]} castShadow material={gold}>
            <boxGeometry args={[0.4, 0.5, 1.6]} />
          </mesh>
        );
      })}
      {/* Keystone */}
      <mesh position={[0, archH + archR - 0.25, 0]} castShadow material={gold}>
        <boxGeometry args={[1.0, 0.7, 1.8]} />
      </mesh>
      {/* Statue atop arch */}
      <mesh position={[0, archH + archR + 1.2, 0]} castShadow material={stone}>
        <sphereGeometry args={[0.6, 12, 8]} />
      </mesh>
      <mesh position={[0, archH + archR + 2.0, 0]} castShadow material={gold}>
        <coneGeometry args={[0.4, 1.2, 8]} />
      </mesh>
      <Sparkles count={12} scale={[8, 3, 8]} size={3} speed={0.3} color="#d4af37" />
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

function pyramidGeometry(args: [number, number, number]) {
  // Placeholder for pyramid geometry - using cone with 4 sides
  return null as any;
}