'use client';

import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdvancedCropField } from './crop-field-advanced';
import { PremiumText } from './premium-text';
import * as THREE from 'three';
import { 
  AmbientLight, 
  DirectionalLight, 
  PointLight, 
  Mesh, 
  PlaneGeometry, 
  MeshBasicMaterial, 
  MeshStandardMaterial,
  OctahedronGeometry,
  Group,
  Fog 
} from 'three';

function HeroSceneContent() {
  const { camera } = useThree();

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(0, 10, 28);
    cam.fov = 50;
    cam.lookAt(0, 8, 0);
  }, [camera]);

  return (
    <>
      {/* Intensive lighting setup for premium look */}
      <AmbientLight intensity={0.6} color="#ffffff" />
      
      <DirectionalLight
        position={[20, 30, 15]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        color="#ffffff"
      />
      
      <DirectionalLight 
        position={[-20, 15, -20]} 
        intensity={0.8} 
        color="#d4a574"
      />

      {/* Fill light for depth */}
      <PointLight position={[0, 15, 0]} intensity={0.4} color="#d4a574" />
      <PointLight position={[15, 12, 15]} intensity={0.3} color="#ffd700" />
      <PointLight position={[-15, 12, -15]} intensity={0.3} color="#ffd700" />

      {/* Sky gradient background */}
      <Mesh position={[0, 0, -50]}>
        <PlaneGeometry args={[100, 80]} />
        <MeshBasicMaterial color="#8fb3d9" />
      </Mesh>

      {/* Horizon line */}
      <Mesh position={[0, -2, 0]}>
        <PlaneGeometry args={[200, 1]} />
        <MeshBasicMaterial color="#6b8a4f" />
      </Mesh>

      {/* Enhanced fog effect */}
      <Fog attach="fog" args={['#a8c5dd', 40, 150]} />

      {/* Advanced crop field */}
      <AdvancedCropField />
      
      {/* Premium text with enhanced styling */}
      <PremiumText
        text="POWERING INDIA'S"
        position={[0, 16, 0]}
        color="#ffffff"
        emissiveColor="#d4a574"
        scale={0.8}
        delay={0.3}
      />

      <PremiumText
        text="CROP TRADE"
        position={[0, 12, 0]}
        color="#d4a574"
        emissiveColor="#ffd700"
        scale={0.95}
        delay={0.6}
        rotationAxis="y"
      />

      <PremiumText
        text="WITH TRUST & TRANSPARENCY"
        position={[0, 7.5, 0]}
        color="#ffffff"
        emissiveColor="#d4a574"
        scale={0.6}
        delay={0.9}
        rotationAxis="y"
      />

      {/* Decorative elements - floating boxes */}
      <FloatingDecorations />
    </>
  );
}

function FloatingDecorations() {
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
    <Group ref={groupRef}>
      {Array.from({ length: 8 }).map((_, idx) => (
        <Mesh
          key={idx}
          position={[
            Math.cos((idx / 8) * Math.PI * 2) * 25,
            15 + Math.sin(idx) * 5,
            Math.sin((idx / 8) * Math.PI * 2) * 25,
          ]}
        >
          <OctahedronGeometry args={[0.4]} />
          <MeshStandardMaterial
            color="#d4a574"
            emissive="#d4a574"
            emissiveIntensity={0.6}
            metalness={0.6}
            roughness={0.4}
            wireframe={false}
          />
        </Mesh>
      ))}
    </Group>
  );
}

export function HeroScene() {
  return (
    <Canvas
      className="w-full h-full"
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      camera={{ position: [0, 10, 28], fov: 50 }}
    >
      <Suspense fallback={null}>
        <HeroSceneContent />
        <FloatingDecorations />
      </Suspense>
    </Canvas>
  );
}
