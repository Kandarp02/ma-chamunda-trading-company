'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { Group } from 'three';
import * as THREE from 'three';
import { 
  Mesh, 
  PlaneGeometry, 
  MeshStandardMaterial,
  SphereGeometry,
  AmbientLight,
  DirectionalLight,
  PointLight,
  Fog,
  CylinderGeometry,
  ConeGeometry,
  MeshBasicMaterial
} from 'three';

function AnimatedCrops() {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.15;
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  const crops = useMemo(() => {
    const cropArray = [];
    for (let x = -12; x < 12; x += 1.8) {
      for (let z = -12; z < 12; z += 1.8) {
        cropArray.push({
          position: [x, 0, z] as [number, number, number],
          scale: 0.5 + Math.random() * 0.6,
          animOffset: Math.random() * 6.28,
        });
      }
    }
    return cropArray;
  }, []);

  return <group ref={groupRef}>{crops}</group>;
}

function SkyBox() {
  return (
    <mesh>
      <sphereGeometry args={[80, 32, 32]} />
      <meshBasicMaterial color="#7fa3d6" side={THREE.BackSide} />
    </mesh>
  );
}

function FloatingLights() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, idx) => {
        const time = clock.getElapsedTime() + idx * 0.5;
        child.position.y += Math.sin(time) * 0.02;
        child.rotation.x = time * 0.3;
        child.rotation.y = time * 0.2;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 8 }).map((_, idx) => (
        <mesh
          key={idx}
          position={[0, 5, 0]}
        >
          <sphereGeometry args={[0.25, 8, 8]} />
          <meshStandardMaterial
            color="#d4a574"
            emissive="#d4a574"
            emissiveIntensity={0.4}
            metalness={0.7}
            roughness={0.3}
            opacity={0.7}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

export function SectionBackground() {
  return (
    <Canvas
      className="absolute inset-0 z-0"
      camera={{ position: [0, 5, 15], fov: 60 }}
      gl={{ alpha: true }}
    >
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight position={[12, 12, 8]} intensity={1.4} color="#ffffff" />
      <directionalLight position={[-12, 8, -12]} intensity={0.6} color="#d4a574" />
      <pointLight position={[0, 10, 0]} intensity={0.3} color="#ffd700" />
      <fog attach="fog" args={['#9dbae6', 20, 80]} />
      
      <mesh position={[0, -0.5, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial
          color="#6b7d4f"
          metalness={0.1}
          roughness={0.9}
        />
      </mesh>
      
      <SkyBox />
      <AnimatedCrops />
      <FloatingLights />
    </Canvas>
  );
}
