/**
 * ExplorationLandmarks — Major world landmark silhouettes visible across the continent.
 * Creates curiosity, geographic wayfinding, and environmental storytelling:
 * 1. Ancient World Tree (Whistling Woods)
 * 2. Forgotten Sky Temple (Floating ruins with ley-line crystal)
 * 3. Dragon's Spine Colossus (Fossilized serpent arch across Sunstone Dunes)
 * 4. Frostpeak Citadel Ruins (High alpine fortress)
 * 5. Gloomwood Sunken Cathedral (Submerged gothic spire)
 * 6. Ancient Arch Bridge (Spans the river gorge)
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles, Text } from "@react-three/drei";
import * as THREE from "three";
import { heightAt } from "@legend/engine";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createWoodMaterial } from "../materials/createWoodMaterial";
import { createMetalMaterial } from "../materials/createMetalMaterial";

const ancientStoneMat = createStoneMaterial({ stoneColor: "#8d867c", roughness: 0.88, flatShading: true });
const darkRuinMat = createStoneMaterial({ stoneColor: "#3c3836", roughness: 0.94 });
const ancientWoodMat = createWoodMaterial({ woodColor: "#2e2118", roughness: 0.95 });
const runeGlowMat = new THREE.MeshStandardMaterial({
  color: "#00e5ff",
  emissive: "#00b4d8",
  emissiveIntensity: 2.5,
  roughness: 0.2,
});
const goldAltarMat = createMetalMaterial({ kind: "gold" });

export function ExplorationLandmarks() {
  return (
    <group>
      <AncientWorldTree />
      <ForgottenSkyTemple />
      <DragonSpineColossus />
      <FrostpeakCitadel />
      <GloomwoodSunkenCathedral />
      <AncientArchBridge />
    </group>
  );
}

/** 1. Ancient World Tree — Colossal landmark in the western forest */
function AncientWorldTree() {
  const x = -75;
  const z = -45;
  const y = heightAt(x, z);
  const foliageMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#2d6a4f",
    roughness: 0.8,
    flatShading: true,
  }), []);

  return (
    <group position={[x, y, z]}>
      {/* Massive Root Arches (Walkable under) */}
      {[0, Math.PI / 3, (2 * Math.PI) / 3, Math.PI, (4 * Math.PI) / 3, (5 * Math.PI) / 3].map((ang, i) => (
        <group key={i} rotation={[0, ang, 0]}>
          <mesh position={[4, 2.5, 0]} rotation={[0, 0, 0.45]} castShadow material={ancientWoodMat}>
            <cylinderGeometry args={[1.2, 2.2, 7, 8]} />
          </mesh>
        </group>
      ))}

      {/* Main Colossal Trunk */}
      <mesh position={[0, 10, 0]} castShadow material={ancientWoodMat}>
        <cylinderGeometry args={[3.2, 5.5, 20, 12]} />
      </mesh>

      {/* Glowing Sap Veins */}
      <mesh position={[0, 8, 2.8]} material={runeGlowMat}>
        <boxGeometry args={[0.5, 12, 0.4]} />
      </mesh>
      <mesh position={[2.5, 9, -1.2]} rotation={[0, 1.2, 0]} material={runeGlowMat}>
        <boxGeometry args={[0.4, 10, 0.4]} />
      </mesh>

      {/* Massive Cloud Canopies */}
      <mesh position={[0, 20, 0]} castShadow material={foliageMat}>
        <sphereGeometry args={[9, 10, 10]} />
      </mesh>
      <mesh position={[-5, 24, 3]} castShadow material={foliageMat}>
        <sphereGeometry args={[7, 9, 9]} />
      </mesh>
      <mesh position={[5, 23, -4]} castShadow material={foliageMat}>
        <sphereGeometry args={[6.5, 9, 9]} />
      </mesh>
      <mesh position={[0, 28, 0]} castShadow material={foliageMat}>
        <sphereGeometry args={[5, 8, 8]} />
      </mesh>

      {/* Ambient Forest Spores */}
      <Sparkles count={50} scale={[25, 20, 25]} position={[0, 14, 0]} size={4} speed={0.3} color="#52b788" />
      <Sparkles count={30} scale={[12, 10, 12]} position={[0, 6, 0]} size={5} speed={0.5} color="#00e5ff" />
      <Text position={[0, 32, 0]} fontSize={1.4} color="#74c69d" anchorX="center">THE HEARTWOOD ARCH-TREE</Text>
    </group>
  );
}

