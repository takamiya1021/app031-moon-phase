/**
 * MoonCanvas コンポーネント - Phase 2-5 (Refactor)
 * 月の満ち欠けをCanvasに描画（アニメーション付き）
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { drawBackground, drawStars, drawMoon } from '@/lib/moonDraw';
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

  // アニメーション処理
  useEffect(() => {
    const targetIllumination = moonPhaseData.illumination;

    // アニメーションの開始時刻と開始時の照度
    const startTime = Date.now();
    const startIllumination = currentIllumination;
    const duration = 500; // 0.5秒

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // イージング適用
      const easedProgress = easeInOutCubic(progress);

      // 現在の照度を計算
      const newIllumination =
        startIllumination + (targetIllumination - startIllumination) * easedProgress;

      setCurrentIllumination(newIllumination);

      // アニメーション継続判定
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentIllumination(targetIllumination);
      }
    };

    // アニメーション開始
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [moonPhaseData.illumination]);

  // Canvas描画
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Retina対応
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    // 背景を描画
    drawBackground(ctx, size, size);

    // 星を描画
    drawStars(ctx, size, size, 25);

    // 月を描画（アニメーション中の照度を使用）
    const moonRadius = size * 0.35; // 画面の35%
    const centerX = size / 2;
    const centerY = size / 2;
    drawMoon(ctx, centerX, centerY, moonRadius, currentIllumination);
  }, [currentIllumination, size]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={`${moonPhaseData.phaseName}（月齢 ${moonPhaseData.moonAge.toFixed(1)}日）`}
      className="rounded-lg shadow-2xl"
    />
  );
}
