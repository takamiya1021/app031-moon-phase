/**
 * 月齢計算ロジック - Phase 1-3 (Refactor)
 * 月の満ち欠けを計算する関数群
 */

import type { MoonPhaseData } from '@/types/moon';

// 基準日: 2000年1月6日 18:14 UTC（既知の新月）
const KNOWN_NEW_MOON = new Date('2000-01-06T18:14:00Z');

// 平均朔望月（月の満ち欠けの周期）
const LUNAR_CYCLE = 29.53058867;

/**
 * 指定された日付の月齢を計算
 * @param date - 計算対象の日付
 * @returns 月齢（0-29.53日）
 */
export function calculateMoonAge(date: Date): number {
  // 基準日からの経過ミリ秒
  const diff = date.getTime() - KNOWN_NEW_MOON.getTime();

  // 経過日数に変換
  const days = diff / (1000 * 60 * 60 * 24);

  // 月齢を計算（朔望月で割った余り）
  const moonAge = days % LUNAR_CYCLE;

  // 負の値の場合は正の値に変換
  return moonAge >= 0 ? moonAge : moonAge + LUNAR_CYCLE;
}

/**
 * 月齢から月の名称を判定
 * @param moonAge - 月齢（0-29.53日）
 * @returns 月の名称（日本の伝統的な呼び名）
 */
export function getMoonPhaseName(moonAge: number): string {
  if (moonAge < 1.84) return '新月';
  if (moonAge < 5.53) return '三日月';
  if (moonAge < 9.22) return '上弦';
  if (moonAge < 12.91) return '十三夜';
  if (moonAge < 16.61) return '満月';
  if (moonAge < 20.30) return '寝待月';
  if (moonAge < 23.99) return '下弦';
  if (moonAge < 27.68) return '有明月';
  return '新月（前日）';
}

/**
 * 月齢から月の照度（明るさ）を計算
 * @param moonAge - 月齢（0-29.53日）
 * @returns 照度（0-1、0=新月、1=満月）
 */
export function getMoonIllumination(moonAge: number): number {
  // 月齢を0-1の範囲に正規化
  const phase = moonAge / LUNAR_CYCLE;

  // コサイン関数を使って照度を計算
  // 0度（新月）= -1 → 0
  // 180度（満月）= 1 → 1
  // 360度（新月）= -1 → 0
  const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2;

  return illumination;
}

/**
 * 指定された日付の月の満ち欠け情報を全て取得
 * @param date - 計算対象の日付
 * @returns 月の満ち欠け情報（月齢、名称、照度）
 */
export function getMoonPhaseData(date: Date): MoonPhaseData {
  const moonAge = calculateMoonAge(date);
  const phaseName = getMoonPhaseName(moonAge);
  const illumination = getMoonIllumination(moonAge);

  return {
    date,
    moonAge,
    phaseName,
    illumination,
  };
}

// 定数もエクスポートして外部から参照可能に
export { KNOWN_NEW_MOON, LUNAR_CYCLE };
