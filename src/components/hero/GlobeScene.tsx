"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function GlobePoints() {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);

  const { positions } = useMemo(() => {
    const radius = 2.1;
    const pts: number[] = [];
    const rings = 42;
    for (let i = 0; i < rings; i++) {
      const lat = Math.PI * (i / (rings - 1) - 0.5);
      const segs = Math.max(6, Math.round(Math.cos(lat) * 64));
      for (let j = 0; j < segs; j++) {
        const lon = (j / segs) * Math.PI * 2;
        const x = radius * Math.cos(lat) * Math.cos(lon);
        const y = radius * Math.sin(lat);
        const z = radius * Math.cos(lat) * Math.sin(lon);
        pts.push(x, y, z);
      }
    }
    return { positions: new Float32Array(pts) };
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
      groupRef.current.rotation.x = Math.sin(Date.now() * 0.00012) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#3ba7ff"
          size={0.028}
          sizeAttenuation
          depthWrite={false}
          opacity={0.85}
        />
      </Points>
      <mesh>
        <sphereGeometry args={[2.08, 48, 48]} />
        <meshBasicMaterial color="#0a1a3a" transparent opacity={0.15} wireframe />
      </mesh>
      {[2.35, 2.6].map((r, i) => (
        <mesh key={r} rotation={[Math.PI / 2.4, i * 0.6, 0]}>
          <torusGeometry args={[r, 0.004, 8, 128]} />
          <meshBasicMaterial color={i === 0 ? "#22d3ee" : "#a855f7"} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function DriftParticles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.02;
  });

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#a855f7" size={0.015} sizeAttenuation depthWrite={false} opacity={0.4} />
    </Points>
  );
}

export default function GlobeScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={40} color="#3ba7ff" />
      <GlobePoints />
      <DriftParticles />
    </Canvas>
  );
}
