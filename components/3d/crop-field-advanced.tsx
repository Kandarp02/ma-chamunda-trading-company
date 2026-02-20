'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, BufferGeometry, BufferAttribute } from 'three';
import * as THREE from 'three';

interface CropPlantProps {
  position: [number, number, number];
  scale?: number;
  windInfluence?: number;
  animationOffset?: number;
}

function CropPlant({ position, scale = 1, windInfluence = 1, animationOffset = 0 }: CropPlantProps) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime() + animationOffset;
      // Wind effect - gentle swaying
      const windSway = Math.sin(time * 0.8) * 0.15 * windInfluence;
      groupRef.current.rotation.z = windSway;
      
      // Subtle height variation based on wind
      const heightVariation = Math.cos(time * 1.2) * 0.05;
      groupRef.current.position.y = position[1] + heightVariation;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Stem */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.8, 6]} />
        <meshStandardMaterial color="#4a6b2f" metalness={0.1} roughness={0.7} />
      </mesh>

      {/* Main head/grain */}
      <mesh position={[0, 0.95, 0]}>
        <coneGeometry args={[0.12, 0.4, 8]} />
        <meshStandardMaterial color="#d4a574" metalness={0.2} roughness={0.5} />
      </mesh>

      {/* Secondary grain */}
      <mesh position={[-0.08, 0.85, 0.05]}>
        <coneGeometry args={[0.08, 0.3, 6]} />
        <meshStandardMaterial color="#c9a563" metalness={0.2} roughness={0.5} />
      </mesh>

      {/* Tertiary grain */}
      <mesh position={[0.08, 0.85, -0.05]}>
        <coneGeometry args={[0.08, 0.3, 6]} />
        <meshStandardMaterial color="#c9a563" metalness={0.2} roughness={0.5} />
      </mesh>

      {/* Leaf detail */}
      <mesh position={[-0.06, 0.5, 0]} rotation={[0, 0, 0.4]}>
        <planeGeometry args={[0.1, 0.3]} />
        <meshStandardMaterial color="#5a7d3a" metalness={0} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0.06, 0.6, 0]} rotation={[0, 0, -0.4]}>
        <planeGeometry args={[0.1, 0.3]} />
        <meshStandardMaterial color="#5a7d3a" metalness={0} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function AdvancedCropField() {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Slow rotation of entire field
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  // Generate crop plants in grid
  const crops = useMemo(() => {
    const cropArray = [];
    for (let x = -15; x < 15; x += 1.5) {
      for (let z = -15; z < 15; z += 1.5) {
        cropArray.push({
          position: [x, 0, z] as [number, number, number],
          scale: 0.7 + Math.random() * 0.4,
          windInfluence: 0.8 + Math.random() * 0.4,
          animationOffset: Math.random() * 6.28,
        });
      }
    }
    return cropArray;
  }, []);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Ground/soil */}
      <mesh position={[0, -0.1, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial 
          color="#654321"
          metalness={0}
          roughness={0.95}
          map={useMemo(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext('2d')!;
            ctx.fillStyle = '#654321';
            ctx.fillRect(0, 0, 512, 512);
            
            for (let i = 0; i < 1000; i++) {
              ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.3})`;
              ctx.fillRect(
                Math.random() * 512,
                Math.random() * 512,
                Math.random() * 20 + 5,
                Math.random() * 20 + 5
              );
            }
            
            const texture = new THREE.CanvasTexture(canvas);
            texture.scale.set(4, 4);
            return texture;
          }, [])}
        />
      </mesh>

      {/* Crop plants */}
      {crops.map((crop, idx) => (
        <CropPlant
          key={idx}
          position={crop.position}
          scale={crop.scale}
          windInfluence={crop.windInfluence}
          animationOffset={crop.animationOffset}
        />
      ))}

      {/* Atmospheric particles */}
      <ParticleEffect />
    </group>
  );
}

function ParticleEffect() {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((particle, idx) => {
        const time = clock.getElapsedTime() + idx * 0.3;
        particle.position.y = Math.sin(time * 0.5) * 3 + 10;
        particle.position.x = Math.cos(time * 0.3 + idx) * 20;
        particle.position.z = Math.sin(time * 0.2 + idx * 2) * 20;
        (particle as any).rotation.x = time * 0.5;
        (particle as any).rotation.y = time * 0.3;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 15 }).map((_, idx) => (
        <mesh key={idx} position={[0, 10 + Math.random() * 5, 0]}>
          <sphereGeometry args={[0.3, 4, 4]} />
          <meshStandardMaterial
            color="#d4a574"
            emissive="#d4a574"
            emissiveIntensity={0.3}
            transparent={true}
            opacity={0.4 + Math.random() * 0.3}
            metalness={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}
