'use client';

import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Sky, Environment } from '@react-three/drei';
import { CropField } from './crop-field';

export function ThreeDCanvas() {
  return (
    <Canvas className="w-full h-full" dpr={[1, 2]}>
      <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={60} />
      
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.5}
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI * 0.6}
      />

      {/* Lighting */}
      <ambientLight intensity={0.7} />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-10, 5, -10]} intensity={0.5} color="#d4a574" />

      {/* Environment */}
      <Sky sunPosition={[100, 20, 100]} turbidity={8} rayleigh={2} />
      <fog attach="fog" args={['#87ceeb', 20, 100]} />

      {/* Scene content */}
      <CropField />
    </Canvas>
  );
}
