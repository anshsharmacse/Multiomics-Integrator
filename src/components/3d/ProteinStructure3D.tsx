"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Tube, Float, Html, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

// Alpha Helix Component
function AlphaHelix({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  const helixPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < 30; i++) {
      const t = i * 0.3;
      const radius = 0.5;
      const x = Math.cos(t) * radius;
      const z = Math.sin(t) * radius;
      const y = i * 0.15;
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, []);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(helixPoints), [helixPoints]);

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Backbone */}
      <Tube args={[curve, 64, 0.08, 8, false]}>
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={0.3}
          roughness={0.3}
          metalness={0.5}
        />
      </Tube>
      
      {/* Amino acid residues */}
      {helixPoints.map((point, i) => (
        <Float key={i} speed={2} rotationIntensity={0.1} floatIntensity={0.1}>
          <Sphere position={[point.x, point.y, point.z]} args={[0.12, 16, 16]}>
            <meshStandardMaterial
              color={i % 2 === 0 ? "#06b6d4" : "#8b5cf6"}
              emissive={i % 2 === 0 ? "#06b6d4" : "#8b5cf6"}
              emissiveIntensity={0.4}
              roughness={0.2}
              metalness={0.8}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  );
}

// Beta Sheet Component
function BetaSheet({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  const strands = useMemo(() => {
    const result: THREE.Vector3[][] = [];
    for (let strand = 0; strand < 4; strand++) {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i < 10; i++) {
        points.push(new THREE.Vector3(strand * 0.6 - 0.9, i * 0.2 - 1, Math.sin(strand + i) * 0.1));
      }
      result.push(points);
    }
    return result;
  }, []);

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {strands.map((strand, strandIndex) => (
        <group key={strandIndex}>
          {/* Strand backbone */}
          {strand.map((point, i) => (
            <Float key={i} speed={1.5} rotationIntensity={0.1} floatIntensity={0.1}>
              <Sphere position={[point.x, point.y, point.z]} args={[0.1, 16, 16]}>
                <meshStandardMaterial
                  color={strandIndex % 2 === 0 ? "#f59e0b" : "#ef4444"}
                  emissive={strandIndex % 2 === 0 ? "#f59e0b" : "#ef4444"}
                  emissiveIntensity={0.3}
                  roughness={0.3}
                  metalness={0.6}
                />
              </Sphere>
            </Float>
          ))}
          
          {/* Connecting lines */}
          {strand.slice(0, -1).map((point, i) => {
            const nextPoint = strand[i + 1];
            const curve = new THREE.LineCurve3(point, nextPoint);
            return (
              <Tube key={`line-${i}`} args={[curve, 1, 0.03, 4, false]}>
                <meshStandardMaterial color="#888888" transparent opacity={0.6} />
              </Tube>
            );
          })}
        </group>
      ))}
      
      {/* Inter-strand connections */}
      {strands.slice(0, -1).map((strand, strandIndex) => (
        strand.map((point, i) => {
          if (i % 2 === 0) {
            const otherStrand = strands[strandIndex + 1];
            if (otherStrand[i]) {
              const curve = new THREE.LineCurve3(point, otherStrand[i]);
              return (
                <Tube key={`conn-${strandIndex}-${i}`} args={[curve, 1, 0.02, 4, false]}>
                  <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
                </Tube>
              );
            }
          }
          return null;
        })
      ))}
    </group>
  );
}

// Active Site Component
function ActiveSite({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.7;
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere ref={meshRef} args={[0.4, 32, 32]}>
          <MeshDistortMaterial
            color="#ff6b6b"
            emissive="#ff6b6b"
            emissiveIntensity={0.5}
            distort={0.3}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
      </Float>
      
      {/* Pulsing ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.65, 32]} />
        <meshBasicMaterial color="#ff6b6b" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Complete Protein Structure
function ProteinStructure() {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Alpha Helices */}
      <AlphaHelix position={[-1.5, 0, 0]} rotation={[0, 0, 0]} />
      <AlphaHelix position={[1.5, 0, 0]} rotation={[Math.PI, 0, 0]} />
      
      {/* Beta Sheet */}
      <BetaSheet position={[0, 0, 1]} rotation={[0, 0, 0]} />
      
      {/* Active Sites */}
      <ActiveSite position={[0, 0.5, 0]} />
      <ActiveSite position={[0, -0.5, 0.5]} />
      
      {/* Connecting loops */}
      <Loops />
    </group>
  );
}

import { useState } from "react";

// Connecting Loops
function Loops() {
  const loopPoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < 20; i++) {
      const t = i * 0.3;
      const x = -1.5 + t * 0.15;
      const y = Math.sin(t) * 0.5;
      const z = Math.cos(t) * 0.3;
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  }, []);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(loopPoints), [loopPoints]);

  return (
    <Tube args={[curve, 32, 0.04, 8, false]}>
      <meshStandardMaterial
        color="#a855f7"
        emissive="#a855f7"
        emissiveIntensity={0.3}
        roughness={0.4}
        metalness={0.4}
      />
    </Tube>
  );
}

// Ambient Molecular Cloud
function MolecularCloud() {
  const cloudRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    const colors = new Float32Array(200 * 3);
    
    for (let i = 0; i < 200; i++) {
      const radius = 3 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Green to cyan gradient
      colors[i * 3] = 0.06 + Math.random() * 0.1;
      colors[i * 3 + 1] = 0.6 + Math.random() * 0.2;
      colors[i * 3 + 2] = 0.5 + Math.random() * 0.3;
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      cloudRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={cloudRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={200}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function ProteinStructure3D() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-10, -10, 10]} intensity={0.4} color="#10b981" />
      <pointLight position={[0, 0, -10]} intensity={0.3} color="#8b5cf6" />
      
      <ProteinStructure />
      <MolecularCloud />
      
      <fog attach="fog" args={["#000000", 6, 20]} />
    </Canvas>
  );
}
