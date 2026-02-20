'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';

interface Text3DProps {
  text?: string;
  position: [number, number, number];
  size?: number;
  color?: string;
  delay?: number;
}

export function Text3D({
  position,
  size = 1,
  color = '#ffffff',
  delay = 0,
}: Text3DProps) {
  const groupRef = useRef<Group>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  useFrame(({ clock }) => {
    if (groupRef.current && isVisible) {
      const time = clock.getElapsedTime();
      groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.2;
      groupRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;
    }
  });

  if (!isVisible) return null;

  return (
    <group ref={groupRef} position={position}>
      <mesh>
        <boxGeometry args={[3 * size, 1.5 * size, 0.5 * size]} />
        <meshPhongMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          shininess={100}
        />
      </mesh>
    </group>
  );
}
