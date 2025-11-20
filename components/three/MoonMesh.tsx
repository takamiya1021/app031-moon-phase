'use client';

import { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import { AdditiveBlending, SRGBColorSpace, Texture, Vector3 } from 'three';
import type { Vector3Tuple } from '@/lib/moonLighting';
import './materials/MoonMaskMaterial';

const MOON_SCALE = 0.72;
const GLOW_SCALE = 0.82;

interface MoonMeshProps {
  illumination: number;
  lightDirection: Vector3Tuple;
}

function prepareTexture(texture: Texture | Texture[]): void {
  if (Array.isArray(texture)) {
    texture.forEach(t => {
      t.anisotropy = 8;
      t.colorSpace = SRGBColorSpace;
    });
    return;
  }

  texture.anisotropy = 8;
  texture.colorSpace = SRGBColorSpace;
}

export default function MoonMesh({ illumination, lightDirection }: MoonMeshProps) {
  const [moonTexture, normalMap] = useTexture([
    '/moon-texture.jpg',
    '/moon_normal_map.png',
  ]) as [Texture, Texture];

  prepareTexture(moonTexture);
  normalMap.anisotropy = 8;
  const lightDirVector = useMemo(
    () => new Vector3(lightDirection[0], lightDirection[1], lightDirection[2]).normalize(),
    [lightDirection]
  );

  return (
    <group scale={MOON_SCALE}>
      <mesh castShadow receiveShadow rotation-y={Math.PI * 0.04}>
        <sphereGeometry args={[1, 256, 256]} />
        {/* @ts-ignore - Custom shader material with extend */}
        <moonMaskMaterial
          map={moonTexture}
          normalMap={normalMap}
          lightDir={lightDirVector}
          illumination={illumination}
          maskSoftness={0.02} // マスクの境界をよりシャープにしてリアリティを向上（0.22 -> 0.02）
        />
      </mesh>
      {/* 実写的な表現のため、人工的なグロー効果は削除 */}
      {/* <mesh scale={GLOW_SCALE}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshBasicMaterial
          color="#ffd8a1"
          transparent
          opacity={0.24}
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh> */}
    </group>
  );
}
