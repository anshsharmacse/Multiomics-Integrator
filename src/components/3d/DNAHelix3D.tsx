"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Tube } from "@react-three/drei";
import * as THREE from "three";

function DNABase({ position, color, delay }: { position: [number, number, number]; color: string; delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5 + delay;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 + delay;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} position={position} args={[0.15, 16, 16]}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  // Generate DNA helix points
  const helixPoints = useMemo(() => {
    const points: { pos1: THREE.Vector3; pos2: THREE.Vector3; color1: string; color2: string }[] = [];
    const colors = ["#10b981", "#06b6d4", "#8b5cf6", "#f59e0b"];
    
    for (let i = 0; i < 20; i++) {
      const t = i * 0.5;
      const radius = 1;
      const x1 = Math.cos(t) * radius;
      const z1 = Math.sin(t) * radius;
      const x2 = Math.cos(t + Math.PI) * radius;
      const z2 = Math.sin(t + Math.PI) * radius;
      const y = i * 0.3 - 3;
      
      points.push({
        pos1: new THREE.Vector3(x1, y, z1),
        pos2: new THREE.Vector3(x2, y, z2),
        color1: colors[i % colors.length],
        color2: colors[(i + 2) % colors.length],
      });
    }
    
    return points;
  }, []);

  // Create backbone curves
  const curve1 = useMemo(() => {
    const points = helixPoints.map((p) => p.pos1);
    return new THREE.CatmullRomCurve3(points);
  }, [helixPoints]);

  const curve2 = useMemo(() => {
    const points = helixPoints.map((p) => p.pos2);
    return new THREE.CatmullRomCurve3(points);
  }, [helixPoints]);

  return (
    <group ref={groupRef} scale={0.5}>
      {/* Backbone 1 */}
      <Tube args={[curve1, 64, 0.05, 8, false]}>
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.3} />
      </Tube>
      
      {/* Backbone 2 */}
      <Tube args={[curve2, 64, 0.05, 8, false]}>
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.3} />
      </Tube>
      
      {/* Base pairs */}
      {helixPoints.map((point, i) => (
        <group key={i}>
          <DNABase position={[point.pos1.x, point.pos1.y, point.pos1.z]} color={point.color1} delay={i * 0.1} />
          <DNABase position={[point.pos2.x, point.pos2.y, point.pos2.z]} color={point.color2} delay={i * 0.1 + 0.05} />
          
          {/* Base pair connector */}
          <mesh position={[(point.pos1.x + point.pos2.x) / 2, point.pos1.y, (point.pos1.z + point.pos2.z) / 2]}>
            <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={100}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#10b981"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function DNAHelix3D() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#10b981" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
      
      <DNAHelix />
      <FloatingParticles />
      
      <fog attach="fog" args={["#000000", 5, 15]} />
    </Canvas>
  );
}
