'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, TextGeometry, Font, MeshPhongMaterial, MeshStandardMaterial, BoxGeometry, Mesh as ThreeMesh } from 'three';

interface PremiumTextProps {
  text: string;
  position: [number, number, number];
  color?: string;
  emissiveColor?: string;
  scale?: number;
  delay?: number;
  rotationAxis?: 'x' | 'y' | 'z';
}

// Dynamic text using basic geometry for now, will be enhanced
export function PremiumText({
  text,
  position,
  color = '#ffffff',
  emissiveColor = '#d4a574',
  scale = 1,
  delay = 0,
  rotationAxis = 'y',
}: PremiumTextProps) {
  const groupRef = useRef<Group>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  useFrame(({ clock }) => {
    if (groupRef.current && isVisible) {
      const time = clock.getElapsedTime();
      const floatY = Math.sin(time * 0.6 + delay) * 0.4;
      groupRef.current.position.y = position[1] + floatY;

      // Rotation based on axis
      if (rotationAxis === 'x') {
        groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
      } else if (rotationAxis === 'y') {
        groupRef.current.rotation.y = time * 0.2;
      } else {
        groupRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;
      }
    }
  });

  if (!isVisible) return null;

  // Create text using multiple boxes to form shapes
  const textLength = text.length;
  const letterWidth = 1.2 * scale;
  const startX = -(textLength * letterWidth) / 2;

  return (
    <group ref={groupRef} position={position}>
      {/* Background glow effect */}
      <mesh position={[0, 0, -2]}>
        <boxGeometry args={[textLength * letterWidth + 1, 1.5 * scale, 0.5]} />
        <meshPhongMaterial 
          color={emissiveColor}
          emissive={emissiveColor}
          emissiveIntensity={0.3}
          transparent={true}
          opacity={0.1}
        />
      </mesh>

      {/* Main text representation - using layered boxes */}
      {Array.from(text).map((char, idx) => (
        <group key={idx} position={[startX + idx * letterWidth, 0, 0]}>
          {/* Character container */}
          <mesh position={[0, 0, 0.3]}>
            <boxGeometry args={[0.9 * scale, 1.2 * scale, 0.6]} />
            <meshStandardMaterial
              color={color}
              emissive={emissiveColor}
              emissiveIntensity={0.5}
              metalness={0.3}
              roughness={0.4}
            />
          </mesh>

          {/* Highlight edge */}
          <mesh position={[0, 0.5 * scale, 0.5]}>
            <boxGeometry args={[0.95 * scale, 0.1 * scale, 0.7]} />
            <meshPhongMaterial 
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.8}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
