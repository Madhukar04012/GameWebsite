import { Instances, Instance } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { heightAt } from "@legend/engine";
import { createWoodMaterial } from "../materials/createWoodMaterial";
import { createStoneMaterial } from "../materials/createStoneMaterial";
import { createMetalMaterial } from "../materials/createMetalMaterial";
import { generateCityDressing, PropSpot } from "./generateCityDressing";
import { useWorldStore } from "../store/worldStore";

export function Props({ visible = true }: { visible?: boolean }) {
  const dressing = useMemo(() => generateCityDressing(), []);

  if (!visible) return null;

  return (
    <group>
      <InstancedBarrels spots={dressing.barrels} />
      <InstancedCrates spots={dressing.crates} />
      <PlazaBenches spots={dressing.benches} />
      <KnightTrainingDummies spots={dressing.trainingDummies} />
      <ArcheryTargets spots={dressing.archeryTargets} />
      <WeaponRacks spots={dressing.weaponRacks} />
      <BlacksmithAnvils spots={dressing.anvils} />
      <MarketStalls spots={dressing.marketStalls} />
      <MerchantCarts spots={dressing.merchantCarts} />
      <NoticeBoards spots={dressing.noticeBoards} />
      <WishingWells spots={dressing.wishingWells} />
      
      <InstancedStreetLamps spots={dressing.streetLamps} type="normal" />
      <InstancedStreetLamps spots={dressing.ornateLamps} type="ornate" />
      <InstancedPlanters spots={dressing.planters} />
      <InstancedFlowerBoxes spots={dressing.flowerBoxes} />
      <InstancedHedges spots={dressing.hedges} />
      <InstancedFountains spots={dressing.fountains} />
      <InstancedStatues spots={dressing.statues} />
      <InstancedWoodPiles spots={dressing.woodPiles} />
      <InstancedLaundry spots={dressing.laundry} />
      <InstancedCargoPallets spots={dressing.cargoPallets} />
    </group>
  );
}

const woodDark = createWoodMaterial({ woodColor: "#3a2416", roughness: 0.9 });
const woodMid = createWoodMaterial({ woodColor: "#5c3c24", roughness: 0.86 });
const woodLight = createWoodMaterial({ woodColor: "#8c6239", roughness: 0.82 });
const ironMat = createMetalMaterial({ kind: "iron" });
const goldMat = createMetalMaterial({ kind: "gold" });
const stoneMat = createStoneMaterial({ stoneColor: "#555248", roughness: 0.92 });
const hedgeMat = new THREE.MeshStandardMaterial({ color: "#2d5a2d", roughness: 0.9 });
const clothMat = new THREE.MeshStandardMaterial({ color: "#e9ecef", roughness: 0.9, side: THREE.DoubleSide });

function InstancedBarrels({ spots }: { spots: PropSpot[] }) {
  return (
    <Instances limit={Math.max(1, spots.length)} castShadow>
      <cylinderGeometry args={[0.42, 0.48, 1.05, 10]} />
      <primitive object={woodMid} attach="material" />
      {spots.map((s, i) => (
        <Instance key={i} position={[s.x, heightAt(s.x, s.z) + 0.52, s.z]} rotation={[0, s.rot ?? 0, 0]} />
      ))}
    </Instances>
  );
}

function InstancedCrates({ spots }: { spots: PropSpot[] }) {
  return (
    <Instances limit={Math.max(1, spots.length)} castShadow>
      <boxGeometry args={[0.85, 0.85, 0.85]} />
      <primitive object={woodLight} attach="material" />
      {spots.map((s, i) => (
        <Instance key={i} position={[s.x, heightAt(s.x, s.z) + 0.42, s.z]} rotation={[0, s.rot ?? 0, 0]} />
      ))}
    </Instances>
  );
}

