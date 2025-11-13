/**
 * useMoonPhase カスタムフック - Phase 1-4 (Green)
 * 月の満ち欠け情報を管理するReactフック
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getMoonPhaseData } from '@/lib/moonPhase';
import type { MoonPhaseData } from '@/types/moon';

/**
 * 月の満ち欠け情報を管理するカスタムフック
 * @param initialDate - 初期日付（省略時は今日）
 * @returns 月の満ち欠けデータと日付更新関数
 */
export function useMoonPhase(initialDate?: Date) {
  const [date, setDateState] = useState<Date>(initialDate || new Date());
  const [moonPhaseData, setMoonPhaseData] = useState<MoonPhaseData>(() =>
    getMoonPhaseData(initialDate || new Date())
  );

  // initialDateが変更されたら、内部のdateも更新
  useEffect(() => {
    if (initialDate) {
      setDateState(initialDate);
    }
  }, [initialDate]);

  // 日付が変更されたら月の満ち欠けデータを再計算
  useEffect(() => {
    const newData = getMoonPhaseData(date);
    setMoonPhaseData(newData);
  }, [date]);

  // 日付を更新する関数
  const setDate = useCallback((newDate: Date) => {
    setDateState(newDate);
  }, []);

  return {
    moonPhaseData,
    setDate,
  };
}
