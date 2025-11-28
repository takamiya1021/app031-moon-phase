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
 * 指定された日付の月齢を計算（高精度版 - Jean Meeusアルゴリズムに基づく）
 * @param date - 計算対象の日付
 * @returns 月齢（0-29.53日）
 */
export function calculateMoonAge(date: Date): number {
  // J2000.0 (2000-01-01 12:00:00 TT) からのユリウス世紀数
  const j2000 = new Date('2000-01-01T12:00:00Z');
  const d = (date.getTime() - j2000.getTime()) / (1000 * 60 * 60 * 24);
  const T = d / 36525; // ユリウス世紀

  // 月の平均黄経 (度)
  const Lp = (218.3164477 + 481267.88123421 * T - 0.0015786 * T * T + T * T * T / 538841 - T * T * T * T / 65194000) % 360;

  // 太陽の平均近点離角 (度)
  const M = (357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + T * T * T / 24490000) % 360;
  const MRad = (M * Math.PI) / 180;

  // 月の平均近点角 (度)
  const Mp = (134.9633964 + 477198.8675055 * T + 0.0087414 * T * T + T * T * T / 69699 - T * T * T * T / 14712000) % 360;
  const MpRad = (Mp * Math.PI) / 180;

  // 月の平均昇交点黄経からの角距離 (度)
  const F = (93.2720950 + 483202.0175233 * T - 0.0036539 * T * T - T * T * T / 3526000 + T * T * T * T / 863310000) % 360;
  const FRad = (F * Math.PI) / 180;

  // 昇交点黄経 (度)
  const Om = (125.04452 - 1934.136261 * T + 0.0020708 * T * T + T * T * T / 450000) % 360;
  const OmRad = (Om * Math.PI) / 180;

  // 太陽の平均黄経 (度)
  const Ls = (280.4664567 + 36000.76982779 * T + 0.0003032028 * T * T + T * T * T / 49931 - T * T * T * T / 15299) % 360;

  // 月の黄経補正項（主要な項のみ）
  let deltaL = 0;
  deltaL += 6.288774 * Math.sin(MpRad);
  deltaL += 1.274027 * Math.sin(2 * (Lp - Ls) * Math.PI / 180 - MpRad);
  deltaL += 0.658314 * Math.sin(2 * (Lp - Ls) * Math.PI / 180);
  deltaL += 0.213618 * Math.sin(2 * MpRad);
  deltaL -= 0.185116 * Math.sin(MRad);
  deltaL -= 0.114332 * Math.sin(2 * FRad);
  deltaL += 0.058793 * Math.sin(2 * (Lp - Ls) * Math.PI / 180 - 2 * MpRad);
  deltaL += 0.057066 * Math.sin(2 * (Lp - Ls) * Math.PI / 180 - MRad - MpRad);
  deltaL += 0.053322 * Math.sin(2 * (Lp - Ls) * Math.PI / 180 + MpRad);
  deltaL += 0.045758 * Math.sin(2 * (Lp - Ls) * Math.PI / 180 - MRad);

  // 月の真黄経
  const lambdaM = Lp + deltaL;

  // 太陽の黄経補正（中心差）
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(MRad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * MRad) +
    0.000289 * Math.sin(3 * MRad);

  // 太陽の真黄経
  const lambdaS = (Ls + C) % 360;

  // 月と太陽の黄経差（位相角、0-360度）
  let phase = (lambdaM - lambdaS) % 360;
  if (phase < 0) phase += 360;

  // 月齢（0-29.53日）に変換
  const moonAge = (phase / 360) * LUNAR_CYCLE;

  return moonAge;
}

/**
 * 月齢から月の名称を判定（伝統的な日本の呼び名）
 * 前日・翌日と比較して、最もターゲットに近い日のみ名前を返す
 * @param moonAge - 月齢（0-29.53日）
 * @param date - 対象の日付（比較用）
 * @returns 月の名称（日本の伝統的な呼び名）、該当なしの場合は空文字
 */
export function getMoonPhaseName(moonAge: number, date: Date): string {
  // ターゲットとなる月齢（整数）
  // 月齢が高い場合（28.5以上）、0（新月）との距離も考慮する必要がある
  let roundedAge = Math.round(moonAge);

  // 月齢28.5以上の場合、0（新月）に近い可能性がある
  if (moonAge >= 28.5) {
    const distToRounded = Math.abs(moonAge - roundedAge);
    const distToZero = LUNAR_CYCLE - moonAge; // 29.53 - 29.4 = 0.13など
    if (distToZero < distToRounded) {
      roundedAge = 0; // 新月の方が近い
    }
  }

  // 名前がある月齢の定義
  const namedPhases: { [key: number]: string } = {
    0: '朔（新月）',
    1: '既朔（一日月）',
    2: '二日月',
    3: '三日月',
    7: '上弦（半月）',
    13: '十三夜',
    14: '小望月',
    15: '満月',
    16: '十六夜',
    17: '立待月',
    18: '居待月',
    19: '寝待月',
    20: '更待月',
    23: '下弦（半月）',
    26: '有明月'
  };

  // 定義されていない月齢なら空文字
  if (!namedPhases[roundedAge]) return '';

  // 前日と翌日の月齢を計算して比較
  // その日の代表時刻として12:00（正午）を使用
  // 月齢3に最も近い日を選ぶため、前日・当日・翌日の12:00時点の月齢を比較
  const currentDate = new Date(date);
  currentDate.setHours(12, 0, 0, 0);

  const prevDate = new Date(currentDate);
  prevDate.setDate(currentDate.getDate() - 1);

  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() + 1);

  // 現在、前日、翌日の月齢を再計算（一貫性を保つため）
  const currentAge = calculateMoonAge(currentDate);
  const prevAge = calculateMoonAge(prevDate);
  const nextAge = calculateMoonAge(nextDate);

  // ターゲットとの差分を計算（循環を考慮）
  const getDiff = (age: number, target: number) => {
    let diff = Math.abs(age - target);
    // 月齢サイクルの境界（0と29.53）の処理
    if (target === 0) {
      diff = Math.min(diff, Math.abs(age - LUNAR_CYCLE));
    }
    return diff;
  };

  const currentDiff = getDiff(currentAge, roundedAge);
  const prevDiff = getDiff(prevAge, roundedAge);
  const nextDiff = getDiff(nextAge, roundedAge);

  // 現在の日が最も近い（または同等）場合のみ名前を返す
  if (currentDiff < prevDiff && currentDiff < nextDiff) {
    return namedPhases[roundedAge];
  }

  return '';
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
  // より正確な計算のため、その日の正午（12:00）を基準にする
  const normalizedDate = new Date(date);
  normalizedDate.setHours(12, 0, 0, 0);

  const moonAge = calculateMoonAge(normalizedDate);
  const phaseName = getMoonPhaseName(moonAge, normalizedDate);
  const illumination = getMoonIllumination(moonAge);

  return {
    date: normalizedDate,
    moonAge,
    phaseName,
    illumination,
  };
}

// 定数もエクスポートして外部から参照可能に
export { KNOWN_NEW_MOON, LUNAR_CYCLE };
