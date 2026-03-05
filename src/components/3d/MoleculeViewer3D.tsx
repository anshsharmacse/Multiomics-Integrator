"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Cylinder, Float, Html } from "@react-three/drei";
import * as THREE from "three";

interface AtomProps {
  position: [number, number, number];
  element: string;
  size?: number;
}

const atomColors: Record<string, string> = {
  C: "#333333",
  H: "#ffffff",
  O: "#ff0000",
  N: "#0000ff",
  P: "#ff8c00",
  S: "#ffff00",
};

const atomSizes: Record<string, number> = {
  C: 0.4,
  H: 0.25,
  O: 0.35,
  N: 0.35,
  P: 0.45,
  S: 0.4,
};

function Atom({ position, element, size }: AtomProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    }
  });

  const color = atomColors[element] || "#888888";
  const atomSize = size || atomSizes[element] || 0.3;

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
      <group position={position}>
        <Sphere
          ref={meshRef}
          args={[atomSize, 32, 32]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 0.5 : 0.2}
            roughness={0.3}
            metalness={0.5}
          />
        </Sphere>
        
        {hovered && (
          <Html center>
            <div className="bg-background/90 px-2 py-1 rounded text-xs border border-emerald-500/50">
              {element}
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}

import { useState } from "react";

function Bond({ start, end }: { start: [number, number, number]; end: [number, number, number] }) {
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const midPoint = startVec.clone().add(endVec).multiplyScalar(0.5);
  const direction = endVec.clone().sub(startVec);
  const length = direction.length();
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());

  return (
    <Cylinder
      args={[0.05, 0.05, length, 8]}
      position={[midPoint.x, midPoint.y, midPoint.z]}
      quaternion={quaternion}
    >
      <meshStandardMaterial color="#888888" transparent opacity={0.7} />
    </Cylinder>
  );
}

// ATP Molecule structure (simplified)
function ATPMolecule() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  // Simplified ATP structure
  const atoms = [
    // Adenine ring
    { pos: [0, 0, 0], element: "N" },
    { pos: [0.5, 0.8, 0], element: "C" },
    { pos: [1.3, 0.8, 0], element: "N" },
    { pos: [1.8, 0, 0], element: "C" },
    { pos: [1.3, -0.8, 0], element: "N" },
    { pos: [0.5, -0.8, 0], element: "C" },
    
    // Ribose sugar
    { pos: [-0.8, 0, 0.5], element: "C" },
    { pos: [-1.2, 0.8, 0.5], element: "C" },
    { pos: [-0.8, 1.2, 1.2], element: "O" },
    { pos: [-1.8, 0, 0.8], element: "C" },
    
    // Phosphate groups
    { pos: [-2.5, -0.5, 0.5], element: "P" },
    { pos: [-3.2, -0.8, 1.2], element: "O" },
    { pos: [-2.8, -1.2, -0.2], element: "O" },
    { pos: [-3.5, -0.2, 0.2], element: "O" },
    
    { pos: [-4.2, -0.8, 0.8], element: "P" },
    { pos: [-4.8, -1.2, 1.5], element: "O" },
    { pos: [-4.5, -1.5, 0], element: "O" },
    
    { pos: [-5.5, -0.8, 0.5], element: "P" },
    { pos: [-6.2, -1.2, 1.2], element: "O" },
    { pos: [-5.8, -1.5, -0.2], element: "O" },
    { pos: [-6.5, -0.2, 0.5], element: "O" },
    
    // Hydrogens
    { pos: [0.2, 1.4, 0], element: "H" },
    { pos: [2.3, 0, 0], element: "H" },
    { pos: [0.2, -1.4, 0], element: "H" },
  ];

  const bonds = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
    [0, 6], [6, 7], [7, 8], [6, 9], [9, 10],
    [10, 11], [10, 12], [10, 13],
    [13, 14], [14, 15], [14, 16],
    [16, 17], [17, 18], [17, 19], [17, 20],
    [1, 21], [3, 22], [5, 23],
  ];

  return (
    <group ref={groupRef} scale={0.8}>
      {atoms.map((atom, i) => (
        <Atom key={i} position={atom.pos as [number, number, number]} element={atom.element} />
      ))}
      {bonds.map((bond, i) => (
        <Bond
          key={i}
          start={atoms[bond[0]].pos as [number, number, number]}
          end={atoms[bond[1]].pos as [number, number, number]}
        />
      ))}
    </group>
  );
}

