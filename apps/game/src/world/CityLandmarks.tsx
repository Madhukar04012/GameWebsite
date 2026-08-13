import { useMemo, useRef } from "react";
import { Sparkles, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Mesh } from "three";
import { heightAt } from "@legend/engine";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createWoodMaterial } from "../materials/createWoodMaterial";
import { createMetalMaterial } from "../materials/createMetalMaterial";
import { createGlassMaterial } from "../materials/createGlassMaterial";
import { createFabricMaterial } from "../materials/createFabricMaterial";

const stone = createStoneMaterial({ stoneColor: "#f0e6d2", roughness: 0.85, seed: [12, 4] });
const darkStone = createStoneMaterial({ stoneColor: "#3e3a46", roughness: 0.90, seed: [2, 9] });
const marble = createStoneMaterial({ stoneColor: "#ffffff", roughness: 0.45, metalness: 0.1, seed: [15, 8] });
const wood = createWoodMaterial({ woodColor: "#4a2e1c", roughness: 0.88 });
const darkWood = createWoodMaterial({ woodColor: "#281810", roughness: 0.92 });
const gold = createMetalMaterial({ kind: "gold", seed: [90, 1] });
const bronze = createMetalMaterial({ kind: "bronze", seed: [90, 2] });
const bannerCloth = createFabricMaterial({ kind: "banner", color: "#b22222", seed: [90, 4] });
const blueBannerCloth = createFabricMaterial({ kind: "banner", color: "#1a3b66", seed: [90, 5] });
const palaceRoseWindowMat = new THREE.MeshStandardMaterial({ color: "#ffb703", emissive: "#fb8500", emissiveIntensity: 2.2 });
const bellArchDarkMat = new THREE.MeshStandardMaterial({ color: "#0a0a14" });
const cathedralRoseWindowMat = new THREE.MeshStandardMaterial({ color: "#00b4d8", emissive: "#0077b6", emissiveIntensity: 2.4 });
const forgeMoltenMat = new THREE.MeshStandardMaterial({ color: "#ff4800", emissive: "#ff5400", emissiveIntensity: 3.0 });

/**
 * Flagship Capital Landmarks — iconic hero structures providing recognizable silhouettes
 * and rich spatial anchors across the city.
 */
export function CityLandmarks() {
  return (
    <group>
      {/* 1. Sovereign Seat of Solaria */}
      <RoyalHighPalace position={[0, heightAt(0, -36), -36]} />

      {/* 2. Gothic Cathedral */}
      <CathedralOfLight position={[28, heightAt(28, 15), 15]} />

      {/* 3. Central Plaza Navigational Anchor */}
      <SunwellFountain position={[0, heightAt(0, -4), -4]} />

      {/* 4. Oathkeeper Knight Monument */}
      <OathkeeperStatue position={[0, heightAt(0, -22), -22]} />

      {/* 5. Heartwood Ancient Tree of Solaria */}
      <HeartwoodTree position={[-26, heightAt(-26, -26), -26]} />

      {/* 6. Adventurer's Guildhall Monument */}
      <GuildhallMonument position={[-32, heightAt(-32, -4), -4]} />

      {/* 7. Royal Arch of Triumph */}
      <RoyalArch position={[0, heightAt(0, -18), -18]} />

      {/* 8. Master Foundry Forge Hearth */}
      <GreatForgeHearth position={[-42, heightAt(-42, 28), 28]} />

      {/* 9. Defensive Corner Fortress Bastions */}
      <FortressBastions />
    </group>
  );
}

