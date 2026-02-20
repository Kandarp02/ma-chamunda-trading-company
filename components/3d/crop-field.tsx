'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import * as THREE from 'three';

interface CropPlantProps {
  position: [number, number, number];
  delay: number;
  scale?: number;
}

function CropPlant({ position, delay, scale = 1 }: CropPlantProps) {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      const wave = Math.sin(time * 0.5 + delay) * 0.3;
      groupRef.current.rotation.z = wave * 0.1;
      groupRef.current.position.y = position[1] + Math.sin(time * 0.4 + delay) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Stem */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1, 6]} />
        <meshStandardMaterial color="#2d5016" />
      </mesh>

      {/* Leaves */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle) * 0.2, 0.7, Math.sin(angle) * 0.2]} rotation={[0.3, angle, 0.1]}>
          <planeGeometry args={[0.3, 0.6]} />
          <meshStandardMaterial color="#3d6b1f" side={THREE.DoubleSide} />
        </mesh>
      ))}

      {/* Top grain head */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
    </group>
  );
}

export function CropField() {
  const fieldRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (fieldRef.current) {
      fieldRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  const crops = [];
  for (let x = -15; x < 15; x += 1.5) {
    for (let z = -15; z < 15; z += 1.5) {
      crops.push({
        position: [x, 0, z] as [number, number, number],
        delay: (x + z) * 0.1,
        scale: 0.8 + Math.random() * 0.4,
      });
    }
  }

  return (
    <group ref={fieldRef}>
      {/* Ground plane */}
      <mesh position={[0, -0.5, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#4a3728" roughness={0.9} />
      </mesh>

      {/* Crop plants */}
      {crops.map((crop, i) => (
        <CropPlant key={i} {...crop} />
      ))}
    </group>
  );
}