// Glucose Molecule
function GlucoseMolecule() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  // Glucose ring structure (pyranose form)
  const atoms = [
    // Ring
    { pos: [0, 0, 0], element: "O" },
    { pos: [0.8, 0.6, 0], element: "C" },
    { pos: [0.5, 1.4, 0], element: "C" },
    { pos: [-0.5, 1.4, 0], element: "C" },
    { pos: [-0.8, 0.6, 0], element: "C" },
    { pos: [-0.5, -0.2, 0], element: "C" },
    
    // Side groups
    { pos: [1.5, 0.3, 0.5], element: "O" },
    { pos: [0.8, 2, 0.5], element: "O" },
    { pos: [-0.8, 2, 0.5], element: "O" },
    { pos: [-1.5, 0.3, 0.5], element: "O" },
    { pos: [-0.8, -0.8, 0.5], element: "O" },
    { pos: [0.5, -0.8, 0.5], element: "O" },
    
    // Hydrogens
    { pos: [1.2, 0, -0.5], element: "H" },
    { pos: [0.8, 1.8, -0.5], element: "H" },
    { pos: [-0.8, 1.8, -0.5], element: "H" },
    { pos: [-1.2, 0, -0.5], element: "H" },
  ];

  const bonds = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
    [1, 6], [2, 7], [3, 8], [4, 9], [5, 10], [0, 11],
    [1, 12], [2, 13], [3, 14], [4, 15],
  ];

  return (
    <group ref={groupRef} scale={1}>
      {atoms.map((atom, i) => (
        <Atom key={i} position={atom.pos as [number, number, number]} element={atom.element} />
      ))}
      {bonds.map((bond, i) => (
        <Bond
          key={i}
          start={atoms[bond[0]].pos as [number, number, number]}
          end={atoms[bond[1]].pos as [number, number, number]}
        />
      ))}
    </group>
  );
}

// Adenine Molecule
function AdenineMolecule() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
    }
  });

  // Adenine structure (purine base)
  const atoms = [
    // Six-membered ring
    { pos: [0, 0, 0], element: "N" },
    { pos: [0.7, 0.7, 0], element: "C" },
    { pos: [0.5, 1.5, 0], element: "N" },
    { pos: [-0.5, 1.5, 0], element: "C" },
    { pos: [-0.7, 0.7, 0], element: "C" },
    
    // Five-membered ring
    { pos: [0.7, -0.7, 0], element: "C" },
    { pos: [0.3, -1.4, 0], element: "N" },
    { pos: [-0.5, -1.2, 0], element: "C" },
    { pos: [-0.7, -0.3, 0], element: "N" },
    
    // Side amino group
    { pos: [-1.3, 1.8, 0], element: "N" },
    
    // Hydrogens
    { pos: [1.3, 0.5, 0], element: "H" },
    { pos: [-1.3, 0.5, 0], element: "H" },
    { pos: [0.6, -2, 0], element: "H" },
    { pos: [-1.8, 1.6, 0], element: "H" },
  ];

  const bonds = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 0],
    [0, 5], [5, 6], [6, 7], [7, 8], [8, 0],
    [3, 9], [1, 10], [4, 11], [6, 12], [9, 13],
  ];

  return (
    <group ref={groupRef} scale={1.2}>
      {atoms.map((atom, i) => (
        <Atom key={i} position={atom.pos as [number, number, number]} element={atom.element} />
      ))}
      {bonds.map((bond, i) => (
        <Bond
          key={i}
          start={atoms[bond[0]].pos as [number, number, number]}
          end={atoms[bond[1]].pos as [number, number, number]}
        />
      ))}
    </group>
  );
}

// Generic molecule selector
function MoleculeSelector({ type }: { type: string }) {
  switch (type) {
    case "ATP Synthase":
      return <ATPMolecule />;
    case "Glucose":
      return <GlucoseMolecule />;
    case "Adenine":
      return <AdenineMolecule />;
    default:
      return <ATPMolecule />;
  }
}

// Ambient particles for atmosphere
function AmbientParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(30 * 3);
    for (let i = 0; i < 30; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={30}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#10b981"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

export default function MoleculeViewer3D({ moleculeType }: { moleculeType: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-10, -10, 10]} intensity={0.3} color="#10b981" />
      
      <MoleculeSelector type={moleculeType} />
      <AmbientParticles />
      
      <fog attach="fog" args={["#000000", 5, 15]} />
    </Canvas>
  );
}