/** Grand Royal High Palace — Sovereign seat of the Capital Kingdom */
function RoyalHighPalace({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Palace Foundation Terrace */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow material={stone}>
        <boxGeometry args={[32, 3, 26]} />
      </mesh>

      {/* Main Palace Keep (Hollowed for interior) */}
      <group position={[0, 11, 0]}>
        <mesh position={[0, 0, -7.5]} castShadow receiveShadow material={marble}>
          <boxGeometry args={[20, 16, 1]} />
        </mesh>
        <mesh position={[-9.5, 0, 0]} castShadow receiveShadow material={marble}>
          <boxGeometry args={[1, 16, 16]} />
        </mesh>
        <mesh position={[9.5, 0, 0]} castShadow receiveShadow material={marble}>
          <boxGeometry args={[1, 16, 16]} />
        </mesh>
        <mesh position={[-6, 0, 7.5]} castShadow receiveShadow material={marble}>
          <boxGeometry args={[8, 16, 1]} />
        </mesh>
        <mesh position={[6, 0, 7.5]} castShadow receiveShadow material={marble}>
          <boxGeometry args={[8, 16, 1]} />
        </mesh>
        <mesh position={[0, 4, 7.5]} castShadow receiveShadow material={marble}>
          <boxGeometry args={[4, 8, 1]} />
        </mesh>
      </group>
      <RoyalPalaceInterior />

      {/* Upper Sovereign Royal Tier */}
      <mesh position={[0, 22, 0]} castShadow receiveShadow material={marble}>
        <boxGeometry args={[14, 8, 12]} />
      </mesh>

      {/* Central Soaring Gilded Spire */}
      <mesh position={[0, 29, 0]} castShadow material={gold}>
        <coneGeometry args={[4.5, 12, 8]} />
      </mesh>
      <mesh position={[0, 35.5, 0]} castShadow>
        <sphereGeometry args={[0.7, 12, 12]} />
        <meshStandardMaterial color="#ffd700" emissive="#d4af37" emissiveIntensity={1.2} />
      </mesh>

      {/* 4 Corner Cylindrical Towers with Spired Turrets */}
      {[-9.5, 9.5].flatMap((cx) =>
        [-7.5, 7.5].map((cz) => (
          <group key={`ptower-${cx}-${cz}`} position={[cx, 0, cz]}>
            <mesh position={[0, 13, 0]} castShadow receiveShadow material={darkStone}>
              <cylinderGeometry args={[2.5, 2.8, 26, 8]} />
            </mesh>
            <mesh position={[0, 28, 0]} castShadow material={gold}>
              <coneGeometry args={[2.9, 7, 8]} />
            </mesh>
          </group>
        ))
      )}

      {/* Grand Arched Entrance Portico */}
      <group position={[0, 5, 8.8]}>
        <mesh position={[-4, 0, 0]} castShadow material={darkStone}>
           <boxGeometry args={[2, 8, 3.5]} />
        </mesh>
        <mesh position={[4, 0, 0]} castShadow material={darkStone}>
           <boxGeometry args={[2, 8, 3.5]} />
        </mesh>
        <mesh position={[0, 2.5, 0]} castShadow material={darkStone}>
           <boxGeometry args={[6, 3, 3.5]} />
        </mesh>
      </group>

      {/* Emissive Rose Window */}
      <mesh position={[0, 16, 8.08]} material={palaceRoseWindowMat}>
        <circleGeometry args={[2.8, 24]} />
      </mesh>

      {/* Royal Velvet Banners */}
      {[-4, 4].map((bx) => (
        <mesh key={bx} position={[bx, 9, 8.2]} material={bannerCloth}>
          <planeGeometry args={[1.8, 6]} />
        </mesh>
      ))}

      {/* Golden Balcony Balustrade */}
      <mesh position={[0, 19, 8.2]} castShadow material={gold}>
        <boxGeometry args={[8, 0.9, 1.2]} />
      </mesh>

      <Sparkles count={40} scale={[24, 30, 20]} position={[0, 18, 0]} size={4} speed={0.4} color="#ffd166" />
      <Text position={[0, 38, 0]} fontSize={1.4} color="#f4a261" anchorX="center">ROYAL HIGH PALACE OF SOLARIA</Text>
    </group>
  );
}