/** 2. Forgotten Sky Temple — Floating ruins above the eastern plateau */
function ForgottenSkyTemple() {
  const x = 70;
  const z = 70;
  const y = heightAt(x, z);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.5;
      coreRef.current.position.y = 18 + Math.sin(t * 1.5) * 0.4;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.3;
      ringRef.current.rotation.z = t * 0.4;
    }
  });

  return (
    <group position={[x, y, z]}>
      {/* Ground Altar Plinth */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow material={ancientStoneMat}>
        <cylinderGeometry args={[6, 7.5, 2, 8]} />
      </mesh>
      <mesh position={[0, 2.2, 0]} castShadow receiveShadow material={darkRuinMat}>
        <cylinderGeometry args={[4.5, 5.5, 0.6, 8]} />
      </mesh>

      {/* Standing Obelisks around Altar */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((ang, i) => (
        <group key={i} position={[Math.sin(ang) * 4.2, 4.5, Math.cos(ang) * 4.2]} rotation={[0, ang, 0]}>
          <mesh castShadow material={ancientStoneMat}>
            <boxGeometry args={[1.2, 6.5, 1.2]} />
          </mesh>
          <mesh position={[0, 0, 0.62]} material={runeGlowMat}>
            <boxGeometry args={[0.3, 5, 0.05]} />
          </mesh>
        </group>
      ))}

      {/* Floating Island / Monolith */}
      <mesh position={[0, 14, 0]} castShadow material={ancientStoneMat}>
        <coneGeometry args={[5, 4, 6]} />
      </mesh>
      <mesh position={[0, 16.2, 0]} castShadow material={ancientStoneMat}>
        <cylinderGeometry args={[4.8, 5, 0.8, 6]} />
      </mesh>

      {/* Floating Magic Power Core */}
      <mesh ref={coreRef} position={[0, 18, 0]} material={runeGlowMat}>
        <octahedronGeometry args={[1.6, 0]} />
      </mesh>
      <mesh ref={ringRef} position={[0, 18, 0]}>
        <torusGeometry args={[2.8, 0.15, 8, 24]} />
        <meshStandardMaterial color="#f5c542" emissive="#d4af37" emissiveIntensity={1.2} />
      </mesh>

      {/* Floating Debris Blocks */}
      {[-3, 3.5, -2, 4].map((dx, i) => (
        <mesh key={i} position={[dx, 15 + i * 1.5, (i - 1.5) * 3]} rotation={[i * 0.4, i * 0.8, 0]} castShadow material={ancientStoneMat}>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
        </mesh>
      ))}

      <Sparkles count={40} scale={[12, 14, 12]} position={[0, 17, 0]} size={5} speed={0.6} color="#00f0ff" />
      <Text position={[0, 23, 0]} fontSize={1.3} color="#00e5ff" anchorX="center">FORGOTTEN SKY TEMPLE</Text>
    </group>
  );
}

/** 3. Dragon's Spine Colossus — Fossilized ancient beast in the southern desert */
function DragonSpineColossus() {
  const x = 85;
  const z = -85;
  const y = heightAt(x, z);
  const boneMat = useMemo(() => createStoneMaterial({ stoneColor: "#d6ccc2", roughness: 0.9, flatShading: true }), []);

  return (
    <group position={[x, y, z]} rotation={[0, 0.6, 0]}>
      {/* Massive Fossil Ribcage Arches */}
      {Array.from({ length: 7 }, (_, i) => {
        const span = 6 - i * 0.4;
        const ribH = 8 - i * 0.5;
        const posZ = i * 4 - 12;
        return (
          <group key={i} position={[0, 0, posZ]}>
            {/* Left Rib */}
            <mesh position={[-span / 2, ribH / 2, 0]} rotation={[0, 0, -0.35]} castShadow material={boneMat}>
              <cylinderGeometry args={[0.3, 0.5, ribH, 6]} />
            </mesh>
            {/* Right Rib */}
            <mesh position={[span / 2, ribH / 2, 0]} rotation={[0, 0, 0.35]} castShadow material={boneMat}>
              <cylinderGeometry args={[0.3, 0.5, ribH, 6]} />
            </mesh>
            {/* Spine Vertebra */}
            <mesh position={[0, ribH, 0]} castShadow material={boneMat}>
              <boxGeometry args={[1.6, 1.4, 2.2]} />
            </mesh>
          </group>
        );
      })}

      {/* Dragon Skull */}
      <group position={[0, 4, 18]} rotation={[-0.2, 0, 0]}>
        <mesh castShadow material={boneMat}>
          <boxGeometry args={[4.2, 3.5, 7]} />
        </mesh>
        {/* Horns */}
        <mesh position={[-1.8, 2.5, -1]} rotation={[0.4, 0, -0.5]} castShadow material={boneMat}>
          <coneGeometry args={[0.5, 4.5, 6]} />
        </mesh>
        <mesh position={[1.8, 2.5, -1]} rotation={[0.4, 0, 0.5]} castShadow material={boneMat}>
          <coneGeometry args={[0.5, 4.5, 6]} />
        </mesh>
        {/* Glowing Amber Eyes */}
        <mesh position={[-1.2, 0.8, 2.5]} material={new THREE.MeshBasicMaterial({ color: "#f39c12" })}>
          <sphereGeometry args={[0.35, 8, 8]} />
        </mesh>
        <mesh position={[1.2, 0.8, 2.5]} material={new THREE.MeshBasicMaterial({ color: "#f39c12" })}>
          <sphereGeometry args={[0.35, 8, 8]} />
        </mesh>
      </group>

      <Sparkles count={25} scale={[14, 8, 28]} position={[0, 4, 0]} size={3.5} speed={0.2} color="#f39c12" />
      <Text position={[0, 11, 0]} fontSize={1.2} color="#e67e22" anchorX="center">WYRM'S REST CRAG</Text>
    </group>
  );
}

