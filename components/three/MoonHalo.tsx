'use client';

import { useMemo } from 'react';
import {
  AdditiveBlending,
  LinearFilter,
  SRGBColorSpace,
  Texture,
  UnsignedByteType,
} from 'three';

const HALO_SIZE = 768;

function createHaloTexture(): Texture {
  const canvas = document.createElement('canvas');
  canvas.width = HALO_SIZE;
  canvas.height = HALO_SIZE;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const gradient = ctx.createRadialGradient(
      HALO_SIZE / 2,
      HALO_SIZE / 2,
      HALO_SIZE * 0.1,
      HALO_SIZE / 2,
      HALO_SIZE / 2,
      HALO_SIZE / 2
    );
    // 参考画像に合わせた淡いゴールド系のハロー
    gradient.addColorStop(0, 'rgba(255,235,200,0.0)');
    gradient.addColorStop(0.3, 'rgba(255,220,180,0.25)');
    gradient.addColorStop(0.5, 'rgba(255,200,150,0.18)');
    gradient.addColorStop(0.7, 'rgba(255,180,120,0.08)');
    gradient.addColorStop(1, 'rgba(40,50,80,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, HALO_SIZE, HALO_SIZE);
  }

  const texture = new Texture(canvas);
  texture.type = UnsignedByteType;
  texture.needsUpdate = true;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.colorSpace = SRGBColorSpace;

  return texture;
}

export default function MoonHalo() {
  const haloTexture = useMemo(() => createHaloTexture(), []);

  return (
    <sprite scale={[2.8, 2.8, 1]}>
      <spriteMaterial
        map={haloTexture}
        blending={AdditiveBlending}
        transparent
        opacity={0.45}
        depthWrite={false}
        toneMapped={false}
      />
    </sprite>
  );
}