/** Grand Cathedral of Light — Vaulted gothic cathedral with flying buttresses */
function CathedralOfLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, -Math.PI / 4, 0]}>
      {/* Main Cathedral Nave (Hollowed for interior) */}
      <group position={[0, 8, 0]}>
        <mesh position={[0, 0, -11.5]} castShadow receiveShadow material={stone}>
          <boxGeometry args={[12, 16, 1]} />
        </mesh>
        <mesh position={[-5.5, 0, 0]} castShadow receiveShadow material={stone}>
          <boxGeometry args={[1, 16, 24]} />
        </mesh>
        <mesh position={[5.5, 0, 0]} castShadow receiveShadow material={stone}>
          <boxGeometry args={[1, 16, 24]} />
        </mesh>
        <mesh position={[-4, 0, 11.5]} castShadow receiveShadow material={stone}>
          <boxGeometry args={[4, 16, 1]} />
        </mesh>
        <mesh position={[4, 0, 11.5]} castShadow receiveShadow material={stone}>
          <boxGeometry args={[4, 16, 1]} />
        </mesh>
        <mesh position={[0, 4, 11.5]} castShadow receiveShadow material={stone}>
          <boxGeometry args={[4, 8, 1]} />
        </mesh>
      </group>
      <CathedralInterior />

      {/* Steep Slate Roof */}
      <mesh position={[0, 18, 0]} rotation={[0, Math.PI / 4, 0]} castShadow material={darkStone}>
        <coneGeometry args={[13, 8, 4]} />
      </mesh>

      {/* Twin Soaring Bell Towers */}
      {[-5, 5].map((tx) => (
        <group key={`bell-tower-${tx}`} position={[tx, 0, 11]}>
          <mesh position={[0, 17, 0]} castShadow receiveShadow material={stone}>
            <boxGeometry args={[4.5, 34, 4.5]} />
          </mesh>
          <mesh position={[0, 37, 0]} castShadow material={gold}>
            <coneGeometry args={[2.8, 9, 8]} />
          </mesh>
          {/* Bell Arch Openings */}
          <mesh position={[0, 28, 2.3]} material={bellArchDarkMat}>
            <planeGeometry args={[1.8, 3.5]} />
          </mesh>
        </group>
      ))}

      {/* Glowing Stained Glass Clerestory Rose Window */}
      <mesh position={[0, 12, 12.08]} material={cathedralRoseWindowMat}>
        <circleGeometry args={[2.4, 24]} />
      </mesh>

      {/* Flying Buttresses along the Nave */}
      {[-7.5, 7.5].map((bx) => (
        <group key={bx} position={[bx, 0, 0]}>
          {[-8, -2, 4].map((bz) => (
            <mesh key={bz} position={[0, 8, bz]} rotation={[0, 0, bx > 0 ? 0.35 : -0.35]} castShadow material={stone}>
              <boxGeometry args={[0.9, 15, 1.2]} />
            </mesh>
          ))}
        </group>
      ))}

      <Sparkles count={35} scale={[16, 24, 24]} position={[0, 16, 0]} size={4} speed={0.4} color="#90e0ef" />
      <Text position={[0, 43, 11]} fontSize={1.3} color="#90e0ef" anchorX="center">GRAND CATHEDRAL OF LIGHT</Text>
    </group>
  );
}

