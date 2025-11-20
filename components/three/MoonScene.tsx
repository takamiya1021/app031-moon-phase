'use client';

import { memo, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import MoonHalo from './MoonHalo';
import MoonMesh from './MoonMesh';
import { computeSunDirection, computeSunPosition } from '@/lib/moonLighting';
import type { Vector3Tuple } from '@/lib/moonLighting';

interface MoonSceneProps {
  moonAge: number;
  illumination: number;
}

function MoonScene({ moonAge, illumination }: MoonSceneProps) {
  const sunPosition = useMemo<Vector3Tuple>(
    () => computeSunPosition(moonAge, 6),
    [moonAge]
  );
  const sunDirection = useMemo<Vector3Tuple>(
    () => computeSunDirection(moonAge),
    [moonAge]
  );

  const fillLight = useMemo<Vector3Tuple>(
    () => ([-sunPosition[0], -sunPosition[1], -sunPosition[2]] as Vector3Tuple),
    [sunPosition]
  );

  return (
    <Canvas
      className="h-full w-full"
      camera={{ position: [0, 0, 3.3], fov: 35 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
    >
      <fog attach="fog" args={['#0a0e1a', 8, 18]} />
      <color attach="background" args={['#0d1220']} />
      <ambientLight intensity={0.008} color="#6a7a9f" />
      {/* 宇宙空間に地面反射はないためHemisphereLightは削除または極小に */}
      
      <directionalLight
        position={sunPosition}
        intensity={2.5}
        color="#fff9f0"
      />
      <directionalLight
        position={fillLight}
        intensity={0.12}
        color="#3a4a6f"
      />
      <MoonMesh illumination={illumination} lightDirection={sunDirection} />
      <Stars
        radius={60}
        depth={30}
        count={1800}
        factor={1.2}
        fade
        speed={0.05}
        saturation={0}
      />
      <MoonHalo />
    </Canvas>
  );
}

export default memo(MoonScene);
