'use client';

import { useEffect, useRef, useState } from 'react';
import type { MoonPhaseData } from '@/types/moon';

interface MoonCanvasProps {
  moonPhaseData: MoonPhaseData;
  size?: number;
}

// イージング関数（ease-in-out）
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function MoonCanvas({ moonPhaseData, size = 400 }: MoonCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentIllumination, setCurrentIllumination] = useState(moonPhaseData.illumination);
  const animationRef = useRef<number | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // 月の画像を読み込み
  useEffect(() => {
    const img = new Image();
    img.src = '/moon-texture.jpg';
    img.onload = () => {
      imageRef.current = img;
    };
  }, []);

  // 照度のアニメーション
  useEffect(() => {
    const targetIllumination = moonPhaseData.illumination;
    const startIllumination = currentIllumination;
    const startTime = Date.now();
    const duration = 500; // 0.5秒

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);
      const interpolated =
        startIllumination + (targetIllumination - startIllumination) * easedProgress;
      setCurrentIllumination(interpolated);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentIllumination(targetIllumination);
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moonPhaseData.illumination]);

  // Canvas描画
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size * 0.72) / 2;

    // 背景を外側と同じ色で塗りつぶす
    ctx.fillStyle = '#0d1220';
    ctx.fillRect(0, 0, size, size);

    // 月の画像を円形にクリップして描画
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();

    // 月の画像を描画（円形にフィット）
    const imgSize = radius * 2;
    ctx.drawImage(img, centerX - radius, centerY - radius, imgSize, imgSize);

    ctx.restore();

    // 球体の正確な陰影マスクをピクセル単位で計算
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;
    
    // 月齢から位相角を算出（0 = 新月, π = 満月）
    const synodicPeriod = 29.53058867;
    const normalizedAge =
      ((moonPhaseData.moonAge % synodicPeriod) + synodicPeriod) / synodicPeriod;
    const phaseAngle = normalizedAge * Math.PI * 2;
    
    // 太陽光の方向ベクトル（無限遠からの平行光）
    const sunDirX = Math.sin(phaseAngle);
    const sunDirY = 0;
    const sunDirZ = -Math.cos(phaseAngle);
    
    // 各ピクセルについて球面の法線ベクトルを計算し、光の当たり具合を判定
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = (x - centerX) / radius;  // X軸: 東西方向（-1〜1）
        const dy = (y - centerY) / radius;  // Y軸: 南北極方向（-1〜1）
        const distSq = dx * dx + dy * dy;
        
        // 円の外側はスキップ
        if (distSq > 1) continue;
        
        // 球面上の点の3D座標（Z座標を計算）
        const dz = Math.sqrt(1 - distSq);
        
        // 法線ベクトル（球の表面に垂直）
        const normalX = dx;
        const normalY = dy;
        const normalZ = dz;
        
        // 太陽光との内積（光の当たり具合）
        const dotProduct = normalX * sunDirX + normalY * sunDirY + normalZ * sunDirZ;
        
        const idx = (y * size + x) * 4;
        
        // 境界をぼんやりさせる（ペナンブラ）— 極付近は極小、赤道ではやや広め
        const penumbra = 0.02 + 0.04 * (1 - Math.abs(dy));
        let shadowStrength = 0;
        if (dotProduct < 0) {
          const ratio = Math.min(1, (-dotProduct) / penumbra);
          shadowStrength = Math.pow(ratio, 1.2);
        }
        
        if (shadowStrength > 0) {
          // 影の部分（地球照で薄明るい）
          const earthshineR = 0.15;
          const earthshineG = 0.16;
          const earthshineB = 0.2;
          
          data[idx] = data[idx] * (1 - shadowStrength) + data[idx] * earthshineR * shadowStrength;
          data[idx + 1] = data[idx + 1] * (1 - shadowStrength) + data[idx + 1] * earthshineG * shadowStrength;
          data[idx + 2] = data[idx + 2] * (1 - shadowStrength) + data[idx + 2] * earthshineB * shadowStrength;
        } else {
          // 太陽光が当たる部分（明るい）
          const brightness = Math.max(0, dotProduct) * 0.35;
          data[idx] = Math.min(255, data[idx] * (1 + brightness * 1.1));
          data[idx + 1] = Math.min(255, data[idx + 1] * (1 + brightness));
          data[idx + 2] = Math.min(255, data[idx + 2] * (1 + brightness * 0.8));
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);

  }, [moonPhaseData.moonAge, currentIllumination, size]);

  return (
    <div
      role="img"
      aria-label={`${moonPhaseData.phaseName}（月齢 ${moonPhaseData.moonAge.toFixed(1)}日）`}
      className="relative overflow-hidden rounded-[32px] border border-[#101b34]/60 shadow-[0_30px_60px_rgba(2,4,14,0.85)]"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: 'radial-gradient(circle at center, #0f1527 0%, #080c16 45%, #04060d 100%)'
      }}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="relative z-10"
      />
    </div>
  );
}