/** The Sunwell & Central Plaza */
function SunwellFountain({ position }: { position: [number, number, number] }) {
  const water = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (water.current) water.current.rotation.y = clock.elapsedTime * 0.35;
  });

  return (
    <group position={position}>
      {/* Outer Stepped Marble Basin */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow material={marble}>
        <cylinderGeometry args={[5.2, 5.8, 0.6, 32]} />
      </mesh>
      {/* Inner Tier Basin */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow material={marble}>
        <cylinderGeometry args={[3.2, 3.6, 0.6, 24]} />
      </mesh>

      {/* Rotating Water Surface */}
      <mesh position={[0, 1.05, 0]} ref={water}>
        <cylinderGeometry args={[3.0, 3.0, 0.08, 24]} />
        <meshStandardMaterial color="#0077b6" emissive="#00b4d8" emissiveIntensity={0.5} metalness={0.8} roughness={0.15} />
      </mesh>

      {/* Central Solar Column */}
      <mesh position={[0, 2.2, 0]} castShadow material={marble}>
        <cylinderGeometry args={[0.8, 1.2, 2.8, 12]} />
      </mesh>

      {/* Golden Solar Sphere */}
      <mesh position={[0, 4.0, 0]} castShadow>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial color="#ffd700" emissive="#ffb703" emissiveIntensity={1.5} metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Four Gilded Water Jets */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((r) => (
        <mesh key={r} position={[Math.sin(r) * 2.0, 2.6, Math.cos(r) * 2.0]} rotation={[0, r, 0]}>
          <coneGeometry args={[0.12, 2.2, 6]} />
          <meshBasicMaterial color="#90e0ef" transparent opacity={0.65} />
        </mesh>
      ))}

      <Sparkles count={30} scale={[8, 5, 8]} size={3.5} speed={0.5} color="#ffd166" />
      <Text position={[0, 5.6, 0]} fontSize={0.65} color="#ffd166" anchorX="center">THE SUNWELL FOUNTAIN</Text>
    </group>
  );
}

/** Oathkeeper Knight Hero Statue */
function OathkeeperStatue({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Stepped Granite Pedestal */}
      <mesh position={[0, 0.7, 0]} castShadow material={darkStone}>
        <boxGeometry args={[3.2, 1.4, 3.2]} />
      </mesh>
      <mesh position={[0, 1.8, 0]} castShadow material={stone}>
        <boxGeometry args={[2.5, 1.0, 2.5]} />
      </mesh>

      {/* Knight Body Armor */}
      <mesh position={[0, 3.8, 0]} castShadow material={darkStone}>
        <cylinderGeometry args={[0.9, 1.2, 3.8, 10]} />
      </mesh>

      {/* Knight Helm */}
      <mesh position={[0, 6.2, 0]} castShadow material={gold}>
        <sphereGeometry args={[0.85, 14, 10]} />
      </mesh>

      {/* Giant Golden Greatsword */}
      <mesh position={[1.1, 4.2, 0]} rotation={[0, 0, -0.22]} castShadow material={gold}>
        <boxGeometry args={[0.35, 5.2, 0.35]} />
      </mesh>

      {/* Hero Shield on Left Arm */}
      <mesh position={[-1.1, 4.2, 0]} rotation={[0, 0, 0.15]} castShadow material={gold}>
        <boxGeometry args={[1.8, 2.6, 0.2]} />
      </mesh>

      {/* Inscription Plaque */}
      <mesh position={[0, 1.2, 1.62]}>
        <planeGeometry args={[1.8, 0.6]} />
        <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={0.6} side={2} />
      </mesh>

      <Text position={[0, 7.8, 0]} fontSize={0.6} color="#d4af37" anchorX="center">OATHKEEPER MONUMENT</Text>
    </group>
  );
}

