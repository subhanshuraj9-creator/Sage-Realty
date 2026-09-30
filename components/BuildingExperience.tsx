"use client";

import { ContactShadows, Float, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Tower() {
  const group = useRef<THREE.Group>(null);
  const floors = useMemo(() => Array.from({ length: 22 }), []);
  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.045;
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -state.pointer.x * 0.014, 0.025);
    const scroll = typeof window === "undefined" ? 0 : window.scrollY / Math.max(document.body.scrollHeight - window.innerHeight, 1);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 2.3 + scroll * 1.6, 0.02);
  });
  return <group ref={group} position={[0, -2.6, 0]}>
    <mesh position={[0, 0.15, 0]} castShadow receiveShadow><cylinderGeometry args={[3.1, 3.45, 0.35, 8]} /><meshStandardMaterial color="#81745f" roughness={0.82} metalness={0.08} /></mesh>
    {[-1.02, 1.02].map((x, towerIndex) => <group key={x} position={[x, 0, towerIndex ? -0.2 : 0.2]}>
      <mesh position={[0, 5.1, 0]} castShadow receiveShadow><boxGeometry args={[1.65, 10.2, 1.55]} /><meshStandardMaterial color={towerIndex ? "#a99f8f" : "#c2b6a3"} roughness={0.68} metalness={0.12} /></mesh>
      {floors.map((_, floor) => <group key={floor} position={[0, 0.55 + floor * 0.43, 0]}><mesh position={[0, 0, 0.82]} castShadow><boxGeometry args={[1.82, 0.06, 0.25]} /><meshStandardMaterial color="#d8ccb8" roughness={0.7} /></mesh>{[-0.5, 0, 0.5].map((windowX) => <mesh key={windowX} position={[windowX, 0.08, 0.795]}><planeGeometry args={[0.3, 0.22]} /><meshStandardMaterial color="#283439" metalness={0.7} roughness={0.2} emissive="#87714d" emissiveIntensity={floor % 5 === 0 ? 0.4 : 0.08} /></mesh>)}</group>)}
      <mesh position={[0, 10.45, 0]} castShadow><boxGeometry args={[1.72, 0.5, 1.62]} /><meshStandardMaterial color="#82745f" roughness={0.6} metalness={0.15} /></mesh>
    </group>)}
    <mesh position={[0, 2.3, 0.35]} castShadow><boxGeometry args={[0.82, 4.7, 1.8]} /><meshStandardMaterial color="#8c7d68" roughness={0.72} /></mesh>
    <mesh position={[0, 4.5, 1.27]}><planeGeometry args={[0.5, 3.8]} /><meshStandardMaterial color="#202b2f" metalness={0.82} roughness={0.18} /></mesh>
  </group>;
}

export default function BuildingExperience() {
  return <Canvas shadows dpr={[1, 1.6]} camera={{ position: [8.8, 2.6, 12], fov: 34 }} gl={{ antialias: true, alpha: true }}>
    <color attach="background" args={["#0a0a09"]} /><fog attach="fog" args={["#0a0a09", 15, 29]} /><ambientLight intensity={0.55} color="#d8c5a3" />
    <directionalLight castShadow position={[6, 10, 8]} intensity={3.2} color="#ffe4b0" shadow-mapSize={[1024, 1024]} /><spotLight position={[-7, 6, -4]} intensity={2.6} color="#89a7b0" angle={0.55} penumbra={1} />
    <Float speed={0.65} rotationIntensity={0.03} floatIntensity={0.08}><Tower /></Float><ContactShadows position={[0, -2.45, 0]} opacity={0.55} scale={16} blur={2.4} far={6} color="#000000" />
    <OrbitControls enablePan={false} minDistance={10} maxDistance={18} minPolarAngle={0.72} maxPolarAngle={1.72} />
  </Canvas>;
}