function PlazaBenches({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow material={woodMid}>
            <boxGeometry args={[1.8, 0.1, 0.5]} />
          </mesh>
          <mesh position={[0, 0.85, -0.22]} castShadow material={woodMid}>
            <boxGeometry args={[1.8, 0.4, 0.08]} />
          </mesh>
          {[-0.75, 0.75].map((lx) => (
            <mesh key={lx} position={[lx, 0.22, 0]} castShadow material={ironMat}>
              <boxGeometry args={[0.08, 0.44, 0.45]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function KnightTrainingDummies({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          <mesh position={[0, 1.0, 0]} castShadow material={woodDark}>
            <cylinderGeometry args={[0.08, 0.1, 2.0, 6]} />
          </mesh>
          <mesh position={[0, 1.4, 0]} castShadow material={woodLight}>
            <cylinderGeometry args={[0.35, 0.4, 1.0, 8]} />
          </mesh>
          <mesh position={[0, 2.05, 0]} castShadow material={woodLight}>
            <sphereGeometry args={[0.22, 8, 8]} />
          </mesh>
          <mesh position={[0, 1.5, 0]} castShadow material={woodDark}>
            <boxGeometry args={[1.6, 0.1, 0.1]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ArcheryTargets({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          <mesh position={[0, 0.9, -0.2]} rotation={[-0.2, 0, 0]} castShadow material={woodDark}>
            <boxGeometry args={[0.1, 1.8, 0.1]} />
          </mesh>
          <mesh position={[0, 1.2, 0]} rotation={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.65, 0.65, 0.2, 16]} />
            <meshStandardMaterial color="#d4a373" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function WeaponRacks({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          <mesh position={[0, 0.9, 0]} castShadow material={woodDark}>
            <boxGeometry args={[1.8, 1.6, 0.5]} />
          </mesh>
          {[-0.5, 0, 0.5].map((wx, j) => (
            <mesh key={j} position={[wx, 1.1, 0]} rotation={[0, 0, 0.1]} castShadow material={ironMat}>
              <boxGeometry args={[0.04, 2.2, 0.04]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function BlacksmithAnvils({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          <mesh position={[0, 0.35, 0]} castShadow material={woodDark}>
            <cylinderGeometry args={[0.45, 0.5, 0.7, 10]} />
          </mesh>
          <mesh position={[0, 0.82, 0]} castShadow material={ironMat}>
            <boxGeometry args={[0.8, 0.28, 0.35]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const STALL_FABRICS = ["#e63946", "#457b9d", "#2a9d8f", "#e76f51", "#f4a261"];
function MarketStalls({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => {
        const fabricColor = STALL_FABRICS[i % STALL_FABRICS.length];
        return (
          <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
            <mesh position={[0, 0.6, 0]} castShadow receiveShadow material={woodMid}>
              <boxGeometry args={[2.4, 0.4, 1.2]} />
            </mesh>
            {[[-1.1, -0.5], [1.1, -0.5], [-1.1, 0.5], [1.1, 0.5]].map(([px, pz], j) => (
              <mesh key={j} position={[px, 1.25, pz]} castShadow material={woodDark}>
                <cylinderGeometry args={[0.05, 0.05, 2.5, 6]} />
              </mesh>
            ))}
            <mesh position={[0, 2.45, 0]} rotation={[-0.12, 0, 0]} castShadow>
              <boxGeometry args={[2.6, 0.08, 1.6]} />
              <meshStandardMaterial color={fabricColor} emissive={fabricColor} emissiveIntensity={0.25} roughness={0.7} />
            </mesh>
            {[-0.6, 0, 0.6].map((wx, k) => (
              <mesh key={k} position={[wx, 0.92, 0]}>
                <sphereGeometry args={[0.14, 8, 8]} />
                <meshStandardMaterial color={k === 0 ? "#ffd166" : k === 1 ? "#06d6a0" : "#ef476f"} emissiveIntensity={0.3} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

function MerchantCarts({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          <mesh position={[0, 0.6, 0]} castShadow material={woodMid}>
            <boxGeometry args={[1.6, 0.4, 2.4]} />
          </mesh>
          {[-0.85, 0.85].map((wx) => (
            <mesh key={wx} position={[wx, 0.45, 0]} rotation={[0, 0, Math.PI / 2]} castShadow material={woodDark}>
              <torusGeometry args={[0.45, 0.08, 6, 12]} />
            </mesh>
          ))}
          <mesh position={[0, 1.0, 0]} castShadow material={woodLight}>
            <boxGeometry args={[1.2, 0.7, 1.6]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function NoticeBoards({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          {[-0.7, 0.7].map((px) => (
            <mesh key={px} position={[px, 1.2, 0]} castShadow material={woodDark}>
              <cylinderGeometry args={[0.08, 0.08, 2.4, 6]} />
            </mesh>
          ))}
          <mesh position={[0, 1.4, 0]} castShadow material={woodMid}>
            <boxGeometry args={[1.6, 1.2, 0.12]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function WishingWells({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          <mesh position={[0, 0.6, 0]} castShadow receiveShadow material={stoneMat}>
            <cylinderGeometry args={[1.2, 1.3, 1.2, 16]} />
          </mesh>
          <mesh position={[0, 0.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.95, 16]} />
            <meshStandardMaterial color="#0077b6" emissive="#00b4d8" emissiveIntensity={0.4} metalness={0.8} roughness={0.1} />
          </mesh>
          {[-1.0, 1.0].map((px) => (
            <mesh key={px} position={[px, 1.8, 0]} castShadow material={woodDark}>
              <cylinderGeometry args={[0.09, 0.09, 1.6, 6]} />
            </mesh>
          ))}
          <mesh position={[0, 2.9, 0]} castShadow material={woodMid}>
            <coneGeometry args={[1.6, 0.9, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ==========================================
// NEW INSTANCED DRESSING
// ==========================================

function InstancedStreetLamps({ spots, type }: { spots: PropSpot[], type: "normal" | "ornate" }) {
  const isNight = useWorldStore(s => s.timeOfDay >= 18 || s.timeOfDay <= 6);
  const intensity = isNight ? 2 : 0;
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          {type === "ornate" ? (
            <>
              <mesh position={[0, 1.5, 0]} castShadow material={ironMat}>
                <cylinderGeometry args={[0.08, 0.12, 3, 8]} />
              </mesh>
              <mesh position={[0, 3.2, 0]} material={goldMat}>
                <cylinderGeometry args={[0.2, 0.2, 0.4, 8]} />
              </mesh>
              {isNight && <pointLight position={[0, 3.2, 0]} intensity={intensity} distance={10} color="#ffcc88" />}
            </>
          ) : (
            <>
              <mesh position={[0, 1.2, 0]} castShadow material={ironMat}>
                <cylinderGeometry args={[0.06, 0.08, 2.4, 6]} />
              </mesh>
              <mesh position={[0, 2.5, 0]} material={ironMat}>
                <boxGeometry args={[0.3, 0.4, 0.3]} />
              </mesh>
              {isNight && <pointLight position={[0, 2.5, 0]} intensity={intensity} distance={8} color="#ffb366" />}
            </>
          )}
        </group>
      ))}
    </group>
  );
}

function InstancedPlanters({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          <mesh position={[0, 0.4, 0]} castShadow material={stoneMat}>
            <boxGeometry args={[1.2, 0.8, 1.2]} />
          </mesh>
          <mesh position={[0, 0.9, 0]} castShadow material={hedgeMat}>
            <sphereGeometry args={[0.5, 8, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function InstancedFlowerBoxes({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z) + 0.1, s.z]} rotation={[0, s.rot ?? 0, 0]}>
          <mesh position={[0, 0, 0]} castShadow material={woodMid}>
            <boxGeometry args={[1.0, 0.3, 0.4]} />
          </mesh>
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.9, 0.2, 0.3]} />
            <meshStandardMaterial color="#8a5a44" />
          </mesh>
          <mesh position={[0, 0.3, 0]} castShadow>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshStandardMaterial color="#e07a5f" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function InstancedHedges({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      <Instances limit={Math.max(1, spots.length)} castShadow>
        <boxGeometry args={[2.0, 1.2, 0.8]} />
        <primitive object={hedgeMat} attach="material" />
        {spots.map((s, i) => (
          <Instance key={i} position={[s.x, heightAt(s.x, s.z) + 0.6, s.z]} rotation={[0, s.rot ?? 0, 0]} />
        ))}
      </Instances>
    </group>
  );
}

function InstancedFountains({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          <mesh position={[0, 0.2, 0]} castShadow material={stoneMat}>
            <cylinderGeometry args={[2, 2.2, 0.4, 16]} />
          </mesh>
          <mesh position={[0, 1.0, 0]} castShadow material={stoneMat}>
            <cylinderGeometry args={[0.8, 0.9, 0.2, 16]} />
          </mesh>
          <mesh position={[0, 1.8, 0]} castShadow material={stoneMat}>
             <cylinderGeometry args={[0.4, 0.5, 0.2, 16]} />
          </mesh>
          <mesh position={[0, 1, 0]} castShadow material={stoneMat}>
             <cylinderGeometry args={[0.2, 0.3, 2.0, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function InstancedStatues({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          <mesh position={[0, 0.5, 0]} castShadow material={stoneMat}>
            <boxGeometry args={[1.2, 1.0, 1.2]} />
          </mesh>
          <mesh position={[0, 2.0, 0]} castShadow material={stoneMat}>
             <cylinderGeometry args={[0.4, 0.4, 2.0, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function InstancedWoodPiles({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
           {[-0.2, 0, 0.2].map(x => (
             <mesh key={x} position={[x, 0.15, 0]} rotation={[0, 0, Math.PI/2]} castShadow material={woodMid}>
               <cylinderGeometry args={[0.1, 0.1, 1.2, 6]} />
             </mesh>
           ))}
           {[-0.1, 0.1].map(x => (
             <mesh key={x} position={[x, 0.3, 0]} rotation={[0, 0, Math.PI/2]} castShadow material={woodMid}>
               <cylinderGeometry args={[0.1, 0.1, 1.0, 6]} />
             </mesh>
           ))}
        </group>
      ))}
    </group>
  );
}

function InstancedLaundry({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z) + 1.5, s.z]} rotation={[0, s.rot ?? 0, 0]}>
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI/2]} castShadow material={woodDark}>
            <cylinderGeometry args={[0.02, 0.02, 2.0, 4]} />
          </mesh>
          <mesh position={[-0.4, -0.4, 0]} castShadow material={clothMat}>
            <planeGeometry args={[0.6, 0.8]} />
          </mesh>
          <mesh position={[0.4, -0.3, 0]} castShadow material={clothMat}>
             <planeGeometry args={[0.4, 0.6]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function InstancedCargoPallets({ spots }: { spots: PropSpot[] }) {
  return (
    <group>
      {spots.map((s, i) => (
        <group key={i} position={[s.x, heightAt(s.x, s.z), s.z]} rotation={[0, s.rot ?? 0, 0]}>
          <mesh position={[0, 0.1, 0]} castShadow material={woodMid}>
            <boxGeometry args={[1.5, 0.2, 1.5]} />
          </mesh>
          <mesh position={[0, 0.6, 0]} castShadow material={woodLight}>
            <boxGeometry args={[1.0, 0.8, 1.0]} />
          </mesh>
          <mesh position={[0, 1.3, 0]} castShadow material={woodLight}>
             <boxGeometry args={[0.8, 0.6, 0.8]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