/** Heartwood Ancient Tree of Solaria */
function HeartwoodTree({ position }: { position: [number, number, number] }) {
  const leaves = useMemo(() => Array.from({ length: 42 }, (_, i) => {
    const angle = i * 2.399;
    const radius = 1.8 + (i % 5) * 0.5;
    return { x: Math.cos(angle) * radius, y: 6.0 + (i % 7) * 0.6, z: Math.sin(angle) * radius, s: 0.9 + (i % 3) * 0.3 };
  }), []);

  return (
    <group position={position}>
      {/* Massive Ancient Trunk */}
      <mesh position={[0, 3.5, 0]} castShadow material={wood}>
        <cylinderGeometry args={[1.2, 2.0, 7, 10]} />
      </mesh>
      {/* Root Buttresses */}
      {[0, Math.PI / 2, Math.PI, 1.5 * Math.PI].map((r) => (
        <mesh key={r} position={[Math.cos(r) * 1.2, 0.6, Math.sin(r) * 1.2]} rotation={[0, r, 0]} castShadow material={wood}>
          <boxGeometry args={[1.2, 1.2, 0.4]} />
        </mesh>
      ))}
      {/* Bioluminescent Canopy */}
      {leaves.map((leaf, i) => (
        <mesh key={i} position={[leaf.x, leaf.y, leaf.z]} scale={leaf.s} castShadow>
          <icosahedronGeometry args={[1.4, 1]} />
          <meshStandardMaterial color="#2d6a4f" emissive="#1b4332" emissiveIntensity={0.3} flatShading />
        </mesh>
      ))}
      <Sparkles count={30} scale={[8, 10, 8]} size={3.5} speed={0.25} color="#52b788" />
      <Text position={[0, 11.5, 0]} fontSize={0.6} color="#52b788" anchorX="center">HEARTWOOD OF SOLARIA</Text>
    </group>
  );
}

/** Adventurer's Guildhall Monument */
function GuildhallMonument({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]} castShadow material={darkStone}>
        <cylinderGeometry args={[2.5, 3.0, 1.2, 8]} />
      </mesh>
      <mesh position={[0, 4.0, 0]} castShadow material={stone}>
        <boxGeometry args={[1.6, 6, 1.6]} />
      </mesh>
      <mesh position={[0, 7.5, 0]} castShadow material={gold}>
        <coneGeometry args={[1.4, 1.6, 4]} />
      </mesh>
      {/* Guild Sigil */}
      <mesh position={[0, 4.5, 0.82]}>
        <circleGeometry args={[0.7, 16]} />
        <meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={1.6} />
      </mesh>
    </group>
  );
}

/** Royal Arch of Triumph */
function RoyalArch({ position }: { position: [number, number, number] }) {
  const archW = 6.0;
  const archH = 9.0;
  return (
    <group position={position}>
      {/* Left & Right Stone Piers */}
      <mesh position={[-archW, archH / 2, 0]} castShadow receiveShadow material={stone}>
        <boxGeometry args={[1.8, archH, 2.2]} />
      </mesh>
      <mesh position={[archW, archH / 2, 0]} castShadow receiveShadow material={stone}>
        <boxGeometry args={[1.8, archH, 2.2]} />
      </mesh>

      {/* Grand Arch Lintel Entablature */}
      <mesh position={[0, archH + 0.8, 0]} castShadow receiveShadow material={stone}>
        <boxGeometry args={[archW * 2 + 3.6, 1.8, 2.6]} />
      </mesh>

      {/* Gold Statues Atop Lintel */}
      <mesh position={[0, archH + 2.4, 0]} castShadow material={gold}>
        <boxGeometry args={[2.2, 1.4, 1.4]} />
      </mesh>
      <mesh position={[0, archH + 3.6, 0]} castShadow material={gold}>
        <coneGeometry args={[0.6, 1.2, 8]} />
      </mesh>

      {/* Royal Arch Banners */}
      <mesh position={[-archW + 0.9, archH - 1.5, 1.15]} material={bannerCloth}>
        <planeGeometry args={[1.2, 4]} />
      </mesh>
      <mesh position={[archW - 0.9, archH - 1.5, 1.15]} material={bannerCloth}>
        <planeGeometry args={[1.2, 4]} />
      </mesh>
    </group>
  );
}

