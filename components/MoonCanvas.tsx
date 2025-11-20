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

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = (size * 0.76) / 2; // 0.95 * 0.8 = 0.76

    // 1. 背景をクリア（透明に）
    ctx.clearRect(0, 0, size, size);

    // 2. 月のテクスチャを描画（ベース）
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();
    const imgSize = radius * 2;
    // 画像を少し拡大して描画（月のテクスチャが画像の中央に小さく配置されている場合の対策）
    const scale = 1.4; // 拡大率
    const scaledSize = imgSize * scale;
    const offset = (scaledSize - imgSize) / 2;
    ctx.drawImage(img, centerX - radius - offset, centerY - radius - offset, scaledSize, scaledSize);
    ctx.restore();

    // 3. ピクセル操作で球体の陰影とマスクを適用
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;

    // 月齢から位相角を算出（0 = 新月, π = 満月）
    const synodicPeriod = 29.53058867;
    const normalizedAge =
      ((moonPhaseData.moonAge % synodicPeriod) + synodicPeriod) / synodicPeriod;
    // 位相角: 0(新月) -> π(満月) -> 2π(新月)
    // 新月のとき、太陽は月の向こう側(Z = -1)
    // 満月のとき、太陽は月の手前側(Z = 1)
    // 上弦のとき(0.25)、太陽は右側(X = 1)
    const phaseAngle = normalizedAge * Math.PI * 2;

    // 太陽光の方向ベクトル
    // 新月(0): sin(0)=0, -cos(0)=-1 -> (0, 0, -1) 奥から手前へ光が来ない（奥が光源）
    // 実際は地球から見て月が太陽と同じ方向にある。
    // ここでの座標系: Z軸手前が正、X軸右が正。
    // 月の表面法線(0,0,1)は手前。
    // 新月: 太陽は奥にある -> 光源ベクトル(0,0,-1) -> 内積 -1 -> 暗い。OK。
    // 満月: 太陽は手前にある -> 光源ベクトル(0,0,1) -> 内積 1 -> 明るい。OK。
    // 上弦: 月齢7.4(0.25) -> sin(PI/2)=1, -cos(PI/2)=0 -> (1,0,0) -> 右から光。OK。
    const sunDirX = Math.sin(phaseAngle);
    const sunDirY = 0;
    const sunDirZ = -Math.cos(phaseAngle);

    // 環境光（地球照）
    const ambientR = 30;
    const ambientG = 32;
    const ambientB = 40;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = (x - centerX) / radius;
        const dy = (y - centerY) / radius;
        const distSq = dx * dx + dy * dy;

        const idx = (y * size + x) * 4;

        // 円の外側は透明にする
        if (distSq >= 1.0) {
          data[idx + 3] = 0; // アルファチャンネルを0に
          continue;
        }

        // 球面上の点の法線ベクトル (nx, ny, nz)
        const nz = Math.sqrt(1.0 - distSq);
        const nx = dx;
        const ny = dy;

        // 太陽光との内積（ランバート反射）
        const dot = nx * sunDirX + ny * sunDirY + nz * sunDirZ;

        // 周縁減光（Limb Darkening）効果
        const limbFactor = Math.pow(nz, 0.6);

        // テクスチャの色
        const texR = data[idx];
        const texG = data[idx + 1];
        const texB = data[idx + 2];

        // 滑らかな明暗の遷移（指数関数的なフォールオフ）
        const shadowBrightness = 0.12; // 影の明るさ
        const litBrightness = 1.5; // 明るい部分の明るさ（より明るく）

        // 境界線の遷移幅を狭くする
        const transitionZone = 0.18; // 遷移が起きる範囲（狭める）

        // dotを遷移ゾーン内で0〜1に正規化
        const normalizedDot = Math.max(0, Math.min(1, (dot + transitionZone) / (2 * transitionZone)));

        // 高いべき乗でシャープな遷移を作る
        const smoothFactor = Math.pow(normalizedDot, 5.0);

        // 明るさを計算
        const brightness = shadowBrightness + (litBrightness - shadowBrightness) * smoothFactor;

        // 色調補正（青白く冷たい色味に）
        const colorR = 0.85;
        const colorG = 0.95;
        const colorB = 1.2;

        data[idx] = Math.min(255, texR * brightness * limbFactor * colorR);
        data[idx + 1] = Math.min(255, texG * brightness * limbFactor * colorG);
        data[idx + 2] = Math.min(255, texB * brightness * limbFactor * colorB);
      }
    }

    ctx.putImageData(imageData, 0, 0);

  }, [moonPhaseData.moonAge, size]);

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