/** 4. Frostpeak Citadel Ruins — High northern mountain stronghold */
function FrostpeakCitadel() {
  const x = 0;
  const z = 140;
  const y = heightAt(x, z);
  const snowStoneMat = useMemo(() => createStoneMaterial({ stoneColor: "#708090", roughness: 0.7, flatShading: true }), []);

  return (
    <group position={[x, y, z]}>
      {/* High Wall Battlement */}
      <mesh position={[0, 5, 0]} castShadow receiveShadow material={snowStoneMat}>
        <boxGeometry args={[26, 10, 4]} />
      </mesh>
      {/* Left Ruined Tower */}
      <mesh position={[-13, 8, 0]} castShadow receiveShadow material={snowStoneMat}>
        <cylinderGeometry args={[3.2, 3.8, 16, 8]} />
      </mesh>
      {/* Right Ruined Tower */}
      <mesh position={[13, 7, 0]} castShadow receiveShadow material={snowStoneMat}>
        <cylinderGeometry args={[3.2, 3.8, 14, 8]} />
      </mesh>
      {/* Center Grand Gate Arch */}
      <mesh position={[0, 4, 0]} castShadow material={darkRuinMat}>
        <boxGeometry args={[6, 8, 4.2]} />
      </mesh>
      {/* Snow Caps */}
      <mesh position={[0, 10.2, 0]} receiveShadow material={new THREE.MeshStandardMaterial({ color: "#f0f8ff", roughness: 0.8 })}>
        <boxGeometry args={[26.4, 0.6, 4.4]} />
      </mesh>

      <Sparkles count={35} scale={[28, 12, 10]} position={[0, 8, 0]} size={3} speed={0.4} color="#e0fbfc" />
      <Text position={[0, 18, 0]} fontSize={1.4} color="#dbe9ee" anchorX="center">FROSTPEAK CITADEL</Text>
    </group>
  );
}

/** 5. Gloomwood Sunken Cathedral — Decaying spire in the western marsh */
function GloomwoodSunkenCathedral() {
  const x = -88;
  const z = 75;
  const y = heightAt(x, z);

  return (
    <group position={[x, y, z]} rotation={[0.08, 0.4, -0.1]}>
      {/* Submerged Nave */}
      <mesh position={[0, 4, 0]} castShadow receiveShadow material={darkRuinMat}>
        <boxGeometry args={[14, 12, 22]} />
      </mesh>
      {/* Tilting Gothic Spire */}
      <mesh position={[0, 13, -7]} castShadow material={darkRuinMat}>
        <cylinderGeometry args={[2.2, 3.2, 10, 8]} />
      </mesh>
      <mesh position={[0, 20, -7]} castShadow material={darkRuinMat}>
        <coneGeometry args={[2.2, 8, 8]} />
      </mesh>
      {/* Glowing Green Marsh Moss & Windows */}
      <mesh position={[0, 7, 11.1]} material={runeGlowMat}>
        <circleGeometry args={[2.2, 16]} />
      </mesh>

      <Sparkles count={30} scale={[18, 16, 24]} position={[0, 8, 0]} size={4} speed={0.3} color="#55a630" />
      <Text position={[0, 26, 0]} fontSize={1.3} color="#80b918" anchorX="center">SUNKEN CATHEDRAL OF MISTS</Text>
    </group>
  );
}

/** 6. Ancient Arch Bridge — Spans across the river gorge */
function AncientArchBridge() {
  const x = -38;
  const z = 0;
  const y = heightAt(x, z);

  return (
    <group position={[x, y + 1.8, z]} rotation={[0, Math.PI / 2, 0]}>
      {/* Bridge Deck */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow material={ancientStoneMat}>
        <boxGeometry args={[18, 0.8, 4.5]} />
      </mesh>
      {/* Bridge Parapets */}
      <mesh position={[0, 0.8, -2.1]} castShadow material={ancientStoneMat}>
        <boxGeometry args={[18, 0.9, 0.4]} />
      </mesh>
      <mesh position={[0, 0.8, 2.1]} castShadow material={ancientStoneMat}>
        <boxGeometry args={[18, 0.9, 0.4]} />
      </mesh>
      {/* Center Arch Pillar */}
      <mesh position={[0, -2.5, 0]} castShadow receiveShadow material={darkRuinMat}>
        <cylinderGeometry args={[2.2, 3, 5, 8]} />
      </mesh>
    </group>
  );
}