/** Great Forge Hearth & Foundry Smoke Stack */
function GreatForgeHearth({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Stone Blast Furnace Base */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow material={darkStone}>
        <cylinderGeometry args={[2.5, 3.2, 5, 10]} />
      </mesh>
      {/* Glowing Molten Crucible Opening */}
      <mesh position={[0, 1.8, 2.4]} material={forgeMoltenMat}>
        <circleGeometry args={[1.1, 16]} />
      </mesh>
      {/* Brick Smoke Stack */}
      <mesh position={[0, 7.5, 0]} castShadow material={darkStone}>
        <cylinderGeometry args={[1.2, 1.8, 6, 8]} />
      </mesh>
      <Sparkles count={30} scale={[4, 8, 4]} position={[0, 8, 0]} size={4} speed={0.8} color="#ff7b00" />
    </group>
  );
}

function CathedralInterior() {
  return (
    <group position={[0, 0, 0]}>
      {/* Central aisle */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4, 22]} />
        <meshStandardMaterial color="#331111" />
      </mesh>
      
      {/* Pews */}
      {[-3, 3].map(px => (
        <group key={`pews-${px}`}>
          {[-8, -4, 0, 4, 8].map(pz => (
            <mesh key={`pew-${pz}`} position={[px, 0.4, pz]} castShadow material={wood}>
              <boxGeometry args={[4, 0.8, 1]} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Altar */}
      <mesh position={[0, 1.2, -10]} castShadow material={marble}>
        <boxGeometry args={[6, 2.4, 2]} />
      </mesh>
      
      {/* Giant cross or symbol */}
      <mesh position={[0, 6, -11.4]} material={gold}>
        <boxGeometry args={[1, 6, 0.5]} />
      </mesh>
      <mesh position={[0, 6.5, -11.4]} material={gold}>
        <boxGeometry args={[4, 1, 0.5]} />
      </mesh>

      {/* Interior lighting */}
      <pointLight position={[0, 10, 0]} intensity={2} distance={30} color="#ffddaa" />
      <pointLight position={[0, 4, -8]} intensity={1.5} distance={15} color="#ffaa55" />
    </group>
  );
}

function RoyalPalaceInterior() {
  return (
    <group position={[0, 3, 0]}>
      {/* Royal carpet */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[6, 14]} />
        <meshStandardMaterial color="#aa0000" />
      </mesh>
      
      {/* Throne platform */}
      <mesh position={[0, 0.5, -6]} castShadow material={marble}>
        <cylinderGeometry args={[3, 4, 1, 8]} />
      </mesh>
      
      {/* Golden Throne */}
      <mesh position={[0, 1.5, -6]} castShadow material={gold}>
        <boxGeometry args={[2, 3, 1]} />
      </mesh>
      
      {/* Interior pillars */}
      {[-5, 5].map(x => (
        <group key={`palace-pillars-${x}`}>
          {[-4, 0, 4].map(z => (
             <mesh key={`palace-pillar-${z}`} position={[x, 6, z]} material={marble}>
               <cylinderGeometry args={[0.8, 1.0, 12]} />
             </mesh>
          ))}
        </group>
      ))}
      
      {/* Chandeliers */}
      <pointLight position={[0, 10, 0]} intensity={2.5} distance={25} color="#ffddaa" />
    </group>
  );
}

/** Defensive Corner Bastions */
function FortressBastions() {
  const towers: [number, number][] = [
    [-44, -44],
    [44, -44],
    [-44, 44],
    [44, 44],
  ];

  return (
    <>
      {towers.map(([x, z]) => (
        <group key={`bastion-${x}-${z}`} position={[x, heightAt(x, z), z]}>
          <mesh position={[0, 8, 0]} castShadow receiveShadow material={darkStone}>
            <cylinderGeometry args={[3.2, 3.8, 16, 10]} />
          </mesh>
          <mesh position={[0, 17, 0]} castShadow material={darkStone}>
            <coneGeometry args={[4.2, 4.0, 10]} />
          </mesh>
          {/* Watchtower Flag */}
          <mesh position={[0, 19.5, 0]} castShadow material={gold}>
            <cylinderGeometry args={[0.06, 0.06, 1.8, 4]} />
          </mesh>
        </group>
      ))}
    </>
  );
}