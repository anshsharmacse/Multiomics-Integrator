"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Html, Line } from "@react-three/drei";
import * as THREE from "three";

interface NeuronProps {
  position: [number, number, number];
  color: string;
  label?: string;
  isPulsing?: boolean;
  pulseDelay?: number;
  onClick?: () => void;
}

function Neuron({ position, color, label, isPulsing = true, pulseDelay = 0, onClick }: NeuronProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && isPulsing) {
      const pulse = Math.sin(state.clock.elapsedTime * 2 + pulseDelay) * 0.2 + 1;
      meshRef.current.scale.setScalar(pulse * (hovered ? 1.5 : 1));
    }
    if (glowRef.current) {
      const opacity = Math.sin(state.clock.elapsedTime * 2 + pulseDelay) * 0.3 + 0.5;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * (hovered ? 1 : 0.5);
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <group position={position}>
        {/* Glow effect */}
        <Sphere ref={glowRef} args={[0.35, 16, 16]}>
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </Sphere>
        
        {/* Main neuron */}
        <Sphere
          ref={meshRef}
          args={[0.2, 32, 32]}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 0.8 : 0.4}
            roughness={0.2}
            metalness={0.8}
          />
        </Sphere>
        
        {label && hovered && (
          <Html center position={[0, 0.5, 0]}>
            <div className="bg-background/90 px-2 py-1 rounded text-xs whitespace-nowrap border border-emerald-500/50">
              {label}
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}

interface ConnectionProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  isAnimating?: boolean;
}

function Connection({ start, end, color = "#10b981", isAnimating = true }: ConnectionProps) {
  const lineRef = useRef<THREE.Line>(null);
  
  const points = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  }, [start, end]);

  useFrame((state) => {
    if (lineRef.current && isAnimating) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = Math.sin(state.clock.elapsedTime * 3) * 0.3 + 0.5;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={1}
      transparent
      opacity={0.5}
    />
  );
}

function NeuralNetwork({ onLayerSelect, isTraining }: { onLayerSelect?: (layer: string) => void; isTraining?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.3;
    }
  });

  // Define layer structure
  const layers = [
    { name: "input", neurons: 8, x: -4, color: "#10b981", label: "Input Layer" },
    { name: "encoder1", neurons: 6, x: -2, color: "#06b6d4", label: "Encoder L1" },
    { name: "encoder2", neurons: 4, x: 0, color: "#8b5cf6", label: "Latent Space" },
    { name: "decoder1", neurons: 6, x: 2, color: "#06b6d4", label: "Decoder L1" },
    { name: "output", neurons: 8, x: 4, color: "#f59e0b", label: "Output Layer" },
  ];

  // Generate neuron positions
  const neuronPositions = useMemo(() => {
    return layers.map((layer) => {
      const positions: [number, number, number][] = [];
      const spacing = 1.5;
      const startY = -((layer.neurons - 1) * spacing) / 2;
      
      for (let i = 0; i < layer.neurons; i++) {
        positions.push([layer.x, startY + i * spacing, 0]);
      }
      
      return { ...layer, positions };
    });
  }, []);

  // Generate connections between layers
  const connections = useMemo(() => {
    const conns: { start: [number, number, number]; end: [number, number, number]; color: string }[] = [];
    
    for (let i = 0; i < neuronPositions.length - 1; i++) {
      const currentLayer = neuronPositions[i];
      const nextLayer = neuronPositions[i + 1];
      
      currentLayer.positions.forEach((start) => {
        nextLayer.positions.forEach((end) => {
          // Only connect some neurons to avoid clutter
          if (Math.random() > 0.4) {
            conns.push({
              start,
              end,
              color: currentLayer.color,
            });
          }
        });
      });
    }
    
    return conns;
  }, [neuronPositions]);

  return (
    <group ref={groupRef}>
      {/* Neurons */}
      {neuronPositions.map((layer, layerIndex) =>
        layer.positions.map((pos, neuronIndex) => (
          <Neuron
            key={`${layer.name}-${neuronIndex}`}
            position={pos}
            color={layer.color}
            label={neuronIndex === 0 ? layer.label : undefined}
            pulseDelay={layerIndex * 0.5 + neuronIndex * 0.1}
            isPulsing={isTraining}
            onClick={() => onLayerSelect?.(layer.name)}
          />
        ))
      )}
      
      {/* Connections */}
      {connections.map((conn, i) => (
        <Connection
          key={i}
          start={conn.start}
          end={conn.end}
          color={conn.color}
          isAnimating={isTraining}
        />
      ))}
      
      {/* Attention mechanism visualization */}
      <AttentionMechanism />
    </group>
  );
}

function AttentionMechanism() {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group position={[0, 0, 1]}>
      <mesh ref={ringRef}>
        <torusGeometry args={[1.5, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.5}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}

function FloatingDataParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(50 * 3);
    const colors = new Float32Array(50 * 3);
    
    for (let i = 0; i < 50; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      
      // Random colors from palette
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i * 3] = 0.06; colors[i * 3 + 1] = 0.73; colors[i * 3 + 2] = 0.51;
      } else if (colorChoice < 0.66) {
        colors[i * 3] = 0.02; colors[i * 3 + 1] = 0.71; colors[i * 3 + 2] = 0.83;
      } else {
        colors[i * 3] = 0.55; colors[i * 3 + 1] = 0.36; colors[i * 3 + 2] = 0.96;
      }
    }
    
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      
      // Animate particles moving through network
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 50; i++) {
        positions[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.002;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={50}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={50}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

export default function NeuralNetwork3D({ onLayerSelect, isTraining }: { onLayerSelect?: (layer: string) => void; isTraining?: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#10b981" />
      <pointLight position={[-10, -10, 10]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[0, 0, -10]} intensity={0.3} color="#06b6d4" />
      
      <NeuralNetwork onLayerSelect={onLayerSelect} isTraining={isTraining} />
      <FloatingDataParticles />
      
      <fog attach="fog" args={["#000000", 8, 20]} />
    </Canvas>
  );
}
